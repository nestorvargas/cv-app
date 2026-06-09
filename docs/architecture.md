# Architecture Overview

CV Editor is a bilingual (ES/EN) web application to edit, preview, and download a CV as PDF. It uses a **two-repo** layout with a Docker Compose orchestration for the full stack.

## System diagram

```
Browser ──▶ Frontend (Vite :5173) ──proxy──▶ Backend (Express :3001) ──▶ PostgreSQL (:5432)
                                                     │
                                                     ├──▶ Disk (uploads/)
                                                     └──▶ Puppeteer (PDF generation)
```

**Host ports** (via Docker port mapping):

| Service  | Host     | Container |
|----------|----------|-----------|
| Frontend | `:15173` | `:5173`   |
| Backend  | `:13001` | `:3001`   |
| Postgres | `:15432` | `:5432`   |

## Directory layout

```
/
├── frontend/                  Vite 5 + React 18 (ESM, JSX, no TypeScript)
│   └── src/
│       ├── main.jsx           Entry — conditionally renders <App /> or <PrintPage />
│       ├── App.jsx            Root SPA — state, routing, template/color management
│       ├── PrintPage.jsx      Standalone render target for Puppeteer PDF
│       ├── api/cvApi.js       Axios-based API client
│       ├── components/
│       │   ├── CVIndex/       Profile listing (cards, create, delete)
│       │   ├── CVEditor/      8-tab editor (Personal, Photo, Summary, Experience, Education, Skills, Certificates, Templates)
│       │   └── CVPreview/     A4-paginated live preview (Paged.jsx + 5 template pairs)
│       └── index.css          Global design system
│
├── backend/                   Express + PostgreSQL (CommonJS)
│   └── src/
│       ├── index.js           Entry — mounts routes, inits DB, starts server
│       ├── db/
│       │   ├── index.js       pg Pool + initDb() — runs init.sql
│       │   └── init.sql       Schema + seed data (3 profiles × 2 languages)
│       ├── routes/
│       │   ├── cv.js          CRUD: /api/cv/*
│       │   ├── pdf.js         PDF generation: /api/pdf/*
│       │   └── upload.js      Image upload: /api/upload/image
│       ├── controllers/       Logic for each route
│       └── templates/         6 HTML templates for PDF (classic, modern, executive, creative, minimal + legacy cvTemplate)
│       └── uploads/           Profile photos (gitignored)
│
├── docker-compose.yml         3 services: postgres, backend, frontend
├── start.sh                   Convenience wrapper (up/down/logs/reset/status)
├── .github/copilot-instructions.md   GitHub Copilot context
└── .claude/agents/            2 specialized agents: cv-pdf-sync, cv-preview-reviewer
```

## Module systems

| Layer    | Format   | Pattern                 |
|----------|----------|-------------------------|
| Frontend | **ESM**  | `import`/`export`       |
| Backend  | **CJS**  | `require`/`module.exports` |

Keep imports consistent within each layer.

## Key design decisions

1. **PDF via screenshot compositing** — Puppeteer renders the frontend's `/print/` page, screenshots each `.cv-page` div, and assembles screenshots into a PDF using `pdf-lib`. This is pixel-based rather than CSS print-based, which can cause visual discrepancies between preview and PDF.

2. **Dual-template system** — Preview (React JSX + CSS) and PDF (HTML string in Node.js) have separate template implementations sharing the same data model. They must be kept in sync manually.

3. **CSS gradient trick for sidebars** — Dark sidebars use a `linear-gradient` on the wrapper div rather than on the sidebar itself, so the colored background extends to the full content height regardless of column heights.

4. **Bilingual by row** — Each profile exists as two DB rows (one per language) sharing the same `profile_name` slug. Creating a profile inserts both rows simultaneously.

## Data flow

```
User edits form → App.jsx updates cvData state
                → CVPreview re-renders (live preview)
                → Save button → PUT /api/cv/:name/:lang
                              → Backend updates JSONB fields in PostgreSQL
                → PDF Download → GET /api/pdf/:name/:lang
                              → Puppeteer opens /print/:name/:lang
                              → Waits for window.__CV_READY__
                              → Screenshots each .cv-page
                              → Assembles PDF with pdf-lib
                              → Returns as download
```

## Image flow

```
Upload: File picker → POST /api/upload/image?profileName=...
                    → multer saves to backend/uploads/
                    → DB column profile_image updated with URL path (/uploads/<file>)

Preview: Browser loads /uploads/<path> → proxied by Vite → served statically by Express

PDF: Backend downloads http://frontend:5173/uploads/<path>
    → converts to base64 → embeds in HTML template
```
