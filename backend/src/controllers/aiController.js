// AI writing assistant backed by a self-hosted Ollama server (server-ia).
// Prompts are built here from a fixed set of actions; the client never sends a raw prompt.
const OLLAMA_URL = (process.env.OLLAMA_URL || '').replace(/\/+$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

const MAX_TEXT = 4000;
const MAX_PER_HOUR = 30;
const HOUR_MS = 60 * 60 * 1000;

// Per-user limits: one generation at a time and a rolling hourly quota.
const active = new Set();
const history = new Map();

function underQuota(userId) {
  const now = Date.now();
  const recent = (history.get(userId) || []).filter(t => now - t < HOUR_MS);
  history.set(userId, recent);
  if (recent.length >= MAX_PER_HOUR) return false;
  recent.push(now);
  return true;
}

const NO_INVENT = {
  es: 'No inventes datos, cifras, empresas, fechas ni tecnologías que no aparezcan en el texto o en el contexto.',
  en: 'Do not invent data, numbers, companies, dates or technologies that are not in the text or the context.',
};

const OUTPUT_ONLY = {
  es: 'Responde únicamente con el texto final, sin títulos, comillas, viñetas ni explicaciones.',
  en: 'Reply only with the final text, without headings, quotes, bullet points or explanations.',
};

function clip(value, max) {
  return String(value || '').slice(0, max);
}

// Compact CV context for summary generation
function describeCv(ctx = {}, lang) {
  const lines = [];
  if (ctx.title) lines.push(`${lang === 'en' ? 'Title' : 'Título'}: ${clip(ctx.title, 200)}`);
  (ctx.experience || []).slice(0, 6).forEach(e => {
    lines.push(`- ${clip(e.position, 120)} @ ${clip(e.company, 120)} (${clip(e.period, 60)}): ${clip(e.description, 500)}`);
  });
  const skills = Object.values(ctx.skills || {}).filter(Array.isArray).flat().slice(0, 40).map(s => clip(s, 60));
  if (skills.length) lines.push(`${lang === 'en' ? 'Skills' : 'Habilidades'}: ${skills.join(', ')}`);
  (ctx.education || []).slice(0, 4).forEach(e => lines.push(`- ${clip(e.degree, 150)}, ${clip(e.institution, 150)}`));
  return lines.join('\n');
}

function buildMessages({ action, field, text, context, lang }) {
  const L = lang === 'en' ? 'en' : 'es';
  const langName = L === 'en' ? 'English' : 'español';
  const system = L === 'en'
    ? `You are an expert resume writer. Write in ${langName}, professional and concise, using action verbs, in implied third person (never start with "I am"). ${NO_INVENT.en} ${OUTPUT_ONLY.en}`
    : `Eres un experto en redacción de hojas de vida. Escribe en ${langName}, con tono profesional y conciso, usando verbos de acción, en tercera persona implícita (nunca empieces con "Soy" ni uses "yo"). Respeta el género de la persona según el contexto. ${NO_INVENT.es} ${OUTPUT_ONLY.es}`;

  const kind = field === 'summary'
    ? (L === 'en' ? 'professional summary' : 'perfil profesional')
    : (L === 'en' ? 'job description' : 'descripción de experiencia laboral');

  const role = context?.position || context?.company
    ? (L === 'en'
      ? `Context: position "${clip(context.position, 120)}" at "${clip(context.company, 120)}".\n`
      : `Contexto: cargo "${clip(context.position, 120)}" en "${clip(context.company, 120)}".\n`)
    : '';

  let user;
  switch (action) {
    case 'improve':
      user = L === 'en'
        ? `${role}Improve the wording of this ${kind}: clearer, more professional, highlighting responsibilities and achievements. Keep roughly the same length.\n\nText:\n${text}`
        : `${role}Mejora la redacción de este ${kind}: más claro, profesional y destacando responsabilidades y logros. Mantén aproximadamente la misma extensión.\n\nTexto:\n${text}`;
      break;
    case 'shorten':
      user = L === 'en'
        ? `${role}Shorten this ${kind} to about 60% of its length, keeping the most relevant information.\n\nText:\n${text}`
        : `${role}Acorta este ${kind} a cerca del 60% de su extensión, conservando lo más relevante.\n\nTexto:\n${text}`;
      break;
    case 'translate': {
      // Converts the text into the CV's language (e.g. Spanish text in the EN version)
      const target = L === 'en' ? 'English' : 'Spanish';
      const sys = `Translate resume text to ${target}. Keep company names, product names and technologies unchanged. ${OUTPUT_ONLY.en}`;
      return [{ role: 'system', content: sys }, { role: 'user', content: text }];
    }
    case 'generate':
      user = L === 'en'
        ? `Write a professional summary (4 to 6 sentences, one paragraph) for this resume, based only on this information:\n\n${describeCv(context, L)}`
        : `Escribe un perfil profesional (4 a 6 oraciones, un solo párrafo) para esta hoja de vida, basado solo en esta información:\n\n${describeCv(context, L)}`;
      break;
    default:
      return null;
  }
  return [{ role: 'system', content: system }, { role: 'user', content: user }];
}

function status(req, res) {
  res.json({ enabled: !!OLLAMA_URL, model: OLLAMA_URL ? OLLAMA_MODEL : null });
}

// Streams the generated text as Server-Sent Events: `data: "<chunk>"` ... `event: done`.
async function assist(req, res) {
  if (!OLLAMA_URL) return res.status(503).json({ error: 'Asistente de IA no configurado' });

  const { action, field, text = '', context = {}, lang = 'es' } = req.body || {};
  if (!['improve', 'shorten', 'translate', 'generate'].includes(action)) {
    return res.status(400).json({ error: 'Acción no válida' });
  }
  if (action !== 'generate' && !String(text).trim()) {
    return res.status(400).json({ error: 'Escribe un texto primero' });
  }
  if (String(text).length > MAX_TEXT) {
    return res.status(400).json({ error: `El texto supera ${MAX_TEXT} caracteres` });
  }

  const userId = req.user.id;
  if (active.has(userId)) return res.status(429).json({ error: 'Ya hay una generación en curso' });
  if (!underQuota(userId)) return res.status(429).json({ error: 'Límite de uso alcanzado, intenta en un rato' });

  const messages = buildMessages({ action, field, text: String(text), context, lang });
  active.add(userId);
  const abort = new AbortController();
  // Stop generating on the server if the user cancels or leaves
  res.on('close', () => abort.abort());

  try {
    const upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abort.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: true,
        think: false,
        options: { temperature: 0.4, num_predict: 700 },
      }),
    });
    if (!upstream.ok || !upstream.body) throw new Error(`Ollama HTTP ${upstream.status}`);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no', // disable nginx buffering in production
    });

    const decoder = new TextDecoder();
    let buffer = '';
    for await (const chunk of upstream.body) {
      buffer += decoder.decode(chunk, { stream: true });
      let nl;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        const msg = JSON.parse(line);
        if (msg.message?.content) res.write(`data: ${JSON.stringify(msg.message.content)}\n\n`);
      }
    }
    res.write('event: done\ndata: ""\n\n');
    res.end();
  } catch (err) {
    if (abort.signal.aborted) return;
    console.error('[ai]', err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'El asistente de IA no está disponible' });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify('Se interrumpió la generación')}\n\n`);
      res.end();
    }
  } finally {
    active.delete(userId);
  }
}

module.exports = { status, assist };
