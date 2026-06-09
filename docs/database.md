# Database

**PostgreSQL 15** (Alpine in Docker), managed via the `pg` Node.js client.

## Connection

- Docker container name: `cv_postgres`
- Internal port: `5432`
- Host port: `15432`
- Database: `cv_db`
- User: `cv_user`
- Password: `cv_password`
- Connection string: `postgresql://cv_user:cv_password@postgres:5432/cv_db` (Docker) / `postgresql://cv_user:cv_password@localhost:15432/cv_db` (host)

## Schema

### `cv_profiles` table

```sql
CREATE TABLE cv_profiles (
  id            SERIAL PRIMARY KEY,
  profile_name  VARCHAR(100) NOT NULL DEFAULT 'desarrollador',
  profile_label VARCHAR(200),
  language      VARCHAR(10) NOT NULL,
  personal_info JSONB NOT NULL DEFAULT '{}',
  summary       TEXT NOT NULL DEFAULT '',
  experience    JSONB NOT NULL DEFAULT '[]',
  education     JSONB NOT NULL DEFAULT '[]',
  skills        JSONB NOT NULL DEFAULT '{}',
  certificates  JSONB NOT NULL DEFAULT '[]',
  profile_image VARCHAR(500),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

UNIQUE (profile_name, language);
```

## JSONB field shapes

### `personal_info`
```json
{
  "name": "Nestor Fabian Vargas Ferrucho",
  "title": "Full Stack Web Developer | PHP Backend | Docker | Laravel | Node.js",
  "phone": "3024213805",
  "email": "nestorfabian.92@gmail.com",
  "location": "Bogota, Colombia"
}
```

### `experience`
```json
[
  {
    "id": 1,
    "company": "Company Name",
    "position": "Job Title",
    "period": "Nov-2022 / Present",
    "description": "Job description text..."
  }
]
```

### `education`
```json
[
  {
    "id": 1,
    "institution": "University Name",
    "degree": "Degree Name",
    "period": "2018 - Present"
  }
]
```

### `skills`
```json
{
  "technical": ["PHP", "Laravel", "Node.js", ...],
  "databases": ["MySQL", "PostgreSQL", ...],
  "devops": ["Docker", "GitLab CI/CD", ...],
  "tools": ["Git", "Jira", ...],
  "languages": ["Spanish (Native)", "English (Intermediate)"]
}
```

### `certificates`
```json
[
  {
    "id": 1,
    "name": "Certificate Name",
    "issuer": "Platzi",
    "year": "2026",
    "url": ""
  }
]
```

### `profile_image`
Stores a URL path string, e.g. `/uploads/profile_1712345678.jpg`.

## Seed data

On first run, `init.sql` creates the table and seeds **3 profiles × 2 languages** (6 rows total):

| profile_name    | ES label                      | EN label                |
|-----------------|-------------------------------|-------------------------|
| `desarrollador` | Desarrollador Full Stack      | Full Stack Developer    |
| `devops-linux`  | DevOps / Linux Admin          | DevOps / Linux Admin    |
| `lider-tecnico` | Líder Técnico                 | Technical Leader        |

The `ON CONFLICT (profile_name, language) DO NOTHING` clause makes seeding idempotent.

## Key behaviors

- **Bilingual model**: Each profile is stored as two rows (one per `language`). They share the same `profile_name` slug but can have different labels and translated content.
- **Profile listing**: The list endpoint queries only `es` rows (`WHERE language='es'`).
- **Image update**: When uploading a photo, ALL language rows for the profile are updated (no language filter in the UPDATE query).
- **Delete protection**: Default profiles are protected at the application layer (not via DB constraint). See `cvController.js`.
- **`created_at`/`updated_at`**: `updated_at` is set to `NOW()` on every PUT. `created_at` is set once on INSERT.
