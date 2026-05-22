import React, { useState, useEffect } from 'react';
import { listProfiles, createProfile, deleteProfile } from '../../api/cvApi.js';
import './index.css';

const PROFILE_META = {
  'devops-linux':  { icon: '🖥️',  color: '#0984e3', bg: '#e8f4fd' },
  'desarrollador': { icon: '💻',  color: '#00b894', bg: '#e6f9f5' },
  'lider-tecnico': { icon: '👑',  color: '#6c5ce7', bg: '#f0eeff' },
};

const DEFAULT_META = { icon: '📄', color: '#636e72', bg: '#f4f4f4' };

function getProfileMeta(profileName) {
  return PROFILE_META[profileName] || DEFAULT_META;
}

export default function CVIndex({ onEdit }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="cv-index">
      {/* Header */}
      <header className="cv-index-header">
        <div className="cv-index-header-inner">
          <div className="cv-index-logo">
            <span className="cv-index-logo-icon">📋</span>
            <div>
              <h1 className="cv-index-title">CV Manager</h1>
              <p className="cv-index-subtitle">Nestor Fabian Vargas Ferrucho</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="cv-index-main">
        <div className="cv-index-section-header">
          <h2 className="cv-index-section-title">Mis CVs</h2>
          <button className="cv-index-add-btn" onClick={() => setShowModal(true)}>
            + Nuevo CV
          </button>
        </div>

        {loading ? (
          <div className="cv-index-loading">Cargando perfiles...</div>
        ) : (
          <div className="cv-index-grid">
            {profiles.map((profile) => {
              const meta = getProfileMeta(profile.profile_name);
              const isDefault = ['desarrollador', 'devops-linux', 'lider-tecnico'].includes(profile.profile_name);
              return (
                <div key={profile.profile_name} className="cv-card" style={{ '--card-color': meta.color, '--card-bg': meta.bg }}>
                  <div className="cv-card-top" style={{ background: meta.color }}>
                    <span className="cv-card-icon">{meta.icon}</span>
                    {!isDefault && (
                      <button
                        className="cv-card-delete"
                        onClick={() => handleDelete(profile.profile_name)}
                        title="Eliminar perfil"
                      >✕</button>
                    )}
                  </div>

                  <div className="cv-card-body">
                    <h3 className="cv-card-label">{profile.profile_label}</h3>
                    <p className="cv-card-name">{profile.personal_info?.name || '—'}</p>
                    <p className="cv-card-role">{profile.personal_info?.title || '—'}</p>
                  </div>

                  <div className="cv-card-actions">
                    <button
                      className="cv-card-edit-btn"
                      style={{ background: meta.color }}
                      onClick={() => onEdit(profile.profile_name, profile.profile_label, 'es')}
                    >
                      Editar ES
                    </button>
                    <button
                      className="cv-card-edit-btn cv-card-edit-btn--outline"
                      style={{ color: meta.color, borderColor: meta.color }}
                      onClick={() => onEdit(profile.profile_name, profile.profile_label, 'en')}
                    >
                      Editar EN
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: nuevo CV */}
      {showModal && (
        <div className="cv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cv-modal" onClick={e => e.stopPropagation()}>
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
            {error && <p className="cv-modal-error">{error}</p>}
            <div className="cv-modal-actions">
              <button className="cv-modal-cancel" onClick={() => { setShowModal(false); setNewLabel(''); setError(''); }}>
                Cancelar
              </button>
              <button className="cv-modal-confirm" onClick={handleCreate} disabled={creating || !newLabel.trim()}>
                {creating ? 'Creando...' : 'Crear CV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
