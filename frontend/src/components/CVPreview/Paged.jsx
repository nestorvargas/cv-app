import React, { useRef, useEffect, useState } from 'react';
import CVTemplateRenderer from './index.jsx';

const PAGE_W            = 794;
const PAGE_H            = 1123;
const PAGE_INSET        = 24;   // top breathing room on pages 2+
const PAGE_BOTTOM_INSET = 24;   // bottom breathing room on every page
const FIRST_PAGE_H = PAGE_H - PAGE_BOTTOM_INSET;
const EFFECTIVE_H  = PAGE_H - PAGE_INSET - PAGE_BOTTOM_INSET;

// Left-sidebar widths (%) per template — used to reconstruct the correct overlay color
const SIDEBAR_WIDTHS = { classic: 35, executive: 30, minimal: 29 };

// Tuning for the break search (all values in unscaled CSS px).
const KEEP_MAX_H    = 0.45 * EFFECTIVE_H; // [data-block]s taller than this may split between lines
// Max blank space accepted at a page bottom to honour keep-together rules.
// Tried from most to least generous; the most generous one that does not add
// a page wins (0 = only never-cut-a-line rules, used just to save a page).
const KEEP_GAP_STEPS = [220, 140, 70, 0];
const ATOMIC_MAX_H  = 40;   // any element this short (badge, chip, single line) is never cut
const HEADING_TAIL  = 48;   // a heading keeps at least this much of the following content with it
const BLOCK_HEAD    = 64;   // a split [data-block] keeps its title rows (company, role…) together
const BLOCK_ATOMIC  = 90;   // [data-block]s up to this height (education, cert entries) stay whole
const LINE_PAD      = 0.5;  // safety margin around text-line boxes (line gaps are only ~5px)

/**
 * Find a cut position <= `raw` that does not fall strictly inside any of the
 * given [top, bottom] intervals. Moving the cut up to an interval's top may
 * land inside another interval (other column), so cascade until clear.
 */
function findClearCut(raw, intervals) {
  let cut = raw;
  for (let guard = 0; guard < intervals.length + 1; guard++) {
    const hit = intervals.find(b => b.top < cut - 0.5 && b.bottom > cut + 0.5);
    if (!hit) return cut;
    cut = hit.top;
  }
  return cut;
}

/**
 * Compute the document offsets where each page starts.
 *
 *  Constraint tiers, from strongest to weakest preference:
 *  - `hard` (text lines, images, icons, badges, short elements): never cut.
 *    A break between two lines of a paragraph is allowed, through one is not.
 *  - `medium` (heading + start of its content, first rows of a block, short
 *    entries): avoid orphaned titles / dangling dates.
 *  - `soft` ([data-block]s that fit comfortably on a page): keep whole.
 *  The strongest tier set whose cut costs at most `maxKeepGap` px of blank
 *  space wins; otherwise the break falls back to the nearest line boundary.
 *  This avoids half-empty pages when a tall block (e.g. a long sidebar skill
 *  group) straddles the boundary, and works for two-column layouts because
 *  the cut must be clear in every column at once.
 *
 * pageOffsets[0] is always 0. `contentBottom` is the bottom of the last real
 * content, so wrapper padding / min-height never creates a blank page.
 */
function computePageOffsets(contentBottom, { hard, medium, soft }, maxKeepGap) {
  const offsets = [0];
  if (contentBottom <= FIRST_PAGE_H) return offsets;

  const tiers = [hard.concat(medium, soft), hard.concat(medium)];
  let rawBreak = FIRST_PAGE_H;

  while (rawBreak < contentBottom) {
    const last = offsets[offsets.length - 1];
    let cut = null;
    for (const tier of tiers) {
      const c = findClearCut(rawBreak, tier);
      if (rawBreak - c <= maxKeepGap && c > last) { cut = c; break; }
    }
    if (cut === null) {
      cut = findClearCut(rawBreak, hard);
      if (cut <= last + 100) cut = rawBreak; // pathological: never loop / emit empty pages
    }
    offsets.push(cut);
    rawBreak = cut + EFFECTIVE_H;
  }

  return offsets;
}

/**
 * Measure page-break constraints inside `el` (the inner-div of page 0).
 *
 * The editor preview sits inside a CSS-zoom FitToWidth. Under zoom, rects are
 * snapped to device pixels, which at e.g. 0.5 adds ~2 CSS px of noise — enough
 * to open fake gaps between text lines (only ~5 px apart). So we temporarily
 * cancel the ancestor zoom on `el` and measure at 1:1, exactly like the PDF
 * print page. Done synchronously (no paint in between), and the box size is
 * restored before the ResizeObserver checks it, so it does not re-trigger.
 */
function measureLayout(el) {
  const ancestorScale = (el.offsetWidth && el.getBoundingClientRect().width / el.offsetWidth) || 1;
  const prevZoom = el.style.zoom;
  if (Math.abs(ancestorScale - 1) > 0.001) el.style.zoom = String(1 / ancestorScale);
  try {
    return measureUnzoomed(el);
  } finally {
    el.style.zoom = prevZoom;
  }
}

