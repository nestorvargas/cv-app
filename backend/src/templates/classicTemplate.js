function buildClassicHtml(cvData, imageBase64, accentColor = '#1abc9c', bgColor = '#2c3e50') {
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
        <span class="cert-icon"><i class="fa-solid fa-award"></i></span>
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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<style>
  @page { margin: 14mm 0 10mm 0; }
  @page :first { margin: 0; }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Sidebar color continues across ALL pages via html background */
  html {
    background: linear-gradient(to right, ${bgColor} 35%, #ffffff 35%);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #222; background: transparent; }

  .cv-wrapper { display: flex; width: 210mm; }

  /* Page-break rules: keep items from splitting mid-text */
  .exp-item  { page-break-inside: avoid; break-inside: avoid; }
  .edu-item  { page-break-inside: avoid; break-inside: avoid; }
  .cert-item { page-break-inside: avoid; break-inside: avoid; }
  .section-title { page-break-after: avoid; break-after: avoid; }

  /* LEFT SIDEBAR */
  .sidebar {
    width: 35%;
    background: transparent;   /* html gradient provides the color */
    color: #ecf0f1;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .photo-area {
    background: rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 16px;
    min-height: 155px;
  }

  .photo-area img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${accentColor};
    box-shadow: 0 4px 14px rgba(26,188,156,0.35);
  }

  .photo-placeholder {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: #34495e;
    border: 3px solid ${accentColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
    color: #7f8c8d;
  }

  .sidebar-section { padding: 18px 20px; }
  .sidebar-section + .sidebar-section { border-top: 1px solid #34495e; }

  .sidebar-title {
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 2px;
    color: ${accentColor};
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
    font-size: 9.5pt;
    color: #bdc3c7;
    word-break: break-all;
  }

  .contact-icon { width: 16px; text-align: center; margin-right: 8px; color: ${accentColor}; font-size: 10pt; flex-shrink: 0; line-height: 1; }

  .skills-group { margin-bottom: 13px; }
  .skills-group-title {
    font-size: 9pt;
    color: #95a5a6;
    font-weight: 600;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .skill-badge {
    display: inline-block;
    background: #34495e;
    color: #ecf0f1;
    border-radius: 12px;
    padding: 3px 10px;
    font-size: 9pt;
    margin: 2px 3px 2px 0;
    border: 1px solid #3d566e;
    font-weight: 500;
  }

  /* RIGHT MAIN CONTENT */
  .main {
    width: 65%;
    background: white;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .header-area {
    background: ${bgColor};
    color: white;
    padding: 32px 30px 26px;
    position: relative;
  }

  .header-area::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 30px;
    right: 30px;
    height: 3px;
    background: linear-gradient(90deg, ${accentColor}, transparent);
    border-radius: 2px;
  }

  .cv-name { font-size: 22pt; font-weight: 700; line-height: 1.1; color: white; }
  .cv-title { font-size: 10.5pt; color: ${accentColor}; margin-top: 8px; line-height: 1.5; font-weight: 500; }

  .main-content { padding: 24px 30px; flex: 1; }

  .section { margin-bottom: 22px; }
  .section-title {
    font-size: 11pt;
    font-weight: 700;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    padding-bottom: 6px;
    border-bottom: 2.5px solid ${accentColor};
    margin-bottom: 13px;
  }

  .summary-text { font-size: 10pt; line-height: 1.7; color: #444; text-align: justify; }

  .exp-item { margin-bottom: 15px; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .exp-company { font-weight: 700; font-size: 10.5pt; color: #2c3e50; }
  .exp-period { font-size: 9pt; color: #7f8c8d; white-space: nowrap; margin-left: 8px; }
  .exp-position { font-size: 9.5pt; color: ${accentColor}; font-weight: 600; margin: 4px 0 6px; }
  .exp-desc { font-size: 9.5pt; line-height: 1.65; color: #555; text-align: justify; }

  .edu-item { margin-bottom: 13px; }
  .edu-institution { font-weight: 700; font-size: 10pt; color: #2c3e50; }
  .edu-degree { font-size: 9.5pt; color: #555; margin-top: 2px; }
  .edu-period { font-size: 9pt; color: #7f8c8d; }

  .cert-item { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 9px; padding-bottom: 8px; border-bottom: 1px dashed #e0e0e0; }
  .cert-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cert-icon { width: 17px; text-align: center; font-size: 10pt; color: ${accentColor}; flex-shrink: 0; margin-top: 1px; line-height: 1; }
  .cert-info { flex: 1; }
  .cert-name { font-weight: 600; font-size: 9.5pt; color: #2c3e50; }
  .cert-meta { font-size: 8.5pt; color: ${accentColor}; margin-top: 2px; }
</style>
</head>
<body>
<div class="cv-wrapper">
  <!-- LEFT SIDEBAR -->
  <div class="sidebar">
    <div class="photo-area">
      ${imageBase64
        ? `<img src="${imageBase64}" alt="Profile" />`
        : `<div class="photo-placeholder"><i class="fa-solid fa-user"></i></div>`
      }
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">${labels.contact}</div>
      <div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-phone"></i></span>${personal_info.phone || ''}</div>
      <div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-envelope"></i></span>${personal_info.email || ''}</div>
      <div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>${personal_info.location || ''}</div>
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

  <!-- RIGHT MAIN CONTENT -->
  <div class="main">
    <div class="header-area">
      <div class="cv-name">${personal_info.name || ''}</div>
      <div class="cv-title">${personal_info.title || ''}</div>
    </div>

    <div class="main-content">
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

module.exports = { buildClassicHtml };
