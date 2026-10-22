import React, { useState, useRef, useEffect } from 'react';
import { importCvFromPdf } from '../../api/aiApi.js';

const STEPS = [
  { key: 'read', label: 'Leyendo el PDF y detectando secciones' },
  { key: 'analyze', label: 'Organizando la experiencia laboral con IA' },
  { key: 'save', label: 'Creando tu hoja de vida' },
];

// "Import from PDF" panel of the new-CV modal
export default function ImportCv({ onImported }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState('idle'); // idle | working | error
  const [step, setStep] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const pick = (f) => {
    setError('');
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('El archivo debe ser un PDF'); return; }
    if (f.size > 8 * 1024 * 1024) { setError('El PDF supera 8 MB'); return; }
    setFile(f);
  };

  const run = async () => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState('working');
    setStep('read');
    setError('');
    try {
      const result = await importCvFromPdf(file, ({ data }) => data.step && setStep(data.step), ctrl.signal);
      onImported(result);
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setError(err.message);
      setState('error');
    }
  };

  const stepIndex = STEPS.findIndex(s => s.key === step);

  if (state === 'working') {
    return (
      <div className="import-progress">
        {STEPS.map((s, i) => (
          <div key={s.key} className={`import-step ${i < stepIndex ? 'is-done' : i === stepIndex ? 'is-active' : ''}`}>
            <span className="import-step-icon">
              <i className={`fa-solid ${i < stepIndex ? 'fa-check' : i === stepIndex ? 'fa-spinner fa-spin' : 'fa-circle'}`} />
            </span>
            {s.label}
          </div>
        ))}
        <p className="import-hint">Suele tardar menos de un minuto. No cierres esta ventana.</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`import-drop ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]); }}
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      >
        <i className={`fa-solid ${file ? 'fa-file-pdf' : 'fa-cloud-arrow-up'}`} />
        {file
          ? <><strong>{file.name}</strong><span>{(file.size / 1024).toFixed(0)} KB · haz clic para cambiarlo</span></>
          : <><strong>Arrastra tu hoja de vida en PDF</strong><span>o haz clic para elegir el archivo (máx. 8 MB)</span></>}
        <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={e => pick(e.target.files[0])} />
      </div>
      <p className="import-hint">
        Detectamos tus datos, experiencia, educación, habilidades y referencias, y creamos una hoja de vida editable.
        Funciona con PDF exportados desde Word u otros editores (no escaneados).
      </p>
      {error && (
        <p className="cv-modal-error"><i className="fa-solid fa-circle-exclamation" /> {error}</p>
      )}
      <div className="cv-modal-actions">
        <button className="cv-modal-confirm" onClick={run} disabled={!file}>
          <i className="fa-solid fa-wand-magic-sparkles" /> {state === 'error' ? 'Reintentar' : 'Importar'}
        </button>
      </div>
    </div>
  );
}
