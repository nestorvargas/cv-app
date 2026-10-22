// Import a CV from a PDF and create a new CV profile owned by the user.
// Hybrid and light on the LLM: a deterministic parser handles sections, contact data,
// lists and references; the self-hosted LLM (Ollama) only segments the work experience,
// answering with line numbers instead of rewriting text (a few hundred tokens, not thousands).
// Progress is streamed as Server-Sent Events.
const crypto = require('crypto');
// Required from lib/ to skip pdf-parse's index.js debug harness
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const { pool } = require('../db');

const OLLAMA_URL = (process.env.OLLAMA_URL || '').replace(/\/+$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

const PLACEHOLDER = /^(no especificad[oa]|n\/?a|ninguno|sin dato|not specified|none|-+)$/i;
const clean = (v, max = 300) => {
  const s = String(v ?? '').replace(/\s+/g, ' ').trim();
  return PLACEHOLDER.test(s) ? '' : s.slice(0, max);
};
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Rebuilds each page in visual order (top to bottom, left to right) from the text item
// positions. Word text boxes (e.g. boxed section titles) are stored out of order in the
// PDF stream, so the default extraction would put headings after their content.
async function renderPageInVisualOrder(pageData) {
  const content = await pageData.getTextContent({ normalizeWhitespace: true });
  const items = content.items
    .filter(it => it.str && it.str.trim())
    .map(it => ({ str: it.str, x: it.transform[4], y: it.transform[5], w: it.width || 0 }));
  const rows = [];
  for (const it of items.sort((a, b) => b.y - a.y || a.x - b.x)) {
    const row = rows.find(r => Math.abs(r.y - it.y) <= 3);
    if (row) row.items.push(it); else rows.push({ y: it.y, items: [it] });
  }
  rows.sort((a, b) => b.y - a.y);
  // Blank line where the vertical gap is large (paragraph / entry separation)
  const out = [];
  let prevY = null;
  for (const row of rows) {
    if (prevY !== null && prevY - row.y > 22) out.push('');
    let line = '';
    let lastEnd = null;
    for (const c of row.items.sort((a, b) => a.x - b.x)) {
      if (lastEnd !== null && c.x - lastEnd > 1.5 && !line.endsWith(' ')) line += ' ';
      line += c.str;
      lastEnd = c.x + c.w;
    }
    out.push(line.replace(/\s+/g, ' ').trim());
    prevY = row.y;
  }
  return out.join('\n');
}

// ── Sections ────────────────────────────────────────────────────────────────
const SECTIONS = [
  ['personal', /^(datos personales|informacion personal|personal (data|information|details))$/],
  ['profile', /^(perfil( profesional)?|resumen( profesional)?|sobre mi|acerca de mi|objetivo( profesional)?|summary|professional summary|profile|about me)$/],
  ['personalProfile', /^perfil personal$/],
  ['experience', /^(experiencia( laboral| profesional)?|trayectoria( laboral| profesional)?|historia laboral|work experience|experience|employment( history)?)$/],
  ['education', /^(formacion( academica)?|educacion|estudios( realizados)?|academic background|education)$/],
  ['certificates', /^(certificad\w*|cursos( y certificaciones)?|estudios complementarios|formacion complementaria|diplomados|certifications?|courses|training)$/],
  ['skills', /^(habilidades( tecnicas)?|competencias|conocimientos( tecnicos)?|aptitudes|manejo de software|software( de [a-z ]+)?|herramientas( informaticas)?|tecnologias|skills|technical skills|tools)$/],
  ['languages', /^(idiomas?|languages?)$/],
  ['workRefs', /^referencias (laborales|profesionales)$|^(professional |work )?references$/],
  ['familyRefs', /^referencias familiares$/],
  ['personalRefs', /^referencias personales$/],
];

function sectionOf(line) {
  const t = strip(line).replace(/[:.\-–—•]+$/g, '').trim();
  if (!t || t.length > 45) return null;
  for (const [key, re] of SECTIONS) if (re.test(t)) return key;
  return null;
}

// Lines grouped by section; text before the first heading is the header (name, title, contact)
function splitSections(lines) {
  const out = { header: [] };
  let current = 'header';
  for (const line of lines) {
    const key = sectionOf(line);
    if (key) { current = key; out[current] = out[current] || []; continue; }
    out[current] = out[current] || [];
    out[current].push(line);
  }
  return out;
}

// ── Field extraction ───────────────────────────────────────────────────────
function extractContacts(text) {
  const email = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0] || '';
  // Colombian mobiles first, then a labeled line; never a bare 10-digit ID number
  const mobile = text.match(/(?:\+?57[\s-]?)?\b3\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/)?.[0];
  const labeled = text.match(/(?:tel[eé]fono|celular|m[oó]vil|phone|tel\.?)\s*:?\s*(\+?[\d\s()-]{7,18}\d)/i)?.[1];
  const linkedin = text.match(/(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i)?.[0]?.replace(/^https?:\/\/(www\.)?/i, '') || '';
  const github = text.match(/(?:https?:\/\/)?github\.com\/[A-Za-z0-9_-]+/i)?.[0]?.replace(/^https?:\/\//i, '') || '';
  return { email, phone: clean(mobile || labeled || ''), linkedin, github };
}

// "LABEL value" rows of a personal data table (traditional Colombian format)
// Known label phrases, longest first, matched at the start of the row ("DOCUMENTO DE IDENTIDAD CC: 123")
const PERSONAL_LABELS = [
  ['name', ['nombre completo', 'nombres', 'nombre']],
  ['document_id', ['documento de identidad', 'cedula de ciudadania', 'cedula', 'documento', 'identificacion']],
  ['birth_date', ['fecha de nacimiento']],
  ['birth_place', ['lugar de nacimiento']],
  ['marital_status', ['estado civil']],
  ['address', ['direccion', 'domicilio']],
  ['location', ['ciudad de residencia', 'ciudad', 'residencia', 'ubicacion']],
];
const ALL_LABELS = PERSONAL_LABELS.flatMap(([, ls]) => ls).concat(['telefono', 'celular', 'e-mail', 'email', 'correo']);
const startsWithLabel = (line, label) => { const l = strip(line); return l === label || l.startsWith(label + ' ') || l.startsWith(label + ':'); };
const isLabelRow = line => ALL_LABELS.some(label => startsWithLabel(line, label));

function parsePersonal(lines) {
  const data = {};
  for (const line of lines) {
    for (const [key, labels] of PERSONAL_LABELS) {
      if (data[key]) continue;
      const label = labels.find(l => startsWithLabel(line, l));
      if (label) {
        // Accents do not change the length, so the label can be cut from the original line
        data[key] = clean(line.slice(label.length).replace(/^\s*:?\s*/, ''), 200);
        break;
      }
    }
  }
  if (data.document_id) data.document_id = data.document_id.replace(/^(c\.?\s?c\.?|cc)\s*:?\s*/i, '');
  return data;
}

// Name and title from the header: skips "HOJA DE VIDA" style captions and contact lines
function parseHeader(lines) {
  const candidates = lines
    .map(l => l.trim())
    .filter(l => l && !isLabelRow(l) && !/hoja de vida|curr[ií]cul|resume|@|\d{6,}|linkedin|github|www\./i.test(l));
  const isName = l => /^[A-Za-zÁÉÍÓÚÑáéíóúñ.' -]{5,60}$/.test(l) && l.split(/\s+/).length >= 2 && l.split(/\s+/).length <= 6;
  const nameIdx = candidates.findIndex(isName);
  const name = nameIdx >= 0 ? candidates[nameIdx] : '';
  const title = nameIdx >= 0 && candidates[nameIdx + 1] && candidates[nameIdx + 1].length <= 120 ? candidates[nameIdx + 1] : '';
  const titleCase = s => (s === s.toUpperCase() ? s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()) : s);
  return { name: titleCase(name), title: clean(title, 200) };
}

const BULLET = /^[•·▪●◦\-–*]\s*/;

// Comma/bullet separated items; "Label:" sub-headings are skipped
function parseList(lines, maxLen = 60) {
  const items = [];
  for (const raw of lines) {
    const line = raw.replace(BULLET, '').trim();
    if (!line || /:$/.test(line)) continue;
    const body = line.includes(':') && line.indexOf(':') < 40 ? line.slice(line.indexOf(':') + 1) : line;
    // Separators outside parentheses only: "Inglés (básico, intermedio)" stays one item
    for (const part of body.split(/[,;|•·](?![^()]*\))/)) {
      const item = part.replace(/\.$/, '').trim();
      if (item && item.length <= maxLen && !items.some(i => i.toLowerCase() === item.toLowerCase())) items.push(item);
    }
  }
  return items.slice(0, 40);
}

// Paragraph-joined text; bullets become sentences
function parseParagraph(lines) {
  return clean(lines.map(l => l.replace(BULLET, '').trim()).filter(Boolean)
    .map(l => (/[.!?:]$/.test(l) ? l : `${l}`)).join(' '), 4000);
}

// Blocks separated by blank lines (or bullets), e.g. education or certificate entries
function blocks(lines) {
  const out = [];
  let cur = [];
  for (const line of lines) {
    if (!line.trim() || BULLET.test(line)) {
      if (cur.length) out.push(cur);
      cur = line.trim() ? [line.replace(BULLET, '').trim()] : [];
    } else cur.push(line.trim());
  }
  if (cur.length) out.push(cur);
  return out;
}

const YEARS = /\b((?:19|20)\d{2})\b(?:\s*[-–/]\s*(\b(?:19|20)\d{2}\b|actual|presente|present|en curso))?/i;

// Degree-like titles: "Estudios complementarios" entries with these words belong to Education
const DEGREE_WORDS = /\b(ingenier[ií]a|ingeniero|tecn[oó]log[oa]|t[eé]cnico|licenciad[oa]|licenciatura|profesional en|maestr[ií]a|especializaci[oó]n|doctorado|bachiller|pregrado|posgrado|universidad|bachelor|master|degree)\b/i;
const LANGUAGE_ROW = /^(idiomas?( extranjeros?)?|segunda lengua|languages?)$/;

function parseEducation(lines) {
  const entries = [];
  const languages = [];
  // "Label: value" rows (traditional format) — continuation lines extend the previous value
  if (lines.some(l => /^[^:]{3,40}:\s*\S/.test(l))) {
    let last = null;
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { last = null; continue; }
      const kv = line.match(/^([^:]{3,40}):\s*(.*)$/);
      if (kv) {
        if (LANGUAGE_ROW.test(strip(kv[1]).trim())) { languages.push(...parseList([kv[2]], 40)); last = null; continue; }
        last = { degree: kv[1].trim(), institution: kv[2].trim(), period: '' };
        entries.push(last);
      } else if (last) {
        last.institution = `${last.institution} ${line}`.trim();
      }
    }
  } else {
    for (const b of blocks(lines)) {
      const joined = b.join(' ');
      const period = joined.match(YEARS)?.[0] || joined.match(/\(([^)]*semestre[^)]*)\)/i)?.[1] || '';
      const [first, second] = b.map(l => l.replace(YEARS, '').replace(/\(\s*\)/, '').trim());
      entries.push({ degree: first || '', institution: second || '', period });
    }
  }
  return {
    education: entries.slice(0, 15).map((e, i) => ({
      id: i + 1, degree: clean(e.degree, 200), institution: clean(e.institution, 200), period: clean(e.period, 60),
    })).filter(e => e.degree || e.institution),
    languages,
  };
}

