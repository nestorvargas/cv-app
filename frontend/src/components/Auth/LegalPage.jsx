import React, { useEffect } from 'react';
import './auth.css';

// Responsible party and contact shown in both documents
export const LEGAL = {
  app: 'CV Manager',
  owner: 'Nestor Fabian Vargas Ferrucho',
  email: 'nestorfabian.92@gmail.com',
  country: 'Colombia',
  version: '2026-10-22',
  updated: '22 de octubre de 2026',
};

const TERMS = [
  ['1. Aceptación', [
    `Al crear una cuenta o usar ${LEGAL.app} aceptas estos Términos y Condiciones y la Política de Tratamiento de Datos Personales. Si no estás de acuerdo, no uses el servicio.`,
  ]],
  ['2. El servicio', [
    `${LEGAL.app} es una aplicación web para crear, editar y descargar hojas de vida en español e inglés, con plantillas, vista previa y un asistente de inteligencia artificial para mejorar textos.`,
  ]],
  ['3. Cuentas', [
    'Puedes registrarte con tu cuenta de Google o con un usuario creado por un administrador. Eres responsable de la actividad realizada desde tu cuenta y de mantener la confidencialidad de tus credenciales.',
    'Debes ser mayor de edad o contar con la autorización de tu representante legal.',
  ]],
  ['4. Uso permitido', [
    'Te comprometes a registrar información veraz y propia. No está permitido suplantar a otras personas, cargar información de terceros sin su autorización, usar el servicio con fines ilícitos ni intentar acceder a cuentas o datos ajenos.',
    'Si incluyes referencias laborales, personales o familiares, declaras que esas personas te autorizaron a compartir sus datos de contacto.',
  ]],
  ['5. Tu contenido', [
    'La información y los documentos que creas te pertenecen. Nos autorizas a almacenarlos y procesarlos únicamente para prestarte el servicio: mostrarlos, generar tus PDF y aplicar las funciones que tú solicites.',
  ]],
  ['6. Asistente de inteligencia artificial', [
    'El asistente sugiere textos y plantillas, y puede cometer errores. Ninguna sugerencia se aplica sin tu aprobación, y eres responsable de revisar la exactitud del contenido final.',
    'El asistente funciona en un servidor propio: tus textos no se envían a servicios de IA de terceros.',
  ]],
  ['7. Disponibilidad', [
    'Hacemos lo posible por mantener el servicio disponible, pero puede tener interrupciones, cambios o fallas. El servicio se ofrece "tal cual", sin garantías de disponibilidad continua.',
  ]],
  ['8. Limitación de responsabilidad', [
    `${LEGAL.app} es una herramienta de apoyo: no garantiza la obtención de empleo, entrevistas ni resultados en procesos de selección. No somos responsables por decisiones tomadas por terceros con base en tu hoja de vida.`,
  ]],
  ['9. Cancelación de la cuenta', [
    `Puedes solicitar la eliminación de tu cuenta y de tus hojas de vida en cualquier momento escribiendo a ${LEGAL.email}. Podemos suspender cuentas que incumplan estos términos.`,
  ]],
  ['10. Cambios', [
    'Podemos actualizar estos términos. Publicaremos la versión vigente en esta página con su fecha; si los cambios son relevantes, te pediremos aceptarlos de nuevo.',
  ]],
  ['11. Ley aplicable', [
    `Estos términos se rigen por las leyes de la República de ${LEGAL.country}.`,
  ]],
];

