import React from 'react';

export default function ExperienceForm({ items, onChange, lang }) {
  const isEn = lang === 'en';

  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const addItem = () => {
    const newId = Math.max(0, ...items.map(i => i.id || 0)) + 1;
    onChange([...items, { id: newId, company: '', position: '', period: '', description: '' }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index, dir) => {
    const arr = [...items];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange(arr);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: '#2c3e50', fontSize: 16 }}>{isEn ? 'Work Experience' : 'Experiencia Laboral'}</h3>
        <button className="btn-primary" onClick={addItem} style={{ fontSize: 13 }}>
          + {isEn ? 'Add' : 'Agregar'}
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id || index} style={{
          border: '1px solid #dee2e6',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          background: '#fafafa',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, color: '#2c3e50', fontSize: 14 }}>
              {item.company || (isEn ? 'New Company' : 'Nueva Empresa')}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn-ghost" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => moveItem(index, -1)}>▲</button>
              <button className="btn-ghost" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => moveItem(index, 1)}>▼</button>
              <button className="btn-danger" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>

          <div className="form-group">
            <label>{isEn ? 'Company' : 'Empresa'}</label>
            <input value={item.company || ''} onChange={e => updateItem(index, 'company', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{isEn ? 'Position' : 'Cargo'}</label>
            <input value={item.position || ''} onChange={e => updateItem(index, 'position', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{isEn ? 'Period' : 'Período'}</label>
            <input value={item.period || ''} onChange={e => updateItem(index, 'period', e.target.value)} placeholder="Ej: Nov-2022 / Actual" />
          </div>
          <div className="form-group">
            <label>{isEn ? 'Description' : 'Descripción'}</label>
            <textarea value={item.description || ''} onChange={e => updateItem(index, 'description', e.target.value)} rows={4} />
          </div>
        </div>
      ))}
    </div>
  );
}
