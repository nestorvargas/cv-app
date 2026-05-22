import React, { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm.jsx';
import SummaryForm from './SummaryForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import EducationForm from './EducationForm.jsx';
import SkillsForm from './SkillsForm.jsx';
import ImageUpload from './ImageUpload.jsx';
import TemplatesForm from './TemplatesForm.jsx';
import CertificatesForm from './CertificatesForm.jsx';

const TABS = [
  { id: 'personal', label: '👤 Personal' },
  { id: 'photo', label: '📷 Foto' },
  { id: 'summary', label: '📝 Resumen' },
  { id: 'experience', label: '💼 Experiencia' },
  { id: 'education', label: '🎓 Educación' },
  { id: 'skills', label: '⚡ Habilidades' },
  { id: 'certificates', label: '🏅 Certificados' },
  { id: 'templates', label: '🎨 Plantillas' },
];

export default function CVEditor({ cvData, onChange, lang, onRefresh, activeTemplate, onTemplateChange }) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e9ecef',
        background: '#f8f9fa',
        flexWrap: 'wrap',
        padding: '6px 8px 0',
        gap: 2,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 14px',
              background: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#2c3e50' : '#6c757d',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #3498db' : '2px solid transparent',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 500,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 -2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = '#e9ecef'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {activeTab === 'personal' && (
          <PersonalInfoForm
            data={cvData.personal_info}
            onChange={(val) => onChange('personal_info', val)}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryForm
            value={cvData.summary}
            onChange={(val) => onChange('summary', val)}
            lang={lang}
          />
        )}
        {activeTab === 'experience' && (
          <ExperienceForm
            items={cvData.experience}
            onChange={(val) => onChange('experience', val)}
            lang={lang}
          />
        )}
        {activeTab === 'education' && (
          <EducationForm
            items={cvData.education}
            onChange={(val) => onChange('education', val)}
            lang={lang}
          />
        )}
        {activeTab === 'skills' && (
          <SkillsForm
            data={cvData.skills}
            onChange={(val) => onChange('skills', val)}
            lang={lang}
          />
        )}
        {activeTab === 'photo' && (
          <ImageUpload
            currentImage={cvData.profile_image}
            onChange={(url) => { onChange('profile_image', url); onRefresh(); }}
          />
        )}
        {activeTab === 'certificates' && (
          <CertificatesForm
            items={cvData.certificates || []}
            onChange={(val) => onChange('certificates', val)}
            lang={lang}
          />
        )}
        {activeTab === 'templates' && (
          <TemplatesForm
            activeTemplate={activeTemplate}
            onChange={onTemplateChange}
          />
        )}
      </div>
    </div>
  );
}