const PRIVACY = [
  ['1. Responsable del tratamiento', [
    `${LEGAL.owner}, responsable de ${LEGAL.app}. Contacto: ${LEGAL.email}.`,
    'Esta política se adopta en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas de protección de datos personales en Colombia.',
  ]],
  ['2. Datos que tratamos', [
    'De tu cuenta: nombre, correo electrónico e identificador y foto de tu cuenta de Google cuando te registras con Google.',
    'De tus hojas de vida, solo lo que tú decidas registrar: datos de contacto, perfil profesional, experiencia, educación, habilidades, certificados, fotografía y, en el formato tradicional, número de documento, fecha y lugar de nacimiento, estado civil, dirección, firma y referencias.',
    'Técnicos: cookie de sesión y dirección IP, usados solo para mantener tu sesión y proteger el servicio contra accesos indebidos.',
  ]],
  ['3. Finalidades', [
    'Crear y administrar tu cuenta; almacenar, mostrar y generar tus hojas de vida en PDF; ofrecer las funciones del asistente de IA que tú solicites; y garantizar la seguridad del servicio. No vendemos ni cedemos tus datos, ni los usamos para publicidad.',
  ]],
  ['4. Datos sensibles y opcionales', [
    'La fotografía y la firma pueden considerarse datos sensibles. Su registro es opcional y no es obligatorio responder preguntas sobre datos sensibles. Si los incluyes, autorizas expresamente su tratamiento para las finalidades descritas.',
  ]],
  ['5. Datos de terceros', [
    'Si registras referencias, declaras contar con la autorización de esas personas para compartir su nombre, ocupación y teléfono con este fin.',
  ]],
  ['6. Tus derechos', [
    'Como titular puedes: conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización otorgada; ser informado sobre el uso de tus datos; revocar la autorización o solicitar la supresión cuando no exista un deber legal de conservarlos; acceder gratuitamente a tus datos; y presentar quejas ante la Superintendencia de Industria y Comercio.',
  ]],
  ['7. Cómo ejercerlos', [
    `Escribe a ${LEGAL.email} indicando tu nombre, el correo de tu cuenta y tu solicitud. Las consultas se responden en máximo diez (10) días hábiles y los reclamos en máximo quince (15) días hábiles, prorrogables en los términos de la ley.`,
    'También puedes actualizar o eliminar la mayor parte de tu información directamente desde la aplicación.',
  ]],
  ['8. Seguridad y conservación', [
    'Los datos se almacenan en un servidor propio, con acceso protegido por autenticación, contraseñas cifradas y conexión segura. Conservamos tus datos mientras tengas una cuenta activa o hasta que solicites su supresión.',
    'Google solo interviene para autenticarte cuando eliges registrarte o ingresar con Google.',
  ]],
  ['9. Cookies', [
    'Usamos únicamente una cookie técnica de sesión, necesaria para mantenerte conectado. No usamos cookies de publicidad ni de seguimiento.',
  ]],
  ['10. Vigencia', [
    `Esta política rige desde el ${LEGAL.updated}. Cualquier cambio sustancial será informado en esta página.`,
  ]],
];

export default function LegalPage({ doc }) {
  const isTerms = doc === 'terms';
  const sections = isTerms ? TERMS : PRIVACY;
  const title = isTerms ? 'Términos y Condiciones' : 'Política de Tratamiento de Datos Personales';

  useEffect(() => {
    document.title = `${title} | ${LEGAL.app}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute(
      'href', `https://cv.nestordevelop.online/${isTerms ? 'terminos' : 'privacidad'}`
    );
  }, [title, isTerms]);

  return (
    <div className="landing app-bg">
      <header className="landing-nav">
        <div className="landing-container landing-nav-inner">
          <a className="landing-logo" href="/" style={{ textDecoration: 'none' }}>
            <span className="cv-index-logo-icon"><i className="fa-solid fa-id-card" /></span>
            {LEGAL.app}
          </a>
          <a className="landing-nav-btn" href="/" style={{ textDecoration: 'none' }}>
            <i className="fa-solid fa-arrow-left" /> Volver
          </a>
        </div>
      </header>

      <main className="landing-container">
        <article className="legal">
          <p className="home-eyebrow">{isTerms ? 'Condiciones de uso' : 'Habeas data'}</p>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-updated">Última actualización: {LEGAL.updated}</p>

          {sections.map(([heading, paragraphs]) => (
            <section key={heading} className="legal-section">
              <h2>{heading}</h2>
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}

          <p className="legal-switch">
            {isTerms
              ? <>Consulta también la <a href="/privacidad">Política de Tratamiento de Datos Personales</a>.</>
              : <>Consulta también los <a href="/terminos">Términos y Condiciones</a>.</>}
          </p>
        </article>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          {LEGAL.app} · <a href="/terminos">Términos</a> · <a href="/privacidad">Privacidad</a>
        </div>
      </footer>
    </div>
  );
}
