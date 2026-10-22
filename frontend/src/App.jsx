import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import CVEditor from './components/CVEditor/index.jsx';
import CVPagedViewer from './components/CVPreview/Paged.jsx';
import CVIndex from './components/CVIndex/index.jsx';
import UsersPage from './components/Auth/UsersPage.jsx';
import FitToWidth from './components/CVPreview/FitToWidth.jsx';
import './editor-layout.css';
import { getCv, updateCv } from './api/cvApi.js';

export default function App({ user, onLogout }) {
  const [page, setPage] = useState('index');
  const [activeProfile, setActiveProfile] = useState(null); // { profileName, profileLabel }
  const [lang, setLang] = useState('es');
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [mobileView, setMobileView] = useState('edit'); // narrow screens show one pane at a time
  const [dirty, setDirty] = useState(false); // unsaved edits in the current CV
  const DEFAULT_COLORS = {
    classic:   '#1abc9c',
    modern:    '#e67e22',
    executive: '#8e44ad',
    creative:  '#e94560',
    minimal:   '#2980b9',
    elegant:   '#8a6d3b',
    timeline:  '#0ea5e9',
    compact:   '#2563eb',
    corporate: '#f59e0b',
  };
  const DEFAULT_BG_COLORS = {
    classic:   '#2c3e50',
    modern:    '#1a252f',
    executive: '#2c3e50',
    creative:  '#1a1a2e',
    minimal:   '#3d3d3d',
    elegant:   '#1f2a37',
    timeline:  '#0f172a',
    compact:   '#111827',
    corporate: '#1e3a5f',
  };

  const loadPrefs = (profileName) => {
    try {
      const raw = localStorage.getItem(`cv_prefs_${profileName}`);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  };

  const [template, setTemplate] = useState('classic');
  const [templateColors, setTemplateColors] = useState(DEFAULT_COLORS);
  const [templateBgColors, setTemplateBgColors] = useState(DEFAULT_BG_COLORS);

  const loadCv = useCallback(async (profileName, language) => {
    setLoading(true);
    try {
      const res = await getCv(profileName, language);
      setCvData(res.data);
      setDirty(false);
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

  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem(`cv_prefs_${activeProfile.profileName}`, JSON.stringify({
        template,
        templateColors,
        templateBgColors,
      }));
    }
  }, [template, templateColors, templateBgColors, activeProfile]);

  const handleEdit = (profileName, profileLabel, initialLang = 'es') => {
    const saved = loadPrefs(profileName);
    if (saved) {
      if (saved.template) setTemplate(saved.template);
      if (saved.templateColors) setTemplateColors({ ...DEFAULT_COLORS, ...saved.templateColors });
      if (saved.templateBgColors) setTemplateBgColors({ ...DEFAULT_BG_COLORS, ...saved.templateBgColors });
    } else {
      setTemplate('classic');
      setTemplateColors(DEFAULT_COLORS);
      setTemplateBgColors(DEFAULT_BG_COLORS);
    }
    setActiveProfile({ profileName, profileLabel });
    setLang(initialLang);
    setPage('editor');
  };

  const confirmDiscard = () =>
    !dirty || window.confirm('Tienes cambios sin guardar. ¿Quieres descartarlos?');

  const handleBack = () => {
    if (!confirmDiscard()) return;
    setCvData(null);
    setDirty(false);
    setPage('index');
  };

  const handleLangToggle = (newLang) => {
    if (newLang === lang || !confirmDiscard()) return;
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
      setDirty(false);
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
    setDirty(true);
  };

  // Ctrl/Cmd+S saves; the ref keeps the listener pointing at the latest handleSave
  const saveRef = useRef(handleSave);
  saveRef.current = handleSave;
  useEffect(() => {
    if (page !== 'editor') return;
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page]);

  // Warn before closing or reloading the tab with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  if (page === 'users') {
    return <UsersPage user={user} onLogout={onLogout} onBack={() => setPage('index')} />;
  }

  if (page === 'index') {
    return <CVIndex onEdit={handleEdit} user={user} onLogout={onLogout} onManageUsers={() => setPage('users')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        lang={lang}
        onLangToggle={handleLangToggle}
        onSave={handleSave}
        saving={saving}
        saveMsg={saveMsg}
        dirty={dirty}
        cvData={cvData}
        template={template}
        profileName={activeProfile?.profileName}
        profileLabel={activeProfile?.profileLabel}
        onBack={handleBack}
        user={user}
        onLogout={onLogout}
        accentColor={templateColors[template]}
        bgColor={templateBgColors[template]}
      />
      <div className="editor-view-toggle">
        {[['edit', 'fa-pen-to-square', 'Editar'], ['preview', 'fa-eye', 'Vista previa']].map(([id, icon, label]) => (
          <button
            key={id}
            className={mobileView === id ? 'active' : ''}
            onClick={() => setMobileView(id)}
          >
            <i className={`fa-solid ${icon}`} /> {label}
          </button>
        ))}
      </div>
      <div className={`editor-layout editor-layout--${mobileView}`}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <p style={{ color: '#666', fontSize: 18 }}>Cargando CV...</p>
          </div>
        ) : cvData ? (
          <>
            <div className="editor-pane">
              <CVEditor
                isAdmin={user?.role === 'admin'}
                cvData={cvData}
                onChange={handleChange}
                lang={lang}
                profileName={activeProfile.profileName}
                onRefresh={() => loadCv(activeProfile.profileName, lang)}
                activeTemplate={template}
                onTemplateChange={setTemplate}
                templateColors={templateColors}
                onColorChange={(tmpl, color) => setTemplateColors(prev => ({ ...prev, [tmpl]: color }))}
                templateBgColors={templateBgColors}
                onBgColorChange={(tmpl, color) => setTemplateBgColors(prev => ({ ...prev, [tmpl]: color }))}
              />
            </div>
            <div className="preview-pane">
              <FitToWidth width={794} gap={28}>
                <CVPagedViewer cvData={cvData} lang={lang} template={template} accentColor={templateColors[template]} bgColor={templateBgColors[template]} />
              </FitToWidth>
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
