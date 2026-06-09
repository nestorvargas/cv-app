import React, { useState, useEffect } from 'react';
import CVPagedViewer from './components/CVPreview/Paged.jsx';
import { getCv } from './api/cvApi.js';

export default function PrintPage() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  // URL pattern: /print/:profileName/:lang
  const profileName = parts[1];
  const lang = parts[2];
  const params = new URLSearchParams(window.location.search);
  const template = params.get('template') || 'classic';
  const accentColor = params.get('accentColor') || undefined;
  const bgColor = params.get('bgColor') || undefined;

  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    if (profileName && lang) {
      getCv(profileName, lang)
        .then(res => setCvData(res.data))
        .catch(console.error);
    }
  }, [profileName, lang]);

  useEffect(() => {
    if (cvData) {
      // Signal readiness after fonts load and layout stabilizes
      document.fonts.ready.then(() => {
        setTimeout(() => {
          window.__CV_READY__ = true;
        }, 600);
      });
    }
  }, [cvData]);

  if (!cvData) {
    return <div id="cv-loading" style={{ padding: 20, fontFamily: 'sans-serif' }}>Cargando...</div>;
  }

  return (
    <div
      id="cv-print-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        background: '#ffffff',
        margin: 0,
        padding: 0,
      }}
    >
      <CVPagedViewer
        cvData={cvData}
        lang={lang}
        template={template}
        accentColor={accentColor}
        bgColor={bgColor}
      />
    </div>
  );
}
