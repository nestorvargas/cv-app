import React from 'react';
import './index.css';

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
  },
};

export default function CVPreview({ cvData, lang }) {
  const { personal_info, summary, experience, education, skills, profile_image } = cvData;
  const L = LABELS[lang] || LABELS.es;

  const imgSrc = profile_image
    ? (profile_image.startsWith('http') ? profile_image : `/api${profile_image}`)
    : null;

  return (
    <div className="cv-preview-wrapper">
      <div className="cv-preview">
        {/* LEFT SIDEBAR */}
        <aside className="cv-sidebar">
          <div className="cv-photo-area">
            {imgSrc ? (
              <img src={imgSrc} alt="Profile" className="cv-photo" />
            ) : (
              <div className="cv-photo-placeholder">👤</div>
            )}
          </div>

          <div className="cv-sidebar-section">
            <h4 className="cv-sidebar-title">{L.contact}</h4>
            {personal_info.phone && (
              <div className="cv-contact-item">
                <span className="cv-contact-icon">📞</span>
                <span>{personal_info.phone}</span>
              </div>
            )}
            {personal_info.email && (
              <div className="cv-contact-item">
                <span className="cv-contact-icon">✉️</span>
                <span style={{ wordBreak: 'break-all' }}>{personal_info.email}</span>
              </div>
            )}
            {personal_info.location && (
              <div className="cv-contact-item">
                <span className="cv-contact-icon">📍</span>
                <span>{personal_info.location}</span>
              </div>
            )}
          </div>

          <div className="cv-sidebar-section">
            <h4 className="cv-sidebar-title">{L.skills}</h4>
            {[
              { key: 'technical', label: L.technical },
              { key: 'databases', label: L.databases },
              { key: 'devops', label: L.devops },
              { key: 'tools', label: L.tools },
              { key: 'languages', label: L.languages },
            ].map(({ key, label }) => skills[key]?.length > 0 && (
              <div key={key} className="cv-skill-group">
                <div className="cv-skill-group-title">{label}</div>
                <div className="cv-skills-list">
                  {skills[key].map((s, i) => <span key={i} className="cv-skill-badge">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="cv-main">
          <div className="cv-header">
            <h1 className="cv-name">{personal_info.name}</h1>
            <p className="cv-title-text">{personal_info.title}</p>
          </div>

          <div className="cv-body">
            {summary && (
              <section className="cv-section">
                <h2 className="cv-section-title">{L.profile}</h2>
                <p className="cv-summary">{summary}</p>
              </section>
            )}

            {experience?.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">{L.experience}</h2>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} className="cv-exp-item">
                    <div className="cv-exp-header">
                      <span className="cv-exp-company">{exp.company}</span>
                      <span className="cv-exp-period">{exp.period}</span>
                    </div>
                    <div className="cv-exp-position">{exp.position}</div>
                    <p className="cv-exp-desc">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">{L.education}</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} className="cv-edu-item">
                    <div className="cv-edu-institution">{edu.institution}</div>
                    <div className="cv-edu-degree">{edu.degree}</div>
                    {edu.period && <div className="cv-edu-period">{edu.period}</div>}
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
