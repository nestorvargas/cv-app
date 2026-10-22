import React, { useState, useEffect } from 'react';
import { login } from '../../api/authApi.js';
import './auth.css';

const STEPS = [
  { icon: 'fa-pen-to-square', title: 'Completa tus datos', text: 'Perfil, experiencia, educación y habilidades en un formulario guiado, con consejos en cada sección.' },
  { icon: 'fa-wand-magic-sparkles', title: 'Mejóralo con IA', text: 'El asistente redacta, mejora, acorta y traduce tus textos sin inventar información.' },
  { icon: 'fa-file-arrow-down', title: 'Descarga y postúlate', text: 'Elige una plantilla, revisa la vista previa y descarga tu PDF en español o inglés.' },
];

const FEATURES = [
  { icon: 'fa-wand-magic-sparkles', title: 'Asistente de IA privado', text: 'Corre en un servidor propio: tus datos no salen a servicios externos.' },
  { icon: 'fa-language', title: 'Español e inglés', text: 'Mantén las dos versiones de cada hoja de vida y tradúcelas con un clic.' },
  { icon: 'fa-palette', title: '6 plantillas', text: 'Diseños visuales y una plantilla ATS con texto legible por los filtros de selección.' },
  { icon: 'fa-eye', title: 'Vista previa en vivo', text: 'Cada cambio se refleja al instante, con paginado real en hojas A4.' },
  { icon: 'fa-briefcase', title: 'Base de cargos', text: 'Elige tu título profesional de un catálogo por área o escribe el tuyo.' },
  { icon: 'fa-layer-group', title: 'Varias versiones', text: 'Crea una hoja de vida por cada oferta y adapta el enfoque en minutos.' },
];

// Before/after examples cycled by the assistant demo
const DEMOS = [
  {
    field: 'Experiencia',
    before: 'hacia reportes y manejaba la base de datos de clientes',
    after: 'Elaboré reportes de gestión y administré la base de datos de clientes, garantizando información confiable para la toma de decisiones.',
  },
  {
    field: 'Perfil profesional',
    before: 'soy desarrollador, se node y react, trabajo en equipo',
    after: 'Desarrollador Full Stack con experiencia en Node.js y React, orientado al trabajo colaborativo y a la entrega de soluciones de calidad.',
  },
  {
    field: 'Experiencia',
    before: 'revisaba la calidad de los productos en el laboratorio',
    after: 'Realicé análisis de calidad de materias primas y producto terminado, asegurando el cumplimiento de las Buenas Prácticas de Laboratorio.',
  },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Animated "assistant at work" card: types the improved version of a rough text
function AiDemo() {
  const [reduced] = useState(prefersReducedMotion);
  const [demo, setDemo] = useState(0);
  const [typed, setTyped] = useState(reduced ? DEMOS[0].after.length : 0);
  const current = DEMOS[demo];

  useEffect(() => {
    if (reduced) return;
    if (typed < current.after.length) {
      const t = setTimeout(() => setTyped(n => n + 2), 28);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDemo(d => (d + 1) % DEMOS.length);
      setTyped(0);
    }, 2600);
    return () => clearTimeout(t);
  }, [typed, current, reduced]);

  const done = typed >= current.after.length;

  return (
    <div className="ai-demo" aria-hidden="true">
      <div className="ai-demo-head">
        <span className="ai-demo-field"><i className="fa-solid fa-pen" /> {current.field}</span>
        <span className={`ai-demo-status ${done ? 'is-done' : ''}`}>
          <i className={`fa-solid ${done ? 'fa-circle-check' : 'fa-wand-magic-sparkles'}`} />
          {done ? 'Mejorado con IA' : 'Mejorando...'}
        </span>
      </div>
      <p className="ai-demo-before">{current.before}</p>
      <p className="ai-demo-after">
        {current.after.slice(0, typed)}
        {!done && <span className="ai-demo-cursor" />}
      </p>
    </div>
  );
}

// Decorative CV sheet behind the assistant card
function CvMock() {
  return (
    <div className="cv-mock" aria-hidden="true">
      <div className="cv-mock-side">
        <div className="cv-mock-avatar" />
        <span className="cv-mock-line w70 light" />
        <span className="cv-mock-line w50 light" />
        <div className="cv-mock-chips">
          <span /><span /><span /><span /><span />
        </div>
      </div>
      <div className="cv-mock-main">
        <span className="cv-mock-line w60 title" />
        <span className="cv-mock-line w40 accent" />
        <span className="cv-mock-sep" />
        <span className="cv-mock-line w90" />
        <span className="cv-mock-line w80" />
        <span className="cv-mock-line w85" />
        <span className="cv-mock-sep" />
        <span className="cv-mock-line w50 strong" />
        <span className="cv-mock-line w90" />
        <span className="cv-mock-line w70" />
      </div>
    </div>
  );
}

