const BAR_WIDTHS = [95, 88, 92, 85, 90, 80, 85, 78, 88, 82, 75, 90, 85, 80, 88];

function buildMinimalHtml(cvData, imageBase64, accentColor = '#2980b9', bgColor = '#3d3d3d') {
  const { personal_info, summary, experience, education, skills, certificates } = cvData;
  const lang = cvData.language;

  const labelMap = {
    es: { about: 'SOBRE MÍ', skills: 'HABILIDADES', certificates: 'CURSOS', experience: 'EXPERIENCIA LABORAL', education: 'EDUCACIÓN' },
    en: { about: 'ABOUT ME', skills: 'SKILLS', certificates: 'COURSES', experience: 'WORK EXPERIENCE', education: 'EDUCATION' },
  };
  const labels = labelMap[lang] || labelMap['es'];

  const allSkills = [
    ...(skills?.technical || []),
    ...(skills?.databases || []),
    ...(skills?.devops    || []),
    ...(skills?.tools     || []),
    ...(skills?.languages || []),
  ];

  const renderSkills = () =>
    allSkills.map((skill, i) => `
      <div class="skill-item">
        <div class="skill-name">${skill}</div>
        <div class="skill-bar-wrap">
          <div class="skill-bar-fill" style="width:${BAR_WIDTHS[i % BAR_WIDTHS.length]}%"></div>
        </div>
      </div>
    `).join('');

  const renderCerts = () =>
    (certificates || []).map(c => `
      <div class="cert-item">
        ${c.year ? `<div class="cert-year">${c.year}</div>` : ''}
        <div class="cert-name">${c.name}</div>
        ${c.issuer ? `<div class="cert-issuer">${c.issuer}</div>` : ''}
      </div>
    `).join('');

  const renderExperience = () =>
    (experience || []).map((e, i) => `
      <div class="timeline-row">
        <div class="timeline-meta">
          <div class="timeline-company">${e.company}</div>
          ${e.period ? `<div class="timeline-period">${e.period}</div>` : ''}
        </div>
        <div class="timeline-dot-wrap">
          <div class="timeline-dot"></div>
          ${i < (experience.length - 1) ? '<div class="timeline-line"></div>' : ''}
        </div>
        <div class="timeline-content">
          <div class="timeline-position">${e.position}</div>
          <div class="timeline-desc">${e.description}</div>
        </div>
      </div>
    `).join('');

  const renderEducation = () =>
    (education || []).map((e, i) => `
      <div class="timeline-row">
        <div class="timeline-meta">
          <div class="timeline-company">${e.institution}</div>
          ${e.period ? `<div class="timeline-period">${e.period}</div>` : ''}
        </div>
        <div class="timeline-dot-wrap">
          <div class="timeline-dot"></div>
          ${i < (education.length - 1) ? '<div class="timeline-line"></div>' : ''}
        </div>
        <div class="timeline-content">
          <div class="timeline-position">${e.degree}</div>
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
  @page { margin: 10mm 0 8mm 0; }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Sidebar background via position:fixed — repeats on every page including margin areas */
  html { background: white; }
  .cv-page-bg {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to right, ${bgColor} 29%, #ffffff 29%);
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    z-index: -1;
  }

  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #222; background: transparent; }

  .cv-wrapper { display: flex; width: 210mm; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 29%;
    background: transparent;
    color: #ecf0f1;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .photo-area {
    background: rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 20px;
  }

  .photo-area img {
    width: 140px; height: 140px;
    border-radius: 50%; object-fit: cover;
    border: 3px solid rgba(255,255,255,0.25);
    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
  }

  .photo-placeholder {
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 3px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 52px; color: rgba(255,255,255,0.35);
  }

  .sidebar-section { padding: 18px 20px; border-top: 1px solid rgba(255,255,255,0.08); }

  .sidebar-title {
    font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #fff;
    text-transform: uppercase; padding-bottom: 6px;
    border-bottom: 1px solid rgba(255,255,255,0.15); margin-bottom: 12px;
  }

  .about-text { font-size: 11px; line-height: 1.65; color: rgba(255,255,255,0.68); }

  /* Skills */
  .skill-item { margin-bottom: 8px; }
  .skill-name { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .skill-bar-wrap { height: 3px; background: rgba(255,255,255,0.14); border-radius: 2px; }
  .skill-bar-fill { height: 3px; background: ${accentColor}; border-radius: 2px; opacity: 0.85; }

  /* Certs */
  .cert-item { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .cert-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cert-year { font-size: 9px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .cert-name { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.88); text-transform: uppercase; line-height: 1.35; letter-spacing: 0.3px; }
  .cert-issuer { font-size: 9.5px; color: rgba(255,255,255,0.48); margin-top: 2px; }

  /* ── MAIN ── */
  .main { width: 71%; background: white; display: flex; flex-direction: column; }

  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 16px; padding: 28px 26px 20px; border-bottom: 1px solid #e0e0e0;
  }
  .header-left { flex: 1; }
  .cv-name { font-size: 24px; font-weight: 700; color: #2d2d2d; text-transform: uppercase; letter-spacing: -0.3px; line-height: 1.2; margin-bottom: 8px; }
  .cv-title { font-size: 10px; color: #999; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; margin: 0; }

  .header-right { display: flex; flex-direction: column; gap: 7px; flex-shrink: 0; padding-top: 3px; }
  .contact-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #555; }
  .contact-icon {
    width: 22px; height: 22px;
    background: ${accentColor};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 9px; flex-shrink: 0; line-height: 1;
  }

  .main-body { padding: 22px 26px; flex: 1; }

  .section { margin-bottom: 24px; }
  .section-title {
    font-size: 11px; font-weight: 700; color: #2d2d2d;
    text-transform: uppercase; letter-spacing: 2px;
    padding-bottom: 7px; border-bottom: 2px solid ${accentColor}; margin-bottom: 16px;
  }

  /* Timeline */
  .timeline-row { display: grid; grid-template-columns: 130px 22px 1fr; gap: 0; margin-bottom: 18px; page-break-inside: avoid; break-inside: avoid; }
  .timeline-meta { text-align: right; padding-right: 6px; padding-top: 1px; }
  .timeline-company { font-size: 10.5px; font-weight: 700; color: #2d2d2d; line-height: 1.3; }
  .timeline-period { font-size: 9.5px; color: #999; margin-top: 3px; line-height: 1.3; }
  .timeline-dot-wrap { display: flex; flex-direction: column; align-items: center; }
  .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: ${accentColor}; flex-shrink: 0; margin-top: 3px; }
  .timeline-line { flex: 1; width: 1px; background: #e0e0e0; margin-top: 5px; }
  .timeline-content { padding-left: 8px; padding-top: 0; }
  .timeline-position { font-size: 12px; font-weight: 700; color: #2d2d2d; margin-bottom: 5px; line-height: 1.3; }
  .timeline-desc { font-size: 11px; line-height: 1.65; color: #555; }
</style>
</head>
<body>
<div class="cv-page-bg"></div>
<div class="cv-wrapper">

  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="photo-area">
      ${imageBase64
        ? `<img src="${imageBase64}" alt="Profile" />`
        : `<div class="photo-placeholder"><i class="fa-solid fa-user"></i></div>`
      }
    </div>

    ${summary ? `
    <div class="sidebar-section">
      <div class="sidebar-title">${labels.about}</div>
      <div class="about-text">${summary}</div>
    </div>` : ''}

    ${allSkills.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">${labels.skills}</div>
      ${renderSkills()}
    </div>` : ''}

    ${(certificates || []).length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">${labels.certificates}</div>
      ${renderCerts()}
    </div>` : ''}
  </div>

  <!-- MAIN -->
  <div class="main">
    <div class="header">
      <div class="header-left">
        <div class="cv-name">${personal_info.name || ''}</div>
        <div class="cv-title">${personal_info.title || ''}</div>
      </div>
      <div class="header-right">
        ${personal_info.location ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>${personal_info.location}</div>` : ''}
        ${personal_info.phone    ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-phone"></i></span>${personal_info.phone}</div>` : ''}
        ${personal_info.email    ? `<div class="contact-item"><span class="contact-icon"><i class="fa-solid fa-envelope"></i></span><span style="word-break:break-all;">${personal_info.email}</span></div>` : ''}
      </div>
    </div>

    <div class="main-body">
      ${experience?.length > 0 ? `
      <div class="section">
        <div class="section-title">${labels.experience}</div>
        ${renderExperience()}
      </div>` : ''}

      ${education?.length > 0 ? `
      <div class="section">
        <div class="section-title">${labels.education}</div>
        ${renderEducation()}
      </div>` : ''}
    </div>
  </div>

</div>
</body>
</html>`;
}

module.exports = { buildMinimalHtml };
