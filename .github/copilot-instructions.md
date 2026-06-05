# Copilot instructions

## Commands

- Full stack (recommended): `docker-compose up --build`
- Convenience wrapper: `./start.sh up` (`down`, `restart`, `logs`, `status`, `reset` are also available)
- Backend dev: `cd backend && npm install && npm run dev`
- Backend start: `cd backend && npm start`
- Frontend dev: `cd frontend && npm install && npm run dev`
- Frontend build: `cd frontend && npm run build`
- Frontend preview: `cd frontend && npm run preview`
- Lint: no lint script is currently defined in `backend/package.json` or `frontend/package.json`
- Tests: no test script is currently defined in `backend/package.json` or `frontend/package.json`, so there is no single-test command yet

## Architecture

- The app is split into a Vite React frontend and an Express/PostgreSQL backend.
- `backend/src/index.js` boots Express, enables CORS and JSON parsing, serves `/uploads`, mounts `/api/cv`, `/api/pdf`, and `/api/upload`, exposes `/health`, and initializes the database before listening.
- `backend/src/db/init.sql` creates and seeds the `cv_profiles` table. Profiles are stored per `profile_name + language` and seeded in both Spanish and English.
- `frontend/vite.config.js` proxies `/api` and `/uploads` to the backend, so frontend code should keep using relative `/api` URLs.
- The main UI flow is `CVIndex` (profile list/create/delete) -> `App.jsx` editor/preview -> `CVEditor` forms + `CVPreview` renderers.
- PDF export is server-side: `backend/src/controllers/pdfController.js` selects a template, builds HTML, and uses Puppeteer to generate the PDF.
- Image uploads are stored on disk in `backend/uploads` and the saved path is persisted in the database.

## Conventions

- Keep the backend JSON field names aligned with the database and the frontend state shape: `personal_info`, `summary`, `experience`, `education`, `skills`, `certificates`, `profile_image`, and `profile_label`.
- `profile_name` is treated as a slug. New profiles are created from a label, slugified in the backend, and inserted for both `es` and `en`.
- Default profiles (`desarrollador`, `devops-linux`, `lider-tecnico`) are protected from deletion.
- Template names are fixed lowercase keys: `classic`, `modern`, `executive`, `creative`, `minimal`.
- The active template colors are managed in `App.jsx` with per-template defaults and persisted in `localStorage` under `cv_prefs_<profileName>`.
- The PDF and preview templates share the same data model and language-specific labels; keep Spanish/English content in sync when changing copy or sections.
- Backend code uses CommonJS; frontend code uses ESM/React. Keep imports and module style consistent with the surrounding file.
