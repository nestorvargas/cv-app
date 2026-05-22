import React from 'react';
import Classic from './Classic.jsx';
import Modern from './Modern.jsx';
import Executive from './Executive.jsx';
import Creative from './Creative.jsx';

export default function CVPreview({ cvData, lang, template = 'classic' }) {
  if (template === 'modern') return <Modern cvData={cvData} lang={lang} />;
  if (template === 'executive') return <Executive cvData={cvData} lang={lang} />;
  if (template === 'creative') return <Creative cvData={cvData} lang={lang} />;
  return <Classic cvData={cvData} lang={lang} />;
}
