import React from 'react';
import SortableList from './SortableList.jsx';
import TextCounter from './TextCounter.jsx';
import AiAssist from './AiAssist.jsx';

export default function ExperienceForm({ items, onChange, lang }) {
  const isEn = lang === 'en';

  return (
    <div>
      <div className="ed-section-head">
        <div>
          <h3 className="ed-section-title">{isEn ? 'Work Experience' : 'Experiencia Laboral'}</h3>
          <p className="ed-section-hint">
            {isEn ? 'Most recent first. Drag to reorder.' : 'La más reciente primero. Arrastra para reordenar.'}
          </p>
        </div>
      </div>

      <SortableList
        items={items}
        onChange={onChange}
        newItem={() => ({ company: '', position: '', period: '', description: '' })}
        getTitle={item => item.position}
        getSubtitle={item => [item.company, item.period].filter(Boolean).join(' · ')}
        isEmpty={item => !item.company && !item.position && !item.description}
        labels={{
          add: isEn ? 'Add experience' : 'Agregar experiencia',
          untitled: isEn ? 'New position' : 'Nuevo cargo',
          empty: isEn ? 'No work experience yet.' : 'Aún no hay experiencia laboral.',
          emptyIcon: 'fa-briefcase',
        }}
        renderFields={(item, update) => (
          <>
            <div className="ed-grid">
              <div className="form-group">
                <label>{isEn ? 'Position' : 'Cargo'}</label>
                <input value={item.position || ''} onChange={e => update('position', e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label>{isEn ? 'Company' : 'Empresa'}</label>
                <input value={item.company || ''} onChange={e => update('company', e.target.value)} />
              </div>
              <div className="form-group ed-span-2">
                <label>{isEn ? 'Period' : 'Período'}</label>
                <input
                  value={item.period || ''}
                  onChange={e => update('period', e.target.value)}
                  placeholder={isEn ? 'e.g. Nov-2022 / Present' : 'Ej: Nov-2022 / Actual'}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{isEn ? 'Description' : 'Descripción'}</label>
              <textarea
                value={item.description || ''}
                onChange={e => update('description', e.target.value)}
                rows={6}
                placeholder={isEn ? 'Responsibilities, achievements and technologies...' : 'Responsabilidades, logros y tecnologías...'}
              />
              <TextCounter value={item.description} min={200} max={900} lang={lang} />
              <AiAssist
                field="experience"
                text={item.description}
                lang={lang}
                actions={['improve', 'shorten', 'translate']}
                context={{ position: item.position, company: item.company }}
                onApply={text => update('description', text)}
              />
            </div>
          </>
        )}
      />
    </div>
  );
}
