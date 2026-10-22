import React from 'react';
import SortableList from './SortableList.jsx';

const TYPES = {
  work: { es: 'Laboral', en: 'Professional' },
  personal: { es: 'Personal', en: 'Personal' },
  family: { es: 'Familiar', en: 'Family' },
};

export default function ReferencesForm({ items, onChange, lang }) {
  const isEn = lang === 'en';
  const typeName = t => (TYPES[t] ? (isEn ? TYPES[t].en : TYPES[t].es) : '');

  return (
    <div>
      <div className="ed-section-head">
        <div>
          <h3 className="ed-section-title">{isEn ? 'References' : 'Referencias'}</h3>
          <p className="ed-section-hint">
            {isEn
              ? 'Shown in the Traditional template. Ask for permission before listing someone.'
              : 'Se muestran en la plantilla Tradicional. Pide autorización antes de incluir a alguien.'}
          </p>
        </div>
      </div>

      <SortableList
        items={items}
        onChange={onChange}
        newItem={() => ({ type: 'work', name: '', occupation: '', phone: '' })}
        getTitle={item => item.name}
        getSubtitle={item => [typeName(item.type), item.occupation, item.phone].filter(Boolean).join(' · ')}
        isEmpty={item => !item.name && !item.phone}
        labels={{
          add: isEn ? 'Add reference' : 'Agregar referencia',
          untitled: isEn ? 'New reference' : 'Nueva referencia',
          empty: isEn ? 'No references yet.' : 'Aún no hay referencias.',
          emptyIcon: 'fa-address-book',
        }}
        renderFields={(item, update) => (
          <div className="ed-grid">
            <div className="form-group">
              <label>{isEn ? 'Type' : 'Tipo'}</label>
              <select value={item.type || 'work'} onChange={e => update('type', e.target.value)}>
                {Object.keys(TYPES).map(t => <option key={t} value={t}>{typeName(t)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{isEn ? 'Full name' : 'Nombre completo'}</label>
              <input value={item.name || ''} onChange={e => update('name', e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label>{isEn ? 'Occupation / role' : 'Ocupación / cargo'}</label>
              <input value={item.occupation || ''} onChange={e => update('occupation', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{isEn ? 'Phone' : 'Teléfono'}</label>
              <input value={item.phone || ''} onChange={e => update('phone', e.target.value)} type="tel" />
            </div>
          </div>
        )}
      />
    </div>
  );
}
