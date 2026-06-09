# Development Guide

## Prerequisites

- Docker Desktop (recommended for full stack)
- Node.js 20 (for local-only dev)
- npm

## Running the app

### Full stack (Docker — recommended)

```bash
./start.sh up        # Build & start all services
./start.sh status    # Check container status
./start.sh logs      # Tail all logs
./start.sh logs backend   # Tail only backend logs
./start.sh down      # Stop all services
./start.sh reset     # Stop + wipe DB + restart (asks confirmation)
```

Services become available at:
- Frontend: http://localhost:15173
- Backend: http://localhost:13001
- PostgreSQL: localhost:15432

### Backend only (outside Docker)

```bash
cd backend
cp .env.example .env        # Edit DATABASE_URL if needed
npm install
npm run dev                 # nodemon with hot reload
```

Requires a running PostgreSQL instance (can use Docker: `docker run -d -p 15432:5432 -e POSTGRES_DB=cv_db -e POSTGRES_USER=cv_user -e POSTGRES_PASSWORD=cv_password postgres:15-alpine`).

### Frontend only (outside Docker)

```bash
cd frontend
npm install
npm run dev                 # Vite dev server with HMR
npm run build               # Production build
npm run preview             # Preview production build
```

Requires backend running on port 3001 (or configure via `VITE_API_URL`).

## Project commands

| Command                        | Location   | Action                           |
|--------------------------------|------------|----------------------------------|
| `npm run dev`                  | frontend/  | Start Vite dev server (HMR)      |
| `npm run build`                | frontend/  | Build for production             |
| `npm run preview`              | frontend/  | Preview production build         |
| `npm run dev`                  | backend/   | Start Express with nodemon       |
| `npm start`                    | backend/   | Start Express (production)       |
| `./start.sh up`               | root       | Docker Compose up --build -d     |
| `./start.sh down`             | root       | Docker Compose down              |
| `./start.sh logs [service]`   | root       | Tail logs (backend/frontend/postgres) |
| `./start.sh status`           | root       | Docker Compose ps                |
| `./start.sh reset`            | root       | down -v + up (wipes DB)          |

## No lint / test / typecheck scripts

Neither `package.json` defines lint, test, or typecheck scripts. There is no CI pipeline configured.

## Environment variables

### Backend (`.env`)
| Variable       | Description                  | Default                              |
|----------------|------------------------------|--------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://cv_user:cv_password@localhost:5432/cv_db` |
| `PORT`         | Express port                 | `3001`                               |
| `NODE_ENV`     | Environment mode             | `development`                        |

### Docker Compose extras
| Variable               | Description                           | Value                          |
|------------------------|---------------------------------------|--------------------------------|
| `FRONTEND_INTERNAL_URL`| Backend→frontend URL (Puppeteer)     | `http://frontend:5173`         |
| `VITE_API_URL`         | Frontend→backend URL (Vite proxy)    | `http://backend:3001`          |

## Docker volumes

| Host path          | Container path    | Purpose                       |
|--------------------|-------------------|-------------------------------|
| `./backend/src`    | `/app/src`        | Hot reload backend code       |
| `./backend/uploads`| `/app/uploads`    | Persist uploaded images       |
| `./frontend/src`   | `/app/src`        | Hot reload frontend code      |
| `./frontend/index.html` | `/app/index.html` | Hot reload entry HTML    |
| `./frontend/vite.config.js` | `/app/vite.config.js` | Hot reload Vite config |

PostgreSQL data is persisted in a named Docker volume (`postgres_data`). Running `./start.sh reset` or `docker compose down -v` destroys it.

## Common tasks

### Add a new profile
Create it from the UI (click "Create CV" on the index page) or via API:
```bash
curl -X POST http://localhost:13001/api/cv \
  -H "Content-Type: application/json" \
  -d '{"profile_name": "New Profile Name"}'
```

### Add a new template
1. Create `frontend/src/components/CVPreview/NewTemplate.jsx` + `newtemplate.css`
2. Create `backend/src/templates/newTemplate.js`
3. Register in both `CVPreview/index.jsx` and `TemplatesForm.jsx`
4. Register in `App.jsx` default color mappings
5. Add sidebar width to `Paged.jsx` `SIDEBAR_WIDTHS` if applicable
6. Add Puppeteer route to `pdfController.js`

### Reset database
```bash
./start.sh reset        # Destroys and recreates PostgreSQL volume
```

### View logs
```bash
./start.sh logs           # All services
./start.sh logs backend   # Backend only
./start.sh logs frontend  # Frontend only
./start.sh logs postgres  # Database only
```

## Notes

- The frontend uses polling for file watching (`usePolling: true` in Vite config) for Docker compatibility — changes outside Docker also work.
- Backend uses `nodemon` for hot reload in development.
- Both Dockerfiles use `node:20-alpine` base image.
- Edit the `.env` file for local development (copy from `.env.example`).
