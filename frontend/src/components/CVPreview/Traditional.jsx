import React from 'react';
import { skillGroups } from './shared.jsx';
import './traditional.css';

// Traditional Colombian "hoja de vida": title page with photo and a personal data table,
// boxed section headings, references and a signature block. Page frames come from Paged.jsx.
const LABELS = {
  es: {
    doc: 'HOJA DE VIDA',
    personal: 'Datos Personales',
    name: 'Nombre',
    documentId: 'Documento de identidad',
    birthDate: 'Fecha de nacimiento',
    birthPlace: 'Lugar de nacimiento',
    maritalStatus: 'Estado civil',
    address: 'Dirección',
    location: 'Ciudad',
    phone: 'Teléfono',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    profile: 'Perfil Profesional',
    experience: 'Experiencia Laboral',
    education: 'Formación Académica',
    certificates: 'Estudios Complementarios',
    skills: 'Habilidades y Conocimientos',
    work: 'Referencias Laborales',
    personalRefs: 'Referencias Personales',
    family: 'Referencias Familiares',
    idShort: 'C.C.',
    issuedIn: 'de',
    technical: 'Técnicas', databases: 'Bases de Datos', devops: 'DevOps', tools: 'Gestión', languages: 'Idiomas',
  },
  en: {
    doc: 'CURRICULUM VITAE',
    personal: 'Personal Information',
    name: 'Name',
    documentId: 'ID number',
    birthDate: 'Date of birth',
    birthPlace: 'Place of birth',
    maritalStatus: 'Marital status',
    address: 'Address',
    location: 'City',
    phone: 'Phone',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    profile: 'Professional Profile',
    experience: 'Work Experience',
    education: 'Education',
    certificates: 'Additional Training',
    skills: 'Skills and Knowledge',
    work: 'Professional References',
    personalRefs: 'Personal References',
    family: 'Family References',
    idShort: 'ID',
    issuedIn: 'issued in',
    technical: 'Technical', databases: 'Databases', devops: 'DevOps', tools: 'Management', languages: 'Languages',
  },
};

function SectionTitle({ children }) {
  return <h2 className="cv-trad-section-title" data-block><span>{children}</span></h2>;
}

function References({ title, items }) {
  if (!items.length) return null;
  return (
    <section className="cv-trad-section">
      <SectionTitle>{title}</SectionTitle>
      <div className="cv-trad-refs">
        {items.map((r, i) => (
          <div key={r.id || i} className="cv-trad-ref" data-block>
            <div className="cv-trad-ref-name">{r.name}</div>
            {r.occupation && <div className="cv-trad-ref-occ">{r.occupation}</div>}
            {r.phone && <div className="cv-trad-ref-phone">{r.phone}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Traditional({ cvData, lang, accentColor, bgColor, pageMinHeight }) {
  const { personal_info: p = {}, summary, experience, education, skills, certificates, profile_image } = cvData;
  const refs = cvData.personal_references || [];
  const L = LABELS[lang] || LABELS.es;
  const groups = skillGroups(skills, L);

  const rows = [
    [L.name, p.name],
    [L.documentId, p.document_id && `${L.idShort} ${p.document_id}`],
    [L.birthDate, p.birth_date],
    [L.birthPlace, p.birth_place],
    [L.maritalStatus, p.marital_status],
    [L.address, p.address],
    [L.location, p.location],
    [L.phone, p.phone],
    [L.email, p.email],
    [L.linkedin, p.linkedin],
  ].filter(([, v]) => v);

  return (
    <div
      className="cv-trad-wrapper"
      style={{ '--cv-accent': accentColor || '#374151', '--cv-bg': bgColor || '#e5e7eb', minHeight: pageMinHeight }}
    >
      <div className="cv-trad">
        <header className="cv-trad-cover" data-block>
          <h1 className="cv-trad-doc">{L.doc}</h1>
          <p className="cv-trad-name">{p.name}</p>
          <div className="cv-trad-rule" />
          {p.title && <p className="cv-trad-title">{p.title}</p>}
          {profile_image && (
            <div className="cv-trad-photo-frame">
              <img src={profile_image} alt="" className="cv-trad-photo" />
            </div>
          )}
        </header>

        {rows.length > 0 && (
          <section className="cv-trad-section">
            <SectionTitle>{L.personal}</SectionTitle>
            <table className="cv-trad-table" data-block>
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {summary && (
          <section className="cv-trad-section">
            <SectionTitle>{L.profile}</SectionTitle>
            <p className="cv-trad-text">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="cv-trad-section">
            <SectionTitle>{L.experience}</SectionTitle>
            {experience.map((exp, i) => (
              <div key={exp.id || i} className="cv-trad-entry" data-block>
                <div className="cv-trad-entry-head">
                  <span className="cv-trad-entry-title">{exp.position || exp.company}</span>
                  {exp.period && <span className="cv-trad-entry-period">{exp.period}</span>}
                </div>
                {exp.position && exp.company && <div className="cv-trad-entry-sub">{exp.company}</div>}
                {exp.description && <p className="cv-trad-text">{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education?.length > 0 && (
          <section className="cv-trad-section">
            <SectionTitle>{L.education}</SectionTitle>
            {education.map((edu, i) => (
              <div key={edu.id || i} className="cv-trad-entry cv-trad-entry--tight" data-block>
                <div className="cv-trad-entry-plain">{edu.degree}</div>
                <div className="cv-trad-entry-title">{edu.institution}</div>
                {edu.period && <div className="cv-trad-entry-period-line">{edu.period}</div>}
              </div>
            ))}
          </section>
        )}

        {certificates?.length > 0 && (
          <section className="cv-trad-section">
            <SectionTitle>{L.certificates}</SectionTitle>
            {certificates.map((c, i) => (
              <div key={c.id || i} className="cv-trad-entry cv-trad-entry--tight" data-block>
                <div className="cv-trad-entry-plain">{c.name}</div>
                <div className="cv-trad-entry-title">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </section>
        )}

        {groups.length > 0 && (
          <section className="cv-trad-section">
            <SectionTitle>{L.skills}</SectionTitle>
            {groups.map(g => (
              <div key={g.key} className="cv-trad-skill" data-block>
                <div className="cv-trad-skill-label">{g.label}:</div>
                <p className="cv-trad-text">{g.items.join(', ')}.</p>
              </div>
            ))}
          </section>
        )}

        <References title={L.work} items={refs.filter(r => r.type === 'work')} />
        <References title={L.personalRefs} items={refs.filter(r => r.type === 'personal')} />
        <References title={L.family} items={refs.filter(r => r.type === 'family')} />

        <footer className="cv-trad-signature" data-block>
          {p.signature
            ? <img src={p.signature} alt="" className="cv-trad-signature-img" />
            : <div className="cv-trad-signature-space" />}
          <div className="cv-trad-signature-line" />
          <div className="cv-trad-signature-name">{p.name}</div>
          {p.document_id && (
            <div className="cv-trad-signature-id">
              {L.idShort} {p.document_id}{p.document_place ? ` ${L.issuedIn} ${p.document_place}` : ''}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
