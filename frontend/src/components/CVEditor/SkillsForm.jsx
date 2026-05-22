import React, { useState } from 'react';

const CATEGORIES = {
  technical: { es: 'Técnicas', en: 'Technical' },
  databases: { es: 'Bases de Datos', en: 'Databases' },
  devops: { es: 'DevOps & Herramientas', en: 'DevOps & Tools' },
  tools: { es: 'Gestión', en: 'Management' },
  languages: { es: 'Idiomas', en: 'Languages' },
};

export default function SkillsForm({ data, onChange, lang }) {
  const [newSkill, setNewSkill] = useState({});

  const removeSkill = (category, index) => {
    onChange({ ...data, [category]: data[category].filter((_, i) => i !== index) });
  };

  const addSkill = (category) => {
    const val = (newSkill[category] || '').trim();
    if (!val) return;
    onChange({ ...data, [category]: [...(data[category] || []), val] });
    setNewSkill(prev => ({ ...prev, [category]: '' }));
  };

  return (
    <div>
      <h3 style={{ color: '#2c3e50', marginBottom: 16, fontSize: 16 }}>
        {lang === 'en' ? 'Skills' : 'Habilidades'}
      </h3>

      {Object.entries(CATEGORIES).map(([cat, labels]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, color: '#2c3e50', fontWeight: 700, marginBottom: 8, display: 'block' }}>
            {labels[lang] || labels.es}
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {(data[cat] || []).map((skill, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#2c3e50',
                color: 'white',
                borderRadius: 4,
                padding: '3px 10px',
                fontSize: 13,
              }}>
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(cat, i)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#ecf0f1',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '1px 5px',
                    fontSize: 13,
                    lineHeight: 1,
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                  title="Quitar"
                >×</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newSkill[cat] || ''}
              onChange={e => setNewSkill(prev => ({ ...prev, [cat]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addSkill(cat)}
              placeholder={lang === 'en' ? 'Add skill...' : 'Agregar habilidad...'}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={() => addSkill(cat)} style={{ whiteSpace: 'nowrap', padding: '7px 14px' }}>
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
