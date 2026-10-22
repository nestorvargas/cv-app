import React from 'react';
import Classic from './Classic.jsx';
import Modern from './Modern.jsx';
import Executive from './Executive.jsx';
import Creative from './Creative.jsx';
import Minimal from './Minimal.jsx';
import Ats from './Ats.jsx';
import Elegant from './Elegant.jsx';
import Timeline from './Timeline.jsx';
import Compact from './Compact.jsx';
import Corporate from './Corporate.jsx';

export default function CVPreview({ cvData, lang, template = 'classic', accentColor, bgColor, pageMinHeight }) {
  const p = { cvData, lang, accentColor, bgColor, pageMinHeight };
  if (template === 'modern')    return <Modern    {...p} />;
  if (template === 'executive') return <Executive {...p} />;
  if (template === 'creative')  return <Creative  {...p} />;
  if (template === 'minimal')   return <Minimal   {...p} />;
  if (template === 'ats')       return <Ats       {...p} />;
  if (template === 'elegant')   return <Elegant   {...p} />;
  if (template === 'timeline')  return <Timeline  {...p} />;
  if (template === 'compact')   return <Compact   {...p} />;
  if (template === 'corporate') return <Corporate {...p} />;
  return <Classic {...p} />;
}
