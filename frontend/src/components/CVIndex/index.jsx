import React, { useState, useEffect } from 'react';
import { listProfiles, createProfile, deleteProfile, setProfileOwner } from '../../api/cvApi.js';
import { listUsers } from '../../api/authApi.js';
import UserMenu from '../Auth/UserMenu.jsx';
import './index.css';

const PROFILE_META = {
  'devops-linux':  { faIcon: 'fa-server',      color: '#0ea5e9' },
  'desarrollador': { faIcon: 'fa-laptop-code', color: '#10b981' },
  'lider-tecnico': { faIcon: 'fa-chess-king',  color: '#f97316' },
};
// Custom profiles get a stable color derived from their slug
const CUSTOM_COLORS = ['#3b82f6', '#0ea5e9', '#14b8a6', '#f43f5e', '#f59e0b', '#2563eb', '#06b6d4'];

function getProfileMeta(profileName) {
  if (PROFILE_META[profileName]) return PROFILE_META[profileName];
  const hash = [...profileName].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0);
  return { faIcon: 'fa-file-lines', color: CUSTOM_COLORS[hash % CUSTOM_COLORS.length] };
}

export default function CVIndex({ onEdit, user, onLogout, onManageUsers }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]); // admin only: owner choices
  const [search, setSearch] = useState('');
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    setLoading(true);
    try {
      const res = await listProfiles();
      setProfiles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!isAdmin) return;
    listUsers().then(res => setUsers(res.data)).catch(console.error);
  }, [isAdmin]);

  const handleOwnerChange = async (profileName, value) => {
    try {
      await setProfileOwner(profileName, value === '' ? null : Number(value));
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Error al asignar el propietario');
    }
  };

  const handleCreate = async () => {
    if (!newLabel.trim()) return;
    setCreating(true);
    setError('');
    try {
      await createProfile({ profile_name: newLabel.trim(), profile_label: newLabel.trim() });
      setNewLabel('');
      setShowModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Error al crear el perfil');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (profileName) => {
    if (!window.confirm('¿Eliminar este perfil de CV? Esta acción no se puede deshacer.')) return;
    try {
      await deleteProfile(profileName);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Error al eliminar');
    }
  };

  const query = search.trim().toLowerCase();
  const visible = query
    ? profiles.filter(p => [p.profile_label, p.personal_info?.name, p.personal_info?.title, p.owner_username]
        .some(v => v?.toLowerCase().includes(query)))
    : profiles;
  const people = new Set(profiles.map(p => p.personal_info?.name).filter(Boolean)).size;

  const STATS = [
    { icon: 'fa-layer-group', value: profiles.length, label: profiles.length === 1 ? 'Hoja de vida' : 'Hojas de vida' },
    { icon: 'fa-language', value: profiles.length * 2, label: 'Versiones ES / EN' },
    { icon: 'fa-user-group', value: people, label: people === 1 ? 'Persona' : 'Personas' },
  ];

  return (
    <div className="cv-index app-bg">
      <header className="cv-index-header">
        <div className="cv-index-header-inner">
          <div className="cv-index-logo">
            <div className="cv-index-logo-icon">
              <i className="fa-solid fa-id-card" />
            </div>
            <div>
              <h1 className="cv-index-title">CV Manager</h1>
              <p className="cv-index-subtitle">App para crear hojas de vida</p>
            </div>
          </div>
          <div className="cv-index-header-right">
            <UserMenu user={user} onLogout={onLogout} onManageUsers={onManageUsers} />
          </div>
        </div>
      </header>

      <main className="cv-index-main">
        <div className="cv-hero">
          <div>
            <p className="cv-hero-eyebrow">Hola, {user?.username}</p>
            <h2 className="cv-index-section-title">
              {isAdmin ? <>Todas las <span className="gradient-text">hojas de vida</span></> : <>Tus <span className="gradient-text">hojas de vida</span></>}
            </h2>
          </div>
          <button className="cv-index-add-btn" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-plus" /> Nuevo CV
          </button>
        </div>

        {!loading && profiles.length > 0 && (
          <div className="cv-stats">
            {STATS.map(stat => (
              <div key={stat.icon} className="cv-stat">
                <div className="cv-stat-icon"><i className={`fa-solid ${stat.icon}`} /></div>
                <div>
                  <div className="cv-stat-value">{stat.value}</div>
                  <div className="cv-stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="cv-index-loading">
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 10 }} />
            Cargando perfiles...
          </div>
        ) : profiles.length === 0 ? (
          <div className="cv-empty">
            <i className="fa-solid fa-file-circle-plus" />
            Aún no tienes hojas de vida. Crea la primera con <strong>Nuevo CV</strong>.
          </div>
        ) : (
          <>
            <div className="cv-toolbar">
              <div className="cv-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  type="search"
                  placeholder="Buscar por perfil, nombre o cargo..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Buscar hojas de vida"
                />
              </div>
              <span className="cv-toolbar-count">
                {visible.length} de {profiles.length}
              </span>
            </div>

            {visible.length === 0 ? (
              <div className="cv-empty">
                <i className="fa-solid fa-magnifying-glass" />
                Ninguna hoja de vida coincide con "{search}".
              </div>
            ) : (
              <ul className="cv-list">
                {visible.map((profile, i) => {
                  const meta = getProfileMeta(profile.profile_name);
                  const isDefault = ['desarrollador', 'devops-linux', 'lider-tecnico'].includes(profile.profile_name);
                  return (
                    <li
                      key={profile.profile_name}
                      className="cv-row"
                      style={{ '--row-color': meta.color, animationDelay: `${Math.min(i, 10) * 35}ms` }}
                    >
                      <div className="cv-row-icon">
                        <i className={`fa-solid ${meta.faIcon}`} />
                      </div>

                      <div className="cv-row-info">
                        <h3 className="cv-row-label">{profile.profile_label}</h3>
                        <p className="cv-row-meta">
                          <span className="cv-row-name">{profile.personal_info?.name || '—'}</span>
                          {profile.personal_info?.title && <> · {profile.personal_info.title}</>}
                        </p>
                      </div>

                      {isAdmin && (
                        <label className="cv-row-owner" title="Usuario que puede ver y editar este CV">
                          <i className="fa-solid fa-user-lock" />
                          <select
                            value={profile.owner_id ?? ''}
                            onChange={e => handleOwnerChange(profile.profile_name, e.target.value)}
                          >
                            <option value="">Sin asignar</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                          </select>
                        </label>
                      )}

                      <div className="cv-row-actions">
                        <div className="cv-lang-switch" role="group" aria-label="Editar versión">
                          {['es', 'en'].map(lang => (
                            <button
                              key={lang}
                              onClick={() => onEdit(profile.profile_name, profile.profile_label, lang)}
                              title={`Editar versión ${lang === 'es' ? 'en español' : 'en inglés'}`}
                            >
                              <i className="fa-solid fa-pen" /> {lang.toUpperCase()}
                            </button>
                          ))}
                        </div>
                        <button
                          className="cv-row-delete"
                          onClick={() => handleDelete(profile.profile_name)}
                          disabled={isDefault}
                          title={isDefault ? 'Los perfiles por defecto no se pueden eliminar' : 'Eliminar perfil'}
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </main>

      {showModal && (
        <div className="cv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cv-modal" onClick={e => e.stopPropagation()}>
            <div className="cv-modal-icon">
              <i className="fa-solid fa-file-circle-plus" />
            </div>
            <h3 className="cv-modal-title">Nuevo perfil de CV</h3>
            <p className="cv-modal-desc">Dale un nombre al nuevo CV (ej: "Data Science", "Mobile Developer")</p>
            <input
              className="cv-modal-input"
              type="text"
              placeholder="Nombre del perfil..."
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            {error && (
              <p className="cv-modal-error">
                <i className="fa-solid fa-circle-exclamation" /> {error}
              </p>
            )}
            <div className="cv-modal-actions">
              <button className="cv-modal-cancel" onClick={() => { setShowModal(false); setNewLabel(''); setError(''); }}>
                Cancelar
              </button>
              <button className="cv-modal-confirm" onClick={handleCreate} disabled={creating || !newLabel.trim()}>
                {creating
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Creando...</>
                  : <><i className="fa-solid fa-check" /> Crear CV</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
