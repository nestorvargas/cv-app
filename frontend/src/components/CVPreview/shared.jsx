import React from 'react';

// Labels and helpers shared by the newer templates (elegant, timeline, compact, corporate)
export const LABELS = {
  es: {
    contact: 'Contacto',
    skills: 'Habilidades',
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
    contact: 'Contact',
    skills: 'Skills',
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

export const getLabels = (lang) => LABELS[lang] || LABELS.es;

// Non-empty skill groups, using the CV's custom category names when set
export function skillGroups(skills, L) {
  return ['technical', 'databases', 'devops', 'tools', 'languages']
    .map(key => ({ key, label: skills?._labels?.[key] || L[key], items: skills?.[key] || [] }))
    .filter(g => g.items.length > 0);
}

export function contactItems(personal_info = {}) {
  return [
    { key: 'phone', icon: 'fa-solid fa-phone', value: personal_info.phone },
    { key: 'email', icon: 'fa-solid fa-envelope', value: personal_info.email, breakAll: true },
    { key: 'location', icon: 'fa-solid fa-location-dot', value: personal_info.location },
    { key: 'linkedin', icon: 'fa-brands fa-linkedin', value: personal_info.linkedin, breakAll: true },
    { key: 'github', icon: 'fa-brands fa-github', value: personal_info.github, breakAll: true },
  ].filter(c => c.value);
}

export function ContactList({ personal_info, className }) {
  return (
    <ul className={className}>
      {contactItems(personal_info).map(c => (
        <li key={c.key}>
          <i className={c.icon} />
          <span style={c.breakAll ? { wordBreak: 'break-all' } : undefined}>{c.value}</span>
        </li>
      ))}
    </ul>
  );
}
