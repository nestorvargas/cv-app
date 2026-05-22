function buildCvHtml(cvData, imageBase64) {
  const { personal_info, summary, experience, education, skills } = cvData;
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

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9pt; color: #222; background: white; }

  .cv-wrapper { display: flex; width: 210mm; min-height: 297mm; }

  /* LEFT SIDEBAR */
  .sidebar {
    width: 35%;
    background: #2c3e50;
    color: #ecf0f1;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .photo-area {
    background: #1a252f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    min-height: 130px;
  }

  .photo-area img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #3498db;
  }

  .photo-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #34495e;
    border: 3px solid #3498db;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #7f8c8d;
  }

  .sidebar-section { padding: 16px 20px; }
  .sidebar-section + .sidebar-section { border-top: 1px solid #34495e; }

  .sidebar-title {
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 2px;
    color: #3498db;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 6px;
    font-size: 8pt;
    color: #bdc3c7;
    word-break: break-all;
  }

  .contact-icon { margin-right: 8px; color: #3498db; font-size: 10pt; min-width: 14px; }

  .skills-group { margin-bottom: 10px; }
  .skills-group-title { font-size: 8pt; color: #95a5a6; font-weight: 600; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }

  .skill-badge {
    display: inline-block;
    background: #34495e;
    color: #ecf0f1;
    border-radius: 3px;
    padding: 2px 7px;
    font-size: 7.5pt;
    margin: 2px 2px 2px 0;
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
    background: #2c3e50;
    color: white;
    padding: 24px 28px 20px;
  }

  .cv-name { font-size: 20pt; font-weight: 700; line-height: 1.1; color: white; }
  .cv-title { font-size: 8.5pt; color: #3498db; margin-top: 5px; line-height: 1.4; }

  .main-content { padding: 20px 28px; flex: 1; }

  .section { margin-bottom: 18px; }
  .section-title {
    font-size: 11pt;
    font-weight: 700;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding-bottom: 4px;
    border-bottom: 2px solid #3498db;
    margin-bottom: 10px;
  }

  .summary-text { font-size: 8.5pt; line-height: 1.55; color: #444; text-align: justify; }

  .exp-item { margin-bottom: 12px; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .exp-company { font-weight: 700; font-size: 9pt; color: #2c3e50; }
  .exp-period { font-size: 7.5pt; color: #7f8c8d; white-space: nowrap; margin-left: 8px; }
  .exp-position { font-size: 8pt; color: #3498db; font-weight: 600; margin: 2px 0 4px; }
  .exp-desc { font-size: 8pt; line-height: 1.45; color: #555; text-align: justify; }

  .edu-item { margin-bottom: 9px; }
  .edu-institution { font-weight: 700; font-size: 8.5pt; color: #2c3e50; }
  .edu-degree { font-size: 8pt; color: #555; }
  .edu-period { font-size: 7.5pt; color: #7f8c8d; }
</style>
</head>
<body>
<div class="cv-wrapper">
  <!-- LEFT SIDEBAR -->
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
    </div>
  </div>
</div>
</body>
</html>`;
}

module.exports = { buildCvHtml };
