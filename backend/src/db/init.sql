CREATE TABLE IF NOT EXISTS cv_profiles (
  id SERIAL PRIMARY KEY,
  language VARCHAR(10) NOT NULL UNIQUE,
  personal_info JSONB NOT NULL DEFAULT '{}',
  summary TEXT NOT NULL DEFAULT '',
  experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '{}',
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO cv_profiles (language, personal_info, summary, experience, education, skills)
VALUES (
  'es',
  '{
    "name": "Nestor Fabian Vargas Ferrucho",
    "title": "Desarrollador Web Full Stack | Backend PHP | Docker | Laravel | Node Js | Java Spring Boot",
    "phone": "3024213805",
    "email": "nestorfabian.92@gmail.com",
    "location": "Bogota, Colombia"
  }',
  'Desarrollador Backend / Full Stack Senior con más de 10 años de experiencia en el diseño y desarrollo de aplicaciones web escalables, seguras y de alto rendimiento. Especialista en PHP (Drupal, Laravel), Node.js y Java Spring Boot, con sólido dominio de arquitectura backend, diseño de APIs, CI/CD, Docker y optimización de rendimiento. Amplia experiencia en diseño, administración y optimización de bases de datos relacionales y NoSQL (MySQL, PostgreSQL, Redis, MongoDB, Oracle), garantizando eficiencia, integridad y escalabilidad de la información. He liderado equipos técnicos e integrado sistemas complejos (REST, SOAP, Active Directory), gestionando entornos productivos en Linux. Enfoque constante en seguridad, accesibilidad, calidad de código y mejora continua.',
  '[
    {
      "id": 1,
      "company": "Complemento 360",
      "position": "Desarrollador Full Stack",
      "period": "Nov-2022 / Actual",
      "description": "Especialista en desarrollo backend en PHP y Node.js, theming y optimización de rendimiento. Amplia experiencia con MySQL, Redis, PHP-FPM, Nginx, Bootstrap y Sass. Integración con servicios REST, SOAP y Active Directory. Desarrollo en entornos Docker, control de versiones con Git y flujos de trabajo en Azure DevOps. Fuerte enfoque en accesibilidad web, seguridad y gestión de entornos de desarrollo y producción (Drupal, Laravel)."
    },
    {
      "id": 2,
      "company": "Estrenar Vivienda",
      "position": "Líder de Desarrollo - PHP",
      "period": "Nov-2021 / Nov-2022",
      "description": "Liderando equipos de desarrollo en proyectos basados en Drupal y Laravel. Especialista en la creación de soluciones personalizadas, integración de sistemas y optimización de aplicaciones web. Implementación de pipelines CI/CD con GitLab, integración de servicios REST y SOAP, desarrollo con Docker, metodologías ágiles Scrum (JIRA)."
    },
    {
      "id": 3,
      "company": "Ariadna Communications Group",
      "position": "Desarrollador Drupal",
      "period": "Jun-2021 / Nov-2021",
      "description": "Desarrollo web con Drupal, creando integraciones personalizadas y optimizando aplicaciones. Experto en frontend (Tailwind, Bootstrap con Webpack, Twig) y backend (PHP, Drupal API). Gestión de bases de datos (MySQL, PostgreSQL) y administración de servidores Linux. Despliegue continuo usando GitLab CI/CD, Docker y Git."
    },
    {
      "id": 4,
      "company": "ESinergia",
      "position": "Desarrollador Drupal",
      "period": "Sep-2020 / Jun-2021",
      "description": "Especialista en desarrollo y soporte de portales web con Drupal. Experto en frontend (Tailwind, Bootstrap con Webpack) y backend (PHP, Drupal API). Despliegue continuo usando GitHub, GitLab CI/CD, Docker (con DDEV) y Git."
    },
    {
      "id": 5,
      "company": "Invima",
      "position": "Desarrollador Full Stack",
      "period": "Ago-2017 / Sep-2021",
      "description": "Drupal, Laravel, PHP, Java, SASS y JavaScript. Desarrollo de soluciones personalizadas, optimización de aplicaciones web y creación de integraciones. Gestión de bases de datos (MySQL, Redis), administración de servidores Linux y despliegue continuo utilizando GitLab CI/CD, Docker y Git."
    },
    {
      "id": 6,
      "company": "Indexcol",
      "position": "Desarrollador Drupal",
      "period": "Ago-2017 / Sep-2021",
      "description": "Desarrollo de portales web con Drupal, creando integraciones personalizadas. Experto en frontend (Bootstrap, Sass, JS con Webpack) y backend (PHP, Drupal API). Gestión de bases de datos (MySQL, Redis) y administración de servidores Linux."
    },
    {
      "id": 7,
      "company": "Tecsua SAS",
      "position": "Desarrollador Full Stack, Soporte",
      "period": "Mar-2014 / Jul-2017",
      "description": "Especialista en PHP, Drupal y soporte de infraestructura. Mantenimiento y optimización de aplicaciones web, gestión de bases de datos (MySQL, PostgreSQL), administración de servidores Linux."
    }
  ]',
  '[
    {
      "id": 1,
      "institution": "Universidad Nacional Abierta y A Distancia",
      "degree": "Ingeniería de Sistemas",
      "period": ""
    },
    {
      "id": 2,
      "institution": "Corporación Universitaria Ibero",
      "degree": "Bootcamp - Desarrollador Fullstack",
      "period": ""
    },
    {
      "id": 3,
      "institution": "Mintic - Universidad Industrial de Santander",
      "degree": "Desarrollador Fullstack (Desarrollo de aplicaciones web)",
      "period": ""
    },
    {
      "id": 4,
      "institution": "Servicio Nacional de Aprendizaje",
      "degree": "Especialización en gestión y seguridad de base de datos",
      "period": ""
    },
    {
      "id": 5,
      "institution": "Servicio Nacional de Aprendizaje",
      "degree": "Tecnólogo en análisis y desarrollo de sistemas de información",
      "period": ""
    }
  ]',
  '{
    "technical": ["PHP", "Laravel", "Drupal", "Node.js", "Java Spring Boot", "React", "JavaScript", "TypeScript"],
    "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB", "Oracle"],
    "devops": ["Docker", "GitLab CI/CD", "Azure DevOps", "Nginx", "Linux"],
    "tools": ["Git", "Jira", "Scrum", "REST APIs", "SOAP", "Active Directory"],
    "languages": ["Español (Nativo)", "Inglés (Intermedio)"]
  }'
)
ON CONFLICT (language) DO NOTHING;

