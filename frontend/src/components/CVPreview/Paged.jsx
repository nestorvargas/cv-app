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

/**
 * Given the full template height and the array of block bounding boxes
 * (relative to the top of the inner-div), compute a list of page-top offsets.
 *
 * Each page starts at an offset into the document. The raw breakpoints are
 * evenly spaced (FIRST_PAGE_H, FIRST_PAGE_H + EFFECTIVE_H, …). For each raw
 * breakpoint we look whether it falls inside a data-block element. If it does,
 * we move the breakpoint UP to the top edge of that block so the block starts
 * fresh on the next page.
 *
 * Returns an array of offsets where each page's visible window starts.
 * pageOffsets[0] is always 0. pageOffsets[i] is the scroll-top for page i.
 */
function computePageOffsets(totalHeight, blocks) {
  const offsets = [0];

  // Nothing to paginate
  if (totalHeight <= FIRST_PAGE_H) return offsets;

  // Sort blocks by their top position
  const sorted = [...blocks].sort((a, b) => a.top - b.top);

  // Raw breakpoints in document space (where a page boundary would land
  // without any adjustment). These are the bottom edges of each page's
  // visible content area.
  let rawBreak = FIRST_PAGE_H;

  while (rawBreak < totalHeight) {
    // The cut position in document space for this page boundary.
    // Check if rawBreak falls inside any block (top < rawBreak < bottom).
    const collision = sorted.find(b => b.top < rawBreak && b.bottom > rawBreak);

    let breakPoint;
    if (collision) {
      // Move the cut up to just before the colliding block's top. Then
      // cascade: the moved position may itself land inside another block
      // (e.g. a sidebar block that straddles the same boundary), so keep
      // moving up until the candidate is in a clear gap.
      // Guard: fall back to rawBreak if cascading would produce a
      // zero-height page (candidate <= last offset) or the block is
      // taller than EFFECTIVE_H.
      let candidate = collision.top;
      for (let i = 0; i < sorted.length; i++) {
        const inner = sorted.find(b => b.top < candidate && b.bottom > candidate);
        if (!inner) break;
        candidate = inner.top;
      }
      breakPoint = candidate > offsets[offsets.length - 1] ? candidate : rawBreak;
    } else {
      breakPoint = rawBreak;
    }

    offsets.push(breakPoint);

    // Advance the raw break by one EFFECTIVE_H from this actual break point.
    rawBreak = breakPoint + EFFECTIVE_H;
  }

  return offsets;
}

export default function CVPagedViewer({ cvData, lang, template, accentColor, bgColor }) {
  const innerRef  = useRef(null);   // ref on the inner-div of page 0
  const [pageOffsets, setPageOffsets] = useState([0]);

  const props = { cvData, lang, template, accentColor, bgColor };

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      const h = el.scrollHeight;

      // getBoundingClientRect() delta gives the block's top relative to the
      // inner-div. The offsetParent chain walk was broken because template
      // wrappers are position:static, so offsetParent jumped directly to the
      // page-div (skipping the inner-div) and produced wrong values.
      // The inner-div is position:absolute top:0 inside an overflow:hidden
      // container that never scrolls, so its rect.top is a stable anchor.
      const containerRect = el.getBoundingClientRect();
      // Rects are in screen pixels: undo any ancestor zoom/scale (e.g. the
      // fit-to-width preview) so offsets stay in unscaled CSS pixels.
      const scale = (el.offsetWidth && containerRect.width / el.offsetWidth) || 1;

      const blockEls = el.querySelectorAll('[data-block]');
      const blocks = Array.from(blockEls).map(b => {
        const bRect = b.getBoundingClientRect();
        const top = (bRect.top - containerRect.top) / scale;
        return { top, bottom: top + bRect.height / scale };
      });

      setPageOffsets(computePageOffsets(h, blocks));
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
