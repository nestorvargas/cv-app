function buildClassicHtml(cvData, imageBase64, accentColor = '#1abc9c', bgColor = '#2c3e50') {
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

  const renderSkillBadges = (items) =>
    items.map(s => `<span class="skill-badge">${s}</span>`).join('');

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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<style>
  @page { margin: 6mm 0 6mm 0; }
  @page :first { margin: 0 0 6mm 0; }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Sidebar background via position:fixed — repeats on every page including margin areas */
  html { background: white; }
  .cv-page-bg {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to right, ${bgColor} 35%, #ffffff 35%);
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    z-index: -1;
  }

  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.65; color: #222; background: transparent; }

  .cv-wrapper { display: flex; width: 210mm; }

  /* Page-break rules: keep items from splitting mid-text */
  .exp-item  { page-break-inside: avoid; break-inside: avoid; }
  .edu-item  { page-break-inside: avoid; break-inside: avoid; }
  .cert-item { page-break-inside: avoid; break-inside: avoid; }
  .section-title { page-break-after: avoid; break-after: avoid; }

  /* LEFT SIDEBAR */
  .sidebar {
    width: 35%;
    background: transparent;
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
    padding: 32px 18px;
    min-height: 168px;
  }

  .photo-area img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${accentColor};
    box-shadow: 0 4px 16px rgba(26,188,156,0.35);
  }

  .photo-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #34495e;
    border: 3px solid ${accentColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44px;
    color: #7f8c8d;
  }

  .sidebar-section { padding: 20px 22px; border-top: 1px solid #34495e; }

  .sidebar-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: ${accentColor};
    margin-bottom: 13px;
    text-transform: uppercase;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 9px;
    font-size: 12.5px;
    color: #bdc3c7;
    word-break: break-all;
  }

  .contact-icon { width: 16px; text-align: center; margin-right: 0; color: ${accentColor}; font-size: 12px; flex-shrink: 0; margin-top: 2px; line-height: 1; }

  .skills-group { margin-bottom: 14px; }
  .skills-group-title {
    font-size: 10px;
    color: #95a5a6;
    font-weight: 700;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }

  .skill-badge {
    display: inline-block;
    background: #34495e;
    color: #ecf0f1;
    border-radius: 12px;
    padding: 4px 11px;
    font-size: 11.5px;
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
    padding: 34px 34px 28px;
    position: relative;
  }

  .header-area::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 34px;
    right: 34px;
    height: 3px;
    background: linear-gradient(90deg, ${accentColor}, transparent);
    border-radius: 2px;
  }

  .cv-name { font-size: 27px; font-weight: 700; line-height: 1.15; color: white; letter-spacing: -0.3px; }
  .cv-title { font-size: 12.5px; color: ${accentColor}; margin-top: 8px; line-height: 1.5; font-weight: 500; }

  .main-content { padding: 26px 32px; flex: 1; }

  .section { margin-bottom: 24px; }
  .section-title {
    font-size: 12.5px;
    font-weight: 700;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    padding-bottom: 6px;
    border-bottom: 2.5px solid ${accentColor};
    margin-bottom: 15px;
    position: relative;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -2.5px;
    left: 50%;
    right: 0;
    height: 2.5px;
    background: linear-gradient(90deg, transparent, white);
    pointer-events: none;
  }

  .summary-text { font-size: 13px; line-height: 1.7; color: #444; text-align: justify; }

  .exp-item { margin-bottom: 18px; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .exp-company { font-weight: 700; font-size: 14px; color: #2c3e50; }
  .exp-period { font-size: 11.5px; color: #7f8c8d; white-space: nowrap; margin-left: 8px; flex-shrink: 0; }
  .exp-position { font-size: 12px; color: ${accentColor}; font-weight: 600; margin: 4px 0 7px; }
  .exp-desc { font-size: 12px; line-height: 1.65; color: #555; text-align: justify; }

  .edu-item { margin-bottom: 14px; }
  .edu-institution { font-weight: 700; font-size: 13px; color: #2c3e50; }
  .edu-degree { font-size: 12px; color: #555; margin-top: 2px; }
  .edu-period { font-size: 11px; color: #7f8c8d; margin-top: 1px; }

  .cert-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; padding-bottom: 9px; border-bottom: 1px dashed #e0e0e0; }
  .cert-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cert-icon { width: 18px; text-align: center; font-size: 13px; color: ${accentColor}; flex-shrink: 0; margin-top: 2px; line-height: 1; }
  .cert-info { flex: 1; }
  .cert-name { font-weight: 600; font-size: 12.5px; color: #2c3e50; }
  .cert-meta { font-size: 11.5px; color: ${accentColor}; margin-top: 2px; }
</style>
</head>
<body>
<div class="cv-page-bg"></div>
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
      ${personal_info.phone ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-phone"></i></span>${personal_info.phone}</div>` : ''}
      ${personal_info.email ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-envelope"></i></span><span style="word-break: break-all;">${personal_info.email}</span></div>` : ''}
      ${personal_info.location ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>${personal_info.location}</div>` : ''}
      ${personal_info.linkedin ? `<div class="contact-item"><span class="contact-icon"><i class="fa-brands fa-linkedin"></i></span><span style="word-break:break-all;">${personal_info.linkedin}</span></div>` : ''}
      ${personal_info.github ? `<div class="contact-item"><span class="contact-icon"><i class="fa-brands fa-github"></i></span><span style="word-break:break-all;">${personal_info.github}</span></div>` : ''}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">${labels.skills}</div>
      ${skills.technical?.length > 0 ? `<div class="skills-group"><div class="skills-group-title">${labels.technical}</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${renderSkillBadges(skills.technical)}</div></div>` : ''}
      ${skills.databases?.length > 0 ? `<div class="skills-group"><div class="skills-group-title">${labels.databases}</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${renderSkillBadges(skills.databases)}</div></div>` : ''}
      ${skills.devops?.length > 0 ? `<div class="skills-group"><div class="skills-group-title">${labels.devops}</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${renderSkillBadges(skills.devops)}</div></div>` : ''}
      ${skills.tools?.length > 0 ? `<div class="skills-group"><div class="skills-group-title">${labels.tools}</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${renderSkillBadges(skills.tools)}</div></div>` : ''}
      ${skills.languages?.length > 0 ? `<div class="skills-group"><div class="skills-group-title">${labels.languages}</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${renderSkillBadges(skills.languages)}</div></div>` : ''}
    </div>
  </div>

  <!-- RIGHT MAIN CONTENT -->
  <div class="main">
    <div class="header-area">
      <div class="cv-name">${personal_info.name || ''}</div>
      <div class="cv-title">${personal_info.title || ''}</div>
    </div>

    <div class="main-content">
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
  </div>
</div>
</body>
</html>`;
}

module.exports = { buildClassicHtml };
