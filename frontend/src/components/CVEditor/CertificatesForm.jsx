import React from 'react';

export default function CertificatesForm({ items, onChange, lang }) {
  const isEn = lang === 'en';

  const updateItem = (index, field, value) => {
    onChange(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newId = Math.max(0, ...items.map(i => i.id || 0)) + 1;
    onChange([...items, { id: newId, name: '', issuer: '', year: '', url: '' }]);
  };

  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: '#2c3e50', fontSize: 16 }}>{isEn ? 'Certificates' : 'Certificados'}</h3>
        <button className="btn-primary" onClick={addItem}>+ Agregar</button>
      </div>

      {items.length === 0 && (
        <p style={{ color: '#95a5a6', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          {isEn ? 'No certificates added yet.' : 'Aún no hay certificados.'}
        </p>
      )}

      {items.map((item, index) => (
        <div key={item.id || index} style={{
          border: '1px solid #dee2e6', borderRadius: 8, padding: 14, marginBottom: 14, background: '#fafafa',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, color: '#2c3e50', fontSize: 13 }}>
              {item.name || (isEn ? 'New Certificate' : 'Nuevo Certificado')}
            </span>
            <button className="btn-delete" onClick={() => removeItem(index)} title="Eliminar"><i className="fa-solid fa-trash" /></button>
          </div>
          <div className="form-group">
            <label>{isEn ? 'Certificate Name' : 'Nombre del Certificado'}</label>
            <input value={item.name || ''} onChange={e => updateItem(index, 'name', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>{isEn ? 'Issuer' : 'Emisor / Plataforma'}</label>
              <input value={item.issuer || ''} onChange={e => updateItem(index, 'issuer', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{isEn ? 'Year' : 'Año'}</label>
              <input value={item.year || ''} onChange={e => updateItem(index, 'year', e.target.value)} placeholder="2024" />
            </div>
          </div>
          <div className="form-group">
            <label>URL {isEn ? '(optional)' : '(opcional)'}</label>
            <input value={item.url || ''} onChange={e => updateItem(index, 'url', e.target.value)} placeholder="https://..." />
          </div>
        </div>
      ))}
    </div>
  );
}
