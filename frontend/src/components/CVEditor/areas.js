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
  health: {
    icon: 'fa-stethoscope',
    name: { es: 'Salud', en: 'Healthcare' },
    labels: {
      es: { technical: 'Competencias clínicas', databases: 'Procedimientos', devops: 'Normatividad y protocolos', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Clinical skills', databases: 'Procedures', devops: 'Regulations & protocols', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Enfermera profesional con 6 años de experiencia en..."',
      en: '"Registered nurse with 6 years of experience in..."',
    },
  },
  education: {
    icon: 'fa-chalkboard-user',
    name: { es: 'Educación y docencia', en: 'Education' },
    labels: {
      es: { technical: 'Áreas de enseñanza', databases: 'Metodologías', devops: 'Herramientas digitales', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Teaching subjects', databases: 'Methodologies', devops: 'Digital tools', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Docente de matemáticas con 8 años de experiencia en..."',
      en: '"Mathematics teacher with 8 years of experience in..."',
    },
  },
  sales: {
    icon: 'fa-chart-line',
    name: { es: 'Ventas y marketing', en: 'Sales & marketing' },
    labels: {
      es: { technical: 'Comerciales', databases: 'Herramientas y CRM', devops: 'Marketing digital', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Sales', databases: 'Tools & CRM', devops: 'Digital marketing', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Ejecutivo comercial con 5 años de experiencia en..."',
      en: '"Sales executive with 5 years of experience in..."',
    },
  },
  finance: {
    icon: 'fa-coins',
    name: { es: 'Finanzas y contabilidad', en: 'Finance & accounting' },
    labels: {
      es: { technical: 'Contables y financieras', databases: 'Software contable', devops: 'Normas (NIIF, tributaria)', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Accounting & finance', databases: 'Accounting software', devops: 'Standards (IFRS, tax)', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Contador público con 7 años de experiencia en..."',
      en: '"Certified accountant with 7 years of experience in..."',
    },
  },
  design: {
    icon: 'fa-pen-ruler',
    name: { es: 'Diseño y creatividad', en: 'Design & creative' },
    labels: {
      es: { technical: 'Diseño', databases: 'Software de diseño', devops: 'Especialidades', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Design', databases: 'Design software', devops: 'Specialties', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Diseñadora gráfica con 4 años de experiencia en..."',
      en: '"Graphic designer with 4 years of experience in..."',
    },
  },
  legal: {
    icon: 'fa-scale-balanced',
    name: { es: 'Derecho', en: 'Legal' },
    labels: {
      es: { technical: 'Áreas del derecho', databases: 'Herramientas', devops: 'Normatividad', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Practice areas', databases: 'Tools', devops: 'Regulations', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Abogado con 6 años de experiencia en..."',
      en: '"Lawyer with 6 years of experience in..."',
    },
  },
  construction: {
    icon: 'fa-helmet-safety',
    name: { es: 'Construcción y arquitectura', en: 'Construction & architecture' },
    labels: {
      es: { technical: 'Técnicas', databases: 'Software (CAD/BIM)', devops: 'Normas y seguridad', tools: 'Gestión de obra', languages: 'Idiomas' },
      en: { technical: 'Technical', databases: 'Software (CAD/BIM)', devops: 'Codes & safety', tools: 'Site management', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Arquitecto con 9 años de experiencia en..."',
      en: '"Architect with 9 years of experience in..."',
    },
  },
  logistics: {
    icon: 'fa-truck-fast',
    name: { es: 'Logística y operaciones', en: 'Logistics & operations' },
    labels: {
      es: { technical: 'Operativas', databases: 'Sistemas (ERP/WMS)', devops: 'Normas y certificaciones', tools: 'Gestión', languages: 'Idiomas' },
      en: { technical: 'Operations', databases: 'Systems (ERP/WMS)', devops: 'Standards & certifications', tools: 'Management', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Coordinador logístico con 5 años de experiencia en..."',
      en: '"Logistics coordinator with 5 years of experience in..."',
    },
  },
  service: {
    icon: 'fa-headset',
    name: { es: 'Atención al cliente / hotelería', en: 'Customer service & hospitality' },
    labels: {
      es: { technical: 'Servicio', databases: 'Herramientas', devops: 'Procesos', tools: 'Habilidades blandas', languages: 'Idiomas' },
      en: { technical: 'Service', databases: 'Tools', devops: 'Processes', tools: 'Soft skills', languages: 'Languages' },
    },
    fields: ['linkedin'],
    summaryExample: {
      es: '"Asesora de servicio al cliente con 3 años de experiencia en..."',
      en: '"Customer service advisor with 3 years of experience in..."',
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
