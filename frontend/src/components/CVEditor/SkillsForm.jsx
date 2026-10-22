import React, { useState } from 'react';
import { SKILL_KEYS, AREAS } from './areas.js';

const ICONS = {
  technical: 'fa-star',
  databases: 'fa-toolbox',
  devops: 'fa-gears',
  tools: 'fa-list-check',
  languages: 'fa-language',
};

// Tag input: Enter or comma adds, pasting "a, b, c" adds several, Backspace on empty removes the last.
function TagInput({ values, onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const addMany = (raw) => {
    const existing = new Set(values.map(v => v.toLowerCase()));
    const added = [];
    raw.split(/[,;\n]/).map(s => s.trim()).filter(Boolean).forEach(s => {
      if (!existing.has(s.toLowerCase())) {
        existing.add(s.toLowerCase());
        added.push(s);
      }
    });
    if (added.length) onChange([...values, ...added]);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addMany(draft);
    } else if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text');
    if (/[,;\n]/.test(text)) {
      e.preventDefault();
      addMany(draft + text);
    }
  };

  return (
    <div className="ed-tags" onClick={e => e.currentTarget.querySelector('input')?.focus()}>
      {values.map((skill, i) => (
        <span key={`${skill}-${i}`} className="ed-tag">
          {skill}
          <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} title="Quitar" aria-label={`Quitar ${skill}`}>
            <i className="fa-solid fa-xmark" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => draft.trim() && addMany(draft)}
        placeholder={values.length ? '' : placeholder}
      />
    </div>
  );
}

export default function SkillsForm({ data, onChange, lang, labels, area }) {
  const isEn = lang === 'en';

  return (
    <div>
      <div className="ed-section-head">
        <div>
          <h3 className="ed-section-title">{isEn ? 'Skills' : 'Habilidades'}</h3>
          <p className="ed-section-hint">
            {isEn
              ? 'Type and press Enter or comma. You can paste a comma-separated list. Click a category name to rename it.'
              : 'Escribe y presiona Enter o coma. Puedes pegar una lista separada por comas. Haz clic en el nombre de una categoría para renombrarla.'}
          </p>
        </div>
      </div>

      {SKILL_KEYS.map(cat => {
        const values = data[cat] || [];
        const renameCategory = (name) => onChange({ ...data, _labels: { ...labels, [cat]: name } });
        return (
          <div key={cat} className="ed-skill-group">
            <div className="ed-skill-head">
              <div className="ed-skill-name">
                <i className={`fa-solid ${ICONS[cat]}`} />
                <input
                  value={labels[cat] || ''}
                  onChange={e => renameCategory(e.target.value)}
                  aria-label={isEn ? 'Category name' : 'Nombre de la categoría'}
                  title={isEn ? 'Rename category' : 'Renombrar categoría'}
                />
                <i className="fa-solid fa-pen ed-skill-name-pen" />
              </div>
              <span className="ed-skill-count">{values.length}</span>
            </div>
            <TagInput
              values={values}
              // Persist the visible category names so templates show the same labels as the form
              onChange={vals => onChange({ ...data, _labels: data._labels || labels, [cat]: vals })}
              placeholder={isEn ? 'Add skill...' : 'Agregar habilidad...'}
            />
          </div>
        );
      })}

      <button
        type="button"
        className="btn-ghost"
        onClick={() => onChange({ ...data, _labels: { ...AREAS[area].labels[isEn ? 'en' : 'es'] } })}
      >
        <i className="fa-solid fa-rotate-left" /> {isEn ? 'Reset category names' : 'Restaurar nombres de categorías'}
      </button>
    </div>
  );
}
