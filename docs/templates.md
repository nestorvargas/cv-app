# Templates

There are **6 active templates** (plus 1 legacy). Each has a React preview component.

**Important:** `backend/src/templates/*.js` (`classicTemplate.js`, `modernTemplate.js`, etc.) are **dead code** —
nothing in `pdfController.js` requires them. All PDF generation is driven by the frontend preview components,
rendered through Puppeteer at `/print/:profileName/:lang` (see "PDF Generation" in `docs/api.md`).

## Available templates

| Name       | Preview (frontend)                                        | Layout summary                                             |
|------------|-------------------------------------------------------------|------------------------------------------------------------|
| `classic`  | `CVPreview/Classic.jsx` + `classic.css`                   | 35% dark sidebar-left, 65% main-right, gradient accent     |
| `modern`   | `CVPreview/Modern.jsx` + `modern.css`                     | Full-width dark header, 50/50 two-column body              |
| `executive`| `CVPreview/Executive.jsx` + `executive.css`               | Centered header, 30% dark sidebar-left, 70% main-right     |
| `creative` | `CVPreview/Creative.jsx` + `creative.css`                 | Header + inline contacts, 70% main-left, 30% sidebar-right |
| `minimal`  | `CVPreview/Minimal.jsx` + `minimal.css`                   | 29% dark sidebar-left, 71% main-right, timeline experience |
| `ats`      | `CVPreview/Ats.jsx` + `ats.css`                            | Single column, no icons/photo/sidebar. **Only template whose PDF has real selectable text** — see below. |
| *(legacy)* | —                                                         | Unused `templates/cvTemplate.js`, same layout as classic    |

## Common features (all templates)

- Inter font from Google Fonts
- Font Awesome 6.5.1 for icons
- A4 width (210mm)
- `@page { margin: 6mm 0 }`
- `-webkit-print-color-adjust: exact`
- Injected CSS variables: `--cv-accent`, `--cv-bg`

## Data sections rendered

All templates render these sections (order may vary):

| Section         | Sidebar | Main |
|-----------------|---------|------|
| Photo           | ✓       | —    |
| Contact info    | ✓       | —    |
| Skills          | ✓       | —    |
| Name / Title    | —       | ✓    |
| Profile Summary | —       | ✓    |
| Experience      | —       | ✓    |
| Education       | —       | ✓    |
| Certificates    | varies  | ✓    |

## Default colors

| Template   | Accent      | Background  |
|------------|-------------|-------------|
| classic    | `#1abc9c`   | `#2c3e50`   |
| modern     | `#e67e22`   | `#1a252f`   |
| executive  | `#8e44ad`   | `#2c3e50`   |
| creative   | `#e94560`   | `#1a1a2e`   |
| minimal    | `#2980b9`   | `#3d3d3d`   |

## Sidebar gradient technique

Templates with dark sidebars use a CSS gradient on the wrapper rather than on the sidebar element:

```css
.wrapper {
  background: linear-gradient(
    to right,
    var(--cv-bg) 35%,
    #ffffff 35%
  );
}
```

This ensures the colored background extends to the full content height regardless of which column is taller. The "sidebar" itself has `background: transparent`. `SIDEBAR_WIDTHS` in `Paged.jsx` must match these percentages for the page overlay to have the correct color break.

| Template  | Sidebar width | SIDEBAR_WIDTHS key |
|-----------|---------------|--------------------|
| classic   | 35%           | `classic: 35%`     |
| executive | 30%           | `executive: 30%`   |
| minimal   | 29%           | `minimal: 29%`     |
| modern    | — (no sidebar)| `undefined → 0`    |
| creative  | — (no sidebar)| `undefined → 0`    |

## `ats` template: real-text PDF path

Every template except `ats` produces its PDF by **screenshotting** the rendered preview (PNG images assembled
into a PDF via `pdf-lib`) — the resulting file has no selectable/extractable text, which makes it invisible to
ATS software and AI resume screeners regardless of how the layout looks.

`ats` is the exception, wired specifically to be machine-readable:

- **Preview** (`PrintPage.jsx`): when `template === 'ats'`, renders `CVTemplateRenderer` directly in normal
  document flow, instead of wrapping it in `CVPagedViewer`'s screenshot-oriented synthetic pager.
- **PDF** (`pdfController.js`): when `tmpl === 'ats'`, calls `page.emulateMediaType('print')` and
  `page.pdf({ format: 'A4', printBackground: true })` — Chromium's native PDF export, which embeds real text.
  Pagination is handled by `ats.css`'s `@media print { @page { size: A4 } }` plus `break-inside: avoid` on
  `[data-block]` elements, not by JS-computed page offsets.
- **Design constraints that follow from this**: no icons (icon fonts extract as garbled private-use-area
  characters), no photo, no colored sidebar — single column, plain text labels only, so both the visual layout
  and the underlying text run in the same left-to-right, top-to-bottom reading order.

## Known discrepancies (screenshot-based templates)

The screenshot-based templates (all except `ats`) can still show minor preview-vs-PDF differences since capture
timing/scaling can drift from the on-screen render. See `.claude/agents/cv-pdf-sync.md` for the diff table.
Note: that agent's references to `backend/src/templates/*.js` describe dead code (see top of this file) — the
actual source of truth for every PDF (`ats` included) is the frontend preview component.
