import React from 'react';
import './creative.css';

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

export default function Creative({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info, summary, experience, education, skills, certificates, profile_image } = cvData;
  const L = LABELS[lang] || LABELS.es;

  const imgSrc = profile_image || null;

  const skillCategories = [
    { key: 'technical', label: skills?._labels?.technical || L.technical },
    { key: 'databases', label: skills?._labels?.databases || L.databases },
    { key: 'devops', label: skills?._labels?.devops || L.devops },
    { key: 'tools', label: skills?._labels?.tools || L.tools },
    { key: 'languages', label: skills?._labels?.languages || L.languages },
  ];

  return (
    <div className="cv-creative-wrapper" style={{ '--cv-accent': accentColor || '#e94560', '--cv-bg': bgColor || '#1a1a2e', minHeight: pageMinHeight }}>
      <div className="cv-creative">
        {/* HEADER: photo left + info right */}
        <header className="cv-creative-header">
          <div className="cv-creative-photo-area">
            {imgSrc ? (
              <img src={imgSrc} alt="Profile" className="cv-creative-photo" />
            ) : (
              <div className="cv-creative-photo-placeholder"><i className="fa-solid fa-user" /></div>
            )}
          </div>
          <div className="cv-creative-header-info">
            <h1 className="cv-creative-name">{personal_info.name}</h1>
            <p className="cv-creative-title">{personal_info.title}</p>
            <div className="cv-creative-header-accent" />
            <div className="cv-creative-header-contacts">
              {personal_info.phone && (
                <span className="cv-creative-header-contact-item">
                  <span className="cv-creative-header-contact-icon"><i className="fa-solid fa-phone" /></span>
                  {personal_info.phone}
                </span>
              )}
              {personal_info.email && (
                <span className="cv-creative-header-contact-item">
                  <span className="cv-creative-header-contact-icon"><i className="fa-solid fa-envelope" /></span>
                  {personal_info.email}
                </span>
              )}
              {personal_info.location && (
                <span className="cv-creative-header-contact-item">
                  <span className="cv-creative-header-contact-icon"><i className="fa-solid fa-location-dot" /></span>
                  {personal_info.location}
                </span>
              )}
              {personal_info.linkedin && (
                <span className="cv-creative-header-contact-item">
                  <span className="cv-creative-header-contact-icon"><i className="fa-brands fa-linkedin" /></span>
                  {personal_info.linkedin}
                </span>
              )}
              {personal_info.github && (
                <span className="cv-creative-header-contact-item">
                  <span className="cv-creative-header-contact-icon"><i className="fa-brands fa-github" /></span>
                  {personal_info.github}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* BODY: main left + sidebar right */}
        <div className="cv-creative-body">
          {/* LEFT MAIN (70%) */}
          <main className="cv-creative-main">
            {summary && (
              <section className="cv-creative-section">
                <h2 className="cv-creative-section-title" data-block>{L.profile}</h2>
                <p className="cv-creative-summary">{summary}</p>
              </section>
            )}

            {experience?.length > 0 && (
              <section className="cv-creative-section">
                <h2 className="cv-creative-section-title" data-block>{L.experience}</h2>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} className="cv-creative-exp-item" data-block>
                    <div className="cv-creative-exp-header">
                      <span className="cv-creative-exp-company">{exp.company}</span>
                      <span className="cv-creative-exp-period">{exp.period}</span>
                    </div>
                    <div className="cv-creative-exp-position">{exp.position}</div>
                    <p className="cv-creative-exp-desc">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (
              <section className="cv-creative-section">
                <h2 className="cv-creative-section-title" data-block>{L.education}</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} className="cv-creative-edu-item" data-block>
                    <div className="cv-creative-edu-institution">{edu.institution}</div>
                    <div className="cv-creative-edu-degree">{edu.degree}</div>
                    {edu.period && <div className="cv-creative-edu-period">{edu.period}</div>}
                  </div>
                ))}
              </section>
            )}

            {certificates?.length > 0 && (
              <section className="cv-creative-section">
                <h2 className="cv-creative-section-title" data-block>{L.certificates}</h2>
                {certificates.map((cert, i) => (
                  <div key={cert.id || i} className="cv-creative-cert-item" data-block>
                    <span className="cv-creative-cert-icon"><i className="fa-solid fa-award" /></span>
                    <div className="cv-creative-cert-info">
                      <div className="cv-creative-cert-name">{cert.name}</div>
                      <div className="cv-creative-cert-meta">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </main>

          {/* RIGHT SIDEBAR (30%) */}
          <aside className="cv-creative-sidebar">
            <div className="cv-creative-sidebar-section">
              <h4 className="cv-creative-sidebar-title">{L.skills}</h4>
              {skillCategories.map(({ key, label }) =>
                skills[key]?.length > 0 ? (
                  <div key={key} className="cv-creative-skill-group" data-block>
                    <div className="cv-creative-skill-group-title">{label}</div>
                    <div className="cv-creative-skill-badges">
                      {skills[key].map((s, i) => (
                        <span key={i} className="cv-creative-skill-badge">{s}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