function parseCertificates(lines) {
  return blocks(lines).slice(0, 30).map((b, i) => {
    const joined = b.join(' ');
    const year = joined.match(/\b(19|20)\d{2}\b/)?.[0] || '';
    return { id: i + 1, name: clean(b[0].replace(/\b(19|20)\d{2}\b/, ''), 200), issuer: clean(b[1] || '', 150), year, url: '' };
  }).filter(c => c.name && !(b => /^[A-ZÁÉÍÓÚÑ]{3,14}$/.test(b))(c.name));
}

// Skips the closing signature block (underline, own name, "Cédula ..." line)
function parseReferences(lines, type, ownName = '') {
  const own = strip(ownName);
  const usable = lines.filter(l => !/_{4,}/.test(l) && !/^(c[eé]dula|c\.?c\.?)\b/i.test(l.trim()) && !/^de [A-ZÁÉÍÓÚÑ ]+$/.test(l.trim()));
  return blocks(usable).filter(b => !(own && b.some(l => strip(l) === own))).slice(0, 10).map((b, i) => {
    const phone = b.find(l => /\d{7,}/.test(l.replace(/\s/g, ''))) || '';
    const rest = b.filter(l => l !== phone);
    return { id: i + 1, type, name: clean(rest[0], 120), occupation: clean(rest[1], 120), phone: clean(phone, 30) };
  }).filter(r => r.name);
}

