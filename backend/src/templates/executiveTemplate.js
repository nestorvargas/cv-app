function buildExecutiveHtml(cvData, imageBase64) {
  const { personal_info, summary, experience, education, skills, certificates } = cvData;
  const lang = cvData.language;

  const labelMap = {
    es: {
      contact: 'CONTACTO',
      skills: 'HABILIDADES',
      technical: 'Técnicas',
      databases: 'Bases de Datos',
      devops: 'DevOps & Herramientas',
      tools: 'Gestión',
      languages: 'Idiomas',
      profile: 'Perfil Profesional',
      experience: 'Experiencia Laboral',
      education: 'Educación',
      certificates: 'Certificados',
    },
    en: {
      contact: 'CONTACT',
      skills: 'SKILLS',
      technical: 'Technical',
      databases: 'Databases',
      devops: 'DevOps & Tools',
      tools: 'Management',
      languages: 'Languages',
      profile: 'Professional Profile',
      experience: 'Work Experience',
      education: 'Education',
      certificates: 'Certificates',
    },
  };

  const labels = labelMap[lang] || labelMap['es'];

  const renderSkillBadges = (items) =>
    items.map(s => `<span class="skill-badge">${s}</span>`).join('');

  const renderExperience = (exp) =>
    exp.map(e => `
      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-company">${e.company}</span>
          <span class="exp-period">${e.period}</span>
        </div>
        <div class="exp-position">${e.position}</div>
        <div class="exp-desc">${e.description}</div>
      </div>
    `).join('');

  const renderEducation = (edu) =>
    edu.map(e => `
      <div class="edu-item">
        <div class="edu-institution">${e.institution}</div>
        <div class="edu-degree">${e.degree}</div>
        ${e.period ? `<div class="edu-period">${e.period}</div>` : ''}
      </div>
    `).join('');

  const renderCertificates = (certs) =>
    certs.map(c => `
      <div class="cert-item">
        <span class="cert-icon">&#127885;</span>
        <div class="cert-info">
          <div class="cert-name">${c.name}</div>
          <div class="cert-meta">${c.issuer}${c.year ? ' · ' + c.year : ''}</div>
        </div>
      </div>
    `).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { margin: 14mm 0 10mm 0; }
  @page :first { margin: 0; }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /*
    Sidebar color across all pages:
    - Top part: full-width #1a252f (header)
    - After header: 30% #2c3e50 | 70% white
    We use a layered gradient on html to approximate this.
    The header covers the top ~120px, sidebar starts below.
    Using a simple left-strip gradient handles page 2+ cleanly.
  */
  html {
    background: linear-gradient(to right, #2c3e50 30%, #ffffff 30%);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #222; background: transparent; }

  /* Page-break rules */
  .exp-item  { page-break-inside: avoid; break-inside: avoid; }
  .edu-item  { page-break-inside: avoid; break-inside: avoid; }
  .section-title { page-break-after: avoid; break-after: avoid; }

  .cv-wrapper {
    display: flex;
    flex-direction: column;
    width: 210mm;
  }

  /* HEADER: full-width, centered — covers html gradient on page 1 */
  .header {
    background: #1a252f;
    color: white;
    padding: 34px 36px 26px;
    text-align: center;
  }

  .cv-name {
    font-size: 24pt;
    font-weight: 700;
    letter-spacing: 2px;
    color: white;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .cv-title {
    font-size: 10.5pt;
    color: #bdc3c7;
    font-weight: 400;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
  }

  .header-accent-line {
    width: 70px;
    height: 3px;
    background: #8e44ad;
    border-radius: 2px;
    margin: 0 auto;
  }

  /* BODY: sidebar + main */
  .body {
    display: flex;
    flex: 1;
  }

  /* SIDEBAR (30%) — transparent, html gradient provides the color */
  .sidebar {
    width: 30%;
    background: transparent;
    color: #ecf0f1;
    display: flex;
    flex-direction: column;
  }

  .photo-area {
    background: #1a252f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    min-height: 135px;
  }

  .photo-area img {
    width: 95px;
    height: 95px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #8e44ad;
    box-shadow: 0 4px 14px rgba(142,68,173,0.4);
  }

  .photo-placeholder {
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: #34495e;
    border: 3px solid #8e44ad;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #7f8c8d;
  }

  .sidebar-section { padding: 16px 18px; }
  .sidebar-section + .sidebar-section { border-top: 1px solid #34495e; }

  .sidebar-title {
    font-size: 9.5pt;
    font-weight: 700;
    letter-spacing: 2px;
    color: #8e44ad;
    margin-bottom: 11px;
    text-transform: uppercase;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    margin-bottom: 8px;
    font-size: 9pt;
    color: #bdc3c7;
    word-break: break-all;
  }

  .contact-icon { font-size: 10pt; min-width: 14px; flex-shrink: 0; }

  .skills-group { margin-bottom: 11px; }
  .skills-group-title {
    font-size: 8.5pt;
    color: #95a5a6;
    font-weight: 600;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .skill-badge {
    display: inline-block;
    background: #34495e;
    color: #ecf0f1;
    border-radius: 10px;
    padding: 2px 9px;
    font-size: 8.5pt;
    margin: 2px 2px 2px 0;
    border: 1px solid #3d566e;
    font-weight: 500;
  }

  /* MAIN CONTENT (70%) */
  .main {
    width: 70%;
    background: white;
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
  }

  .section { margin-bottom: 20px; }

  .section-title {
    font-size: 10.5pt;
    font-weight: 700;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding-bottom: 5px;
    border-bottom: 2px solid #8e44ad;
    margin-bottom: 12px;
  }

  .summary-text { font-size: 9.5pt; line-height: 1.7; color: #444; text-align: justify; }

  .exp-item { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
  .exp-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .exp-company { font-weight: 700; font-size: 10pt; color: #1a252f; }
  .exp-period { font-size: 8.5pt; color: #7f8c8d; white-space: nowrap; margin-left: 8px; }
  .exp-position { font-size: 9.5pt; color: #8e44ad; font-weight: 600; margin: 4px 0 5px; }
  .exp-desc { font-size: 9pt; line-height: 1.65; color: #555; text-align: justify; }

  .edu-item { margin-bottom: 12px; }
  .edu-institution { font-weight: 700; font-size: 9.5pt; color: #1a252f; }
  .edu-degree { font-size: 9pt; color: #555; margin-top: 2px; }
  .edu-period { font-size: 8.5pt; color: #7f8c8d; }

  .cert-item { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 9px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; }
  .cert-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cert-icon { font-size: 10pt; flex-shrink: 0; margin-top: 1px; }
  .cert-info { flex: 1; }
  .cert-name { font-weight: 600; font-size: 9.5pt; color: #1a252f; }
  .cert-meta { font-size: 8.5pt; color: #8e44ad; margin-top: 2px; }
</style>
</head>
<body>
<div class="cv-wrapper">
  <!-- HEADER (full-width, centered) -->
  <div class="header">
    <div class="cv-name">${personal_info.name || ''}</div>
    <div class="cv-title">${personal_info.title || ''}</div>
    <div class="header-accent-line"></div>
  </div>

  <!-- BODY: sidebar + main -->
  <div class="body">
    <!-- LEFT SIDEBAR (30%) -->
    <div class="sidebar">
      <div class="photo-area">
        ${imageBase64
          ? `<img src="${imageBase64}" alt="Profile" />`
          : `<div class="photo-placeholder">&#128100;</div>`
        }
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">${labels.contact}</div>
        <div class="contact-item"><span class="contact-icon">&#128222;</span>${personal_info.phone || ''}</div>
        <div class="contact-item"><span class="contact-icon">&#9993;</span>${personal_info.email || ''}</div>
        <div class="contact-item"><span class="contact-icon">&#128205;</span>${personal_info.location || ''}</div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">${labels.skills}</div>
        ${skills.technical ? `<div class="skills-group"><div class="skills-group-title">${labels.technical}</div>${renderSkillBadges(skills.technical)}</div>` : ''}
        ${skills.databases ? `<div class="skills-group"><div class="skills-group-title">${labels.databases}</div>${renderSkillBadges(skills.databases)}</div>` : ''}
        ${skills.devops ? `<div class="skills-group"><div class="skills-group-title">${labels.devops}</div>${renderSkillBadges(skills.devops)}</div>` : ''}
        ${skills.tools ? `<div class="skills-group"><div class="skills-group-title">${labels.tools}</div>${renderSkillBadges(skills.tools)}</div>` : ''}
        ${skills.languages ? `<div class="skills-group"><div class="skills-group-title">${labels.languages}</div>${renderSkillBadges(skills.languages)}</div>` : ''}
      </div>
    </div>

    <!-- RIGHT MAIN (70%) -->
    <div class="main">
      <div class="section">
        <div class="section-title">${labels.profile}</div>
        <div class="summary-text">${summary || ''}</div>
      </div>

      <div class="section">
        <div class="section-title">${labels.experience}</div>
        ${renderExperience(experience || [])}
      </div>

      <div class="section">
        <div class="section-title">${labels.education}</div>
        ${renderEducation(education || [])}
      </div>

      ${certificates?.length > 0 ? `
      <div class="section">
        <div class="section-title">${labels.certificates}</div>
        ${renderCertificates(certificates)}
      </div>` : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}

module.exports = { buildExecutiveHtml };
