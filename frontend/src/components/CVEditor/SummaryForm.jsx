import React from 'react';

export default function SummaryForm({ value, onChange, lang }) {
  const label = lang === 'en' ? 'Professional Summary' : 'Perfil Profesional';
  return (
    <div>
      <h3 style={{ color: '#2c3e50', marginBottom: 16, fontSize: 16 }}>{label}</h3>
      <div className="form-group">
        <label>{lang === 'en' ? 'Summary text' : 'Texto del resumen'}</label>
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={10}
          style={{ minHeight: 200 }}
        />
      </div>
    </div>
  );
}