// ── Work experience: paragraphs are the entries; the LLM only labels them ──
// It answers with company / position / period per paragraph (or marks it as the
// continuation of the previous one), so the output is a few hundred tokens and the
// descriptions keep the original text.
const EXP_SCHEMA = {
  type: 'object',
  properties: {
    paragraphs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: { type: 'integer' }, continues_previous: { type: 'boolean' },
          company: { type: 'string' }, position: { type: 'string' }, period: { type: 'string' },
        },
        required: ['index', 'continues_previous', 'company', 'position', 'period'],
      },
    },
  },
  required: ['paragraphs'],
};

const paragraphsOf = lines => blocks(lines).map(b => b.join(' ').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 25);

// Durations and dates that mark the start of a job ("(3 AÑOS)", "desde marzo de 2014", "2019 - 2021")
const DURATION = /\(\s*\d+\s*(a[nñ]os?|meses|mes|years?|months?)\s*\)|desde\s+[a-záéíóú]+\s+de\s+(19|20)\d{2}|\b(19|20)\d{2}\s*[-–/]\s*((19|20)\d{2}|actual|presente|present)/i;

// "Ingeniero de soporte y desarrollo en Tecsua desde ..." -> position + company
function guessRole(text) {
  const m = text.match(/^(.{3,90}?)\s+(?:en|at)\s+([A-ZÁÉÍÓÚÑ][^,(.]{1,60}?)(?=\s+(?:desde|con|from|\()|[,(.]|$)/);
  return m ? { position: m[1].trim(), company: m[2].trim() } : { position: '', company: '' };
}

async function labelExperience(paragraphs, signal) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Give up after 90 s (or if the user leaves); the import then splits by paragraphs
    signal: AbortSignal.any([signal, AbortSignal.timeout(90000)]),
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      think: false,
      format: EXP_SCHEMA,
      options: { temperature: 0, num_ctx: 4096, num_predict: 900 },
      messages: [
        { role: 'system', content: 'Recibes los párrafos numerados de la sección de experiencia laboral de una hoja de vida. Para cada párrafo indica la empresa, el cargo y el periodo tal como aparecen (vacío si no aparecen). Si el párrafo no es un empleo nuevo sino la continuación del anterior (por ejemplo una lista de proyectos o de tareas), marca continues_previous como true. No inventes datos.' },
        { role: 'user', content: paragraphs.map((p, i) => `[${i + 1}] ${p.slice(0, 600)}`).join('\n\n') },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const labels = JSON.parse((await res.json()).message?.content || '{}').paragraphs || [];
  const byIndex = new Map(labels.map(l => [l.index, l]));

  const jobs = [];
  paragraphs.forEach((text, i) => {
    const l = byIndex.get(i + 1) || {};
    // A paragraph with its own duration/date is a new job, whatever the model said
    const ownPeriod = text.match(DURATION)?.[0] || '';
    if (l.continues_previous && jobs.length && !ownPeriod) {
      jobs[jobs.length - 1].description += ` ${text}`;
      return;
    }
    const guess = guessRole(text);
    jobs.push({
      company: clean(l.continues_previous ? guess.company : (l.company || guess.company), 150),
      position: clean(l.continues_previous ? guess.position : (l.position || guess.position), 150),
      period: clean(l.continues_previous ? ownPeriod : (l.period || ownPeriod), 60),
      description: text,
    });
  });
  return jobs.map((j, i) => ({ id: i + 1, ...j, description: clean(j.description, 3000) }));
}

// Without the LLM: one entry per paragraph, description kept as written
function experienceByParagraph(paragraphs) {
  return paragraphs.map((text, i) => ({
    id: i + 1, company: '', position: '', period: clean(text.match(YEARS)?.[0] || '', 60), description: clean(text, 3000),
  }));
}

// Area from keywords, so no LLM call is needed for it
const AREA_HINTS = [
  ['tech', /desarroll|software|program|sistemas|devops|java|php|node|react|python|datos|ingenier[ií]a de sistemas/],
  ['health', /enfermer|m[eé]dic|salud|cl[ií]nic|hospital|farmac|odontol/],
  ['engineering', /industrial|calidad|laboratorio|procesos|producci[oó]n|mantenimiento|qu[ií]mic/],
  ['education', /docente|profesor|pedag|licenciad|ense[nñ]anza/],
  ['finance', /contad|contable|financ|tesorer|auditor/],
  ['sales', /ventas|comercial|marketing|mercadeo/],
  ['design', /dise[nñ]ador|gr[aá]fic|ux|ilustra/],
  ['legal', /abogad|jur[ií]dic|derecho/],
  ['construction', /arquitect|obra civil|ingeniero civil|construcci/],
  ['logistics', /log[ií]stic|bodega|inventari|despacho/],
  ['service', /servicio al cliente|call center|hotel|recepci/],
  ['business', /administrativ|asistente|secretari|gesti[oó]n documental/],
];
const guessArea = text => AREA_HINTS.find(([, re]) => re.test(strip(text)))?.[0] || 'general';

async function uniqueSlug(base) {
  const slug = strip(base).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'cv-importado';
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    const { rows } = await pool.query('SELECT 1 FROM cv_profiles WHERE profile_name = $1', [candidate]);
    if (!rows.length) return candidate;
  }
  return `${slug}-${crypto.randomBytes(3).toString('hex')}`;
}

const active = new Set();

async function importCv(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Sube un archivo PDF' });
  if (active.has(req.user.id)) return res.status(429).json({ error: 'Ya hay una importación en curso' });

  let text;
  try {
    text = (await pdfParse(req.file.buffer, { pagerender: renderPageInVisualOrder })).text
      .replace(/[ \t]+/g, ' ').replace(/\r/g, '').trim();
  } catch (_) {
    return res.status(400).json({ error: 'No se pudo leer el PDF. Verifica que no esté dañado ni protegido con contraseña.' });
  }
  if (text.length < 150) {
    return res.status(422).json({ error: 'El PDF no tiene texto seleccionable (parece escaneado). Usa un PDF exportado desde Word u otro editor.' });
  }

  active.add(req.user.id);
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
  });
  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  // Keep the stream alive while the LLM works (proxies drop idle connections)
  const keepAlive = setInterval(() => res.write(': ping\n\n'), 10000);

  try {
    const lines = text.split('\n').map(l => l.trim());
    const sec = splitSections(lines);
    send('progress', { step: 'read', sections: Object.keys(sec).filter(k => sec[k].some(Boolean)) });

    const contacts = extractContacts(text);
    const header = parseHeader(sec.header || []);
    const personal = parsePersonal([...(sec.personal || []), ...(sec.header || [])]);

    let experience = [];
    const expLines = (sec.experience || []).filter(Boolean);
    const expParagraphs = paragraphsOf(sec.experience || []);
    if (expParagraphs.length) {
      send('progress', { step: 'analyze' });
      experience = OLLAMA_URL
        ? await labelExperience(expParagraphs, abort.signal).catch(err => {
            console.warn('[import] LLM labeling failed, using paragraphs:', err.message);
            return experienceByParagraph(expParagraphs);
          })
        : experienceByParagraph(expParagraphs);
    }

    send('progress', { step: 'save' });
    const summary = parseParagraph(sec.profile || sec.personalProfile || []);
    const area = guessArea(`${header.title} ${summary} ${expLines.join(' ')}`);
    const personalInfo = {
      name: clean(personal.name || header.name, 150),
      title: header.title || experience[0]?.position || '',
      email: contacts.email,
      phone: contacts.phone,
      location: personal.location || '',
      linkedin: contacts.linkedin,
      github: contacts.github,
      area,
      document_id: personal.document_id,
      birth_date: personal.birth_date,
      birth_place: personal.birth_place,
      marital_status: personal.marital_status,
      address: personal.address,
    };
    Object.keys(personalInfo).forEach(k => { if (!personalInfo[k]) delete personalInfo[k]; });

    const edu = parseEducation(sec.education || []);
    const allCerts = parseCertificates(sec.certificates || []);
    // Degrees listed under "Estudios complementarios" go to Education
    const degreeCerts = allCerts.filter(c => DEGREE_WORDS.test(c.name));
    const education = [...edu.education, ...degreeCerts.map(c => ({ degree: c.name, institution: c.issuer, period: c.year }))]
      .map((e, i) => ({ ...e, id: i + 1 }));
    const certificates = allCerts.filter(c => !degreeCerts.includes(c)).map((c, i) => ({ ...c, id: i + 1 }));
    const skills = {
      technical: parseList(sec.skills || []),
      languages: [...parseList(sec.languages || [], 40), ...edu.languages].filter((v, i, a) => a.indexOf(v) === i),
    };
    const references = [
      ...parseReferences(sec.workRefs || [], 'work', personalInfo.name),
      ...parseReferences(sec.personalRefs || [], 'personal', personalInfo.name),
      ...parseReferences(sec.familyRefs || [], 'family', personalInfo.name),
    ].map((r, i) => ({ ...r, id: i + 1 }));

    const label = personalInfo.title || personalInfo.name || 'CV importado';
    const slug = await uniqueSlug(`${personalInfo.name || 'cv'} importado`);
    // Saved in both languages with the same content, ready to translate with the AI
    await pool.query(
      `INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education, skills, certificates, personal_references, owner_id)
       VALUES ($1, $2, 'es', $3::jsonb, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10),
              ($1, $2, 'en', $3::jsonb, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10)`,
      [slug, label, JSON.stringify(personalInfo), summary, JSON.stringify(experience), JSON.stringify(education),
        JSON.stringify(skills), JSON.stringify(certificates), JSON.stringify(references), req.user.id]
    );

    send('done', {
      profile_name: slug,
      profile_label: label,
      counts: {
        experience: experience.length, education: education.length, certificates: certificates.length,
        skills: skills.technical.length + skills.languages.length, references: references.length,
      },
    });
    res.end();
  } catch (err) {
    if (abort.signal.aborted) return;
    console.error('[import]', err);
    send('error', 'No se pudo analizar la hoja de vida. Intenta de nuevo.');
    res.end();
  } finally {
    clearInterval(keepAlive);
    active.delete(req.user.id);
  }
}

module.exports = { importCv };
