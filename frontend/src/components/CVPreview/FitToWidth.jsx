import React, { useState, useEffect, useRef } from 'react';

// Shrinks fixed-width content (A4 pages) to fit the available width. Never upscales.
// Uses transform (not CSS zoom): under zoom, mobile WebKit clamps the zoomed
// text to its minimum font size, so the CV fonts blow up on phones.
export default function FitToWidth({ width, gap = 0, children }) {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [innerH, setInnerH] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const ro = new ResizeObserver(() => {
      // A hidden pane (mobile "Editar" tab) reports 0: keep the last scale so
      // the content never collapses to scale(0) and gets measured as empty.
      if (el.clientWidth > 0) setScale(Math.min(1, el.clientWidth / width));
      setInnerH(inner.offsetHeight);
    });
    ro.observe(el);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} style={{ width: '100%', height: innerH * scale, overflow: 'hidden' }}>
      <div
        ref={innerRef}
        style={{
          width,
          marginLeft: `max(0px, calc((100% - ${width * scale}px) / 2))`,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          display: 'flex',
          flexDirection: 'column',
          gap,
        }}
      >
        {children}
      </div>
    </div>
  );
}
