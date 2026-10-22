import React, { useState, useEffect } from 'react';
import { googleRegister } from '../../api/authApi.js';
import { searchTitles } from '../../api/catalogApi.js';
import { AREAS } from '../CVEditor/areas.js';

// Second step of Google sign-up: data prefilled from Google + main CV fields
export default function GoogleRegister({ registration, onDone, onCancel }) {
  const { profile, registrationToken } = registration;
  const [name, setName] = useState(profile.name || '');
  const [area, setArea] = useState('general');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [titles, setTitles] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Title suggestions from the catalog, for the chosen area
  useEffect(() => {
    const t = setTimeout(() => {
      searchTitles(title.trim(), 'es', area).then(r => setTitles(r.data)).catch(() => setTitles([]));
    }, 200);
    return () => clearTimeout(t);
  }, [title, area]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await googleRegister({ registrationToken, name, area, title, phone, location, acceptTerms: accepted });
      onDone(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo completar el registro');
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-card auth-card--wide" onSubmit={submit} onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="reg-title">
      <button type="button" className="auth-close" onClick={onCancel} aria-label="Cerrar">
        <i className="fa-solid fa-xmark" />
      </button>

      <div className="reg-head">
        {profile.picture
          ? <img src={profile.picture} alt="" className="reg-avatar" referrerPolicy="no-referrer" />
          : <div className="reg-avatar reg-avatar--empty"><i className="fa-solid fa-user" /></div>}
        <div>
          <h2 className="auth-title" id="reg-title">Completa tu registro</h2>
          <p className="auth-subtitle" style={{ margin: '4px 0 0' }}>
            <i className="fa-brands fa-google" /> {profile.email}
          </p>
        </div>
      </div>
      <p className="reg-note">
        Con estos datos creamos tu cuenta y tu primera hoja de vida. Podrás completarla y cambiarlo todo después.
      </p>

      <label className="auth-label" htmlFor="reg-name">Nombre completo</label>
      <div className="auth-input">
        <i className="fa-solid fa-user" />
        <input id="reg-name" className="cv-modal-input" value={name} onChange={e => setName(e.target.value)} required />
      </div>

      <label className="auth-label">Área profesional</label>
      <div className="reg-areas" role="radiogroup">
        {Object.entries(AREAS).map(([key, a]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={area === key}
            className={area === key ? 'active' : ''}
            onClick={() => setArea(key)}
          >
            <i className={`fa-solid ${a.icon}`} /> {a.name.es}
          </button>
        ))}
      </div>

      <label className="auth-label" htmlFor="reg-title-input">Título profesional</label>
      <div className="auth-input">
        <i className="fa-solid fa-briefcase" />
        <input
          id="reg-title-input"
          className="cv-modal-input"
          list="reg-titles"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Escribe o elige un cargo"
          autoComplete="off"
        />
        <datalist id="reg-titles">
          {titles.map(t => <option key={t.id} value={t.title} />)}
        </datalist>
      </div>

      <div className="reg-grid">
        <div>
          <label className="auth-label" htmlFor="reg-phone">Teléfono</label>
          <div className="auth-input">
            <i className="fa-solid fa-phone" />
            <input id="reg-phone" className="cv-modal-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="auth-label" htmlFor="reg-location">Ciudad</label>
          <div className="auth-input">
            <i className="fa-solid fa-location-dot" />
            <input id="reg-location" className="cv-modal-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Bogotá, Colombia" />
          </div>
        </div>
      </div>

      <label className="reg-terms">
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required />
        <span>
          Acepto los <a href="/terminos" target="_blank" rel="noreferrer">Términos y Condiciones</a> y
          autorizo el tratamiento de mis datos según la <a href="/privacidad" target="_blank" rel="noreferrer">Política de Tratamiento de Datos Personales</a>.
        </span>
      </label>

      {error && (
        <p className="cv-modal-error">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </p>
      )}

      <button className="cv-modal-confirm auth-submit" type="submit" disabled={submitting || !name.trim() || !accepted}>
        {submitting
          ? <><i className="fa-solid fa-spinner fa-spin" /> Creando tu cuenta...</>
          : <><i className="fa-solid fa-check" /> Crear cuenta y mi hoja de vida</>}
      </button>
    </form>
  );
}
