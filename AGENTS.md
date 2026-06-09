# AGENTS.md — CV Editor

## Commands

```bash
./start.sh up          # docker compose up --build -d  (default)
./start.sh down        # docker compose down
./start.sh logs [srv]  # docker compose logs -f [backend|frontend|postgres]
./start.sh reset       # down -v + up (wipes DB volume, asks confirmation)
./start.sh status      # docker compose ps

# Backend dev (outside Docker):
cd backend && npm install && npm run dev

# Frontend dev (outside Docker):
cd frontend && npm install && npm run dev

# Frontend build:
cd frontend && npm run build && npm run preview
```

- No lint, typecheck, or test scripts exist in either package.
- Host ports: frontend `http://localhost:15173`, backend `http://localhost:13001`, postgres `localhost:15432`.

## Architecture

- **Frontend** (`frontend/`): Vite 5 + React 18, ESM, JSX (no TypeScript). Entry: `src/main.jsx`.
- **Backend** (`backend/`): Express + PostgreSQL (pg), CommonJS. Entry: `src/index.js`. Port 3001.
- DB init/seed: `src/db/init.sql` — creates `cv_profiles` table, seeds 3 profiles × 2 languages (es/en) on first run.
- `vite.config.js` proxies `/api` and `/uploads` → backend. Frontend code uses relative `/api` URLs.
- PDFs generated server-side with Puppeteer (system Chromium in Docker Alpine). Templates at `backend/src/templates/`.
- Image uploads stored on disk at `backend/uploads/<profileName>/`.
- Module split: **CommonJS** in backend (`require`/`module.exports`), **ESM** in frontend (`import`/`export`).

## Domain conventions

- `profile_name` is a slug. New profiles are inserted for both `es` and `en` simultaneously.
- Default profiles (`desarrollador`, `devops-linux`, `lider-tecnico`) are protected from deletion.
- Template names are fixed lowercase keys: `classic`, `modern`, `executive`, `creative`, `minimal`.
- Template colors are managed in `App.jsx` and persisted in `localStorage` under `cv_prefs_<profileName>`.
- DB JSONB fields: `personal_info`, `summary`, `experience`, `education`, `skills`, `certificates`, `profile_image`, `profile_label`.
- PDF and preview templates share the same data model. Keep visuals in sync when changing either.
- Preview system: `frontend/src/components/CVPreview/Paged.jsx` handles A4 pagination. Constants: `PAGE_W=794`, `PAGE_H=1123`, `EFFECTIVE_H=1099`.

## Known quirks

- PDF templates may diverge from React preview templates in font sizes, image dimensions, and section labels. See `.claude/agents/cv-pdf-sync.md` for known diff table.
- `./start.sh reset` runs `docker compose down -v` — wipes PostgreSQL volume. Only revert if intentional.
- Puppeteer in Docker uses system Chromium via `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` (not bundled).
- `.env` is gitignored. Copy `backend/.env.example` for local dev.
