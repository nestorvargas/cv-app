-- Create table with full schema
CREATE TABLE IF NOT EXISTS cv_profiles (
  id SERIAL PRIMARY KEY,
  profile_name VARCHAR(100) NOT NULL DEFAULT 'desarrollador',
  profile_label VARCHAR(200),
  language VARCHAR(10) NOT NULL,
  personal_info JSONB NOT NULL DEFAULT '{}',
  summary TEXT NOT NULL DEFAULT '',
  experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '{}',
  certificates JSONB NOT NULL DEFAULT '[]',
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure unique constraint exists (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cv_profiles_profile_lang_key'
  ) THEN
    ALTER TABLE cv_profiles ADD CONSTRAINT cv_profiles_profile_lang_key UNIQUE (profile_name, language);
  END IF;
END $$;

-- Seed: Desarrollador Full Stack (ES)
INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education, skills, certificates)
VALUES (
  'desarrollador', 'Desarrollador Full Stack', 'es',
  '{"name": "Nestor Fabian Vargas Ferrucho", "title": "Desarrollador Web Full Stack | Backend PHP | Docker | Laravel | Node Js | Java Spring Boot", "phone": "3024213805", "email": "nestorfabian.92@gmail.com", "location": "Bogota, Colombia"}',
  'Desarrollador Backend / Full Stack Senior con más de 10 años de experiencia en el diseño y desarrollo de aplicaciones web escalables, seguras y de alto rendimiento. Especialista en PHP (Drupal, Laravel), Node.js y Java Spring Boot, con sólido dominio de arquitectura backend, diseño de APIs, CI/CD, Docker y optimización de rendimiento. Amplia experiencia en diseño, administración y optimización de bases de datos relacionales y NoSQL (MySQL, PostgreSQL, Redis, MongoDB, Oracle), garantizando eficiencia, integridad y escalabilidad de la información. He liderado equipos técnicos e integrado sistemas complejos (REST, SOAP, Active Directory), gestionando entornos productivos en Linux. Enfoque constante en seguridad, accesibilidad, calidad de código y mejora continua.',
  '[
    {"id": 1, "company": "Complemento 360", "position": "Desarrollador Full Stack", "period": "Nov-2022 / Actual", "description": "Especialista en desarrollo backend en PHP y Node.js, theming y optimización de rendimiento. Amplia experiencia con MySQL, Redis, PHP-FPM, Nginx, Bootstrap y Sass. Integración con servicios REST, SOAP y Active Directory. Desarrollo en entornos Docker, control de versiones con Git y flujos de trabajo en Azure DevOps. Fuerte enfoque en accesibilidad web, seguridad y gestión de entornos de desarrollo y producción (Drupal, Laravel)."},
    {"id": 2, "company": "Estrenar Vivienda", "position": "Líder de Desarrollo - PHP", "period": "Nov-2021 / Nov-2022", "description": "Liderando equipos de desarrollo en proyectos basados en Drupal y Laravel. Especialista en la creación de soluciones personalizadas, integración de sistemas y optimización de aplicaciones web. Implementación de pipelines CI/CD con GitLab, integración de servicios REST y SOAP, desarrollo con Docker, metodologías ágiles Scrum (JIRA)."},
    {"id": 3, "company": "Ariadna Communications Group", "position": "Desarrollador Drupal", "period": "Jun-2021 / Nov-2021", "description": "Desarrollo web con Drupal, creando integraciones personalizadas y optimizando aplicaciones. Experto en frontend (Tailwind, Bootstrap con Webpack, Twig) y backend (PHP, Drupal API). Gestión de bases de datos (MySQL, PostgreSQL) y administración de servidores Linux. Despliegue continuo usando GitLab CI/CD, Docker y Git."},
    {"id": 4, "company": "ESinergia", "position": "Desarrollador Drupal", "period": "Sep-2020 / Jun-2021", "description": "Especialista en desarrollo y soporte de portales web con Drupal. Experto en frontend (Tailwind, Bootstrap con Webpack) y backend (PHP, Drupal API). Despliegue continuo usando GitHub, GitLab CI/CD, Docker (con DDEV) y Git."},
    {"id": 5, "company": "Invima", "position": "Desarrollador Full Stack", "period": "Ago-2017 / Sep-2021", "description": "Drupal, Laravel, PHP, Java, SASS y JavaScript. Desarrollo de soluciones personalizadas, optimización de aplicaciones web y creación de integraciones. Gestión de bases de datos (MySQL, Redis), administración de servidores Linux y despliegue continuo utilizando GitLab CI/CD, Docker y Git."},
    {"id": 6, "company": "Indexcol", "position": "Desarrollador Drupal", "period": "Ago-2017 / Sep-2021", "description": "Desarrollo de portales web con Drupal, creando integraciones personalizadas. Experto en frontend (Bootstrap, Sass, JS con Webpack) y backend (PHP, Drupal API). Gestión de bases de datos (MySQL, Redis) y administración de servidores Linux."},
    {"id": 7, "company": "Tecsua SAS", "position": "Desarrollador Full Stack, Soporte", "period": "Mar-2014 / Jul-2017", "description": "Especialista en PHP, Drupal y soporte de infraestructura. Mantenimiento y optimización de aplicaciones web, gestión de bases de datos (MySQL, PostgreSQL), administración de servidores Linux."}
  ]',
  '[
    {"id": 1, "institution": "Universidad Nacional Abierta y A Distancia", "degree": "Ingeniería de Sistemas", "period": ""},
    {"id": 2, "institution": "Corporación Universitaria Ibero", "degree": "Bootcamp - Desarrollador Fullstack", "period": ""},
    {"id": 3, "institution": "Mintic - Universidad Industrial de Santander", "degree": "Desarrollador Fullstack (Desarrollo de aplicaciones web)", "period": ""},
    {"id": 4, "institution": "Servicio Nacional de Aprendizaje", "degree": "Especialización en gestión y seguridad de base de datos", "period": ""},
    {"id": 5, "institution": "Servicio Nacional de Aprendizaje", "degree": "Tecnólogo en análisis y desarrollo de sistemas de información", "period": ""}
  ]',
  '{"technical": ["PHP", "Laravel", "Drupal", "Node.js", "Java Spring Boot", "React", "JavaScript", "TypeScript"], "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB", "Oracle"], "devops": ["Docker", "GitLab CI/CD", "Azure DevOps", "Nginx", "Linux"], "tools": ["Git", "Jira", "Scrum", "REST APIs", "SOAP", "Active Directory"], "languages": ["Español (Nativo)", "Inglés (Intermedio)"]}',
  '[
    {"id": 1, "name": "Introducción DevOps", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 2, "name": "Desarrollador Backend PHP", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 3, "name": "Desarrollo API First", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 4, "name": "Fundamentos de Bases de Datos", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 5, "name": "Backend con Node.js - Express.js", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 6, "name": "Scrum Master", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 7, "name": "Backend con Node.js - Nest.js", "issuer": "Platzi", "year": "2026", "url": ""}
  ]'
)
ON CONFLICT (profile_name, language) DO NOTHING;

