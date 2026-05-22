import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import CVEditor from './components/CVEditor/index.jsx';
import CVPreview from './components/CVPreview/index.jsx';
import CVIndex from './components/CVIndex/index.jsx';
import { getCv, updateCv } from './api/cvApi.js';

export default function App() {
  const [page, setPage] = useState('index');
  const [activeProfile, setActiveProfile] = useState(null); // { profileName, profileLabel }
  const [lang, setLang] = useState('es');
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [template, setTemplate] = useState('classic');

  const loadCv = useCallback(async (profileName, language) => {
    setLoading(true);
    try {
      const res = await getCv(profileName, language);
      setCvData(res.data);
    } catch (err) {
      console.error('Failed to load CV:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page === 'editor' && activeProfile) {
      loadCv(activeProfile.profileName, lang);
    }
  }, [page, activeProfile, lang, loadCv]);

  const handleEdit = (profileName, profileLabel, initialLang = 'es') => {
    setActiveProfile({ profileName, profileLabel });
    setLang(initialLang);
    setPage('editor');
  };

  const handleBack = () => {
    setCvData(null);
    setPage('index');
  };

  const handleLangToggle = (newLang) => {
    setLang(newLang);
  };

  const handleSave = async () => {
    if (!cvData || !activeProfile) return;
    setSaving(true);
    try {
      const res = await updateCv(activeProfile.profileName, lang, {
        personal_info: cvData.personal_info,
        summary: cvData.summary,
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills,
        certificates: cvData.certificates,
        profile_image: cvData.profile_image,
        profile_label: activeProfile.profileLabel,
      });
      setCvData(res.data);
      setSaveMsg('Guardado');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {
      setSaveMsg('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  if (page === 'index') {
    return <CVIndex onEdit={handleEdit} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        lang={lang}
        onLangToggle={handleLangToggle}
        onSave={handleSave}
        saving={saving}
        saveMsg={saveMsg}
        cvData={cvData}
        template={template}
        profileName={activeProfile?.profileName}
        profileLabel={activeProfile?.profileLabel}
        onBack={handleBack}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <p style={{ color: '#666', fontSize: 18 }}>Cargando CV...</p>
          </div>
        ) : cvData ? (
          <>
            <div style={{ width: '45%', overflowY: 'auto', borderRight: '1px solid #dee2e6', background: '#fff' }}>
              <CVEditor
                cvData={cvData}
                onChange={handleChange}
                lang={lang}
                onRefresh={() => loadCv(activeProfile.profileName, lang)}
                activeTemplate={template}
                onTemplateChange={setTemplate}
              />
            </div>
            <div style={{ width: '55%', overflowY: 'auto', background: '#525659', padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <CVPreview cvData={cvData} lang={lang} template={template} />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Error al cargar el CV</p>
          </div>
        )}
      </div>
    </div>
  );
}
