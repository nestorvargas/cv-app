import React, { useState, useEffect, useRef } from 'react';
import { changePassword } from '../../api/authApi.js';
import './auth.css';

function ChangePasswordModal({ onClose }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (next !== confirm) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await changePassword(current, next);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cv-modal-overlay" onClick={onClose}>
      <form className="cv-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="cv-modal-icon">
          <i className="fa-solid fa-key" />
        </div>
        <h3 className="cv-modal-title">Cambiar contraseña</h3>
        {done ? (
          <>
            <p className="cv-modal-desc">Contraseña actualizada. Se cerraron las sesiones en otros dispositivos.</p>
            <div className="cv-modal-actions">
              <button type="button" className="cv-modal-confirm" onClick={onClose}>Cerrar</button>
            </div>
          </>
        ) : (
          <>
            <p className="cv-modal-desc">Mínimo 8 caracteres.</p>
            <label className="auth-label">Contraseña actual</label>
            <input className="cv-modal-input" type="password" autoComplete="current-password"
              value={current} onChange={e => setCurrent(e.target.value)} autoFocus required />
            <label className="auth-label">Nueva contraseña</label>
            <input className="cv-modal-input" type="password" autoComplete="new-password"
              value={next} onChange={e => setNext(e.target.value)} required minLength={8} />
            <label className="auth-label">Confirmar nueva contraseña</label>
            <input className="cv-modal-input" type="password" autoComplete="new-password"
              value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8} />
            {error && (
              <p className="cv-modal-error">
                <i className="fa-solid fa-circle-exclamation" /> {error}
              </p>
            )}
            <div className="cv-modal-actions">
              <button type="button" className="cv-modal-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="cv-modal-confirm" disabled={saving}>
                {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Guardando...</> : <><i className="fa-solid fa-check" /> Guardar</>}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default function UserMenu({ user, onLogout, onManageUsers }) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-menu-trigger" onClick={() => setOpen(o => !o)}>
        <i className="fa-solid fa-circle-user" />
        <span>{user.username}</span>
        <i className="fa-solid fa-chevron-down user-menu-caret" />
      </button>
      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-role">{user.role === 'admin' ? 'Administrador' : 'Editor'}</div>
          {user.role === 'admin' && onManageUsers && (
            <button className="user-menu-item" onClick={() => { setOpen(false); onManageUsers(); }}>
              <i className="fa-solid fa-users-gear" /> Usuarios
            </button>
          )}
          <button className="user-menu-item" onClick={() => { setOpen(false); setShowPassword(true); }}>
            <i className="fa-solid fa-key" /> Cambiar contraseña
          </button>
          <button className="user-menu-item user-menu-item--danger" onClick={() => { setOpen(false); onLogout(); }}>
            <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
          </button>
        </div>
      )}
      {showPassword && <ChangePasswordModal onClose={() => setShowPassword(false)} />}
    </div>
  );
}
