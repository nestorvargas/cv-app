import React, { useState } from 'react';
import { AREAS } from './areas.js';
import TitleField from './TitleField.jsx';
import { uploadImage } from '../../api/cvApi.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Extra data used by the traditional Colombian format only
const EXTRA_FIELDS = [
  { key: 'document_id',    es: 'Número de documento',      en: 'ID number' },
  { key: 'document_place', es: 'Lugar de expedición',      en: 'Place of issue' },
  { key: 'birth_date',     es: 'Fecha de nacimiento',      en: 'Date of birth', placeholder: '24 de junio de 1992' },
  { key: 'birth_place',    es: 'Lugar de nacimiento',      en: 'Place of birth' },
  { key: 'marital_status', es: 'Estado civil',             en: 'Marital status',
    options: { es: ['Soltero(a)', 'Casado(a)', 'Unión libre', 'Divorciado(a)', 'Viudo(a)'], en: ['Single', 'Married', 'Domestic partnership', 'Divorced', 'Widowed'] } },
  { key: 'address',        es: 'Dirección',                en: 'Address', span: true },
];

const FIELDS = [
  { key: 'name',     icon: 'fa-solid fa-user',         es: 'Nombre completo',    en: 'Full name',          span: true },
  { key: 'title',    icon: 'fa-solid fa-briefcase',    es: 'Título profesional', en: 'Professional title', span: true },
  { key: 'email',    icon: 'fa-solid fa-envelope',     es: 'Correo electrónico', en: 'Email',              type: 'email' },
  { key: 'phone',    icon: 'fa-solid fa-phone',        es: 'Teléfono',           en: 'Phone',              type: 'tel' },
  { key: 'location', icon: 'fa-solid fa-location-dot', es: 'Ubicación',          en: 'Location',           span: true },
  { key: 'linkedin', icon: 'fa-brands fa-linkedin',    es: 'LinkedIn',           en: 'LinkedIn',           placeholder: 'linkedin.com/in/usuario' },
  { key: 'github',   icon: 'fa-brands fa-github',      es: 'GitHub',             en: 'GitHub',             placeholder: 'github.com/usuario', optional: true },
];

export default function PersonalInfoForm({ data, onChange, lang, area, onAreaChange, isAdmin, profileName }) {
  const isEn = lang === 'en';

  const handleField = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const emailInvalid = data.email && !EMAIL_RE.test(data.email.trim());
  const hasExtra = EXTRA_FIELDS.some(f => data[f.key]);
  const [showExtra, setShowExtra] = useState(hasExtra || !!data.signature);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [sigError, setSigError] = useState('');

  const handleSignature = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setUploadingSig(true);
    setSigError('');
    try {
      const res = await uploadImage(file, profileName, 'signature');
      handleField('signature', res.data.url);
    } catch (_) {
      setSigError(isEn ? 'Could not upload the image' : 'No se pudo subir la imagen');
    } finally {
      setUploadingSig(false);
    }
  };

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

      <div className={`ed-extra ${showExtra ? 'is-open' : ''}`}>
        <button type="button" className="ed-extra-head" onClick={() => setShowExtra(o => !o)} aria-expanded={showExtra}>
          <span>
            <i className="fa-solid fa-id-card" /> {isEn ? 'Additional details (traditional format)' : 'Datos adicionales (formato tradicional)'}
          </span>
          <i className="fa-solid fa-chevron-down ed-item-chevron" />
        </button>
        {showExtra && (
          <div className="ed-extra-body">
            <p className="ed-help" style={{ marginTop: 0, marginBottom: 12 }}>
              {isEn
                ? 'Only shown in the Traditional template. Leave empty what you prefer not to share.'
                : 'Solo se muestran en la plantilla Tradicional. Deja vacío lo que prefieras no compartir.'}
            </p>
            <div className="ed-grid">
              {EXTRA_FIELDS.map(f => (
                <div key={f.key} className={`form-group ${f.span ? 'ed-span-2' : ''}`}>
                  <label htmlFor={`pi-${f.key}`}>{isEn ? f.en : f.es}</label>
                  {f.options ? (
                    <select id={`pi-${f.key}`} value={data[f.key] || ''} onChange={e => handleField(f.key, e.target.value)}>
                      <option value="">—</option>
                      {f.options[isEn ? 'en' : 'es'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      id={`pi-${f.key}`}
                      value={data[f.key] || ''}
                      placeholder={f.placeholder}
                      onChange={e => handleField(f.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <div className="form-group ed-span-2">
                <label>{isEn ? 'Signature (image)' : 'Firma (imagen)'}</label>
                <div className="ed-signature">
                  {data.signature
                    ? <img src={data.signature} alt="" />
                    : <span className="ed-help">{isEn ? 'PNG with transparent or white background' : 'PNG con fondo transparente o blanco'}</span>}
                  <div className="ed-signature-actions">
                    <label className="btn-outline ed-add-btn" style={{ margin: 0, cursor: 'pointer' }}>
                      <i className={`fa-solid ${uploadingSig ? 'fa-spinner fa-spin' : 'fa-signature'}`} />
                      {data.signature ? (isEn ? 'Replace' : 'Cambiar') : (isEn ? 'Upload signature' : 'Subir firma')}
                      <input type="file" accept="image/*" onChange={handleSignature} hidden />
                    </label>
                    {data.signature && (
                      <button type="button" className="btn-ghost" onClick={() => handleField('signature', '')}>
                        {isEn ? 'Remove' : 'Quitar'}
                      </button>
                    )}
                  </div>
                </div>
                {sigError && <p className="ed-help is-error">{sigError}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
