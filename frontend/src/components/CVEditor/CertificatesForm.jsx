import React from 'react';
import SortableList from './SortableList.jsx';

export default function CertificatesForm({ items, onChange, lang }) {
  const isEn = lang === 'en';

  return (
    <div>
      <div className="ed-section-head">
        <div>
          <h3 className="ed-section-title">{isEn ? 'Certificates' : 'Certificados'}</h3>
          <p className="ed-section-hint">
            {isEn ? 'Put the most relevant for the role first.' : 'Pon primero los más relevantes para el cargo.'}
          </p>
        </div>
      </div>

      <SortableList
        items={items}
        onChange={onChange}
        newItem={() => ({ name: '', issuer: '', year: '', url: '' })}
        getTitle={item => item.name}
        getSubtitle={item => [item.issuer, item.year].filter(Boolean).join(' · ')}
        isEmpty={item => !item.name && !item.issuer}
        labels={{
          add: isEn ? 'Add certificate' : 'Agregar certificado',
          untitled: isEn ? 'New certificate' : 'Nuevo certificado',
          empty: isEn ? 'No certificates yet.' : 'Aún no hay certificados.',
          emptyIcon: 'fa-award',
        }}
        renderFields={(item, update) => (
          <div className="ed-grid">
            <div className="form-group ed-span-2">
              <label>{isEn ? 'Certificate name' : 'Nombre del certificado'}</label>
              <input value={item.name || ''} onChange={e => update('name', e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label>{isEn ? 'Issuer' : 'Emisor / Plataforma'}</label>
              <input value={item.issuer || ''} onChange={e => update('issuer', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{isEn ? 'Year' : 'Año'}</label>
              <input value={item.year || ''} onChange={e => update('year', e.target.value)} placeholder="2025" inputMode="numeric" />
            </div>
            <div className="form-group ed-span-2">
              <label>URL {isEn ? '(optional)' : '(opcional)'}</label>
              <div className="ed-field">
                <i className="fa-solid fa-link" />
                <input value={item.url || ''} onChange={e => update('url', e.target.value)} placeholder="https://..." type="url" />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
