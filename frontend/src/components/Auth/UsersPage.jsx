import React, { useState, useEffect } from 'react';
import { listUsers, createUser, updateUser, deleteUser } from '../../api/authApi.js';
import AppShell from '../AppShell/index.jsx';
import Pagination, { PAGE_SIZE } from '../Pagination/index.jsx';
import './auth.css';

const ROLE_LABELS = { admin: 'Administrador', editor: 'Editor' };

// mode: 'create' | 'edit'
function UserModal({ mode, target, onClose, onSaved }) {
  const [username, setUsername] = useState(target?.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(target?.role || 'editor');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await createUser({ username: username.trim(), password, role });
      } else {
        const data = { role };
        if (password) data.password = password;
        await updateUser(target.id, data);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cv-modal-overlay" onClick={onClose}>
      <form className="cv-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="cv-modal-icon">
          <i className={`fa-solid ${mode === 'create' ? 'fa-user-plus' : 'fa-user-pen'}`} />
        </div>
        <h3 className="cv-modal-title">{mode === 'create' ? 'Nuevo usuario' : `Editar ${target.username}`}</h3>
        <p className="cv-modal-desc">
          {mode === 'create'
            ? 'Usuario de 3-50 caracteres y contraseña de al menos 8.'
            : 'Deja la contraseña vacía para mantenerla. Cambiarla cierra las sesiones del usuario.'}
        </p>

        {mode === 'create' && (
          <>
            <label className="auth-label">Usuario</label>
            <input className="cv-modal-input" type="text" autoComplete="off"
              value={username} onChange={e => setUsername(e.target.value)} autoFocus required />
          </>
        )}

        <label className="auth-label">{mode === 'create' ? 'Contraseña' : 'Nueva contraseña'}</label>
        <input className="cv-modal-input" type="password" autoComplete="new-password"
          value={password} onChange={e => setPassword(e.target.value)}
          required={mode === 'create'} minLength={8} />

        <label className="auth-label">Rol</label>
        <select className="cv-modal-input" value={role} onChange={e => setRole(e.target.value)}>
          <option value="editor">Editor: edita CVs</option>
          <option value="admin">Administrador: edita CVs y gestiona usuarios</option>
        </select>

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
      </form>
    </div>
  );
}

export default function UsersPage({ user, onNavigate, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode, target }
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listUsers();
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (target) => {
    if (!window.confirm(`¿Eliminar el usuario "${target.username}"?`)) return;
    try {
      await deleteUser(target.id);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Error al eliminar');
    }
  };

  // 20 users per page; the page is clamped if users are deleted
  const currentPage = Math.min(page, Math.max(1, Math.ceil(users.length / PAGE_SIZE)));
  const pageUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <AppShell
      user={user}
      active="users"
      onNavigate={onNavigate}
      onLogout={onLogout}
      subtitle={`${users.length} usuario${users.length !== 1 ? 's' : ''}`}
      title="Gestión de usuarios"
      actions={
        <button className="cv-index-add-btn" onClick={() => setModal({ mode: 'create' })}>
          <i className="fa-solid fa-user-plus" /> <span className="shell-hide-sm">Nuevo usuario</span>
        </button>
      }
    >
        {loading ? (
          <div className="cv-index-loading">
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 10 }} />
            Cargando usuarios...
          </div>
        ) : (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Creado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pageUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="users-user">
                        <span className="user-avatar">{u.username.charAt(0)}</span>
                        {u.username}
                        {u.id === user.id && <span className="users-you">tú</span>}
                      </div>
                    </td>
                    <td><span className={`users-role users-role--${u.role}`}>{ROLE_LABELS[u.role]}</span></td>
                    <td className="users-date">{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
                    <td className="users-actions">
                      <button className="users-action" title="Editar" onClick={() => setModal({ mode: 'edit', target: u })}>
                        <i className="fa-solid fa-pen" />
                      </button>
                      {u.id !== user.id && (
                        <button className="users-action users-action--danger" title="Eliminar" onClick={() => handleDelete(u)}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (
          <Pagination page={currentPage} total={users.length} onChange={setPage} />
        )}

      {modal && (
        <UserModal
          mode={modal.mode}
          target={modal.target}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </AppShell>
  );
}
