import React, { useRef, useEffect, useState } from 'react';
import CVTemplateRenderer from './index.jsx';

const PAGE_W = 794;
const PAGE_H = 1123;

export default function CVPagedViewer({ cvData, lang, template, accentColor, bgColor }) {
  const ghostRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);

  const props = { cvData, lang, template, accentColor, bgColor };

  useEffect(() => {
    const el = ghostRef.current;
    if (!el) return;
    const update = () => {
      setPageCount(Math.max(1, Math.ceil(el.scrollHeight / PAGE_H)));
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [cvData, lang, template, accentColor, bgColor]);

  return (
    <>
      {/* Hidden ghost — used only to measure total rendered height */}
      <div
        ref={ghostRef}
        style={{
          position: 'fixed',
          top: '-400%',
          left: 0,
          width: PAGE_W,
          pointerEvents: 'none',
          visibility: 'hidden',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <CVTemplateRenderer {...props} />
      </div>

      {Array.from({ length: pageCount }, (_, i) => (
        <div
          key={i}
          style={{
            width: PAGE_W,
            height: PAGE_H,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            background: 'white',
            boxShadow: '0 4px 24px rgba(0,0,0,0.55)',
          }}
        >
          <div style={{ position: 'absolute', top: -i * PAGE_H, left: 0, width: PAGE_W }}>
            <CVTemplateRenderer {...props} />
          </div>
        </div>
      ))}
    </>
  );
}
