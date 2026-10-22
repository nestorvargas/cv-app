import React, { useState, useRef, useEffect } from 'react';
import { getAiStatus, streamAssist } from '../../api/aiApi.js';
import { AREAS, getArea } from './areas.js';

// AI card in the Templates tab: recommends a template for this CV (and an optional job posting)
export default function TemplateAdvisor({ cvData, lang, templates, onApply }) {
  const [enabled, setEnabled] = useState(false);
  const [offer, setOffer] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  useEffect(() => {
    getAiStatus().then(r => setEnabled(!!r.data.enabled)).catch(() => {});
    return () => abortRef.current?.abort();
  }, []);

  if (!enabled) return null;

  const run = async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState('loading');
    setResult('');
    setError('');
    const area = getArea(cvData);
    const experience = cvData.experience || [];
    try {
      const full = await streamAssist({
        action: 'template',
        lang,
        text: offer.trim().slice(0, 3500),
        context: {
          area: AREAS[area].name.es,
          title: cvData.personal_info?.title,
          experienceCount: experience.length,
          textLength: (cvData.summary || '').length + experience.reduce((n, e) => n + (e.description || '').length, 0),
          hasPhoto: !!cvData.profile_image,
          templates: templates.map(t => ({ id: t.id, description: `${t.name}. ${t.description}` })),
        },
      }, setResult, ctrl.signal);
      setResult(full.trim());
      setState('done');
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setError(err.message);
      setState('error');
    }
  };

  // First template id mentioned on the "Plantilla: <id>" line (or anywhere as fallback)
  const firstLine = result.split('\n')[0].toLowerCase();
  const picked = templates.find(t => firstLine.includes(t.id))
    || templates.find(t => result.toLowerCase().includes(`"${t.id}"`));
  const explanation = result.split('\n').slice(1).join(' ').trim();

  return (
    <div className="tpl-advisor">
      <div className="tpl-advisor-head">
        <span className="ai-badge"><i className="fa-solid fa-wand-magic-sparkles" /> IA</span>
        <strong>¿Qué plantilla me conviene?</strong>
      </div>
      <p className="ed-help" style={{ marginTop: 4 }}>
        Analiza tu área, cargo y extensión del CV. Si pegas la oferta, la recomendación se ajusta a ella.
      </p>
      <textarea
        className="tpl-advisor-offer"
        rows={3}
        value={offer}
        onChange={e => setOffer(e.target.value)}
        placeholder="Opcional: pega aquí el texto de la oferta de empleo"
      />
      <button type="button" className="btn-primary" onClick={run} disabled={state === 'loading'}>
        <i className={`fa-solid ${state === 'loading' ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`} />
        {state === 'loading' ? 'Analizando...' : 'Recomendar plantilla'}
      </button>

      {state === 'error' && <p className="ai-error" style={{ marginTop: 10 }}>{error}</p>}

      {(state === 'loading' || state === 'done') && result && (
        <div className="ai-panel">
          {picked && state === 'done' ? (
            <>
              <div className="tpl-advisor-pick">
                Recomendada: <strong>{picked.name}</strong>
              </div>
              {explanation && <p className="ai-text">{explanation}</p>}
              <div className="ai-panel-actions">
                <button type="button" className="btn-primary ai-apply" onClick={() => onApply(picked.id)}>
                  <i className="fa-solid fa-check" /> Usar {picked.name}
                </button>
              </div>
            </>
          ) : (
            <p className="ai-text">{result}{state === 'loading' && <span className="ai-cursor" />}</p>
          )}
          <p className="ai-disclaimer">La IA puede equivocarse. Revisa la vista previa antes de descargar.</p>
        </div>
      )}
    </div>
  );
}
