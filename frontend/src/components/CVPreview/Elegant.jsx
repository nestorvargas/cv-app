import React from 'react';
import { getLabels, skillGroups, contactItems } from './shared.jsx';
import './elegant.css';

// Single column, serif headings, centered header and fine rules
export default function Elegant({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info = {}, summary, experience, education, skills, certificates, profile_image } = cvData;
  const L = getLabels(lang);
  const groups = skillGroups(skills, L);
  const contacts = contactItems(personal_info);

  return (
    <div
      className="cv-elegant-wrapper"
      style={{ '--cv-accent': accentColor || '#8a6d3b', '--cv-bg': bgColor || '#1f2a37', minHeight: pageMinHeight }}
    >
      <div className="cv-elegant">
        <header className="cv-elegant-header" data-block>
          {profile_image && <img src={profile_image} alt="" className="cv-elegant-photo" />}
          <h1 className="cv-elegant-name">{personal_info.name}</h1>
          {personal_info.title && <p className="cv-elegant-title">{personal_info.title}</p>}
          {contacts.length > 0 && (
            <ul className="cv-elegant-contact">
              {contacts.map(c => (
                <li key={c.key}>
                  <i className={c.icon} /> <span>{c.value}</span>
                </li>
              ))}
            </ul>
          )}
        </header>

        {summary && (
          <section className="cv-elegant-section">
            <h2 className="cv-elegant-section-title" data-block><span>{L.profile}</span></h2>
            <p className="cv-elegant-summary">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="cv-elegant-section">
            <h2 className="cv-elegant-section-title" data-block><span>{L.experience}</span></h2>
            {experience.map((exp, i) => (
              <article key={exp.id || i} className="cv-elegant-item" data-block>
                <div className="cv-elegant-item-head">
                  <div>
                    <div className="cv-elegant-item-title">{exp.position}</div>
                    <div className="cv-elegant-item-sub">{exp.company}</div>
                  </div>
                  {exp.period && <div className="cv-elegant-item-period">{exp.period}</div>}
                </div>
                {exp.description && <p className="cv-elegant-item-desc">{exp.description}</p>}
              </article>
            ))}
          </section>
        )}

        {education?.length > 0 && (
          <section className="cv-elegant-section">
            <h2 className="cv-elegant-section-title" data-block><span>{L.education}</span></h2>
            {education.map((edu, i) => (
              <article key={edu.id || i} className="cv-elegant-item cv-elegant-item--compact" data-block>
                <div className="cv-elegant-item-head">
                  <div>
                    <div className="cv-elegant-item-title">{edu.degree}</div>
                    <div className="cv-elegant-item-sub">{edu.institution}</div>
                  </div>
                  {edu.period && <div className="cv-elegant-item-period">{edu.period}</div>}
                </div>
              </article>
            ))}
          </section>
        )}

        {groups.length > 0 && (
          <section className="cv-elegant-section">
            <h2 className="cv-elegant-section-title" data-block><span>{L.skills}</span></h2>
            <div className="cv-elegant-skills">
              {groups.map(g => (
                <div key={g.key} className="cv-elegant-skill-row" data-block>
                  <span className="cv-elegant-skill-label">{g.label}</span>
                  <span className="cv-elegant-skill-items">{g.items.join(' · ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certificates?.length > 0 && (
          <section className="cv-elegant-section">
            <h2 className="cv-elegant-section-title" data-block><span>{L.certificates}</span></h2>
            <ul className="cv-elegant-certs">
              {certificates.map((c, i) => (
                <li key={c.id || i} data-block>
                  <span className="cv-elegant-cert-name">{c.name}</span>
                  <span className="cv-elegant-cert-meta">{[c.issuer, c.year].filter(Boolean).join(' · ')}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
