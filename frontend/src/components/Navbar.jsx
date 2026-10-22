import React, { useState } from 'react';
import { downloadPdf } from '../api/cvApi.js';
import UserMenu from './Auth/UserMenu.jsx';
import './navbar.css';

export default function Navbar({ lang, onLangToggle, onSave, saving, saveMsg, cvData, template, profileName, profileLabel, onBack, user, onLogout, accentColor, bgColor }) {
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
    <nav className="app-navbar" style={{
      height: 64,
      background: '#0f1f3d',
      borderBottom: '1px solid rgba(120, 170, 255, 0.15)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      zIndex: 100,
      flexShrink: 0,
      gap: 16,
    }}>
      {/* Left: back + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#bdc3c7',
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: 12 }} /> <span className="nav-label">Volver</span>
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div className="nav-brand-icon" style={{
            width: 36,
            height: 36,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: 'white',
          }}>
            <i className="fa-solid fa-id-card" />
          </div>
          <div className="nav-brand-text">
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
              {profileLabel || 'CV Editor'}
            </div>
            {cvData?.personal_info?.name && (
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{cvData.personal_info.name}</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

        {saveMsg && (
          <span style={{
            fontSize: 12,
            color: saveMsg.includes('Error') ? '#e74c3c' : '#2ecc71',
            fontWeight: 700,
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <i className={`fa-solid ${saveMsg.includes('Error') ? 'fa-circle-xmark' : 'fa-circle-check'}`} />
            {saveMsg}
          </span>
        )}

        {/* Language toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 10,
          padding: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          gap: 2,
        }}>
          {['es', 'en'].map(l => (
            <button
              key={l}
              onClick={() => onLangToggle(l)}
              style={{
                background: lang === l ? '#2f74e8' : 'transparent',
                color: lang === l ? 'white' : '#95a5a6',
                padding: '6px 14px',
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 12,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
                boxShadow: lang === l ? '0 2px 6px rgba(47,116,232,0.4)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            background: saving ? '#5d6d7e' : '#27ae60',
            color: 'white',
            padding: '9px 20px',
            borderRadius: 9,
            fontWeight: 700,
            fontSize: 13,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 2px 8px rgba(39,174,96,0.4)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
          <span className="nav-label">{saving ? 'Guardando...' : 'Guardar'}</span>
        </button>

        {/* Download PDF */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            background: downloading ? '#5d6d7e' : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            padding: '9px 20px',
            borderRadius: 9,
            fontWeight: 700,
            fontSize: 13,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(231,76,60,0.4)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(231,76,60,0.55)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(231,76,60,0.4)'}
        >
          <i className={`fa-solid ${downloading ? 'fa-spinner fa-spin' : 'fa-file-arrow-down'}`} />
          <span className="nav-label">{downloading ? 'Generando...' : 'Descargar PDF'}</span>
        </button>

        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </nav>
  );
}
