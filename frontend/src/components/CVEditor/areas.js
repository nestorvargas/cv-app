// Professional areas: each one adapts skill category names, optional fields and tip examples.
// The area is stored in personal_info.area; custom category names in skills._labels
// (templates read skills._labels and fall back to their default labels).

export const SKILL_KEYS = ['technical', 'databases', 'devops', 'tools', 'languages'];

export const AREAS = {
  tech: {
    icon: 'fa-laptop-code',
    name: { es: 'Tecnología', en: 'Technology' },
    labels: {
      es: { technical: 'Técnicas', databases: 'Bases de Datos', devops: 'DevOps', tools: 'Gestión', languages: 'Idiomas' },
      en: { technical: 'Technical', databases: 'Databases', devops: 'DevOps', tools: 'Management', languages: 'Languages' },
    },
    fields: ['linkedin', 'github'],
    summaryExample: {
      es: '"Desarrollador full stack con 8 años de experiencia en..."',
      en: '"Full stack developer with 8 years of experience in..."',
    },
  },
  engineering: {
    icon: 'fa-industry',
    name: { es: 'Ingeniería y calidad', en: 'Engineering & quality' },
    labels: {
      es: { technical: 'Técnicas', databases: 'Herramientas y software', devops: 'Normas y certificaciones', tools: 'Gestión', languages: 'Idiomas' },
      en: { technical: 'Technical', databases: 'Tools & software', devops: 'Standards & certifications', tools: 'Management', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Ingeniero de procesos con 5 años de experiencia en..."',
      en: '"Process engineer with 5 years of experience in..."',
    },
  },
  business: {
    icon: 'fa-briefcase',
    name: { es: 'Administrativa', en: 'Business & admin' },
    labels: {
      es: { technical: 'Competencias', databases: 'Herramientas ofimáticas', devops: 'Software', tools: 'Gestión', languages: 'Idiomas' },
      en: { technical: 'Competencies', databases: 'Office tools', devops: 'Software', tools: 'Management', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Profesional administrativo con 6 años de experiencia en..."',
      en: '"Administrative professional with 6 years of experience in..."',
    },
  },
  general: {
    icon: 'fa-user-tie',
    name: { es: 'General', en: 'General' },
    labels: {
      es: { technical: 'Habilidades', databases: 'Herramientas', devops: 'Otros conocimientos', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Skills', databases: 'Tools', devops: 'Other knowledge', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Profesional con 4 años de experiencia en..."',
      en: '"Professional with 4 years of experience in..."',
    },
  },
};

// Area of a CV: explicit choice, or inferred from existing data for older CVs
export function getArea(cv) {
  const explicit = cv?.personal_info?.area;
  if (AREAS[explicit]) return explicit;
  const s = cv?.skills || {};
  if (cv?.personal_info?.github || s.databases?.length || s.devops?.length) return 'tech';
  return 'general';
}

export function getSkillLabels(cv, lang) {
  const L = lang === 'en' ? 'en' : 'es';
  return { ...AREAS[getArea(cv)].labels[L], ...(cv?.skills?._labels || {}) };
}
