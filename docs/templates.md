# Templates

There are **5 active templates** (plus 1 legacy). Each exists as a pair: React preview and Node.js PDF generator.

## Available templates

| Name       | Preview (frontend)                                        | PDF (backend)                                   | Layout summary                                             |
|------------|-----------------------------------------------------------|-------------------------------------------------|------------------------------------------------------------|
| `classic`  | `CVPreview/Classic.jsx` + `classic.css`                   | `templates/classicTemplate.js`                  | 35% dark sidebar-left, 65% main-right, gradient accent     |
| `modern`   | `CVPreview/Modern.jsx` + `modern.css`                     | `templates/modernTemplate.js`                   | Full-width dark header, 50/50 two-column body              |
| `executive`| `CVPreview/Executive.jsx` + `executive.css`               | `templates/executiveTemplate.js`                | Centered header, 30% dark sidebar-left, 70% main-right     |
| `creative` | `CVPreview/Creative.jsx` + `creative.css`                 | `templates/creativeTemplate.js`                 | Header + inline contacts, 70% main-left, 30% sidebar-right |
| `minimal`  | `CVPreview/Minimal.jsx` + `minimal.css`                   | `templates/minimalTemplate.js`                  | 29% dark sidebar-left, 71% main-right, timeline experience |
| *(legacy)* | —                                                         | `templates/cvTemplate.js`                       | Same layout as classic, hardcoded colors, no accents       |

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

## PDF template function signature

```js
function buildXxxHtml(cvData, imageBase64, accentColor, bgColor) {
  // Returns an HTML string with full <html><head><style>...</style></head><body>...</body></html>
}
```

## Known discrepancies

PDF and preview templates have known visual differences. Key areas:

- **Image sizes**: Most templates use slightly different dimensions in PDF vs preview
- **Font scaling**: Backend uses `pt` units, frontend uses `px` (1pt ≈ 1.333px)
- **Section labels**: Some labels differ (e.g., skills "DevOps" vs "DevOps & Herramientas")
- **Header padding**: Minor spacing differences in classic and modern

See `.claude/agents/cv-pdf-sync.md` for the complete diff table.
