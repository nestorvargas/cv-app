import React from 'react';
import './pagination.css';

export const PAGE_SIZE = 20;

// Page numbers with ellipses: 1 … 4 5 [6] 7 8 … 20
function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1].filter(n => n >= 1 && n <= pages));
  const sorted = [...set].sort((a, b) => a - b);
  const out = [];
  sorted.forEach((n, i) => {
    if (i && n - sorted[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}

// Shown only when there is more than one page
export default function Pagination({ page, total, pageSize = PAGE_SIZE, onChange }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  const go = (n) => {
    if (n < 1 || n > pages || n === page) return;
    onChange(n);
  };

  return (
    <nav className="pager" aria-label="Paginación">
      <button className="pager-btn" onClick={() => go(page - 1)} disabled={page === 1} aria-label="Página anterior">
        <i className="fa-solid fa-chevron-left" /> <span className="pager-text">Anterior</span>
      </button>
      <div className="pager-pages">
        {pageList(page, pages).map((n, i) => (n === '…'
          ? <span key={`gap-${i}`} className="pager-gap">…</span>
          : (
            <button
              key={n}
              className={`pager-num ${n === page ? 'active' : ''}`}
              onClick={() => go(n)}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </button>
          )))}
      </div>
      <button className="pager-btn" onClick={() => go(page + 1)} disabled={page === pages} aria-label="Página siguiente">
        <span className="pager-text">Siguiente</span> <i className="fa-solid fa-chevron-right" />
      </button>
    </nav>
  );
}
