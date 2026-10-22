import React from 'react';
import SortableList from './SortableList.jsx';

export default function EducationForm({ items, onChange, lang }) {
  const isEn = lang === 'en';

  return (
    <div>
      <div className="ed-section-head">
        <div>
          <h3 className="ed-section-title">{isEn ? 'Education' : 'Educación'}</h3>
          <p className="ed-section-hint">
            {isEn ? 'Degrees, bootcamps and programs.' : 'Títulos, bootcamps y programas.'}
          </p>
        </div>
      </div>

      <SortableList
        items={items}
        onChange={onChange}
        newItem={() => ({ institution: '', degree: '', period: '' })}
        getTitle={item => item.degree}
        getSubtitle={item => [item.institution, item.period].filter(Boolean).join(' · ')}
        isEmpty={item => !item.institution && !item.degree}
        labels={{
          add: isEn ? 'Add education' : 'Agregar educación',
          untitled: isEn ? 'New program' : 'Nuevo programa',
          empty: isEn ? 'No education yet.' : 'Aún no hay educación.',
          emptyIcon: 'fa-graduation-cap',
        }}
        renderFields={(item, update) => (
          <div className="ed-grid">
            <div className="form-group ed-span-2">
              <label>{isEn ? 'Degree / Program' : 'Título / Programa'}</label>
              <input value={item.degree || ''} onChange={e => update('degree', e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label>{isEn ? 'Institution' : 'Institución'}</label>
              <input value={item.institution || ''} onChange={e => update('institution', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{isEn ? 'Period' : 'Período'}</label>
              <input
                value={item.period || ''}
                onChange={e => update('period', e.target.value)}
                placeholder={isEn ? 'e.g. 2018 - present' : 'Ej: 2018 - en curso'}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
