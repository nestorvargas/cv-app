# CV Editor - Nestor Vargas

Web app to edit, preview, and download the CV as PDF in Spanish or English.

## Run

```bash
docker-compose up --build
```

Then open http://localhost:15173 and sign in with `admin` / `admin1234` (local dev only, set in `docker-compose.yml`).

## Deploy (server-ia)

```bash
git clone https://github.com/nestorvargas/cv-app.git && cd cv-app
cp .env.prod.example .env.prod   # set DB_PASSWORD, ADMIN_USERNAME, ADMIN_PASSWORD
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

The app listens on `127.0.0.1:8075`. The Cloudflare tunnel routes `cv.nestordevelop.online` to `http://localhost:8075`.
The first admin is created from `ADMIN_USERNAME`/`ADMIN_PASSWORD` only while there are no users; manage the rest from the **Usuarios** screen.

## Features
- Edit all CV sections (personal info, summary, experience, education, skills)
- Switch between Spanish and English
- Upload profile photo
- Live CV preview with two-column design
- Download as PDF
- Login and user management (roles: `admin`, `editor`)
