import React from 'react';
import { downloadPdf } from '../api/cvApi.js';

export default function Navbar({ lang, onLangToggle, onSave, saving, saveMsg, cvData }) {
  return (
    <nav style={{
      height: 60,
      background: '#2c3e50',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 100,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>📄</span>
        <span style={{ fontWeight: 700, fontSize: 16 }}>CV Editor</span>
        <span style={{ color: '#7f8c8d', fontSize: 13 }}>— Nestor Fabian Vargas</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {saveMsg && (
          <span style={{
            fontSize: 13,
            color: saveMsg.includes('Error') ? '#e74c3c' : '#2ecc71',
            fontWeight: 600,
          }}>
            {saveMsg}
          </span>
        )}

        {/* Language toggle */}
        <div style={{
          display: 'flex',
          background: '#1a252f',
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #34495e',
        }}>
          {['es', 'en'].map(l => (
            <button
              key={l}
              onClick={() => onLangToggle(l)}
              style={{
                background: lang === l ? '#3498db' : 'transparent',
                color: 'white',
                padding: '6px 16px',
                borderRadius: 0,
                fontWeight: 600,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {l === 'es' ? '🇨🇴 ES' : '🇺🇸 EN'}
            </button>
          ))}
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          style={{
            background: saving ? '#7f8c8d' : '#27ae60',
            color: 'white',
            padding: '7px 18px',
            borderRadius: 7,
            fontWeight: 600,
            fontSize: 13,
            border: 'none',
            cursor: saving ? 'default' : 'pointer',
          }}
        >
          {saving ? 'Guardando...' : '💾 Guardar'}
        </button>

        <button
          onClick={() => downloadPdf(lang)}
          style={{
            background: '#e74c3c',
            color: 'white',
            padding: '7px 18px',
            borderRadius: 7,
            fontWeight: 600,
            fontSize: 13,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          📥 Descargar PDF
        </button>
      </div>
    </nav>
  );
}
