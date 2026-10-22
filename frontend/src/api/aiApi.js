import axios from 'axios';

const BASE = '/api/ai';

export const getAiStatus = () => axios.get(`${BASE}/status`);

// Streams the assistant output; calls onChunk(text) as it arrives. Returns the full text.
// The request can be cancelled with the AbortSignal.
export async function streamAssist({ action, field, text, context, lang }, onChunk, signal) {
  const res = await fetch(`${BASE}/assist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, field, text, context, lang }),
    signal,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let sep;
    // SSE events are separated by a blank line
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const raw = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const event = /^event: (.+)$/m.exec(raw)?.[1];
      const data = /^data: (.*)$/m.exec(raw)?.[1];
      if (event === 'error') throw new Error(JSON.parse(data));
      if (event === 'done') return full;
      if (data) {
        full += JSON.parse(data);
        onChunk(full);
      }
    }
  }
  // Stream closed without the "done" event (server restart, network drop)
  throw new Error(full ? 'La generación se interrumpió antes de terminar' : 'Se perdió la conexión con el asistente');
}
