import React from 'react';

const FIELDS = [
  { key: 'name', label: 'Nombre completo' },
  { key: 'title', label: 'Título profesional' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'email', label: 'Correo electrónico' },
  { key: 'location', label: 'Ubicación' },
];

export default function PersonalInfoForm({ data, onChange }) {
  const handleField = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div>
      <h3 style={{ color: '#2c3e50', marginBottom: 16, fontSize: 16 }}>Información Personal</h3>
      {FIELDS.map(f => (
        <div key={f.key} className="form-group">
          <label>{f.label}</label>
          <input
            type="text"
            value={data[f.key] || ''}
            onChange={e => handleField(f.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