-- Seed: Desarrollador Full Stack (EN)
INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education, skills, certificates)
VALUES (
  'desarrollador', 'Full Stack Developer', 'en',
  '{"name": "Nestor Fabian Vargas Ferrucho", "title": "Full Stack Web Developer | PHP Backend | Docker | Laravel | Node.js | Java Spring Boot", "phone": "3024213805", "email": "nestorfabian.92@gmail.com", "location": "Bogota, Colombia"}',
  'Senior Backend / Full Stack Developer with over 10 years of experience designing and developing scalable, secure, and high-performance web applications. Specialist in PHP (Drupal, Laravel), Node.js, and Java Spring Boot, with solid expertise in backend architecture, API design, CI/CD, Docker, and performance optimization. Extensive experience in designing, administering, and optimizing relational and NoSQL databases (MySQL, PostgreSQL, Redis, MongoDB, Oracle), ensuring data efficiency, integrity, and scalability. I have led technical teams and integrated complex systems (REST, SOAP, Active Directory), managing production environments on Linux. Constant focus on security, accessibility, code quality, and continuous improvement.',
  '[
    {"id": 1, "company": "Complemento 360", "position": "Full Stack Developer", "period": "Nov-2022 / Present", "description": "Backend development specialist in PHP and Node.js, theming and performance optimization. Extensive experience with MySQL, Redis, PHP-FPM, Nginx, Bootstrap and Sass. Integration with REST, SOAP and Active Directory services. Development in Docker environments, version control with Git and workflows in Azure DevOps. Strong focus on web accessibility, security and management of development and production environments (Drupal, Laravel)."},
    {"id": 2, "company": "Estrenar Vivienda", "position": "Development Lead - PHP", "period": "Nov-2021 / Nov-2022", "description": "Leading development teams on Drupal and Laravel-based projects. Specialist in creating custom solutions, systems integration and web application optimization. Implementation of CI/CD pipelines with GitLab, REST and SOAP services integration, Docker development, Agile Scrum methodologies (JIRA)."},
    {"id": 3, "company": "Ariadna Communications Group", "position": "Drupal Developer", "period": "Jun-2021 / Nov-2021", "description": "Web development with Drupal, creating custom integrations and optimizing applications. Expert in frontend (Tailwind, Bootstrap with Webpack, Twig) and backend (PHP, Drupal API). Database management (MySQL, PostgreSQL) and Linux server administration. Continuous deployment using GitLab CI/CD, Docker and Git."},
    {"id": 4, "company": "ESinergia", "position": "Drupal Developer", "period": "Sep-2020 / Jun-2021", "description": "Web portal development and support specialist with Drupal. Expert in frontend (Tailwind, Bootstrap with Webpack) and backend (PHP, Drupal API). Continuous deployment using GitHub, GitLab CI/CD, Docker (with DDEV) and Git."},
    {"id": 5, "company": "Invima", "position": "Full Stack Developer", "period": "Aug-2017 / Sep-2021", "description": "Drupal, Laravel, PHP, Java, SASS and JavaScript. Development of custom solutions, web application optimization and integration creation. Database management (MySQL, Redis), Linux server administration and continuous deployment using GitLab CI/CD, Docker and Git."},
    {"id": 6, "company": "Indexcol", "position": "Drupal Developer", "period": "Aug-2017 / Sep-2021", "description": "Web portal development with Drupal, creating custom integrations. Expert in frontend (Bootstrap, Sass, JS with Webpack) and backend (PHP, Drupal API). Database management (MySQL, Redis) and Linux server administration."},
    {"id": 7, "company": "Tecsua SAS", "position": "Full Stack Developer, Support", "period": "Mar-2014 / Jul-2017", "description": "PHP, Drupal and infrastructure support specialist. Web application maintenance and optimization, database management (MySQL, PostgreSQL), Linux server administration."}
  ]',
  '[
    {"id": 1, "institution": "National Open and Distance University (UNAD)", "degree": "Systems Engineering", "period": ""},
    {"id": 2, "institution": "Ibero University Corporation", "degree": "Bootcamp - Fullstack Developer", "period": ""},
    {"id": 3, "institution": "Mintic - Industrial University of Santander", "degree": "Fullstack Developer (Web Application Development)", "period": ""},
    {"id": 4, "institution": "National Learning Service (SENA)", "degree": "Specialization in Database Management and Security", "period": ""},
    {"id": 5, "institution": "National Learning Service (SENA)", "degree": "Technology in Information Systems Analysis and Development", "period": ""}
  ]',
  '{"technical": ["PHP", "Laravel", "Drupal", "Node.js", "Java Spring Boot", "React", "JavaScript", "TypeScript"], "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB", "Oracle"], "devops": ["Docker", "GitLab CI/CD", "Azure DevOps", "Nginx", "Linux"], "tools": ["Git", "Jira", "Scrum", "REST APIs", "SOAP", "Active Directory"], "languages": ["Spanish (Native)", "English (Intermediate)"]}',
  '[
    {"id": 1, "name": "Introduction to DevOps", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 2, "name": "Backend PHP Developer", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 3, "name": "API First Development", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 4, "name": "Database Fundamentals", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 5, "name": "Backend with Node.js - Express.js", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 6, "name": "Scrum Master", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 7, "name": "Backend with Node.js - Nest.js", "issuer": "Platzi", "year": "2026", "url": ""}
  ]'
)
ON CONFLICT (profile_name, language) DO NOTHING;

