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
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.6)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 0 0 2px',
                    fontSize: 11,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  title="Quitar"
                ><i className="fa-solid fa-xmark" /></button>
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
