import React from 'react';
import { AREAS } from './areas.js';
import TitleField from './TitleField.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS = [
  { key: 'name',     icon: 'fa-solid fa-user',         es: 'Nombre completo',    en: 'Full name',          span: true },
  { key: 'title',    icon: 'fa-solid fa-briefcase',    es: 'Título profesional', en: 'Professional title', span: true },
  { key: 'email',    icon: 'fa-solid fa-envelope',     es: 'Correo electrónico', en: 'Email',              type: 'email' },
  { key: 'phone',    icon: 'fa-solid fa-phone',        es: 'Teléfono',           en: 'Phone',              type: 'tel' },
  { key: 'location', icon: 'fa-solid fa-location-dot', es: 'Ubicación',          en: 'Location',           span: true },
  { key: 'linkedin', icon: 'fa-brands fa-linkedin',    es: 'LinkedIn',           en: 'LinkedIn',           placeholder: 'linkedin.com/in/usuario' },
  { key: 'github',   icon: 'fa-brands fa-github',      es: 'GitHub',             en: 'GitHub',             placeholder: 'github.com/usuario', optional: true },
];

export default function PersonalInfoForm({ data, onChange, lang, area, onAreaChange, isAdmin }) {
  const isEn = lang === 'en';

  const handleField = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const emailInvalid = data.email && !EMAIL_RE.test(data.email.trim());

  return (
    <div>
      <div className="ed-section-head">
        <div>
          <h3 className="ed-section-title">{isEn ? 'Personal Information' : 'Información Personal'}</h3>
          <p className="ed-section-hint">
            {isEn ? 'Empty fields are hidden in the CV.' : 'Los campos vacíos no se muestran en el CV.'}
          </p>
        </div>
      </div>

      <div className="form-group">
        <label>{isEn ? 'Professional area' : 'Área profesional'}</label>
        <div className="ed-area-picker" role="radiogroup">
          {Object.entries(AREAS).map(([key, a]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={area === key}
              className={area === key ? 'active' : ''}
              onClick={() => onAreaChange(key)}
            >
              <i className={`fa-solid ${a.icon}`} /> {isEn ? a.name.en : a.name.es}
            </button>
          ))}
        </div>
        <p className="ed-help">
          {isEn
            ? 'Adapts skill categories, optional fields and tips to your field.'
            : 'Adapta las categorías de habilidades, los campos opcionales y los consejos a tu área.'}
        </p>
      </div>

      <div className="ed-grid">
        {FIELDS.filter(f => !f.optional || AREAS[area].fields.includes(f.key) || data[f.key]).map(f => {
          const invalid = f.key === 'email' && emailInvalid;
          return (
            <div key={f.key} className={`form-group ${f.span ? 'ed-span-2' : ''}`}>
              <label htmlFor={`pi-${f.key}`}>{isEn ? f.en : f.es}</label>
              {f.key === 'title' ? (
                <TitleField
                  id="pi-title"
                  value={data.title}
                  onChange={v => handleField('title', v)}
                  lang={lang}
                  area={area}
                  isAdmin={isAdmin}
                />
              ) : (
                <div className={`ed-field ${invalid ? 'ed-field-error' : ''}`}>
                  <i className={f.icon} />
                  <input
                    id={`pi-${f.key}`}
                    type={f.type || 'text'}
                    value={data[f.key] || ''}
                    placeholder={f.placeholder}
                    onChange={e => handleField(f.key, e.target.value)}
                  />
                </div>
              )}
              {invalid && (
                <p className="ed-help is-error">{isEn ? 'Check the email format.' : 'Revisa el formato del correo.'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