-- Seed: DevOps / Linux Admin (ES)
INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education, skills, certificates)
VALUES (
  'devops-linux', 'DevOps / Linux Admin', 'es',
  '{"name": "Nestor Fabian Vargas Ferrucho", "title": "Senior Linux System Administrator | DevOps Engineer", "phone": "3024213805", "email": "nestorfabian.92@gmail.com", "location": "Bogota, Colombia"}',
  'Administrador Linux Senior con más de 10 años de experiencia gestionando entornos productivos críticos. Experto en hardening de sistemas, gestión avanzada de permisos y políticas de seguridad. Especialista en la automatización de infraestructura mediante Bash, Python y Ansible, con enfoque en optimización de kernel y alta disponibilidad. Amplia trayectoria en monitoreo proactivo (Zabbix, Nagios, Grafana) y resolución de incidentes complejos en arquitecturas híbridas (On-premise y Cloud).',
  '[
    {"id": 1, "company": "Complemento 360", "position": "DevOps Engineer | Linux Admin | Full Stack", "period": "Nov-2022 / Actual", "description": "Despliegue de aplicaciones en cloud computing (AWS, Azure, GCP). Implementación de dominios, DNS, CDN y servidores Linux. Resolución de incidentes críticos y mitigación de vulnerabilidades. Pipelines CI/CD con GitLab, Docker y Git (BitBucket). Administración y hardening de servidores Linux en producción."},
    {"id": 2, "company": "Estrenar Vivienda", "position": "Líder de Equipo | DevOps | Linux Admin", "period": "Nov-2021 / Nov-2022", "description": "Administración y tuning de servidores Linux para portales gubernamentales de alto tráfico. Liderazgo de la transformación digital migrando servicios en entornos Linux bajo alta disponibilidad. Implementación de prácticas DevOps con CI/CD, DNS, CDN y AWS."},
    {"id": 3, "company": "Ariadna Communications Group", "position": "DevOps | Desarrollador Backend", "period": "Jun-2021 / Nov-2021", "description": "Gestión de bases de datos (MySQL, Redis) y administración de servidores Linux. Despliegue continuo con GitLab CI/CD, Docker (DDEV) y Git. Creación y mantenimiento de bases de datos SQL y NoSQL."},
    {"id": 4, "company": "Invima", "position": "Linux Admin | Desarrollador Full Stack", "period": "Ago-2017 / Sep-2021", "description": "Administración integral de servidores Linux. Despliegue continuo con GitLab CI/CD, Docker y Git. Monitoreo de servicios y atención de incidentes nivel 2 y 3."},
    {"id": 5, "company": "Tecsua SAS", "position": "Soporte Servidores | Desarrollador Full Stack", "period": "Mar-2014 / Jul-2017", "description": "Gestión y administración de servidores Windows y Linux. Despliegue de aplicaciones en cloud (AWS, Azure, GCP). Diseño y mantenimiento de bases de datos SQL y NoSQL."}
  ]',
  '[
    {"id": 1, "institution": "Universidad Nacional Abierta y A Distancia", "degree": "Ingeniería de Sistemas", "period": "2018 - En curso"},
    {"id": 2, "institution": "Servicio Nacional de Aprendizaje", "degree": "Especialización en gestión y seguridad de base de datos", "period": "2019 - 2020"},
    {"id": 3, "institution": "Servicio Nacional de Aprendizaje", "degree": "Tecnólogo en análisis y desarrollo de sistemas de información", "period": "2010 - 2012"},
    {"id": 4, "institution": "Instituto Cenis de Colombia", "degree": "Técnico en análisis y diseño de programación de sistemas", "period": "2009 - 2011"}
  ]',
  '{"technical": ["Linux (RHEL, Debian, Ubuntu)", "Bash Scripting", "Python", "Ansible", "Nginx", "PHP", "Node.js"], "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB"], "devops": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "GitLab CI/CD", "Zabbix", "Nagios", "Grafana"], "tools": ["Git", "Jira", "Scrum", "DNS/CDN", "Hardening Linux", "Active Directory"], "languages": ["Español (Nativo)", "Inglés (Intermedio)"]}',
  '[
    {"id": 1, "name": "Introducción DevOps", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 2, "name": "Backend con Node.js - Express.js", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 3, "name": "Scrum Master", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 4, "name": "Fundamentos de Bases de Datos", "issuer": "Platzi", "year": "2025", "url": ""}
  ]'
)
ON CONFLICT (profile_name, language) DO NOTHING;

