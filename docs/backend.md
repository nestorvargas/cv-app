# Backend

**Stack:** Express 4 + PostgreSQL (pg), CommonJS, Puppeteer 22, pdf-lib, multer, dotenv.

## Entry point

`src/index.js` — boots Express, initializes DB, starts server.

```js
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/cv', cvRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

initDb().then(() => app.listen(PORT));
```

## Route structure

| Prefix      | File                  | Methods                                |
|-------------|-----------------------|----------------------------------------|
| `/api/cv`   | `src/routes/cv.js`    | GET, POST, PUT, DELETE                 |
| `/api/pdf`  | `src/routes/pdf.js`   | GET (generates + downloads PDF)        |
| `/api/upload` | `src/routes/upload.js` | POST (image multipart upload)        |

## Controllers

### `cvController.js`

| Method          | SQL                                      | Notes |
|-----------------|------------------------------------------|-------|
| `listProfiles`  | `SELECT DISTINCT profile_name, ... WHERE language='es'` | Lists distinct profiles (ES only) |
| `getCv`         | `SELECT * WHERE profile_name=$1 AND language=$2` | Returns 404 if not found |
| `updateCv`      | `UPDATE ... SET col = COALESCE($n, col)` | Partial updates via COALESCE, sets `updated_at = NOW()` |
| `createProfile` | `INSERT ... (es), INSERT ... (en)`       | Inserts 2 rows (both languages), slugifies `profile_name` |
| `deleteProfile` | `DELETE WHERE profile_name=$1`           | Rejects default profiles with 403 |

### `pdfController.js`

Launches Puppeteer headless Chromium, navigates to frontend's `/print/` URL, screenshots each `.cv-page`, assembles PDF with `pdf-lib`. Query params: `template`, `accentColor`, `bgColor`.

### `uploadController.js`

Uses multer to accept multipart `image` field (max 5MB, images only). Saves to `backend/uploads/<timestamp>_<original>`. Updates `profile_image` column for ALL language rows of the given profile.

## PDF templates

Location: `src/templates/`

| File                   | Layout                              |
|------------------------|-------------------------------------|
| `classicTemplate.js`   | 35% dark sidebar-left, 65% main-right |
| `modernTemplate.js`    | Full-width header, 50/50 columns    |
| `executiveTemplate.js` | 30% dark sidebar-left, 70% main-right |
| `creativeTemplate.js`  | 30% light sidebar-right, 70% main-left |
| `minimalTemplate.js`   | 29% dark sidebar-left, 71% main-right (timeline) |
| `cvTemplate.js`        | Legacy — hardcoded colors, no accents |

All accept `(cvData, imageBase64, accentColor, bgColor)` and return an HTML string.

## Environment

See `backend/.env.example`:

```
DATABASE_URL=postgresql://cv_user:cv_password@localhost:5432/cv_db
PORT=3001
NODE_ENV=development
```

`.env` is gitignored — copy the example file for local dev.

## Docker

- Dockerfile installs system Chromium (Alpine package `chromium`) alongside Node.js
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` (uses system Chrome, not bundled)
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`
- Volume mounts: `backend/src/` (hot reload via nodemon), `backend/uploads/` (persist images)
- Waits for postgres health check before starting

## Dependencies

| Package       | Purpose                           |
|---------------|-----------------------------------|
| express       | HTTP framework                    |
| pg            | PostgreSQL client                 |
| puppeteer     | PDF generation (headless Chrome)  |
| pdf-lib       | PDF assembly from screenshots     |
| multer        | Multipart file upload handling    |
| cors          | CORS middleware                   |
| dotenv        | Environment variable loading      |
| nodemon (dev) | Hot reload in development         |
