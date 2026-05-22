import React, { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm.jsx';
import SummaryForm from './SummaryForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import EducationForm from './EducationForm.jsx';
import SkillsForm from './SkillsForm.jsx';
import ImageUpload from './ImageUpload.jsx';

const TABS = [
  { id: 'personal', label: '👤 Personal' },
  { id: 'summary', label: '📝 Resumen' },
  { id: 'experience', label: '💼 Experiencia' },
  { id: 'education', label: '🎓 Educación' },
  { id: 'skills', label: '⚡ Habilidades' },
  { id: 'photo', label: '📷 Foto' },
];

export default function CVEditor({ cvData, onChange, lang, onRefresh }) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #dee2e6',
        background: '#f8f9fa',
        flexWrap: 'wrap',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 14px',
              background: activeTab === tab.id ? '#2c3e50' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#555',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #3498db' : 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
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
      </div>
    </div>
  );
}
