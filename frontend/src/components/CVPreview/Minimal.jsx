import React from 'react';
import './minimal.css';

const LABELS = {
  es: {
    about:        'SOBRE MÍ',
    skills:       'HABILIDADES',
    certificates: 'CURSOS',
    experience:   'EXPERIENCIA LABORAL',
    education:    'EDUCACIÓN',
  },
  en: {
    about:        'ABOUT ME',
    skills:       'SKILLS',
    certificates: 'COURSES',
    experience:   'WORK EXPERIENCE',
    education:    'EDUCATION',
  },
};

const BAR_WIDTHS = [95, 88, 92, 85, 90, 80, 85, 78, 88, 82, 75, 90, 85, 80, 88];

export default function Minimal({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info, summary, experience, education, skills, certificates, profile_image } = cvData;
  const L = LABELS[lang] || LABELS.es;
  const accent = accentColor || '#2980b9';

  const imgSrc = profile_image || null;

  const allSkills = [
    ...(skills?.technical  || []),
    ...(skills?.databases  || []),
    ...(skills?.devops     || []),
    ...(skills?.tools      || []),
    ...(skills?.languages  || []),
  ];

  return (
    <div className="cv-minimal-wrapper" style={{ '--cv-accent': accent, '--cv-bg': bgColor || '#3d3d3d', minHeight: pageMinHeight }}>
      <div className="cv-minimal">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="cv-minimal-sidebar">

          <div className="cv-minimal-photo-area">
            {imgSrc ? (
              <img src={imgSrc} alt="Profile" className="cv-minimal-photo" />
            ) : (
              <div className="cv-minimal-photo-placeholder">
                <i className="fa-solid fa-user" />
              </div>
            )}
          </div>

          {summary && (
            <div className="cv-minimal-sidebar-section">
              <h4 className="cv-minimal-sidebar-title">{L.about}</h4>
              <p className="cv-minimal-about-text">{summary}</p>
            </div>
          )}

          {allSkills.length > 0 && (
            <div className="cv-minimal-sidebar-section">
              <h4 className="cv-minimal-sidebar-title">{L.skills}</h4>
              {allSkills.map((skill, i) => (
                <div key={i} className="cv-minimal-skill-item" data-block>
                  <div className="cv-minimal-skill-name">{skill}</div>
                  <div className="cv-minimal-skill-bar-wrap">
                    <div
                      className="cv-minimal-skill-bar-fill"
                      style={{ width: `${BAR_WIDTHS[i % BAR_WIDTHS.length]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {certificates?.length > 0 && (
            <div className="cv-minimal-sidebar-section">
              <h4 className="cv-minimal-sidebar-title">{L.certificates}</h4>
              {certificates.map((cert, i) => (
                <div key={cert.id || i} className="cv-minimal-cert-item" data-block>
                  {cert.year && <div className="cv-minimal-cert-year">{cert.year}</div>}
                  <div className="cv-minimal-cert-name">{cert.name}</div>
                  {cert.issuer && <div className="cv-minimal-cert-issuer">{cert.issuer}</div>}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* ── RIGHT MAIN ── */}
        <main className="cv-minimal-main">

          <header className="cv-minimal-header">
            <div className="cv-minimal-header-left">
              <h1 className="cv-minimal-name">{personal_info.name}</h1>
              <p className="cv-minimal-title-text">{personal_info.title}</p>
            </div>
            <div className="cv-minimal-header-right">
              {personal_info.location && (
                <div className="cv-minimal-contact-item">
                  <span className="cv-minimal-contact-icon">
                    <i className="fa-solid fa-location-dot" />
                  </span>
                  <span>{personal_info.location}</span>
                </div>
              )}
              {personal_info.phone && (
                <div className="cv-minimal-contact-item">
                  <span className="cv-minimal-contact-icon">
                    <i className="fa-solid fa-phone" />
                  </span>
                  <span>{personal_info.phone}</span>
                </div>
              )}
              {personal_info.email && (
                <div className="cv-minimal-contact-item">
                  <span className="cv-minimal-contact-icon">
                    <i className="fa-solid fa-envelope" />
                  </span>
                  <span className="cv-minimal-email">{personal_info.email}</span>
                </div>
              )}
              {personal_info.linkedin && (
                <div className="cv-minimal-contact-item">
                  <span className="cv-minimal-contact-icon">
                    <i className="fa-brands fa-linkedin" />
                  </span>
                  <span style={{ wordBreak: 'break-all' }}>{personal_info.linkedin}</span>
                </div>
              )}
              {personal_info.github && (
                <div className="cv-minimal-contact-item">
                  <span className="cv-minimal-contact-icon">
                    <i className="fa-brands fa-github" />
                  </span>
                  <span style={{ wordBreak: 'break-all' }}>{personal_info.github}</span>
                </div>
              )}
            </div>
          </header>

          <div className="cv-minimal-body">

            {experience?.length > 0 && (
              <section className="cv-minimal-section">
                <h2 className="cv-minimal-section-title" data-block>{L.experience}</h2>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} className="cv-minimal-timeline-item" data-block>
                    <div className="cv-minimal-timeline-meta">
                      <div className="cv-minimal-timeline-company">{exp.company}</div>
                      {exp.period && <div className="cv-minimal-timeline-period">{exp.period}</div>}
                    </div>
                    <div className="cv-minimal-timeline-dot-wrap">
                      <div className="cv-minimal-timeline-dot" />
                      {i < experience.length - 1 && <div className="cv-minimal-timeline-line" />}
                    </div>
                    <div className="cv-minimal-timeline-content">
                      <div className="cv-minimal-timeline-position">{exp.position}</div>
                      <p className="cv-minimal-timeline-desc">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (
              <section className="cv-minimal-section">
                <h2 className="cv-minimal-section-title" data-block>{L.education}</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} className="cv-minimal-timeline-item" data-block>
                    <div className="cv-minimal-timeline-meta">
                      <div className="cv-minimal-timeline-company">{edu.institution}</div>
                      {edu.period && <div className="cv-minimal-timeline-period">{edu.period}</div>}
                    </div>
                    <div className="cv-minimal-timeline-dot-wrap">
                      <div className="cv-minimal-timeline-dot" />
                      {i < education.length - 1 && <div className="cv-minimal-timeline-line" />}
                    </div>
                    <div className="cv-minimal-timeline-content">
                      <div className="cv-minimal-timeline-position">{edu.degree}</div>
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
