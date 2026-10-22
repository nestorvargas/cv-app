import React, { useState } from 'react';
import { downloadPdf } from '../api/cvApi.js';
import UserMenu from './Auth/UserMenu.jsx';
import './navbar.css';

export default function Navbar({ lang, onLangToggle, onSave, saving, saveMsg, dirty, cvData, template, profileName, profileLabel, onBack, user, onLogout, accentColor, bgColor }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPdf(profileName, lang, template, accentColor, bgColor);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('Error al generar el PDF. Intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <nav className="app-navbar">
      {/* Left: back + brand */}
      <div className="nav-left">
        {onBack && (
          <button className="nav-btn nav-btn--ghost" onClick={onBack} title="Volver a la lista">
            <i className="fa-solid fa-arrow-left" /> <span className="nav-label">Volver</span>
          </button>
        )}
        <div className="nav-brand">
          <div className="nav-brand-icon">
            <i className="fa-solid fa-id-card" />
          </div>
          <div className="nav-brand-text">
            <div className="nav-brand-title">{profileLabel || 'CV Editor'}</div>
            {cvData?.personal_info?.name && (
              <div className="nav-brand-sub">{cvData.personal_info.name}</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="nav-actions">
        {saveMsg && (
          <span className={`nav-save-msg ${saveMsg.includes('Error') ? 'is-error' : ''}`}>
            <i className={`fa-solid ${saveMsg.includes('Error') ? 'fa-circle-xmark' : 'fa-circle-check'}`} />
            <span className="nav-label">{saveMsg}</span>
          </span>
        )}

        <div className="nav-lang" role="group" aria-label="Idioma del CV">
          {['es', 'en'].map(l => (
            <button key={l} className={lang === l ? 'active' : ''} onClick={() => onLangToggle(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          className={`nav-btn nav-btn--ghost ${dirty ? 'is-dirty' : ''}`}
          onClick={onSave}
          disabled={saving}
          title={dirty ? 'Cambios sin guardar (Ctrl/⌘ + S)' : 'Guardar (Ctrl/⌘ + S)'}
        >
          <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'} nav-icon-save`} />
          <span className="nav-label">{saving ? 'Guardando...' : dirty ? 'Guardar cambios' : 'Guardado'}</span>
          {dirty && !saving && <span className="nav-dirty-dot" />}
        </button>

        <button className="nav-btn nav-btn--primary" onClick={handleDownload} disabled={downloading} title="Descargar PDF">
          <i className={`fa-solid ${downloading ? 'fa-spinner fa-spin' : 'fa-file-arrow-down'}`} />
          <span className="nav-label">{downloading ? 'Generando...' : 'Descargar PDF'}</span>
        </button>

        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </nav>
  );
}