INSERT INTO cv_profiles (language, personal_info, summary, experience, education, skills)
VALUES (
  'en',
  '{
    "name": "Nestor Fabian Vargas Ferrucho",
    "title": "Full Stack Web Developer | PHP Backend | Docker | Laravel | Node.js | Java Spring Boot",
    "phone": "3024213805",
    "email": "nestorfabian.92@gmail.com",
    "location": "Bogota, Colombia"
  }',
  'Senior Backend / Full Stack Developer with over 10 years of experience designing and developing scalable, secure, and high-performance web applications. Specialist in PHP (Drupal, Laravel), Node.js, and Java Spring Boot, with solid expertise in backend architecture, API design, CI/CD, Docker, and performance optimization. Extensive experience in designing, administering, and optimizing relational and NoSQL databases (MySQL, PostgreSQL, Redis, MongoDB, Oracle), ensuring data efficiency, integrity, and scalability. I have led technical teams and integrated complex systems (REST, SOAP, Active Directory), managing production environments on Linux. Constant focus on security, accessibility, code quality, and continuous improvement.',
  '[
    {
      "id": 1,
      "company": "Complemento 360",
      "position": "Full Stack Developer",
      "period": "Nov-2022 / Present",
      "description": "Backend development specialist in PHP and Node.js, theming and performance optimization. Extensive experience with MySQL, Redis, PHP-FPM, Nginx, Bootstrap and Sass. Integration with REST, SOAP and Active Directory services. Development in Docker environments, version control with Git and workflows in Azure DevOps. Strong focus on web accessibility, security and management of development and production environments (Drupal, Laravel)."
    },
    {
      "id": 2,
      "company": "Estrenar Vivienda",
      "position": "Development Lead - PHP",
      "period": "Nov-2021 / Nov-2022",
      "description": "Leading development teams on Drupal and Laravel-based projects. Specialist in creating custom solutions, systems integration and web application optimization. Implementation of CI/CD pipelines with GitLab, REST and SOAP services integration, Docker development, Agile Scrum methodologies (JIRA)."
    },
    {
      "id": 3,
      "company": "Ariadna Communications Group",
      "position": "Drupal Developer",
      "period": "Jun-2021 / Nov-2021",
      "description": "Web development with Drupal, creating custom integrations and optimizing applications. Expert in frontend (Tailwind, Bootstrap with Webpack, Twig) and backend (PHP, Drupal API). Database management (MySQL, PostgreSQL) and Linux server administration. Continuous deployment using GitLab CI/CD, Docker and Git."
    },
    {
      "id": 4,
      "company": "ESinergia",
      "position": "Drupal Developer",
      "period": "Sep-2020 / Jun-2021",
      "description": "Web portal development and support specialist with Drupal. Expert in frontend (Tailwind, Bootstrap with Webpack) and backend (PHP, Drupal API). Continuous deployment using GitHub, GitLab CI/CD, Docker (with DDEV) and Git."
    },
    {
      "id": 5,
      "company": "Invima",
      "position": "Full Stack Developer",
      "period": "Aug-2017 / Sep-2021",
      "description": "Drupal, Laravel, PHP, Java, SASS and JavaScript. Development of custom solutions, web application optimization and integration creation. Database management (MySQL, Redis), Linux server administration and continuous deployment using GitLab CI/CD, Docker and Git."
    },
    {
      "id": 6,
      "company": "Indexcol",
      "position": "Drupal Developer",
      "period": "Aug-2017 / Sep-2021",
      "description": "Web portal development with Drupal, creating custom integrations. Expert in frontend (Bootstrap, Sass, JS with Webpack) and backend (PHP, Drupal API). Database management (MySQL, Redis) and Linux server administration."
    },
    {
      "id": 7,
      "company": "Tecsua SAS",
      "position": "Full Stack Developer, Support",
      "period": "Mar-2014 / Jul-2017",
      "description": "PHP, Drupal and infrastructure support specialist. Web application maintenance and optimization, database management (MySQL, PostgreSQL), Linux server administration."
    }
  ]',
  '[
    {
      "id": 1,
      "institution": "National Open and Distance University (UNAD)",
      "degree": "Systems Engineering",
      "period": ""
    },
    {
      "id": 2,
      "institution": "Ibero University Corporation",
      "degree": "Bootcamp - Fullstack Developer",
      "period": ""
    },
    {
      "id": 3,
      "institution": "Mintic - Industrial University of Santander",
      "degree": "Fullstack Developer (Web Application Development)",
      "period": ""
    },
    {
      "id": 4,
      "institution": "National Learning Service (SENA)",
      "degree": "Specialization in Database Management and Security",
      "period": ""
    },
    {
      "id": 5,
      "institution": "National Learning Service (SENA)",
      "degree": "Technology in Information Systems Analysis and Development",
      "period": ""
    }
  ]',
  '{
    "technical": ["PHP", "Laravel", "Drupal", "Node.js", "Java Spring Boot", "React", "JavaScript", "TypeScript"],
    "databases": ["MySQL", "PostgreSQL", "Redis", "MongoDB", "Oracle"],
    "devops": ["Docker", "GitLab CI/CD", "Azure DevOps", "Nginx", "Linux"],
    "tools": ["Git", "Jira", "Scrum", "REST APIs", "SOAP", "Active Directory"],
    "languages": ["Spanish (Native)", "English (Intermediate)"]
  }'
)
ON CONFLICT (language) DO NOTHING;
