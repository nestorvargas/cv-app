import React, { useState } from 'react';
import { login } from '../../api/authApi.js';
import './auth.css';

const FEATURES = [
  { icon: 'fa-pen-to-square', text: 'Edita tu experiencia, educación y habilidades' },
  { icon: 'fa-language', text: 'Versiones en español e inglés' },
  { icon: 'fa-palette', text: 'Plantillas con vista previa en tiempo real' },
  { icon: 'fa-file-pdf', text: 'Descarga en PDF, incluida una versión ATS' },
];

// Home screen: app presentation plus the login form.
export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await login(username.trim(), password);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page app-bg">
      <div className="home-layout">
        <section className="home-hero">
          <div className="home-brand">
            <i className="fa-solid fa-id-card" /> CV Manager
          </div>
          <h1 className="home-title">App para crear hojas de vida</h1>
          <p className="home-lead">
            Crea, organiza y exporta tus hojas de vida profesionales desde un solo lugar.
          </p>
          <ul className="home-features">
            {FEATURES.map(f => (
              <li key={f.icon}>
                <span className="home-feature-icon"><i className={`fa-solid ${f.icon}`} /></span>
                {f.text}
              </li>
            ))}
          </ul>
        </section>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtitle">Ingresa con tu usuario para continuar</p>

          <label className="auth-label" htmlFor="auth-username">Usuario</label>
          <input
            id="auth-username"
            className="cv-modal-input"
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
          />

          <label className="auth-label" htmlFor="auth-password">Contraseña</label>
          <input
            id="auth-password"
            className="cv-modal-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="cv-modal-error">
              <i className="fa-solid fa-circle-exclamation" /> {error}
            </p>
          )}

          <button className="cv-modal-confirm auth-submit" type="submit" disabled={submitting || !username || !password}>
            {submitting
              ? <><i className="fa-solid fa-spinner fa-spin" /> Ingresando...</>
              : <><i className="fa-solid fa-right-to-bracket" /> Ingresar</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
