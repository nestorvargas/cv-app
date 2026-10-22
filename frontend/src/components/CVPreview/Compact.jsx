import React from 'react';
import { getLabels, skillGroups, ContactList } from './shared.jsx';
import './compact.css';

// Dense two-column layout: main content left, light sidebar right. Fits long CVs in fewer pages.
export default function Compact({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info = {}, summary, experience, education, skills, certificates, profile_image } = cvData;
  const L = getLabels(lang);
  const groups = skillGroups(skills, L);

  return (
    <div
      className="cv-compact-wrapper"
      style={{ '--cv-accent': accentColor || '#2563eb', '--cv-bg': bgColor || '#111827', minHeight: pageMinHeight }}
    >
      <div className="cv-compact">
        <main className="cv-compact-main">
          <header className="cv-compact-header" data-block>
            <h1 className="cv-compact-name">{personal_info.name}</h1>
            {personal_info.title && <p className="cv-compact-title">{personal_info.title}</p>}
          </header>

          {summary && (
            <section className="cv-compact-section">
              <h2 className="cv-compact-section-title" data-block>{L.profile}</h2>
              <p className="cv-compact-text">{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="cv-compact-section">
              <h2 className="cv-compact-section-title" data-block>{L.experience}</h2>
              {experience.map((exp, i) => (
                <article key={exp.id || i} className="cv-compact-item" data-block>
                  <div className="cv-compact-item-head">
                    <span className="cv-compact-item-title">{exp.position}</span>
                    {exp.period && <span className="cv-compact-item-period">{exp.period}</span>}
                  </div>
                  <div className="cv-compact-item-sub">{exp.company}</div>
                  {exp.description && <p className="cv-compact-text">{exp.description}</p>}
                </article>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section className="cv-compact-section">
              <h2 className="cv-compact-section-title" data-block>{L.education}</h2>
              {education.map((edu, i) => (
                <article key={edu.id || i} className="cv-compact-item cv-compact-item--tight" data-block>
                  <div className="cv-compact-item-head">
                    <span className="cv-compact-item-title">{edu.degree}</span>
                    {edu.period && <span className="cv-compact-item-period">{edu.period}</span>}
                  </div>
                  <div className="cv-compact-item-sub">{edu.institution}</div>
                </article>
              ))}
            </section>
          )}
        </main>

        <aside className="cv-compact-side">
          {profile_image && (
            <div className="cv-compact-photo-wrap" data-block>
              <img src={profile_image} alt="" className="cv-compact-photo" />
            </div>
          )}

          <section className="cv-compact-side-section" data-block>
            <h3 className="cv-compact-side-title">{L.contact}</h3>
            <ContactList personal_info={personal_info} className="cv-compact-contact" />
          </section>

          {groups.map(g => (
            <section key={g.key} className="cv-compact-side-section" data-block>
              <h3 className="cv-compact-side-title">{g.label}</h3>
              <ul className="cv-compact-list">
                {g.items.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </section>
          ))}

          {certificates?.length > 0 && (
            <section className="cv-compact-side-section">
              <h3 className="cv-compact-side-title" data-block>{L.certificates}</h3>
              {certificates.map((c, i) => (
                <div key={c.id || i} className="cv-compact-cert" data-block>
                  <div className="cv-compact-cert-name">{c.name}</div>
                  <div className="cv-compact-cert-meta">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
