import React, { useState, useEffect } from 'react';
import { listProfiles, createProfile, deleteProfile, setProfileOwner, cloneProfile } from '../../api/cvApi.js';
import { listUsers } from '../../api/authApi.js';
import AppShell from '../AppShell/index.jsx';
import { getCompleteness } from '../CVEditor/completeness.js';
import ImportCv from './ImportCv.jsx';
import Pagination, { PAGE_SIZE } from '../Pagination/index.jsx';
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

export default function CVIndex({ onEdit, user, onLogout, onNavigate }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]); // admin only: owner choices
  const [search, setSearch] = useState('');
  const [newMode, setNewMode] = useState('blank'); // blank | import
  const [page, setPage] = useState(1);
  const [cloneTarget, setCloneTarget] = useState(null); // { profile_name, label }
  const [cloning, setCloning] = useState(false);
  const [cloneError, setCloneError] = useState('');
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

  // Pagination over the filtered list (the page is clamped if the list shrinks)
  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const pageItems = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeFrom = visible.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const rangeTo = Math.min(currentPage * PAGE_SIZE, visible.length);
  const changePage = (n) => {
    setPage(n);
    document.querySelector('.cv-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const avgProgress = profiles.length
    ? Math.round(profiles.reduce((n, p) => n + getCompleteness(p.progress?.es), 0) / profiles.length)
    : 0;
  const STATS = [
    { icon: 'fa-layer-group', value: profiles.length, label: profiles.length === 1 ? 'Hoja de vida' : 'Hojas de vida' },
    { icon: 'fa-language', value: profiles.length * 2, label: 'Versiones ES / EN' },
    { icon: 'fa-chart-pie', value: `${avgProgress}%`, label: 'Avance promedio' },
    { icon: 'fa-user-group', value: people, label: people === 1 ? 'Persona' : 'Personas' },
  ];

  const openNew = (mode) => { setNewMode(mode); setShowModal(true); };

  const openClone = (profile) => {
    setCloneError('');
    setCloneTarget({ profile_name: profile.profile_name, label: `${profile.profile_label} (copia)` });
  };

  const handleClone = async () => {
    if (!cloneTarget?.label.trim()) return;
    setCloning(true);
    setCloneError('');
    try {
      const res = await cloneProfile(cloneTarget.profile_name, cloneTarget.label.trim());
      setCloneTarget(null);
      load();
      onEdit(res.data.profile_name, res.data.profile_label, 'es');
    } catch (e) {
      setCloneError(e.response?.data?.error || 'No se pudo clonar la hoja de vida');
    } finally {
      setCloning(false);
    }
  };

  return (
    <AppShell
      user={user}
      active="index"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onNew={openNew}
      subtitle={`Hola, ${user?.username}`}
      title={isAdmin ? 'Todas las hojas de vida' : 'Tus hojas de vida'}
      actions={
        <button className="cv-index-add-btn" onClick={() => openNew('blank')}>
          <i className="fa-solid fa-plus" /> <span className="shell-hide-sm">Nuevo CV</span>
        </button>
      }
    >
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
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  aria-label="Buscar hojas de vida"
                />
              </div>
              <span className="cv-toolbar-count">
                {visible.length > PAGE_SIZE
                  ? `${rangeFrom}–${rangeTo} de ${visible.length}`
                  : `${visible.length} de ${profiles.length}`}
              </span>
            </div>

            {visible.length === 0 ? (
              <div className="cv-empty">
                <i className="fa-solid fa-magnifying-glass" />
                Ninguna hoja de vida coincide con "{search}".
              </div>
            ) : (
              <ul className="cv-list">
                {pageItems.map((profile, i) => {
                  const meta = getProfileMeta(profile.profile_name);
                  const isDefault = ['desarrollador', 'devops-linux', 'lider-tecnico'].includes(profile.profile_name);
                  const pct = { es: getCompleteness(profile.progress?.es), en: getCompleteness(profile.progress?.en) };
                  return (
                    <li
                      key={profile.profile_name}
                      className="cv-row"
                      style={{ '--row-color': meta.color, animationDelay: `${Math.min(i, 10) * 35}ms` }}
                    >
                      <div
                        className="cv-row-progress"
                        style={{ '--pct': pct.es }}
                        title={`Completada: ES ${pct.es}% · EN ${pct.en}%`}
                      >
                        <div className="cv-row-icon">
                          <i className={`fa-solid ${meta.faIcon}`} />
                        </div>
                      </div>

                      <div className="cv-row-info">
                        <h3 className="cv-row-label">{profile.profile_label}</h3>
                        <p className="cv-row-meta">
                          <span className="cv-row-name">{profile.personal_info?.name || '—'}</span>
                          {profile.personal_info?.title && <> · {profile.personal_info.title}</>}
                        </p>
                        <div className="cv-row-pct">
                          {['es', 'en'].map(l => (
                            <span key={l} className={`cv-row-pct-item ${pct[l] === 100 ? 'is-done' : ''}`}>
                              <span className="cv-row-pct-lang">{l.toUpperCase()}</span>
                              <span className="cv-row-pct-bar"><span style={{ width: `${pct[l]}%` }} /></span>
                              <span className="cv-row-pct-num">{pct[l]}%</span>
                            </span>
                          ))}
                        </div>
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
                          className="cv-row-delete cv-row-clone"
                          onClick={() => openClone(profile)}
                          title="Clonar hoja de vida"
                          aria-label="Clonar hoja de vida"
                        >
                          <i className="fa-regular fa-copy" />
                        </button>
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
            <Pagination page={currentPage} total={visible.length} onChange={changePage} />
          </>
        )}

      {cloneTarget && (
        <div className="cv-modal-overlay" onClick={() => setCloneTarget(null)}>
          <div className="cv-modal" onClick={e => e.stopPropagation()}>
            <div className="cv-modal-icon">
              <i className="fa-regular fa-copy" />
            </div>
            <h3 className="cv-modal-title">Clonar hoja de vida</h3>
            <p className="cv-modal-desc">
              Se copian las versiones en español e inglés con todo su contenido. Ideal para adaptar la hoja de vida a otra oferta.
            </p>
            <input
              className="cv-modal-input"
              type="text"
              value={cloneTarget.label}
              onChange={e => setCloneTarget(t => ({ ...t, label: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleClone()}
              aria-label="Nombre de la copia"
              autoFocus
            />
            {cloneError && (
              <p className="cv-modal-error"><i className="fa-solid fa-circle-exclamation" /> {cloneError}</p>
            )}
            <div className="cv-modal-actions">
              <button className="cv-modal-cancel" onClick={() => setCloneTarget(null)}>Cancelar</button>
              <button className="cv-modal-confirm" onClick={handleClone} disabled={cloning || !cloneTarget.label.trim()}>
                {cloning
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Clonando...</>
                  : <><i className="fa-regular fa-copy" /> Clonar y abrir</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="cv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cv-modal" onClick={e => e.stopPropagation()}>
            <div className="cv-modal-icon">
              <i className={`fa-solid ${newMode === 'import' ? 'fa-file-import' : 'fa-file-circle-plus'}`} />
            </div>
            <h3 className="cv-modal-title">Nueva hoja de vida</h3>

            <div className="cv-new-tabs" role="tablist">
              <button role="tab" aria-selected={newMode === 'blank'} className={newMode === 'blank' ? 'active' : ''} onClick={() => setNewMode('blank')}>
                <i className="fa-solid fa-file" /> En blanco
              </button>
              <button role="tab" aria-selected={newMode === 'import'} className={newMode === 'import' ? 'active' : ''} onClick={() => setNewMode('import')}>
                <i className="fa-solid fa-file-pdf" /> Importar PDF
              </button>
            </div>

            {newMode === 'import' ? (
              <ImportCv
                onImported={(result) => {
                  setShowModal(false);
                  setNewMode('blank');
                  load();
                  onEdit(result.profile_name, result.profile_label, 'es');
                }}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
