import React from 'react';
export default function LanguageToggle({ lang, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {['es', 'en'].map(l => (
        <button
          key={l}
          className={lang === l ? 'btn-primary' : 'btn-ghost'}
          onClick={() => onChange(l)}
        >
          {l === 'es' ? '🇨🇴 Español' : '🇺🇸 English'}
        </button>
      ))}
    </div>
  );
}