function measureUnzoomed(el) {
  // getBoundingClientRect() deltas give positions relative to the inner-div,
  // which is position:absolute top:0 inside a non-scrolling clip box.
  const containerRect = el.getBoundingClientRect();
  // Safety net for any residual scale (e.g. a CSS transform on an ancestor):
  // keep offsets in unscaled CSS pixels.
  const scale = (el.offsetWidth && containerRect.width / el.offsetWidth) || 1;
  const rel = r => {
    const top = (r.top - containerRect.top) / scale;
    return { top, bottom: top + r.height / scale };
  };

  const hard = [];
  let contentBottom = 0;

  // 1. Every rendered line of text.
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.height <= 0 || r.width <= 0) continue;
      const b = rel(r);
      hard.push({ top: b.top - LINE_PAD, bottom: b.bottom + LINE_PAD });
      if (b.bottom > contentBottom) contentBottom = b.bottom;
    }
  }

  // 2. Images, icons and any short element (badges, chips, bars, single rows).
  for (const node of el.querySelectorAll('*')) {
    const r = node.getBoundingClientRect();
    if (r.height <= 0 || r.width <= 0) continue;
    const tag = node.tagName;
    const isMedia = tag === 'IMG' || tag === 'svg' || tag === 'I';
    const h = r.height / scale;
    if (isMedia || h <= ATOMIC_MAX_H) {
      const b = rel(r);
      hard.push(b);
      if (isMedia && b.bottom > contentBottom) contentBottom = b.bottom;
    }
  }

  // 3. Keep-together preferences.
  const medium = [];
  const soft = [];
  for (const node of el.querySelectorAll('[data-block]')) {
    const b = rel(node.getBoundingClientRect());
    const h = b.bottom - b.top;
    if (h <= 0) continue;
    if (h <= KEEP_MAX_H) soft.push(b);
    // Even when a block must split, avoid stranding its first rows at a page bottom.
    medium.push({ top: b.top, bottom: b.top + (h <= BLOCK_ATOMIC ? h : BLOCK_HEAD) });
  }
  for (const node of el.querySelectorAll('h2, h3, h4')) {
    const b = rel(node.getBoundingClientRect());
    if (b.bottom - b.top > 0) {
      // Never leave a heading orphaned at the bottom of a page.
      medium.push({ top: b.top, bottom: b.bottom + HEADING_TAIL });
    }
  }

  return { contentBottom, hard, medium, soft };
}

export default function CVPagedViewer({ cvData, lang, template, accentColor, bgColor }) {
  const innerRef  = useRef(null);   // ref on the inner-div of page 0
  const [pageOffsets, setPageOffsets] = useState([0]);

  const props = { cvData, lang, template, accentColor, bgColor };

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      const { contentBottom, ...constraints } = measureLayout(el);
      const options = KEEP_GAP_STEPS.map(g => computePageOffsets(contentBottom, constraints, g));
      const minPages = Math.min(...options.map(o => o.length));
      const next = options.find(o => o.length === minPages);
      setPageOffsets(prev =>
        prev.length === next.length && prev.every((v, i) => Math.abs(v - next[i]) < 0.5) ? prev : next
      );
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [cvData, lang, template, accentColor, bgColor]);

  const pageCount = pageOffsets.length;

  const sidebarW  = SIDEBAR_WIDTHS[template] || 0;
  // Per-template bg defaults must match each template's CSS variable fallback
  const DEFAULT_BG = { classic: '#2c3e50', executive: '#2c3e50', minimal: '#3d3d3d' };
  const bg = bgColor || DEFAULT_BG[template] || '#2c3e50';
  // Overlay gradient that exactly matches the template wrapper background
  let overlayBg;
  if (template === 'creative') {
    overlayBg = 'linear-gradient(to right, #ffffff 70%, #f4f6f8 70%)';
  } else if (template === 'modern') {
    overlayBg = 'linear-gradient(to right, #ffffff 50%, #fafbfc 50%)';
  } else if (template === 'compact') {
    overlayBg = 'linear-gradient(to right, #ffffff 67%, #f3f5f8 67%)';
  } else {
    overlayBg = sidebarW > 0
      ? `linear-gradient(to right, ${bg} ${sidebarW}%, #ffffff ${sidebarW}%)`
      : '#ffffff';
  }

  return (
    <>
      {pageOffsets.map((offset, i) => (
        <div
          key={i}
          className="cv-page"
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
          {/* Inner div is absolutely positioned so its scrollHeight = full template height.
              Page 0 (i=0) is referenced for measurement. The top offset scrolls the
              template content so the correct slice is visible in this page's clip window. */}
          <div
            ref={i === 0 ? innerRef : undefined}
            style={{
              position: 'absolute',
              top: i === 0 ? 0 : PAGE_INSET - offset,
              left: 0,
              width: PAGE_W,
            }}
          >
            {/* pageMinHeight ensures the template wrapper's background gradient
                fills the full A4 page height even when content is short.
                We use total accumulated height so the gradient always reaches
                the bottom of the last visible page slice. */}
            <CVTemplateRenderer {...props} pageMinHeight={(i + 1) * PAGE_H} />
          </div>

          {/* Top overlay for pages 2+: hides the bleed from the previous page
              and gives breathing room. */}
          {i > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: PAGE_INSET,
                background: overlayBg,
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Bottom overlay: hides content that belongs to the next page.
              Height is dynamic — covers from the break point to the page bottom. */}
          {i < pageCount - 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: PAGE_H - (pageOffsets[i + 1] - pageOffsets[i] + (i === 0 ? 0 : PAGE_INSET)),
                background: overlayBg,
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      ))}
    </>
  );
}