-- Seed: DevOps / Linux Admin (EN)
INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education, skills, certificates)
VALUES (
  'devops-linux', 'DevOps / Linux Admin', 'en',
  '{"name": "Nestor Fabian Vargas Ferrucho", "title": "Senior Linux System Administrator | DevOps Engineer", "phone": "3024213805", "email": "nestorfabian.92@gmail.com", "location": "Bogota, Colombia"}',
  'Senior Linux System Administrator with over 10 years of experience managing critical production environments. Expert in system hardening, advanced permission management and security policies. Specialist in infrastructure automation through Bash, Python and Ansible, focused on kernel optimization and high availability. Extensive background in proactive monitoring (Zabbix, Nagios, Grafana) and resolution of complex incidents in hybrid architectures (On-premise and Cloud).',
  '[
    {"id": 1, "company": "Complemento 360", "position": "DevOps Engineer | Linux Admin | Full Stack", "period": "Nov-2022 / Present", "description": "Application deployment on cloud computing (AWS, Azure, GCP). Implementation of domains, DNS, CDN and Linux servers. Resolution of critical incidents and vulnerability mitigation. CI/CD pipelines with GitLab, Docker and Git (BitBucket). Administration and hardening of Linux servers in production."},
    {"id": 2, "company": "Estrenar Vivienda", "position": "Team Lead | DevOps | Linux Admin", "period": "Nov-2021 / Nov-2022", "description": "Administration and tuning of Linux servers for high-traffic government portals. Leadership of digital transformation migrating services in Linux environments under high availability standards. DevOps practices with CI/CD, DNS, CDN and AWS."},
    {"id": 3, "company": "Ariadna Communications Group", "position": "DevOps | Backend Developer", "period": "Jun-2021 / Nov-2021", "description": "Database management (MySQL, Redis) and Linux server administration. Continuous deployment with GitLab CI/CD, Docker (DDEV) and Git. SQL and NoSQL database creation and maintenance."},
    {"id": 4, "company": "Invima", "position": "Linux Admin | Full Stack Developer", "period": "Aug-2017 / Sep-2021", "description": "Comprehensive Linux server administration. Continuous deployment with GitLab CI/CD, Docker and Git. Service monitoring and incident handling at levels 2 and 3."},
    {"id": 5, "company": "Tecsua SAS", "position": "Server Support | Full Stack Developer", "period": "Mar-2014 / Jul-2017", "description": "Windows and Linux server management and administration. Application deployment on cloud (AWS, Azure, GCP). SQL and NoSQL database design and maintenance."}
  ]',
  '[
    {"id": 1, "institution": "National Open and Distance University (UNAD)", "degree": "Systems Engineering", "period": "2018 - Present"},
    {"id": 2, "institution": "National Learning Service (SENA)", "degree": "Specialization in Database Management and Security", "period": "2019 - 2020"},
    {"id": 3, "institution": "National Learning Service (SENA)", "degree": "Technology in Information Systems Analysis and Development", "period": "2010 - 2012"},
    {"id": 4, "institution": "Instituto Cenis de Colombia", "degree": "Technical Degree in Systems Programming Analysis and Design", "period": "2009 - 2011"}
  ]',
  '{"technical": ["Linux (RHEL, Debian, Ubuntu)", "Bash Scripting", "Python", "Ansible", "Nginx", "PHP", "Node.js"], "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB"], "devops": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "GitLab CI/CD", "Zabbix", "Nagios", "Grafana"], "tools": ["Git", "Jira", "Scrum", "DNS/CDN", "Linux Hardening", "Active Directory"], "languages": ["Spanish (Native)", "English (Intermediate)"]}',
  '[
    {"id": 1, "name": "Introduction to DevOps", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 2, "name": "Backend with Node.js - Express.js", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 3, "name": "Scrum Master", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 4, "name": "Database Fundamentals", "issuer": "Platzi", "year": "2025", "url": ""}
  ]'
)
ON CONFLICT (profile_name, language) DO NOTHING;

