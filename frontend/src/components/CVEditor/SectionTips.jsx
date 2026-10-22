import React, { useState } from 'react';
import { AREAS } from './areas.js';

// Writing tips shown at the bottom of each editor section
const TIPS = {
  personal: {
    es: [
      'Usa un correo profesional, idealmente con tu nombre.',
      'En "Título profesional" pon el cargo al que aplicas, no el que tuviste.',
      'Con ciudad y país basta: no incluyas tu dirección completa.',
      'Revisa que el enlace de LinkedIn esté personalizado (linkedin.com/in/tu-nombre).',
    ],
    en: [
      'Use a professional email, ideally with your name.',
      'Set "Professional title" to the role you are applying for.',
      'City and country are enough: skip your full address.',
      'Use a custom LinkedIn URL (linkedin.com/in/your-name).',
    ],
  },
  photo: {
    es: [
      'Fondo neutro, buena luz y encuadre de hombros hacia arriba.',
      'Vestimenta acorde al cargo al que aplicas.',
      'Para la plantilla ATS la foto no se usa: los sistemas de selección la ignoran.',
    ],
    en: [
      'Neutral background, good lighting, shoulders-up framing.',
      'Dress for the role you are applying to.',
      'The ATS template skips the photo: screening systems ignore it.',
    ],
  },
  summary: {
    es: [
      'Empieza con tu cargo y años de experiencia: {example}.',
      'Menciona 3 a 5 fortalezas o herramientas clave que pida la oferta.',
      'Cierra con lo que aportas a la empresa, no con lo que buscas.',
      'Entre 400 y 1.100 caracteres suele ser suficiente.',
    ],
    en: [
      'Start with your role and years of experience: {example}.',
      'Mention 3 to 5 strengths or key tools the job asks for.',
      'Close with what you bring to the company, not what you are looking for.',
      'Between 400 and 1,100 characters is usually enough.',
    ],
  },
  experience: {
    es: [
      'Ordena de la más reciente a la más antigua.',
      'Empieza cada frase con un verbo de acción: lideré, implementé, reduje, mejoré.',
      'Cuantifica cuando puedas: porcentajes, tiempos, volúmenes, equipos.',
      'Prioriza lo relevante para la oferta; lo demás puede ir más corto.',
    ],
    en: [
      'List from most recent to oldest.',
      'Start each sentence with an action verb: led, built, reduced, improved.',
      'Quantify when you can: percentages, time, volume, team size.',
      'Prioritize what matters for the job; keep the rest short.',
    ],
  },
  education: {
    es: [
      'Pon primero el título más alto o el más relevante para el cargo.',
      'Si estás estudiando, indícalo: "2018 - en curso".',
      'Los cursos cortos van mejor en Certificados.',
    ],
    en: [
      'List your highest or most relevant degree first.',
      'If still studying, say so: "2018 - present".',
      'Short courses fit better under Certificates.',
    ],
  },
  skills: {
    es: [
      'Usa las mismas palabras que aparecen en la oferta: ayuda con los filtros ATS.',
      'Mejor 8 a 15 habilidades concretas que una lista muy larga.',
      'Puedes renombrar las categorías según tu área profesional.',
      'En idiomas, indica el nivel: "Inglés (B2)".',
    ],
    en: [
      'Use the same words as the job posting: it helps with ATS filters.',
      'Prefer 8 to 15 concrete skills over a very long list.',
      'You can rename categories to fit your field.',
      'For languages, state the level: "English (B2)".',
    ],
  },
  certificates: {
    es: [
      'Incluye primero los certificados relacionados con la oferta.',
      'Agrega el enlace de verificación cuando exista.',
      'Si un certificado vence, indica el año de vigencia.',
    ],
    en: [
      'List certificates related to the job first.',
      'Add the verification link when available.',
      'If a certificate expires, include its validity year.',
    ],
  },
  references: {
    es: [
      'Incluye 2 referencias laborales y 1 o 2 personales o familiares.',
      'Avisa a tus referencias que podrían llamarlas.',
      'Verifica que los teléfonos estén actualizados.',
    ],
    en: [
      'Include 2 professional and 1 or 2 personal references.',
      'Let your references know they may be contacted.',
      'Double-check that phone numbers are up to date.',
    ],
  },
  templates: {
    es: [
      'Para enviar por portales de empleo usa la plantilla ATS: el texto es legible por máquinas.',
      'Para enviar directo a una persona, una plantilla visual destaca más.',
      'Revisa la vista previa antes de descargar: verifica que nada quede cortado entre páginas.',
    ],
    en: [
      'For job portals use the ATS template: its text is machine-readable.',
      'When sending to a person directly, a visual template stands out more.',
      'Check the preview before downloading so nothing is cut between pages.',
    ],
  },
};

export default function SectionTips({ section, lang, area }) {
  const [open, setOpen] = useState(true);
  const L = lang === 'en' ? 'en' : 'es';
  const example = AREAS[area]?.summaryExample[L] || '';
  const tips = TIPS[section]?.[L]?.map(t => t.replace('{example}', example));
  if (!tips) return null;

  return (
    <aside className={`ed-tips ${open ? 'is-open' : ''}`}>
      <button type="button" className="ed-tips-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span><i className="fa-solid fa-lightbulb" /> {lang === 'en' ? 'Tips' : 'Consejos'}</span>
        <i className="fa-solid fa-chevron-down ed-item-chevron" />
      </button>
      {open && (
        <ul>
          {tips.map(t => <li key={t}>{t}</li>)}
        </ul>
      )}
    </aside>
  );
}
