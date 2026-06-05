import React from 'react';
import './modern.css';

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

export default function Modern({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
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
    <div className="cv-modern-wrapper" style={{ '--cv-accent': accentColor || '#e67e22', '--cv-bg': bgColor || '#1a252f', minHeight: pageMinHeight }}>
      <div className="cv-modern">
        {/* FULL-WIDTH HEADER */}
        <header className="cv-modern-header">
          <div className="cv-modern-photo-wrap">
            {imgSrc ? (
              <img src={imgSrc} alt="Profile" className="cv-modern-photo" />
            ) : (
              <div className="cv-modern-photo-placeholder"><i className="fa-solid fa-user" /></div>
            )}
          </div>

          <div className="cv-modern-header-info">
            <h1 className="cv-modern-name">{personal_info.name}</h1>
            <p className="cv-modern-title">{personal_info.title}</p>
          </div>

          <div className="cv-modern-header-accent" />
        </header>

        {/* BODY: 2-column grid */}
        <div className="cv-modern-body">
          {/* LEFT COLUMN: Profile + Experience */}
          <div className="cv-modern-col">
            {summary && (
              <section className="cv-modern-section">
                <h2 className="cv-modern-section-title">{L.profile}</h2>
                <p className="cv-modern-summary">{summary}</p>
              </section>
            )}

            {experience?.length > 0 && (
              <section className="cv-modern-section">
                <h2 className="cv-modern-section-title">{L.experience}</h2>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} className="cv-modern-exp-item" data-block>
                    <div className="cv-modern-exp-header">
                      <span className="cv-modern-exp-company">{exp.company}</span>
                      <span className="cv-modern-exp-period">{exp.period}</span>
                    </div>
                    <div className="cv-modern-exp-position">{exp.position}</div>
                    <p className="cv-modern-exp-desc">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Skills + Education + Contact */}
          <div className="cv-modern-col">
            {skillCategories.some(({ key }) => skills[key]?.length > 0) && (
              <section className="cv-modern-section">
                <h2 className="cv-modern-section-title">{L.skills}</h2>
                {skillCategories.map(({ key, label }) =>
                  skills[key]?.length > 0 ? (
                    <div key={key} className="cv-modern-skill-category">
                      <div className="cv-modern-skill-cat-label">{label}</div>
                      <div className="cv-modern-skill-dots">
                        {skills[key].map((s, i) => (
                          <div key={i} className="cv-modern-skill-dot-item">
                            <span className="cv-modern-skill-dot" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </section>
            )}

            {education?.length > 0 && (
              <section className="cv-modern-section">
                <h2 className="cv-modern-section-title">{L.education}</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} className="cv-modern-edu-item" data-block>
                    <div className="cv-modern-edu-institution">{edu.institution}</div>
                    <div className="cv-modern-edu-degree">{edu.degree}</div>
                    {edu.period && <div className="cv-modern-edu-period">{edu.period}</div>}
                  </div>
                ))}
              </section>
            )}

            {certificates?.length > 0 && (
              <section className="cv-modern-section">
                <h2 className="cv-modern-section-title">{L.certificates}</h2>
                {certificates.map((cert, i) => (
                  <div key={cert.id || i} className="cv-modern-cert-item" data-block>
                    <span className="cv-modern-cert-icon"><i className="fa-solid fa-award" /></span>
                    <div className="cv-modern-cert-info">
                      <div className="cv-modern-cert-name">{cert.name}</div>
                      <div className="cv-modern-cert-meta">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="cv-modern-section">
              <h2 className="cv-modern-section-title">{L.contact}</h2>
              {personal_info.phone && (
                <div className="cv-modern-contact-item">
                  <span className="cv-modern-contact-icon"><i className="fa-solid fa-phone" /></span>
                  <span>{personal_info.phone}</span>
                </div>
              )}
              {personal_info.email && (
                <div className="cv-modern-contact-item">
                  <span className="cv-modern-contact-icon"><i className="fa-solid fa-envelope" /></span>
                  <span>{personal_info.email}</span>
                </div>
              )}
              {personal_info.location && (
                <div className="cv-modern-contact-item">
                  <span className="cv-modern-contact-icon"><i className="fa-solid fa-location-dot" /></span>
                  <span>{personal_info.location}</span>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
