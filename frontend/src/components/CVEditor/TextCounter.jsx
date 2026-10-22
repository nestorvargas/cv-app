import React from 'react';

// Character/word counter with a recommended range, shown under long text fields.
export default function TextCounter({ value, min, max, lang }) {
  const text = value || '';
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isEn = lang === 'en';

  let state = 'is-ok';
  let msg = isEn ? 'Good length' : 'Buena extensión';
  if (chars < min) {
    state = 'is-low';
    msg = isEn ? `Recommended: at least ${min} characters` : `Recomendado: al menos ${min} caracteres`;
  } else if (chars > max) {
    state = 'is-high';
    msg = isEn ? `Long: try to stay under ${max}` : `Extenso: intenta quedar bajo ${max}`;
  }

  const pct = Math.min(100, (chars / max) * 100);
  const color = state === 'is-ok' ? '#10b981' : state === 'is-low' ? '#f59e0b' : '#ef4444';

  return (
    <div className={`ed-counter ${state}`}>
      <span>{msg}</span>
      <span className="ed-counter-bar"><span style={{ width: `${pct}%`, background: color }} /></span>
      <span>{chars} {isEn ? 'chars' : 'caract.'} · {words} {isEn ? 'words' : 'palabras'}</span>
    </div>
  );
}
