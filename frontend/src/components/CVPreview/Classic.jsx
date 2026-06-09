import React from 'react';
import './classic.css';

const LABELS = {
  es: {
    contact: 'CONTACTO',
    skills: 'HABILIDADES',
    technical: 'Técnicas',
    databases: 'Bases de Datos',
    devops: 'DevOps',
    tools: 'Gestión',
    languages: 'Idiomas',
    profile: 'Perfil Profesional',
    experience: 'Experiencia Laboral',
    education: 'Educación',
    certificates: 'Certificados',
  },
  en: {
    contact: 'CONTACT',
    skills: 'SKILLS',
    technical: 'Technical',
    databases: 'Databases',
    devops: 'DevOps',
    tools: 'Management',
    languages: 'Languages',
    profile: 'Professional Profile',
    experience: 'Work Experience',
    education: 'Education',
    certificates: 'Certificates',
  },
};

export default function Classic({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info, summary, experience, education, skills, certificates, profile_image } = cvData;
  const L = LABELS[lang] || LABELS.es;

  const imgSrc = profile_image || null;

  const skillCategories = [
    { key: 'technical', label: L.technical },
    { key: 'databases', label: L.databases },
    { key: 'devops', label: L.devops },
    { key: 'tools', label: L.tools },
    { key: 'languages', label: L.languages },
  ];

  return (
    <div className="cv-classic-wrapper" style={{ '--cv-accent': accentColor || '#1abc9c', '--cv-bg': bgColor || '#2c3e50', minHeight: pageMinHeight }}>
      <div className="cv-classic">
        {/* LEFT SIDEBAR */}
        <aside className="cv-classic-sidebar">
          <div className="cv-classic-photo-area">
            {imgSrc ? (
              <img src={imgSrc} alt="Profile" className="cv-classic-photo" />
            ) : (
              <div className="cv-classic-photo-placeholder"><i className="fa-solid fa-user" /></div>
            )}
          </div>

          <div className="cv-classic-sidebar-section">
            <h4 className="cv-classic-sidebar-title">{L.contact}</h4>
            {personal_info.phone && (
              <div className="cv-classic-contact-item">
                <span className="cv-classic-contact-icon"><i className="fa-solid fa-phone" /></span>
                <span>{personal_info.phone}</span>
              </div>
            )}
            {personal_info.email && (
              <div className="cv-classic-contact-item">
                <span className="cv-classic-contact-icon"><i className="fa-solid fa-envelope" /></span>
                <span style={{ wordBreak: 'break-all' }}>{personal_info.email}</span>
              </div>
            )}
            {personal_info.location && (
              <div className="cv-classic-contact-item">
                <span className="cv-classic-contact-icon"><i className="fa-solid fa-location-dot" /></span>
                <span>{personal_info.location}</span>
              </div>
            )}
            {personal_info.linkedin && (
              <div className="cv-classic-contact-item">
                <span className="cv-classic-contact-icon"><i className="fa-brands fa-linkedin" /></span>
                <span style={{ wordBreak: 'break-all' }}>{personal_info.linkedin}</span>
              </div>
            )}
            {personal_info.github && (
              <div className="cv-classic-contact-item">
                <span className="cv-classic-contact-icon"><i className="fa-brands fa-github" /></span>
                <span style={{ wordBreak: 'break-all' }}>{personal_info.github}</span>
              </div>
            )}
          </div>

          <div className="cv-classic-sidebar-section">
            <h4 className="cv-classic-sidebar-title">{L.skills}</h4>
            {skillCategories.map(({ key, label }) =>
              skills[key]?.length > 0 ? (
                <div key={key} className="cv-classic-skill-group">
                  <div className="cv-classic-skill-group-title">{label}</div>
                  <div className="cv-classic-skills-list">
                    {skills[key].map((s, i) => (
                      <span key={i} className="cv-classic-skill-badge">{s}</span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="cv-classic-main">
          <div className="cv-classic-header">
            <h1 className="cv-classic-name">{personal_info.name}</h1>
            <p className="cv-classic-title-text">{personal_info.title}</p>
          </div>

          <div className="cv-classic-body">
            {summary && (
              <section className="cv-classic-section">
                <h2 className="cv-classic-section-title" data-block>{L.profile}</h2>
                <p className="cv-classic-summary">{summary}</p>
              </section>
            )}

            {experience?.length > 0 && (
              <section className="cv-classic-section">
                <h2 className="cv-classic-section-title" data-block>{L.experience}</h2>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} className="cv-classic-exp-item" data-block>
                    <div className="cv-classic-exp-header">
                      <span className="cv-classic-exp-company">{exp.company}</span>
                      <span className="cv-classic-exp-period">{exp.period}</span>
                    </div>
                    <div className="cv-classic-exp-position">{exp.position}</div>
                    <p className="cv-classic-exp-desc">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (
              <section className="cv-classic-section">
                <h2 className="cv-classic-section-title" data-block>{L.education}</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} className="cv-classic-edu-item" data-block>
                    <div className="cv-classic-edu-institution">{edu.institution}</div>
                    <div className="cv-classic-edu-degree">{edu.degree}</div>
                    {edu.period && <div className="cv-classic-edu-period">{edu.period}</div>}
                  </div>
                ))}
              </section>
            )}

            {certificates?.length > 0 && (
              <section className="cv-classic-section">
                <h2 className="cv-classic-section-title" data-block>{L.certificates}</h2>
                {certificates.map((cert, i) => (
                  <div key={cert.id || i} className="cv-classic-cert-item" data-block>
                    <span className="cv-classic-cert-icon"><i className="fa-solid fa-award" /></span>
                    <div className="cv-classic-cert-info">
                      <div className="cv-classic-cert-name">{cert.name}</div>
                      <div className="cv-classic-cert-meta">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
