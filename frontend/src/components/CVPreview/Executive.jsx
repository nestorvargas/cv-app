import React from 'react';
import './executive.css';

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

export default function Executive({ cvData, lang }) {
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
    <div className="cv-executive-wrapper">
      <div className="cv-executive">
        {/* FULL-WIDTH HEADER (centered) */}
        <header className="cv-executive-header">
          <h1 className="cv-executive-name">{personal_info.name}</h1>
          <p className="cv-executive-title-text">{personal_info.title}</p>
          <div className="cv-executive-header-line" />
        </header>

        {/* BODY: sidebar + main */}
        <div className="cv-executive-body">
          {/* LEFT SIDEBAR */}
          <aside className="cv-executive-sidebar">
            <div className="cv-executive-photo-area">
              {imgSrc ? (
                <img src={imgSrc} alt="Profile" className="cv-executive-photo" />
              ) : (
                <div className="cv-executive-photo-placeholder">👤</div>
              )}
            </div>

            <div className="cv-executive-sidebar-section">
              <h4 className="cv-executive-sidebar-title">{L.contact}</h4>
              {personal_info.phone && (
                <div className="cv-executive-contact-item">
                  <span className="cv-executive-contact-icon">📞</span>
                  <span>{personal_info.phone}</span>
                </div>
              )}
              {personal_info.email && (
                <div className="cv-executive-contact-item">
                  <span className="cv-executive-contact-icon">✉️</span>
                  <span style={{ wordBreak: 'break-all' }}>{personal_info.email}</span>
                </div>
              )}
              {personal_info.location && (
                <div className="cv-executive-contact-item">
                  <span className="cv-executive-contact-icon">📍</span>
                  <span>{personal_info.location}</span>
                </div>
              )}
            </div>

            <div className="cv-executive-sidebar-section">
              <h4 className="cv-executive-sidebar-title">{L.skills}</h4>
              {skillCategories.map(({ key, label }) =>
                skills[key]?.length > 0 ? (
                  <div key={key} className="cv-executive-skill-group">
                    <div className="cv-executive-skill-group-title">{label}</div>
                    <div className="cv-executive-skills-list">
                      {skills[key].map((s, i) => (
                        <span key={i} className="cv-executive-skill-badge">{s}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT */}
          <main className="cv-executive-main">
            {summary && (
              <section className="cv-executive-section">
                <h2 className="cv-executive-section-title">{L.profile}</h2>
                <p className="cv-executive-summary">{summary}</p>
              </section>
            )}

            {experience?.length > 0 && (
              <section className="cv-executive-section">
                <h2 className="cv-executive-section-title">{L.experience}</h2>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} className="cv-executive-exp-item">
                    <div className="cv-executive-exp-header">
                      <span className="cv-executive-exp-company">{exp.company}</span>
                      <span className="cv-executive-exp-period">{exp.period}</span>
                    </div>
                    <div className="cv-executive-exp-position">{exp.position}</div>
                    <p className="cv-executive-exp-desc">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (
              <section className="cv-executive-section">
                <h2 className="cv-executive-section-title">{L.education}</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} className="cv-executive-edu-item">
                    <div className="cv-executive-edu-institution">{edu.institution}</div>
                    <div className="cv-executive-edu-degree">{edu.degree}</div>
                    {edu.period && <div className="cv-executive-edu-period">{edu.period}</div>}
                  </div>
                ))}
              </section>
            )}

            {certificates?.length > 0 && (
              <section className="cv-executive-section">
                <h2 className="cv-executive-section-title">{L.certificates}</h2>
                {certificates.map((cert, i) => (
                  <div key={cert.id || i} className="cv-executive-cert-item">
                    <span className="cv-executive-cert-icon">🏅</span>
                    <div className="cv-executive-cert-info">
                      <div className="cv-executive-cert-name">{cert.name}</div>
                      <div className="cv-executive-cert-meta">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
