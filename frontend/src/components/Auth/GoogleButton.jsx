import React, { useEffect, useRef } from 'react';

const GSI_SRC = 'https://accounts.google.com/gsi/client';
let gsiPromise = null;

function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve();
  gsiPromise = gsiPromise || new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => { gsiPromise = null; reject(new Error('No se pudo cargar Google')); };
    document.head.appendChild(script);
  });
  return gsiPromise;
}

// Official "Continue with Google" button (Google Identity Services); returns the ID token
export default function GoogleButton({ clientId, onCredential, onError, text = 'continue_with' }) {
  const ref = useRef(null);
  const cbRef = useRef(onCredential);
  cbRef.current = onCredential;

  useEffect(() => {
    let alive = true;
    loadGsi()
      .then(() => {
        if (!alive || !ref.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp) => cbRef.current(resp.credential),
          ux_mode: 'popup',
        });
        window.google.accounts.id.renderButton(ref.current, {
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
          text,
          width: Math.min(338, ref.current.offsetWidth || 338),
          locale: 'es',
        });
      })
      .catch(err => onError?.(err.message));
    return () => { alive = false; };
  }, [clientId, text, onError]);

  return <div ref={ref} className="google-btn" />;
}
