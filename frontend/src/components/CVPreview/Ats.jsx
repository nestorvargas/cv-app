import React from 'react';
import './ats.css';

const LABELS = {
  es: {
    summary:      'PERFIL PROFESIONAL',
    experience:   'EXPERIENCIA LABORAL',
    education:    'EDUCACIÓN',
    skills:       'HABILIDADES',
    certificates: 'CERTIFICADOS',
    technical:    'Técnicas',
    databases:    'Bases de Datos',
    devops:       'DevOps',
    tools:        'Gestión',
    languages:    'Idiomas',
  },
  en: {
    summary:      'PROFESSIONAL SUMMARY',
    experience:   'WORK EXPERIENCE',
    education:    'EDUCATION',
    skills:       'SKILLS',
    certificates: 'CERTIFICATES',
    technical:    'Technical',
    databases:    'Databases',
    devops:       'DevOps',
    tools:        'Management',
    languages:    'Languages',
  },
};

export default function Ats({ cvData, lang, accentColor, pageMinHeight }) {
  const { personal_info, summary, experience, education, skills, certificates } = cvData;
  const L = LABELS[lang] || LABELS.es;
  const accent = accentColor || '#2c3e50';

  const skillCategories = [
    { key: 'technical', label: skills?._labels?.technical || L.technical },
    { key: 'databases', label: skills?._labels?.databases || L.databases },
    { key: 'devops',    label: skills?._labels?.devops || L.devops },
    { key: 'tools',     label: skills?._labels?.tools || L.tools },
    { key: 'languages', label: skills?._labels?.languages || L.languages },
  ];

  const contactParts = [
    personal_info.location,
    personal_info.phone,
    personal_info.email,
    personal_info.linkedin,
    personal_info.github,
  ].filter(Boolean);

  return (
    <div className="cv-ats-wrapper" style={{ '--cv-accent': accent, minHeight: pageMinHeight }}>

      <div className="cv-ats-header" data-block>
        <h1 className="cv-ats-name">{personal_info.name}</h1>
        {personal_info.title && <p className="cv-ats-title">{personal_info.title}</p>}
        {contactParts.length > 0 && (
          <p className="cv-ats-contact-line">
            {contactParts.map((part, i) => <span key={i}>{part}</span>)}
          </p>
        )}
      </div>

      {summary && (
        <section className="cv-ats-section" data-block>
          <h2 className="cv-ats-section-title">{L.summary}</h2>
          <p className="cv-ats-summary">{summary}</p>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-section-title" data-block>{L.experience}</h2>
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="cv-ats-exp-item" data-block>
              <div className="cv-ats-item-header">
                <span>{exp.position}{exp.company ? ` — ${exp.company}` : ''}</span>
                {exp.period && <span className="cv-ats-item-period">{exp.period}</span>}
              </div>
              {exp.description && <p className="cv-ats-exp-desc">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education?.length > 0 && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-section-title" data-block>{L.education}</h2>
          {education.map((edu, i) => (
            <div key={edu.id || i} className="cv-ats-edu-item" data-block>
              <div className="cv-ats-item-header">
                <span>{edu.degree}{edu.institution ? ` — ${edu.institution}` : ''}</span>
                {edu.period && <span className="cv-ats-item-period">{edu.period}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {skillCategories.some(({ key }) => skills?.[key]?.length > 0) && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-section-title" data-block>{L.skills}</h2>
          {skillCategories.map(({ key, label }) => (
            skills?.[key]?.length > 0 && (
              <div key={key} className="cv-ats-skills-row" data-block>
                <span className="cv-ats-skills-label">{label}: </span>
                {skills[key].join(', ')}
              </div>
            )
          ))}
        </section>
      )}

      {certificates?.length > 0 && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-section-title" data-block>{L.certificates}</h2>
          {certificates.map((cert, i) => (
            <div key={cert.id || i} className="cv-ats-cert-item" data-block>
              <span>{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}</span>
              {cert.year && <span className="cv-ats-item-period"> ({cert.year})</span>}
            </div>
          ))}
        </section>
      )}

    </div>
  );
}
