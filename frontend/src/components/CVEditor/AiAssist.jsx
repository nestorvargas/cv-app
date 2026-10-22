import React, { useState, useRef, useEffect } from 'react';
import { getAiStatus, streamAssist } from '../../api/aiApi.js';

const ACTIONS = {
  generate:  { icon: 'fa-file-pen',            es: 'Generar desde mi CV', en: 'Generate from my CV' },
  improve:   { icon: 'fa-pen-nib',             es: 'Mejorar',             en: 'Improve' },
  shorten:   { icon: 'fa-compress',            es: 'Acortar',             en: 'Shorten' },
  translate: { icon: 'fa-language',            es: 'Pasar a español',     en: 'Translate to English' },
};

// Shared across instances so the status is fetched once per page load
let statusPromise = null;
const loadStatus = () => {
  statusPromise = statusPromise || getAiStatus().then(r => r.data).catch(() => ({ enabled: false }));
  return statusPromise;
};

// AI toolbar for a text field: proposes a new text that the user can accept or discard.
export default function AiAssist({ field, text, context, lang, actions, onApply }) {
  const isEn = lang === 'en';
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    let alive = true;
    loadStatus().then(s => alive && setEnabled(!!s.enabled));
    return () => { alive = false; abortRef.current?.abort(); };
  }, []);

  if (!enabled) return null;

  const run = async (action) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLastAction(action);
    setState('loading');
    setResult('');
    setError('');
    try {
      const full = await streamAssist({ action, field, text, context, lang }, setResult, ctrl.signal);
      setResult(full.trim());
      setState('done');
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setError(err.message);
      setState('error');
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setState(result ? 'done' : 'idle');
  };

  const discard = () => {
    setState('idle');
    setResult('');
  };

  const apply = () => {
    onApply(result.trim());
    discard();
  };

  const busy = state === 'loading';
  const hasText = !!(text || '').trim();

  return (
    <div className="ai-assist">
      <div className="ai-toolbar">
        <span className="ai-badge"><i className="fa-solid fa-wand-magic-sparkles" /> IA</span>
        {actions.map(a => (
          <button
            key={a}
            type="button"
            className="ai-action"
            onClick={() => run(a)}
            disabled={busy || (a !== 'generate' && !hasText)}
            title={a !== 'generate' && !hasText ? (isEn ? 'Write some text first' : 'Escribe un texto primero') : undefined}
          >
            <i className={`fa-solid ${ACTIONS[a].icon}`} /> {isEn ? ACTIONS[a].en : ACTIONS[a].es}
          </button>
        ))}
      </div>

      {state !== 'idle' && (
        <div className={`ai-panel ${state === 'error' ? 'is-error' : ''}`}>
          <div className="ai-panel-head">
            <span>
              <i className="fa-solid fa-wand-magic-sparkles" />{' '}
              {busy
                ? (isEn ? 'Writing...' : 'Escribiendo...')
                : state === 'error'
                  ? (isEn ? 'Could not generate' : 'No se pudo generar')
                  : (isEn ? 'Suggestion' : 'Sugerencia')}
            </span>
            {busy && (
              <button type="button" className="ai-link" onClick={cancel}>{isEn ? 'Stop' : 'Detener'}</button>
            )}
          </div>

          {state === 'error' ? (
            <p className="ai-error">{error}</p>
          ) : (
            <p className="ai-text">
              {result}
              {busy && <span className="ai-cursor" />}
            </p>
          )}

          {!busy && (
            <div className="ai-panel-actions">
              {state === 'done' && result && (
                <button type="button" className="btn-primary ai-apply" onClick={apply}>
                  <i className="fa-solid fa-check" /> {isEn ? 'Use this text' : 'Usar texto'}
                </button>
              )}
              <button type="button" className="btn-ghost" onClick={() => run(lastAction)}>
                <i className="fa-solid fa-rotate-right" /> {isEn ? 'Retry' : 'Reintentar'}
              </button>
              <button type="button" className="btn-ghost" onClick={discard}>
                {isEn ? 'Discard' : 'Descartar'}
              </button>
            </div>
          )}
          <p className="ai-disclaimer">
            {isEn
              ? 'AI can make mistakes. Review the text before using it.'
              : 'La IA puede equivocarse. Revisa el texto antes de usarlo.'}
          </p>
        </div>
      )}
    </div>
  );
}
