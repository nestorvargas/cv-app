function buildModernHtml(cvData, imageBase64, accentColor = '#e67e22', bgColor = '#1a252f') {
  const { personal_info, summary, experience, education, skills, certificates } = cvData;
  const lang = cvData.language;

  const labelMap = {
    es: {
      contact: 'CONTACTO',
      skills: 'HABILIDADES',
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
      contact: 'CONTACT',
      skills: 'SKILLS',
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

  const renderExpItem = (e) => `
      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-company">${e.company}</span>
          <span class="exp-period">${e.period}</span>
        </div>
        <div class="exp-position">${e.position}</div>
        <p class="exp-desc">${e.description}</p>
      </div>`;

  const renderEduItem = (e) => `
      <div class="edu-item">
        <div class="edu-institution">${e.institution}</div>
        <div class="edu-degree">${e.degree}</div>
        ${e.period ? `<div class="edu-period">${e.period}</div>` : ''}
      </div>`;

  const renderCertItem = (c) => `
      <div class="cert-item">
        <span class="cert-icon"><i class="fa-solid fa-award"></i></span>
        <div class="cert-info">
          <div class="cert-name">${c.name}</div>
          <div class="cert-meta">${c.issuer}${c.year ? ' · ' + c.year : ''}</div>
        </div>
      </div>`;

  const renderSection = (title, items, renderItem) => {
    if (!items?.length) return '';
    const [first, ...rest] = items;
    return `
      <div class="section">
        <div style="page-break-inside:avoid;break-inside:avoid;">
          <div class="section-title">${title}</div>
          ${renderItem(first)}
        </div>
        ${rest.map(renderItem).join('')}
      </div>`;
  };

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<style>
  @page { margin: 6mm 0 6mm 0; }
  @page :first { margin: 0 0 6mm 0; }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.65; color: #222; background: white; }

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
    padding: 32px 36px;
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .photo-wrap { flex-shrink: 0; }

  .photo-wrap img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${accentColor};
    box-shadow: 0 4px 16px rgba(230,126,34,0.4);
  }

  .photo-placeholder {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    border: 3px solid ${accentColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44px;
    color: #7f8c8d;
  }

  .header-info { flex: 1; }
  .cv-name { font-size: 28px; font-weight: 700; color: white; line-height: 1.15; letter-spacing: -0.3px; margin-bottom: 8px; }
  .cv-title { font-size: 13px; color: ${accentColor}; margin-top: 0; font-weight: 500; line-height: 1.5; }

  .header-accent {
    width: 3px;
    height: 80px;
    background: linear-gradient(180deg, ${accentColor}, transparent);
    border-radius: 2px;
    flex-shrink: 0;
  }

  /* BODY: 2-column flex — grid causes duplication bugs in Puppeteer print */
  .body {
    display: flex;
    align-items: stretch;
  }

  .col {
    width: 50%;
    padding: 28px;
  }

  .col-left {
    padding-right: 20px;
    border-right: 1px solid #e9ecef;
  }

  .col-right {
    padding-left: 20px;
    background: #fafbfc;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .section { margin-bottom: 26px; }

  .section-title {
    font-size: 11.5px;
    font-weight: 700;
    color: ${accentColor};
    text-transform: uppercase;
    letter-spacing: 2px;
    padding-bottom: 6px;
    border-bottom: 2px solid ${accentColor};
    margin-bottom: 12px;
    position: relative;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 40%;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #fafbfc);
  }

  .summary-text { font-size: 12.5px; line-height: 1.7; color: #444; text-align: justify; }

  .exp-item { margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px dashed #e0e0e0; }
  .exp-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 4px; }
  .exp-company { font-weight: 700; font-size: 13.5px; color: #1a252f; }
  .exp-period {
    font-size: 11px;
    color: #95a5a6;
    background: #f0f2f4;
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
  }
  .exp-position { font-size: 12px; color: ${accentColor}; font-weight: 600; margin: 4px 0 7px; }
  .exp-desc { font-size: 11.5px; line-height: 1.65; color: #555; text-align: justify; }

  /* Skills with dot badges */
  .skill-cat { margin-bottom: 14px; }
  .skill-cat-label { font-size: 10.5px; font-weight: 700; color: #7f8c8d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 7px; }
  .skill-dots { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill-dot-item {
    display: flex;
    align-items: center;
    gap: 5px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11.5px;
    color: #333;
  }
  .skill-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${accentColor};
    flex-shrink: 0;
    display: inline-block;
  }

  .edu-item { margin-bottom: 14px; padding-left: 12px; border-left: 3px solid ${accentColor}; }
  .edu-institution { font-weight: 700; font-size: 13px; color: #1a252f; }
  .edu-degree { font-size: 12px; color: #555; margin-top: 2px; }
  .edu-period { font-size: 11px; color: #95a5a6; margin-top: 2px; }

  .cert-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 9px; padding-bottom: 8px; border-bottom: 1px dashed #e0e0e0; }
  .cert-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cert-icon { width: 18px; text-align: center; font-size: 13px; color: ${accentColor}; flex-shrink: 0; margin-top: 2px; line-height: 1; }
  .cert-info { flex: 1; }
  .cert-name { font-weight: 600; font-size: 12px; color: #1a252f; }
  .cert-meta { font-size: 11px; color: ${accentColor}; margin-top: 2px; }

  .contact-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 12.5px; color: #444; word-break: break-all; }
  .contact-icon { width: 16px; text-align: center; font-size: 12px; color: ${accentColor}; flex-shrink: 0; margin-top: 2px; line-height: 1; }
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

  <!-- BODY: 2-column grid -->
  <div class="body">
    <!-- LEFT: Profile + Experience -->
    <div class="col col-left">
      ${summary ? `
      <div class="section">
        <div style="page-break-inside:avoid;break-inside:avoid;">
          <div class="section-title">${labels.profile}</div>
          <p class="summary-text">${summary}</p>
        </div>
      </div>` : ''}

      ${renderSection(labels.experience, experience, renderExpItem)}
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

      ${renderSection(labels.education, education, renderEduItem)}
      ${renderSection(labels.certificates, certificates, renderCertItem)}

      <div class="section">
        <div style="page-break-inside:avoid;break-inside:avoid;">
          <div class="section-title">${labels.contact}</div>
          ${personal_info.phone ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-phone"></i></span>${personal_info.phone}</div>` : ''}
          ${personal_info.email ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-envelope"></i></span>${personal_info.email}</div>` : ''}
          ${personal_info.location ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>${personal_info.location}</div>` : ''}
          ${personal_info.linkedin ? `<div class="contact-item"><span class="contact-icon"><i class="fa-brands fa-linkedin"></i></span><span style="word-break:break-all;">${personal_info.linkedin}</span></div>` : ''}
          ${personal_info.github ? `<div class="contact-item"><span class="contact-icon"><i class="fa-brands fa-github"></i></span><span style="word-break:break-all;">${personal_info.github}</span></div>` : ''}
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}

module.exports = { buildModernHtml };
