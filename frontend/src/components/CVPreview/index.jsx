import React from 'react';
import Classic from './Classic.jsx';
import Modern from './Modern.jsx';
import Executive from './Executive.jsx';
import Creative from './Creative.jsx';
import Minimal from './Minimal.jsx';

export default function CVPreview({ cvData, lang, template = 'classic', accentColor, bgColor }) {
  if (template === 'modern')    return <Modern    cvData={cvData} lang={lang} accentColor={accentColor} bgColor={bgColor} />;
  if (template === 'executive') return <Executive cvData={cvData} lang={lang} accentColor={accentColor} bgColor={bgColor} />;
  if (template === 'creative')  return <Creative  cvData={cvData} lang={lang} accentColor={accentColor} bgColor={bgColor} />;
  if (template === 'minimal')   return <Minimal   cvData={cvData} lang={lang} accentColor={accentColor} bgColor={bgColor} />;
  return <Classic cvData={cvData} lang={lang} accentColor={accentColor} bgColor={bgColor} />;
}
