function buildModernHtml(cvData, imageBase64, accentColor = '#e67e22', bgColor = '#1a252f') {
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

  const renderSkillCategory = (title, items) => {
    if (!items || items.length === 0) return '';
    const dots = items.map(s => `
      <div class="skill-dot-item">
        <span class="skill-dot"></span>
        ${s}
      </div>
    `).join('');
    return `
      <div class="skill-cat">
        <div class="skill-cat-label">${title}</div>
        <div class="skill-dots">${dots}</div>
      </div>
    `;
  };

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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<style>
  @page { margin: 14mm 0 10mm 0; }
  @page :first { margin: 0; }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #222; background: white; }

  /* Page-break rules */
  .exp-item  { page-break-inside: avoid; break-inside: avoid; }
  .edu-item  { page-break-inside: avoid; break-inside: avoid; }
  .skill-cat { page-break-inside: avoid; break-inside: avoid; }
  .section-title { page-break-after: avoid; break-after: avoid; }

  .cv-wrapper {
    display: flex;
    flex-direction: column;
    width: 210mm;
  }

  /* HEADER */
  .header {
    background: ${bgColor};
    color: white;
    padding: 26px 32px;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .photo-wrap { flex-shrink: 0; }

  .photo-wrap img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${accentColor};
    box-shadow: 0 4px 14px rgba(230,126,34,0.4);
  }

  .photo-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    border: 3px solid ${accentColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
    color: #7f8c8d;
  }

  .header-info { flex: 1; }
  .cv-name { font-size: 22pt; font-weight: 700; color: white; line-height: 1.1; }
  .cv-title { font-size: 10pt; color: ${accentColor}; margin-top: 7px; font-weight: 500; }

  .header-accent {
    width: 3px;
    height: 70px;
    background: linear-gradient(180deg, ${accentColor}, transparent);
    border-radius: 2px;
    flex-shrink: 0;
  }

  /* BODY: 2-column */
  .body {
    display: flex;
    flex: 1;
  }

  .col {
    padding: 22px 24px;
    flex: 1;
  }

  .col-left {
    border-right: 1px solid #e9ecef;
  }

  .col-right {
    background: #fafbfc;
    -webkit-print-color-adjust: exact;
  }

  .section { margin-bottom: 20px; }

  .section-title {
    font-size: 10pt;
    font-weight: 700;
    color: ${accentColor};
    text-transform: uppercase;
    letter-spacing: 2px;
    padding-bottom: 5px;
    border-bottom: 2px solid ${accentColor};
    margin-bottom: 12px;
  }

  .summary-text { font-size: 9.5pt; line-height: 1.7; color: #444; text-align: justify; }

  .exp-item { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px dashed #e0e0e0; }
  .exp-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 4px; }
  .exp-company { font-weight: 700; font-size: 10pt; color: #1a252f; }
  .exp-period {
    font-size: 8.5pt;
    color: #95a5a6;
    background: #f0f2f4;
    padding: 2px 7px;
    border-radius: 8px;
    white-space: nowrap;
  }
  .exp-position { font-size: 9.5pt; color: ${accentColor}; font-weight: 600; margin: 4px 0 5px; }
  .exp-desc { font-size: 9pt; line-height: 1.65; color: #555; text-align: justify; }

  /* Skills with dot badges */
  .skill-cat { margin-bottom: 12px; }
  .skill-cat-label { font-size: 8.5pt; font-weight: 700; color: #7f8c8d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .skill-dots { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-dot-item {
    display: flex;
    align-items: center;
    gap: 5px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 18px;
    padding: 3px 9px;
    font-size: 8.5pt;
    color: #333;
  }
  .skill-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${accentColor};
    flex-shrink: 0;
    display: inline-block;
  }

  .edu-item { margin-bottom: 12px; padding-left: 10px; border-left: 3px solid ${accentColor}; }
  .edu-institution { font-weight: 700; font-size: 9.5pt; color: #1a252f; }
  .edu-degree { font-size: 9pt; color: #555; margin-top: 2px; }
  .edu-period { font-size: 8.5pt; color: #95a5a6; margin-top: 2px; }

  .cert-item { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 9px; padding-bottom: 8px; border-bottom: 1px dashed #e0e0e0; }
  .cert-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cert-icon { width: 17px; text-align: center; font-size: 10pt; color: ${accentColor}; flex-shrink: 0; margin-top: 1px; line-height: 1; }
  .cert-info { flex: 1; }
  .cert-name { font-weight: 600; font-size: 9pt; color: #1a252f; }
  .cert-meta { font-size: 8.5pt; color: ${accentColor}; margin-top: 2px; }

  .contact-item { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 7px; font-size: 9.5pt; color: #444; word-break: break-all; }
  .contact-icon { width: 16px; text-align: center; font-size: 10pt; color: ${accentColor}; flex-shrink: 0; line-height: 1; }
</style>
</head>
<body>
<div class="cv-wrapper">
  <!-- HEADER -->
  <div class="header">
    <div class="photo-wrap">
      ${imageBase64
        ? `<img src="${imageBase64}" alt="Profile" />`
        : `<div class="photo-placeholder"><i class="fa-solid fa-user"></i></div>`
      }
    </div>
    <div class="header-info">
      <div class="cv-name">${personal_info.name || ''}</div>
      <div class="cv-title">${personal_info.title || ''}</div>
    </div>
    <div class="header-accent"></div>
  </div>

  <!-- BODY: 2-column -->
  <div class="body">
    <!-- LEFT: Profile + Experience -->
    <div class="col col-left">
      <div class="section">
        <div class="section-title">${labels.profile}</div>
        <div class="summary-text">${summary || ''}</div>
      </div>

      <div class="section">
        <div class="section-title">${labels.experience}</div>
        ${renderExperience(experience || [])}
      </div>
    </div>

    <!-- RIGHT: Skills + Education + Contact -->
    <div class="col col-right">
      <div class="section">
        <div class="section-title">${labels.skills}</div>
        ${renderSkillCategory(labels.technical, skills.technical)}
        ${renderSkillCategory(labels.databases, skills.databases)}
        ${renderSkillCategory(labels.devops, skills.devops)}
        ${renderSkillCategory(labels.tools, skills.tools)}
        ${renderSkillCategory(labels.languages, skills.languages)}
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

      <div class="section">
        <div class="section-title">${labels.contact}</div>
        <div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-phone"></i></span>${personal_info.phone || ''}</div>
        <div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-envelope"></i></span>${personal_info.email || ''}</div>
        <div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>${personal_info.location || ''}</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}

module.exports = { buildModernHtml };
