import React from 'react';
import { getLabels, skillGroups, ContactList } from './shared.jsx';
import './timeline.css';

// Header with photo, then experience and education as a vertical timeline
export default function Timeline({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info = {}, summary, experience, education, skills, certificates, profile_image } = cvData;
  const L = getLabels(lang);
  const groups = skillGroups(skills, L);

  return (
    <div
      className="cv-timeline-wrapper"
      style={{ '--cv-accent': accentColor || '#0ea5e9', '--cv-bg': bgColor || '#0f172a', minHeight: pageMinHeight }}
    >
      <div className="cv-timeline">
        <header className="cv-timeline-header" data-block>
          {profile_image
            ? <img src={profile_image} alt="" className="cv-timeline-photo" />
            : <div className="cv-timeline-photo cv-timeline-photo--empty"><i className="fa-solid fa-user" /></div>}
          <div className="cv-timeline-identity">
            <h1 className="cv-timeline-name">{personal_info.name}</h1>
            {personal_info.title && <p className="cv-timeline-title">{personal_info.title}</p>}
            <ContactList personal_info={personal_info} className="cv-timeline-contact" />
          </div>
        </header>

        {summary && (
          <section className="cv-timeline-section">
            <h2 className="cv-timeline-section-title" data-block><i className="fa-solid fa-user" /> {L.profile}</h2>
            <p className="cv-timeline-summary">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="cv-timeline-section">
            <h2 className="cv-timeline-section-title" data-block><i className="fa-solid fa-briefcase" /> {L.experience}</h2>
            <div className="cv-timeline-track">
              {experience.map((exp, i) => (
                <article key={exp.id || i} className="cv-timeline-entry" data-block>
                  <span className="cv-timeline-dot" />
                  {exp.period && <div className="cv-timeline-period">{exp.period}</div>}
                  <div className="cv-timeline-entry-title">{exp.position}</div>
                  <div className="cv-timeline-entry-sub">{exp.company}</div>
                  {exp.description && <p className="cv-timeline-entry-desc">{exp.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section className="cv-timeline-section">
            <h2 className="cv-timeline-section-title" data-block><i className="fa-solid fa-graduation-cap" /> {L.education}</h2>
            <div className="cv-timeline-track">
              {education.map((edu, i) => (
                <article key={edu.id || i} className="cv-timeline-entry" data-block>
                  <span className="cv-timeline-dot" />
                  {edu.period && <div className="cv-timeline-period">{edu.period}</div>}
                  <div className="cv-timeline-entry-title">{edu.degree}</div>
                  <div className="cv-timeline-entry-sub">{edu.institution}</div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(groups.length > 0 || certificates?.length > 0) && (
          <div className="cv-timeline-columns">
            {groups.length > 0 && (
              <section className="cv-timeline-section">
                <h2 className="cv-timeline-section-title" data-block><i className="fa-solid fa-star" /> {L.skills}</h2>
                {groups.map(g => (
                  <div key={g.key} className="cv-timeline-skill-group" data-block>
                    <div className="cv-timeline-skill-label">{g.label}</div>
                    <div className="cv-timeline-chips">
                      {g.items.map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </section>
            )}
            {certificates?.length > 0 && (
              <section className="cv-timeline-section">
                <h2 className="cv-timeline-section-title" data-block><i className="fa-solid fa-award" /> {L.certificates}</h2>
                {certificates.map((c, i) => (
                  <div key={c.id || i} className="cv-timeline-cert" data-block>
                    <div className="cv-timeline-cert-name">{c.name}</div>
                    <div className="cv-timeline-cert-meta">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
