function buildCreativeHtml(cvData, imageBase64, accentColor = '#e94560', bgColor = '#1a1a2e') {
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

  const renderSkillGroup = (title, items) => {
    if (!items || items.length === 0) return '';
    const badges = items.map(s => `<span class="skill-badge">${s}</span>`).join('');
    return `
      <div class="skill-group">
        <div class="skill-group-title">${title}</div>
        <div class="skill-badges">${badges}</div>
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

  /* Right sidebar background via position:fixed — repeats on every page including margin areas */
  html { background: white; }
  .cv-page-bg {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to right, #ffffff 70%, #f4f6f8 70%);
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    z-index: -1;
  }

  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.65; color: #222; background: transparent; }

  /* Page-break rules */
  .exp-item  { page-break-inside: avoid; break-inside: avoid; }
  .edu-item  { page-break-inside: avoid; break-inside: avoid; }
  .skill-group { page-break-inside: avoid; break-inside: avoid; }
  .section-title { page-break-after: avoid; break-after: avoid; }

  .cv-wrapper { display: flex; flex-direction: column; width: 210mm; }

  /* HEADER: photo left + name right */
  .header {
    background: ${bgColor};
    display: flex;
    align-items: center;
    padding: 28px 32px;
    gap: 28px;
  }

  .photo-area { flex-shrink: 0; }

  .photo-area img {
    width: 110px;
    height: 110px;
    border-radius: 12px;
    object-fit: cover;
    border: 3px solid ${accentColor};
    box-shadow: 0 4px 16px rgba(233, 69, 96, 0.4);
  }

  .photo-placeholder {
    width: 110px;
    height: 110px;
    border-radius: 12px;
    background: rgba(255,255,255,0.12);
    border: 3px solid ${accentColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44px;
    color: #7f8c8d;
  }

  .header-info { flex: 1; }

  .cv-name {
    font-size: 28px;
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .cv-title {
    font-size: 13px;
    color: #bdc3c7;
    margin-bottom: 14px;
    font-weight: 400;
    letter-spacing: 0.4px;
  }

  .header-accent {
    width: 56px;
    height: 3px;
    background: ${accentColor};
    border-radius: 2px;
    margin-bottom: 12px;
  }

  .header-contacts {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .header-contact-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #95a5a6;
  }

  .header-contact-icon { width: 14px; text-align: center; font-size: 11px; color: ${accentColor}; line-height: 1; }

  /* BODY */
  .body { display: flex; flex: 1; align-items: start; }

  /* MAIN CONTENT (70%) */
  .main {
    width: 70%;
    background: transparent;
    padding: 24px 26px 24px 32px;
    display: flex;
    flex-direction: column;
  }

  .section { margin-bottom: 22px; }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: #1a1a2e;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding-bottom: 5px;
    border-bottom: 2px solid ${accentColor};
    margin-bottom: 13px;
  }

  .summary-text { font-size: 12.5px; line-height: 1.7; color: #444; text-align: justify; }

  .exp-item {
    margin-bottom: 16px;
    padding-bottom: 14px;
    padding-left: 12px;
    border-left: 3px solid ${accentColor};
    border-bottom: 1px solid #f0f0f0;
  }

  .exp-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 4px; }
  .exp-company { font-weight: 700; font-size: 13.5px; color: #1a1a2e; }
  .exp-period {
    font-size: 11px;
    color: white;
    background: ${accentColor};
    padding: 2px 9px;
    border-radius: 9px;
    white-space: nowrap;
    font-weight: 500;
  }
  .exp-position { font-size: 12px; color: ${accentColor}; font-weight: 600; margin: 4px 0 6px; }
  .exp-desc { font-size: 11.5px; line-height: 1.65; color: #555; text-align: justify; }

  .edu-item { margin-bottom: 13px; }
  .edu-institution { font-weight: 700; font-size: 13px; color: #1a1a2e; }
  .edu-degree { font-size: 12px; color: #555; margin-top: 2px; }
  .edu-period { font-size: 11px; color: #95a5a6; margin-top: 2px; }

  .cert-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; padding-bottom: 9px; border-bottom: 1px dashed #e0e0e0; }
  .cert-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cert-icon { width: 18px; text-align: center; font-size: 13px; color: ${accentColor}; flex-shrink: 0; margin-top: 2px; line-height: 1; }
  .cert-info { flex: 1; }
  .cert-name { font-weight: 600; font-size: 12.5px; color: #1a1a2e; }
  .cert-meta { font-size: 11.5px; color: ${accentColor}; margin-top: 2px; }

  /* RIGHT SIDEBAR (30%) */
  .sidebar {
    width: 30%;
    background: transparent;
    padding: 24px 18px;
    border-left: 1px solid #e0e6ed;
    display: flex;
    flex-direction: column;
  }

  .sidebar-section { margin-bottom: 20px; }

  .sidebar-title {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: ${accentColor};
    margin-bottom: 11px;
    padding-bottom: 5px;
    border-bottom: 1.5px solid ${accentColor};
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    margin-bottom: 8px;
    font-size: 12px;
    color: #444;
    word-break: break-all;
  }

  .contact-icon { width: 16px; text-align: center; font-size: 12px; color: ${accentColor}; flex-shrink: 0; margin-top: 2px; line-height: 1; }

  .skill-group { margin-bottom: 12px; }

  .skill-group-title {
    font-size: 10px;
    color: #7f8c8d;
    font-weight: 700;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .skill-badges { display: flex; flex-wrap: wrap; gap: 4px; }

  .skill-badge {
    display: inline-block;
    background: ${bgColor};
    color: #ecf0f1;
    border-radius: 10px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 500;
  }
</style>
</head>
<body>
<div class="cv-page-bg"></div>
<div class="cv-wrapper">
  <!-- HEADER -->
  <div class="header">
    <div class="photo-area">
      ${imageBase64
        ? `<img src="${imageBase64}" alt="Profile" />`
        : `<div class="photo-placeholder"><i class="fa-solid fa-user"></i></div>`
      }
    </div>
    <div class="header-info">
      <div class="cv-name">${personal_info.name || ''}</div>
      <div class="cv-title">${personal_info.title || ''}</div>
      <div class="header-accent"></div>
      <div class="header-contacts">
        ${personal_info.phone ? `<span class="header-contact-item"><span class="header-contact-icon"><i class="fa-solid fa-phone"></i></span>${personal_info.phone}</span>` : ''}
        ${personal_info.email ? `<span class="header-contact-item"><span class="header-contact-icon"><i class="fa-solid fa-envelope"></i></span>${personal_info.email}</span>` : ''}
        ${personal_info.location ? `<span class="header-contact-item"><span class="header-contact-icon"><i class="fa-solid fa-location-dot"></i></span>${personal_info.location}</span>` : ''}
        ${personal_info.linkedin ? `<span class="header-contact-item"><span class="header-contact-icon"><i class="fa-brands fa-linkedin"></i></span>${personal_info.linkedin}</span>` : ''}
        ${personal_info.github ? `<span class="header-contact-item"><span class="header-contact-icon"><i class="fa-brands fa-github"></i></span>${personal_info.github}</span>` : ''}
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">
    <!-- LEFT MAIN (70%) -->
    <div class="main">
      ${summary ? `
      <div class="section">
        <div style="page-break-inside:avoid;break-inside:avoid;">
          <div class="section-title">${labels.profile}</div>
          <p class="summary-text">${summary}</p>
        </div>
      </div>` : ''}

      ${renderSection(labels.experience, experience, renderExpItem)}
      ${renderSection(labels.education, education, renderEduItem)}
      ${renderSection(labels.certificates, certificates, renderCertItem)}
    </div>

    <!-- RIGHT SIDEBAR (30%) -->
    <div class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">${labels.contact}</div>
        ${personal_info.phone ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-phone"></i></span>${personal_info.phone}</div>` : ''}
        ${personal_info.email ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-envelope"></i></span><span style="word-break:break-all;">${personal_info.email}</span></div>` : ''}
        ${personal_info.location ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>${personal_info.location}</div>` : ''}
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">${labels.skills}</div>
        ${renderSkillGroup(labels.technical, skills.technical)}
        ${renderSkillGroup(labels.databases, skills.databases)}
        ${renderSkillGroup(labels.devops, skills.devops)}
        ${renderSkillGroup(labels.tools, skills.tools)}
        ${renderSkillGroup(labels.languages, skills.languages)}
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}

module.exports = { buildCreativeHtml };
