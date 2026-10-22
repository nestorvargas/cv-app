import React, { useState, useEffect, useRef } from 'react';
import { searchTitles, addTitle } from '../../api/catalogApi.js';

// "Título profesional" input with suggestions from the job titles catalog.
// Free text is always allowed; admins can save a new title to the catalog.
export default function TitleField({ id, value, onChange, lang, area, isAdmin }) {
  const isEn = lang === 'en';
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);
  const [notice, setNotice] = useState('');
  const boxRef = useRef(null);

  // Search with the last segment typed ("A | B" → "B") so composed titles still get suggestions
  const query = (value || '').split('|').pop().trim();

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      searchTitles(query, lang, area)
        .then(res => { setItems(res.data); setActive(-1); })
        .catch(() => setItems([]));
    }, 180);
    return () => clearTimeout(t);
  }, [query, lang, area, open]);

  useEffect(() => {
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pick = (title) => {
    // Replace only the segment being typed, keeping "Title A | " prefixes
    const parts = (value || '').split('|');
    parts[parts.length - 1] = (parts.length > 1 ? ' ' : '') + title;
    onChange(parts.join('|'));
    setOpen(false);
  };

  const exact = items.some(i => i.title.toLowerCase() === query.toLowerCase());
  const canAdd = isAdmin && query.length >= 3 && !exact;

  const saveToCatalog = async () => {
    try {
      await addTitle(isEn ? { title_es: query, title_en: query, area } : { title_es: query, area });
      setNotice(isEn ? 'Saved to the catalog' : 'Guardado en la base');
      setTimeout(() => setNotice(''), 2500);
      setOpen(false);
    } catch (err) {
      setNotice(err.response?.data?.error || 'Error');
    }
  };

  const onKeyDown = (e) => {
    if (!open || !items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => (a + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => (a <= 0 ? items.length - 1 : a - 1)); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(items[active].title); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="ed-combo" ref={boxRef}>
      <div className="ed-field">
        <i className="fa-solid fa-briefcase" />
        <input
          id={id}
          value={value || ''}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={isEn ? 'Start typing or pick from the list' : 'Escribe o elige de la lista'}
        />
      </div>

      {open && (items.length > 0 || canAdd) && (
        <ul className="ed-combo-list" role="listbox">
          {items.map((it, i) => (
            <li
              key={it.id}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'is-active' : ''}
              onMouseDown={e => { e.preventDefault(); pick(it.title); }}
              onMouseEnter={() => setActive(i)}
            >
              <i className="fa-solid fa-briefcase" /> {it.title}
              {it.area === area && <span className="ed-combo-tag">{isEn ? 'your area' : 'tu área'}</span>}
            </li>
          ))}
          {canAdd && (
            <li className="ed-combo-add" onMouseDown={e => { e.preventDefault(); saveToCatalog(); }}>
              <i className="fa-solid fa-plus" /> {isEn ? `Save "${query}" to the catalog` : `Guardar "${query}" en la base`}
            </li>
          )}
        </ul>
      )}
      <p className="ed-help">
        {notice || (isEn
          ? 'Suggestions from the titles catalog. Use "|" to combine titles.'
          : 'Sugerencias de la base de títulos. Usa "|" para combinar títulos.')}
      </p>
    </div>
  );
}
