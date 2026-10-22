import React, { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm.jsx';
import SummaryForm from './SummaryForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import EducationForm from './EducationForm.jsx';
import SkillsForm from './SkillsForm.jsx';
import ImageUpload from './ImageUpload.jsx';
import TemplatesForm from './TemplatesForm.jsx';
import CertificatesForm from './CertificatesForm.jsx';
import SectionTips from './SectionTips.jsx';
import { AREAS, getArea, getSkillLabels } from './areas.js';
import './editor.css';

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

// Skills hold arrays per category (other keys, like custom labels, are ignored)
const countSkills = skills =>
  Object.values(skills || {}).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0);

// Completeness checks, in the order the tip suggests them
function getChecks(cv, isEn) {
  const p = cv.personal_info || {};
  const skillsCount = countSkills(cv.skills);
  const experience = cv.experience || [];
  return [
    { tab: 'personal', done: !!(p.name && p.title && p.email && p.phone),
      tip: isEn ? 'Complete name, title, email and phone' : 'Completa nombre, título, correo y teléfono' },
    { tab: 'summary', done: (cv.summary || '').length >= 400,
      tip: isEn ? 'Write a summary of at least 400 characters' : 'Escribe un perfil de al menos 400 caracteres' },
    { tab: 'experience', done: experience.some(e => e.position && e.description),
      tip: isEn ? 'Add your work experience' : 'Agrega tu experiencia laboral' },
    { tab: 'education', done: (cv.education || []).length > 0,
      tip: isEn ? 'Add your education' : 'Agrega tu educación' },
    { tab: 'skills', done: skillsCount >= 6,
      tip: isEn ? 'Add at least 6 skills' : 'Agrega al menos 6 habilidades' },
    { tab: 'photo', done: !!cv.profile_image,
      tip: isEn ? 'Upload a profile photo' : 'Sube una foto de perfil' },
  ];
}

function getBadge(tab, cv, checks) {
  const count = {
    experience: cv.experience?.length,
    education: cv.education?.length,
    certificates: cv.certificates?.length,
    skills: countSkills(cv.skills),
  }[tab];
  const check = checks.find(c => c.tab === tab);
  if (count !== undefined) return { text: count, done: check ? check.done : count > 0 };
  if (check?.done) return { text: <i className="fa-solid fa-check" style={{ fontSize: 9 }} />, done: true };
  return null;
}

export default function CVEditor({ isAdmin, cvData, onChange, lang, profileName, onRefresh, activeTemplate, onTemplateChange, templateColors, onColorChange, templateBgColors, onBgColorChange }) {
  const [activeTab, setActiveTab] = useState('personal');
  const isEn = lang === 'en';
  const checks = getChecks(cvData, isEn);
  const doneCount = checks.filter(c => c.done).length;
  const percent = Math.round((doneCount / checks.length) * 100);
  const nextStep = checks.find(c => !c.done);
  const area = getArea(cvData);
  const skillLabels = getSkillLabels(cvData, lang);

  // Choosing an area also renames the skill categories to that area's defaults
  const handleAreaChange = (key) => {
    onChange('personal_info', { ...cvData.personal_info, area: key });
    onChange('skills', { ...(cvData.skills || {}), _labels: { ...AREAS[key].labels[isEn ? 'en' : 'es'] } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Completeness */}
      <div className="ed-progress">
        <div className="ed-progress-row">
          <span>{isEn ? 'CV completeness' : 'Tu hoja de vida está al'} <strong>{percent}%</strong></span>
          {nextStep ? (
            <button type="button" className="ed-progress-tip" onClick={() => setActiveTab(nextStep.tab)}>
              <i className="fa-solid fa-lightbulb" /> {nextStep.tip}
            </button>
          ) : (
            <span className="ed-progress-tip" style={{ color: '#059669' }}>
              <i className="fa-solid fa-circle-check" /> {isEn ? 'Ready to download' : 'Lista para descargar'}
            </span>
          )}
        </div>
        <div className="ed-progress-track">
          <div className="ed-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff',
        flexWrap: 'wrap',
        flexShrink: 0,
        padding: '10px 12px',
        gap: 4,
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          const badge = getBadge(tab.id, cvData, checks);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 13px',
                background: active ? '#eff6ff' : 'transparent',
                color: active ? '#1d4ed8' : '#64748b',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: active ? 700 : 600,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: active ? 'inset 0 0 0 1px #bfdbfe' : 'none',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: 11 }} />
              {tab.label}
              {badge && <span className={`ed-tab-badge ${badge.done ? 'is-done' : ''}`}>{badge.text}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {activeTab === 'personal' && (
          <PersonalInfoForm
            data={cvData.personal_info}
            onChange={(val) => onChange('personal_info', val)}
            lang={lang}
            area={area}
            onAreaChange={handleAreaChange}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryForm
            cvData={cvData}
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
            labels={skillLabels}
            area={area}
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
        <SectionTips section={activeTab} lang={lang} area={area} />
      </div>
    </div>
  );
}
