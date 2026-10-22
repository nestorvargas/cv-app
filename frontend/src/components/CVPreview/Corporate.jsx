import React from 'react';
import { getLabels, skillGroups, contactItems } from './shared.jsx';
import './corporate.css';

function SectionTitle({ icon, children }) {
  return (
    <h2 className="cv-corp-section-title" data-block>
      <span className="cv-corp-section-icon"><i className={`fa-solid ${icon}`} /></span>
      {children}
    </h2>
  );
}

// Color band header with overlapping photo, contact strip and icon section headings
export default function Corporate({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info = {}, summary, experience, education, skills, certificates, profile_image } = cvData;
  const L = getLabels(lang);
  const groups = skillGroups(skills, L);
  const contacts = contactItems(personal_info);

  return (
    <div
      className="cv-corp-wrapper"
      style={{ '--cv-accent': accentColor || '#f59e0b', '--cv-bg': bgColor || '#1e3a5f', minHeight: pageMinHeight }}
    >
      <div className="cv-corp">
        <header className="cv-corp-header" data-block>
          <div className="cv-corp-band">
            <div className="cv-corp-identity">
              <h1 className="cv-corp-name">{personal_info.name}</h1>
              {personal_info.title && <p className="cv-corp-title">{personal_info.title}</p>}
            </div>
            {profile_image && <img src={profile_image} alt="" className="cv-corp-photo" />}
          </div>
          {contacts.length > 0 && (
            <ul className={`cv-corp-contact ${profile_image ? 'has-photo' : ''}`}>
              {contacts.map(c => (
                <li key={c.key}><i className={c.icon} /> <span>{c.value}</span></li>
              ))}
            </ul>
          )}
        </header>

        <div className="cv-corp-body">
          {summary && (
            <section className="cv-corp-section">
              <SectionTitle icon="fa-user-tie">{L.profile}</SectionTitle>
              <p className="cv-corp-text">{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="cv-corp-section">
              <SectionTitle icon="fa-briefcase">{L.experience}</SectionTitle>
              {experience.map((exp, i) => (
                <article key={exp.id || i} className="cv-corp-item" data-block>
                  <div className="cv-corp-item-head">
                    <div>
                      <span className="cv-corp-item-title">{exp.position}</span>
                      {exp.company && <span className="cv-corp-item-company"> | {exp.company}</span>}
                    </div>
                    {exp.period && <span className="cv-corp-item-period">{exp.period}</span>}
                  </div>
                  {exp.description && <p className="cv-corp-text">{exp.description}</p>}
                </article>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section className="cv-corp-section">
              <SectionTitle icon="fa-graduation-cap">{L.education}</SectionTitle>
              <div className="cv-corp-grid">
                {education.map((edu, i) => (
                  <article key={edu.id || i} className="cv-corp-card" data-block>
                    <div className="cv-corp-card-title">{edu.degree}</div>
                    <div className="cv-corp-card-sub">{edu.institution}</div>
                    {edu.period && <div className="cv-corp-card-meta">{edu.period}</div>}
                  </article>
                ))}
              </div>
            </section>
          )}

          {groups.length > 0 && (
            <section className="cv-corp-section">
              <SectionTitle icon="fa-star">{L.skills}</SectionTitle>
              <div className="cv-corp-grid">
                {groups.map(g => (
                  <div key={g.key} className="cv-corp-skill" data-block>
                    <div className="cv-corp-skill-label">{g.label}</div>
                    <div className="cv-corp-tags">
                      {g.items.map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certificates?.length > 0 && (
            <section className="cv-corp-section">
              <SectionTitle icon="fa-award">{L.certificates}</SectionTitle>
              <div className="cv-corp-grid">
                {certificates.map((c, i) => (
                  <div key={c.id || i} className="cv-corp-cert" data-block>
                    <i className="fa-solid fa-circle-check" />
                    <div>
                      <div className="cv-corp-card-title">{c.name}</div>
                      <div className="cv-corp-card-meta">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
