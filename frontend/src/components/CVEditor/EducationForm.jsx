import React from 'react';

export default function EducationForm({ items, onChange, lang }) {
  const isEn = lang === 'en';

  const updateItem = (index, field, value) => {
    onChange(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newId = Math.max(0, ...items.map(i => i.id || 0)) + 1;
    onChange([...items, { id: newId, institution: '', degree: '', period: '' }]);
  };

  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: '#2c3e50', fontSize: 16 }}>{isEn ? 'Education' : 'Educación'}</h3>
        <button className="btn-primary" onClick={addItem}>
          + Agregar
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id || index} style={{
          border: '1px solid #dee2e6', borderRadius: 8, padding: 14, marginBottom: 14, background: '#fafafa',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, color: '#2c3e50', fontSize: 13 }}>{item.institution || (isEn ? 'New Institution' : 'Nueva Institución')}</span>
            <button className="btn-delete" onClick={() => removeItem(index)} title="Eliminar"><i className="fa-solid fa-trash" /></button>
          </div>
          <div className="form-group">
            <label>{isEn ? 'Institution' : 'Institución'}</label>
            <input value={item.institution || ''} onChange={e => updateItem(index, 'institution', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{isEn ? 'Degree / Program' : 'Título / Programa'}</label>
            <input value={item.degree || ''} onChange={e => updateItem(index, 'degree', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{isEn ? 'Period' : 'Período'}</label>
            <input value={item.period || ''} onChange={e => updateItem(index, 'period', e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  );
}
