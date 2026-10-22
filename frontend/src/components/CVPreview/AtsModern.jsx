import React from 'react';
import { getLabels, skillGroups } from './shared.jsx';
import './atsmodern.css';

// ATS-safe with more hierarchy: one column, no icons or photo, real text in the PDF
// (printed natively like "ats"; see REAL_TEXT_TEMPLATES in PrintPage/pdfController).
export default function AtsModern({ cvData, lang, accentColor, pageMinHeight }) {
  const { personal_info: p = {}, summary, experience, education, skills, certificates } = cvData;
  const L = getLabels(lang);
  const groups = skillGroups(skills, L);
  const contact = [p.location, p.phone, p.email, p.linkedin, p.github].filter(Boolean);

  return (
    <div className="cv-atsm-wrapper" style={{ '--cv-accent': accentColor || '#1d4ed8', minHeight: pageMinHeight }}>
      <header className="cv-atsm-header" data-block>
        <h1 className="cv-atsm-name">{p.name}</h1>
        {p.title && <p className="cv-atsm-title">{p.title}</p>}
        {contact.length > 0 && (
          <p className="cv-atsm-contact">
            {contact.map((c, i) => <span key={i}>{c}</span>)}
          </p>
        )}
      </header>

      {summary && (
        <section className="cv-atsm-section" data-block>
          <h2 className="cv-atsm-section-title">{L.profile}</h2>
          <p className="cv-atsm-text">{summary}</p>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="cv-atsm-section">
          <h2 className="cv-atsm-section-title" data-block>{L.experience}</h2>
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="cv-atsm-item" data-block>
              <div className="cv-atsm-item-head">
                <span className="cv-atsm-item-title">{exp.position}</span>
                {exp.period && <span className="cv-atsm-item-period">{exp.period}</span>}
              </div>
              {exp.company && <div className="cv-atsm-item-sub">{exp.company}</div>}
              {exp.description && <p className="cv-atsm-text">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education?.length > 0 && (
        <section className="cv-atsm-section">
          <h2 className="cv-atsm-section-title" data-block>{L.education}</h2>
          {education.map((edu, i) => (
            <div key={edu.id || i} className="cv-atsm-item cv-atsm-item--tight" data-block>
              <div className="cv-atsm-item-head">
                <span className="cv-atsm-item-title">{edu.degree}</span>
                {edu.period && <span className="cv-atsm-item-period">{edu.period}</span>}
              </div>
              {edu.institution && <div className="cv-atsm-item-sub">{edu.institution}</div>}
            </div>
          ))}
        </section>
      )}

      {groups.length > 0 && (
        <section className="cv-atsm-section">
          <h2 className="cv-atsm-section-title" data-block>{L.skills}</h2>
          <div className="cv-atsm-skills">
            {groups.map(g => (
              <p key={g.key} className="cv-atsm-skill" data-block>
                <strong>{g.label}:</strong> {g.items.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {certificates?.length > 0 && (
        <section className="cv-atsm-section">
          <h2 className="cv-atsm-section-title" data-block>{L.certificates}</h2>
          <ul className="cv-atsm-certs">
            {certificates.map((c, i) => (
              <li key={c.id || i} data-block>
                <strong>{c.name}</strong>
                {c.issuer ? ` — ${c.issuer}` : ''}
                {c.year ? ` (${c.year})` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