function LoginModal({ onLogin, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await login(username.trim(), password);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cv-modal-overlay" onMouseDown={onClose}>
      <form
        className="auth-card"
        onSubmit={handleSubmit}
        onMouseDown={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button type="button" className="auth-close" onClick={onClose} aria-label="Cerrar">
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="auth-logo"><i className="fa-solid fa-id-card" /></div>
        <h2 className="auth-title" id="auth-title">Iniciar sesión</h2>
        <p className="auth-subtitle">Ingresa con tu usuario para continuar</p>

        <label className="auth-label" htmlFor="auth-username">Usuario</label>
        <div className="auth-input">
          <i className="fa-solid fa-user" />
          <input
            id="auth-username"
            className="cv-modal-input"
            type="text"
            autoComplete="username"
            placeholder="Tu usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
          />
        </div>

        <label className="auth-label" htmlFor="auth-password">Contraseña</label>
        <div className="auth-input">
          <i className="fa-solid fa-lock" />
          <input
            id="auth-password"
            className="cv-modal-input"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="cv-modal-error">
            <i className="fa-solid fa-circle-exclamation" /> {error}
          </p>
        )}

        <button className="cv-modal-confirm auth-submit" type="submit" disabled={submitting || !username || !password}>
          {submitting
            ? <><i className="fa-solid fa-spinner fa-spin" /> Ingresando...</>
            : <><i className="fa-solid fa-right-to-bracket" /> Ingresar</>
          }
        </button>
        <p className="auth-footnote">¿No tienes cuenta? Pídela a un administrador.</p>
      </form>
    </div>
  );
}

// Public home (landing) with the login in a modal
export default function LoginPage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => setShowLogin(true);

  return (
    <div className="landing app-bg">
      <header className="landing-nav">
        <div className="landing-container landing-nav-inner">
          <div className="landing-logo">
            <span className="cv-index-logo-icon"><i className="fa-solid fa-id-card" /></span>
            CV Manager
          </div>
          <button className="landing-nav-btn" onClick={openLogin}>
            <i className="fa-solid fa-right-to-bracket" /> Iniciar sesión
          </button>
        </div>
      </header>

      <main>
        <section className="landing-container landing-hero">
          <div className="landing-hero-copy">
            <div className="home-brand">
              <span className="home-brand-dot" /> Nuevo · Asistente de IA para tu CV
            </div>
            <p className="home-eyebrow">App para crear hojas de vida</p>
            <h1 className="home-title">
              Tu hoja de vida, <span className="gradient-text">mejor escrita con IA</span>
            </h1>
            <p className="home-lead">
              Redacta, mejora y traduce tu perfil y experiencia con un asistente de IA privado.
              Elige una plantilla y descarga un PDF listo para enviar.
            </p>
            <div className="landing-cta">
              <button className="cv-index-add-btn landing-cta-main" onClick={openLogin}>
                Empezar ahora <i className="fa-solid fa-arrow-right" />
              </button>
              <a className="landing-cta-link" href="#como-funciona">
                Cómo funciona <i className="fa-solid fa-chevron-down" />
              </a>
            </div>
            <ul className="landing-trust">
              <li><i className="fa-solid fa-shield-halved" /> IA en servidor propio</li>
              <li><i className="fa-solid fa-robot" /> Compatible con ATS</li>
              <li><i className="fa-solid fa-language" /> ES / EN</li>
            </ul>
          </div>

          <div className="landing-visual">
            <CvMock />
            <AiDemo />
          </div>
        </section>

        <section className="landing-container landing-section" id="como-funciona">
          <p className="home-eyebrow">Cómo funciona</p>
          <h2 className="landing-h2">De cero a tu PDF en <span className="gradient-text">3 pasos</span></h2>
          <ol className="landing-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="landing-step">
                <span className="landing-step-num">{i + 1}</span>
                <span className="landing-step-icon"><i className={`fa-solid ${s.icon}`} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-container landing-section">
          <p className="home-eyebrow">Funcionalidades</p>
          <h2 className="landing-h2">Todo lo que necesitas para <span className="gradient-text">postularte</span></h2>
          <div className="landing-features">
            {FEATURES.map(f => (
              <article key={f.title} className="landing-feature">
                <span className="landing-feature-icon"><i className={`fa-solid ${f.icon}`} /></span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-container landing-section">
          <div className="landing-final">
            <h2 className="landing-h2">¿Listo para tu próxima postulación?</h2>
            <p className="home-lead">Ingresa y crea tu hoja de vida con la ayuda del asistente.</p>
            <button className="cv-index-add-btn landing-cta-main" onClick={openLogin}>
              Iniciar sesión <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          CV Manager · App para crear hojas de vida
        </div>
      </footer>

      {showLogin && <LoginModal onLogin={onLogin} onClose={() => setShowLogin(false)} />}
    </div>
  );
}
