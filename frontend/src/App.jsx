import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import CVEditor from './components/CVEditor/index.jsx';
import CVPreview from './components/CVPreview/index.jsx';
import { getCv, updateCv } from './api/cvApi.js';

export default function App() {
  const [lang, setLang] = useState('es');
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const loadCv = useCallback(async (language) => {
    setLoading(true);
    try {
      const res = await getCv(language);
      setCvData(res.data);
    } catch (err) {
      console.error('Failed to load CV:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCv(lang);
  }, [lang, loadCv]);

  const handleLangToggle = (newLang) => {
    setLang(newLang);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateCv(lang, {
        personal_info: cvData.personal_info,
        summary: cvData.summary,
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills,
        profile_image: cvData.profile_image,
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        lang={lang}
        onLangToggle={handleLangToggle}
        onSave={handleSave}
        saving={saving}
        saveMsg={saveMsg}
        cvData={cvData}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 60px)' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <p style={{ color: '#666', fontSize: 18 }}>Cargando CV...</p>
          </div>
        ) : cvData ? (
          <>
            <div style={{ width: '45%', overflowY: 'auto', borderRight: '1px solid #dee2e6', background: '#fff' }}>
              <CVEditor cvData={cvData} onChange={handleChange} lang={lang} onRefresh={() => loadCv(lang)} />
            </div>
            <div style={{ width: '55%', overflowY: 'auto', background: '#f0f2f5', padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <CVPreview cvData={cvData} lang={lang} />
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