-- Seed: Líder Técnico (ES)
INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education, skills, certificates)
VALUES (
  'lider-tecnico', 'Líder Técnico', 'es',
  '{"name": "Nestor Fabian Vargas Ferrucho", "title": "Líder Técnico | Full Stack | Arquitectura de Software", "phone": "3024213805", "email": "nestorfabian.92@gmail.com", "location": "Bogota, Colombia"}',
  'Líder Técnico Senior con más de 10 años de experiencia liderando equipos de desarrollo y diseñando arquitecturas escalables. Especialista en la gestión de proyectos bajo metodologías ágiles (Scrum, JIRA), con sólida experiencia en PHP, Node.js, Java Spring Boot y React. Trayectoria probada en la transformación digital, integración de sistemas complejos y entrega continua de valor mediante CI/CD. Enfoque constante en la calidad del código, mentoría técnica, seguridad y mejora continua del equipo.',
  '[
    {"id": 1, "company": "Complemento 360", "position": "Líder Técnico | Full Stack | DevOps", "period": "Nov-2022 / Actual", "description": "Liderazgo de equipos de desarrollo en proyectos Drupal y Laravel. Gestión de pipelines CI/CD con GitLab y Azure DevOps. Definición de arquitecturas de soluciones e integración de sistemas. Mentoring técnico y code review. Metodologías ágiles Scrum (JIRA)."},
    {"id": 2, "company": "Estrenar Vivienda", "position": "Líder de Desarrollo | Arquitecto de Soluciones", "period": "Nov-2021 / Nov-2022", "description": "Liderazgo de equipos en proyectos Drupal y Laravel. Evaluación del rendimiento del equipo y retroalimentación constructiva. Supervisión del desarrollo profesional del equipo. Metodologías ágiles (Scrum) y prácticas DevOps. Liderazgo de la transformación digital."},
    {"id": 3, "company": "Ariadna Communications Group", "position": "DevOps | Desarrollador Senior Drupal", "period": "Jun-2021 / Nov-2021", "description": "Desarrollo web con Drupal, integraciones personalizadas y optimización de aplicaciones. Experto en frontend (Tailwind, Bootstrap, Twig) y backend (PHP, Drupal API). Gestión de proyectos con Jira."},
    {"id": 4, "company": "Invima", "position": "Desarrollador Full Stack | Tech Lead", "period": "Ago-2017 / Sep-2021", "description": "Liderazgo técnico en proyectos gubernamentales de alto impacto. PHP, Laravel, Java, SASS y JavaScript. Desarrollo de soluciones personalizadas e integración con servicios REST y SOAP."},
    {"id": 5, "company": "Tecsua SAS", "position": "Desarrollador Full Stack | Soporte", "period": "Mar-2014 / Jul-2017", "description": "Especialista en PHP, Drupal y soporte de infraestructura. Colaboración en equipos ágiles con Scrum y Kanban. Gestión de proyectos estableciendo plazos y objetivos claros."}
  ]',
  '[
    {"id": 1, "institution": "Universidad Nacional Abierta y A Distancia", "degree": "Ingeniería de Sistemas", "period": "2018 - En curso"},
    {"id": 2, "institution": "Corporación Universitaria Ibero", "degree": "Bootcamp - Desarrollador Fullstack", "period": "2021"},
    {"id": 3, "institution": "Mintic - Universidad Industrial de Santander", "degree": "Desarrollador Fullstack", "period": "2022"},
    {"id": 4, "institution": "Servicio Nacional de Aprendizaje", "degree": "Especialización en gestión y seguridad de base de datos", "period": "2019 - 2020"}
  ]',
  '{"technical": ["PHP", "Laravel", "Drupal", "Node.js", "React", "Java Spring Boot", "JavaScript", "TypeScript"], "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB", "Oracle"], "devops": ["Docker", "GitLab CI/CD", "Azure DevOps", "Nginx", "Linux"], "tools": ["Scrum Master", "Jira", "Code Review", "Mentoring", "REST APIs", "SOAP", "Active Directory"], "languages": ["Español (Nativo)", "Inglés (Intermedio)"]}',
  '[
    {"id": 1, "name": "Scrum Master", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 2, "name": "Introducción DevOps", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 3, "name": "Desarrollador Backend PHP", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 4, "name": "Backend con Node.js - Nest.js", "issuer": "Platzi", "year": "2026", "url": ""}
  ]'
)
ON CONFLICT (profile_name, language) DO NOTHING;

