import React, { useState } from 'react';
import { login } from '../../api/authApi.js';
import './auth.css';

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
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <i className="fa-solid fa-id-card" />
        </div>
        <h1 className="auth-title">CV Manager</h1>
        <p className="auth-subtitle">Inicia sesión para continuar</p>

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
  );
}
