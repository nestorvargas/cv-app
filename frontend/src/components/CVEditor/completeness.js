// CV completeness, shared by the editor (progress bar, tips) and the CV list (% per language).
// Weighted and proportional, so partial content counts partially (100 points in total).

// Skills hold arrays per category (other keys, like custom labels, are ignored)
export const countSkills = skills =>
  Object.values(skills || {}).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0);

const filled = v => typeof v === 'string' ? v.trim().length > 0 : !!v;
const ratio = (value, target) => Math.min(1, value / target);

// Checks in the order the tip suggests them; `score` out of `max`
export function getChecks(cv, isEn) {
  const p = cv.personal_info || {};
  const personalFields = ['name', 'title', 'email', 'phone', 'location'];
  const personalFilled = personalFields.filter(k => filled(p[k])).length;

  const experience = cv.experience || [];
  const completeJobs = experience.filter(e =>
    filled(e.position) && filled(e.company) && filled(e.period) && (e.description || '').trim().length >= 100
  ).length;

  const completeEducation = (cv.education || []).filter(e => filled(e.degree) && filled(e.institution)).length;
  const summaryLength = (cv.summary || '').trim().length;
  const skillsCount = countSkills(cv.skills);
  const certificates = (cv.certificates || []).filter(c => filled(c.name)).length;

  const checks = [
    { tab: 'personal', max: 15, score: 15 * ratio(personalFilled, personalFields.length),
      tip: isEn ? 'Complete name, title, email, phone and city' : 'Completa nombre, título, correo, teléfono y ciudad' },
    { tab: 'summary', max: 15, score: 15 * ratio(summaryLength, 400),
      tip: isEn ? 'Write a summary of at least 400 characters' : 'Escribe un perfil de al menos 400 caracteres' },
    { tab: 'experience', max: 25, score: 25 * ratio(completeJobs, 2),
      tip: isEn
        ? 'Add 2 jobs with position, company, period and a description of 100+ characters'
        : 'Agrega 2 experiencias con cargo, empresa, periodo y una descripción de 100+ caracteres' },
    { tab: 'education', max: 15, score: 15 * ratio(completeEducation, 1),
      tip: isEn ? 'Add your education (degree and institution)' : 'Agrega tu educación (título e institución)' },
    { tab: 'skills', max: 15, score: 15 * ratio(skillsCount, 8),
      tip: isEn ? 'Add at least 8 skills' : 'Agrega al menos 8 habilidades' },
    { tab: 'certificates', max: 10, score: 10 * ratio(certificates, 1),
      tip: isEn ? 'Add a certificate or course' : 'Agrega un certificado o curso' },
    { tab: 'photo', max: 5, score: cv.profile_image ? 5 : 0,
      tip: isEn ? 'Upload a profile photo' : 'Sube una foto de perfil' },
  ];
  return checks.map(c => ({ ...c, done: c.score >= c.max - 0.001 }));
}

export function getCompleteness(cv) {
  if (!cv) return 0;
  const checks = getChecks(cv, false);
  const total = checks.reduce((n, c) => n + c.max, 0);
  return Math.round((checks.reduce((n, c) => n + c.score, 0) / total) * 100);
}
