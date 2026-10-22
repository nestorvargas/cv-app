import React, { useState, useEffect, useRef } from 'react';

// Shrinks fixed-width content (A4 pages) to fit the available width. Never upscales.
export default function FitToWidth({ width, gap = 0, children }) {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setZoom(Math.min(1, entry.contentRect.width / width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div style={{ zoom, width, margin: '0 auto', display: 'flex', flexDirection: 'column', gap }}>
        {children}
      </div>
    </div>
  );
}
