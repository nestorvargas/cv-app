import React from 'react';
import Classic from './Classic.jsx';
import Modern from './Modern.jsx';
import Executive from './Executive.jsx';
import Creative from './Creative.jsx';
import Minimal from './Minimal.jsx';

export default function CVPreview({ cvData, lang, template = 'classic', accentColor, bgColor, pageMinHeight }) {
  const p = { cvData, lang, accentColor, bgColor, pageMinHeight };
  if (template === 'modern')    return <Modern    {...p} />;
  if (template === 'executive') return <Executive {...p} />;
  if (template === 'creative')  return <Creative  {...p} />;
  if (template === 'minimal')   return <Minimal   {...p} />;
  return <Classic {...p} />;
}
