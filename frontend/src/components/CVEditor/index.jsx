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
  { id: 'personal',     icon: 'fa-user',            label: 'Personal' },
  { id: 'photo',        icon: 'fa-camera',           label: 'Foto' },
  { id: 'summary',      icon: 'fa-align-left',       label: 'Resumen' },
  { id: 'experience',   icon: 'fa-briefcase',        label: 'Experiencia' },
  { id: 'education',    icon: 'fa-graduation-cap',   label: 'Educación' },
  { id: 'skills',       icon: 'fa-code',             label: 'Habilidades' },
  { id: 'certificates', icon: 'fa-award',            label: 'Certificados' },
  { id: 'templates',    icon: 'fa-palette',          label: 'Plantillas' },
];

export default function CVEditor({ cvData, onChange, lang, profileName, onRefresh, activeTemplate, onTemplateChange, templateColors, onColorChange, templateBgColors, onBgColorChange }) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e9ecef',
        background: '#f8f9fa',
        overflowX: 'auto',
        flexShrink: 0,
        padding: '6px 8px 0',
        gap: 2,
        scrollbarWidth: 'none',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 12px',
                background: active ? '#ffffff' : 'transparent',
                color: active ? '#2c3e50' : '#6c757d',
                border: 'none',
                borderBottom: active ? '2px solid #3498db' : '2px solid transparent',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: active ? '0 -2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#e9ecef'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: 11 }} />
              {tab.label}
            </button>
          );
        })}
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
            profileName={profileName}
            onChange={(url) => onChange('profile_image', url)}
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
            templateColors={templateColors}
            onColorChange={onColorChange}
            templateBgColors={templateBgColors}
            onBgColorChange={onBgColorChange}
          />
        )}
      </div>
    </div>
  );
}
