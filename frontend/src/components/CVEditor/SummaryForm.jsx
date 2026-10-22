import React from 'react';
import TextCounter from './TextCounter.jsx';
import AiAssist from './AiAssist.jsx';

export default function SummaryForm({ value, onChange, lang, cvData }) {
  const isEn = lang === 'en';
  return (
    <div>
      <div className="ed-section-head">
        <div>
          <h3 className="ed-section-title">{isEn ? 'Professional Summary' : 'Perfil Profesional'}</h3>
          <p className="ed-section-hint">
            {isEn
              ? 'Who you are, years of experience, key technologies and what you bring.'
              : 'Quién eres, años de experiencia, tecnologías clave y qué aportas.'}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="summary-text">{isEn ? 'Summary text' : 'Texto del resumen'}</label>
        <textarea
          id="summary-text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={12}
          style={{ minHeight: 240, lineHeight: 1.6 }}
        />
        <TextCounter value={value} min={400} max={1100} lang={lang} />
        <AiAssist
          field="summary"
          text={value}
          lang={lang}
          actions={['generate', 'improve', 'shorten', 'translate']}
          context={{
            title: cvData?.personal_info?.title,
            experience: cvData?.experience,
            education: cvData?.education,
            skills: cvData?.skills,
          }}
          onApply={onChange}
        />
      </div>
    </div>
  );
}
