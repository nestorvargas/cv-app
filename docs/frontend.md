# Frontend

**Stack:** Vite 5 + React 18, ESM, JSX, plain CSS (no TypeScript, no CSS-in-JS).

## Entry point

`src/main.jsx` — conditionally renders:

- `<App />` — normal SPA when URL path is `/` or `/<profileName>`
- `<PrintPage />` — standalone render target for Puppeteer when URL starts with `/print/`

## Component tree

```
main.jsx
├── App.jsx                          Root — state, routing, template/color management
│   ├── CVIndex/index.jsx            Profile listing (card grid, create/delete modals)
│   └── [editor view] ──────────────
│       ├── Navbar.jsx               Top bar: back, profile name, lang toggle, save, PDF download
│       ├── CVEditor/index.jsx       Tabbed editor (8 tabs)
│       │   ├── PersonalInfoForm.jsx
│       │   ├── SummaryForm.jsx
│       │   ├── ExperienceForm.jsx   Add/remove/reorder
│       │   ├── EducationForm.jsx    Add/remove
│       │   ├── SkillsForm.jsx       Tag-style add/remove by Enter
│       │   ├── CertificatesForm.jsx Add/remove
│       │   ├── ImageUpload.jsx      File picker → POST /api/upload/image
│       │   └── TemplatesForm.jsx    5-template selector + color pickers
│       └── CVPreview/
│           ├── Paged.jsx            A4 pagination engine
│           └── index.jsx            Template router → Classic | Modern | Executive | Creative | Minimal
│
└── PrintPage.jsx                    Puppeteer target — loads cvData, renders CVPagedViewer
```

## State management

All state lives in `App.jsx` (no context, no Redux):

| State         | Type      | Persisted? | Key |
|---------------|-----------|------------|-----|
| `page`        | `"index"` or `"editor"` | No | — |
| `language`    | `"es"` or `"en"` | No | — |
| `profileName` | string    | No | — |
| `cvData`      | object    | No | — |
| `template`    | string    | In localStorage | `cv_prefs_<profileName>.template` |
| `accentColor` | string    | In localStorage | `cv_prefs_<profileName>.accent` |
| `bgColor`     | string    | In localStorage | `cv_prefs_<profileName>.bg` |

Template colors are stored per-profile in localStorage under `cv_prefs_<profileName>` as a JSON object with keys: `template`, `accent`, `bg`.

## API client

`src/api/cvApi.js` — uses **axios** for all calls except PDF download (uses `fetch` + blob URL).

```js
listProfiles()          => GET  /api/cv
getCv(name, lang)       => GET  /api/cv/:name/:lang
updateCv(name, lang, d) => PUT  /api/cv/:name/:lang     (JSON body)
createProfile(data)     => POST /api/cv                    (JSON body)
deleteProfile(name)     => DELETE /api/cv/:name
uploadImage(file, name) => POST /api/upload/image?profileName=... (multipart)
downloadPdf(name, lang, template, accent, bg) => GET /api/pdf/... (blob → download)
```

All URLs are relative (`/api/...`) — Vite proxies them to the backend.

## Vite config (`vite.config.js`)

```js
server: {
  host: '0.0.0.0',       // Docker-compatible
  port: 5173,
  allowedHosts: true,     // Docker-compatible
  watch: { usePolling: true },  // Docker file-watch compat
  proxy: {
    '/api':     { target: process.env.VITE_API_URL || 'http://localhost:3001', changeOrigin: true },
    '/uploads': { target: process.env.VITE_API_URL || 'http://localhost:3001', changeOrigin: true },
  },
}
```

In Docker, `VITE_API_URL=http://backend:3001` (set in docker-compose.yml).

## CSS architecture

- **`index.css`** — global reset + design system (CSS custom properties, button/form classes)
- **`components/CVIndex/index.css`** — index page layout
- **`components/CVPreview/*.css`** — one CSS file per template, each imports Inter from Google Fonts
- **`components/CVPreview/index.css`** — unused (legacy)

Each template CSS file uses BEM-like class naming (e.g. `cv-classic-sidebar`, `cv-modern-header`) and consumes `--cv-accent` / `--cv-bg` CSS custom properties set via inline styles.

## Preview pagination (`Paged.jsx`)

Constants: `PAGE_W=794`, `PAGE_H=1123`, `EFFECTIVE_H=1099`.

Measures real DOM block positions via `getBoundingClientRect()` + `ResizeObserver`. Computes page breaks that avoid splitting content blocks. Renders overlays to mask page boundaries on pages 2+.

## Shared utilities

- `components/LanguageToggle.jsx` — small reusable ES/EN switch (currently unused; toggle is inlined in Navbar)