-- Seed: Technical Leader (EN)
INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education, skills, certificates)
VALUES (
  'lider-tecnico', 'Technical Leader', 'en',
  '{"name": "Nestor Fabian Vargas Ferrucho", "title": "Technical Leader | Full Stack | Software Architecture", "phone": "3024213805", "email": "nestorfabian.92@gmail.com", "location": "Bogota, Colombia"}',
  'Senior Technical Leader with over 10 years of experience leading development teams and designing scalable architectures. Specialist in project management under agile methodologies (Scrum, JIRA), with solid expertise in PHP, Node.js, Java Spring Boot and React. Proven track record in digital transformation, complex system integration and continuous value delivery through CI/CD. Constant focus on code quality, technical mentorship, security and continuous team improvement.',
  '[
    {"id": 1, "company": "Complemento 360", "position": "Technical Leader | Full Stack | DevOps", "period": "Nov-2022 / Present", "description": "Leadership of development teams on Drupal and Laravel projects. Management of CI/CD pipelines with GitLab and Azure DevOps. Definition of solution architectures and systems integration. Technical mentoring and code review. Agile Scrum methodologies (JIRA)."},
    {"id": 2, "company": "Estrenar Vivienda", "position": "Development Lead | Solutions Architect", "period": "Nov-2021 / Nov-2022", "description": "Leadership of development teams on Drupal and Laravel projects. Team performance evaluation and constructive feedback. Professional development supervision. Agile methodologies (Scrum) and DevOps practices. Digital transformation leadership."},
    {"id": 3, "company": "Ariadna Communications Group", "position": "DevOps | Senior Drupal Developer", "period": "Jun-2021 / Nov-2021", "description": "Web development with Drupal, custom integrations and application optimization. Expert in frontend (Tailwind, Bootstrap, Twig) and backend (PHP, Drupal API). Project management with Jira."},
    {"id": 4, "company": "Invima", "position": "Full Stack Developer | Tech Lead", "period": "Aug-2017 / Sep-2021", "description": "Technical leadership on high-impact government projects. PHP, Laravel, Java, SASS and JavaScript. Custom solution development and REST/SOAP service integration."},
    {"id": 5, "company": "Tecsua SAS", "position": "Full Stack Developer | Support", "period": "Mar-2014 / Jul-2017", "description": "PHP, Drupal and infrastructure support specialist. Collaboration in agile teams with Scrum and Kanban. Project management with clear deadlines and objectives."}
  ]',
  '[
    {"id": 1, "institution": "National Open and Distance University (UNAD)", "degree": "Systems Engineering", "period": "2018 - Present"},
    {"id": 2, "institution": "Ibero University Corporation", "degree": "Bootcamp - Fullstack Developer", "period": "2021"},
    {"id": 3, "institution": "Mintic - Industrial University of Santander", "degree": "Fullstack Developer", "period": "2022"},
    {"id": 4, "institution": "National Learning Service (SENA)", "degree": "Specialization in Database Management and Security", "period": "2019 - 2020"}
  ]',
  '{"technical": ["PHP", "Laravel", "Drupal", "Node.js", "React", "Java Spring Boot", "JavaScript", "TypeScript"], "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB", "Oracle"], "devops": ["Docker", "GitLab CI/CD", "Azure DevOps", "Nginx", "Linux"], "tools": ["Scrum Master", "Jira", "Code Review", "Mentoring", "REST APIs", "SOAP", "Active Directory"], "languages": ["Spanish (Native)", "English (Intermediate)"]}',
  '[
    {"id": 1, "name": "Scrum Master", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 2, "name": "Introduction to DevOps", "issuer": "Platzi", "year": "2026", "url": ""},
    {"id": 3, "name": "Backend PHP Developer", "issuer": "Platzi", "year": "2025", "url": ""},
    {"id": 4, "name": "Backend with Node.js - Nest.js", "issuer": "Platzi", "year": "2026", "url": ""}
  ]'
)
ON CONFLICT (profile_name, language) DO NOTHING;

-- Users and sessions (login)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);

-- CV ownership: each user sees their own CVs; admins see all.
-- Profiles without owner (seed data, or whose owner was deleted) are admin-only.
ALTER TABLE cv_profiles ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS cv_profiles_owner_id_idx ON cv_profiles (owner_id);
