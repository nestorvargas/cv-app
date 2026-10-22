# Docker

Docker empaqueta aplicaciones en **contenedores** — entornos aislados y portátiles que incluyen todo lo necesario para ejecutarse.

## Conceptos clave

| Concepto | Descripción |
|----------|-------------|
| **Imagen** | Plantilla (como un ISO) con el sistema de archivos, dependencias y configuración |
| **Contenedor** | Instancia en ejecución de una imagen |
| **Dockerfile** | Receta para construir una imagen |
| **Volumen** | Persistencia de datos fuera del contenedor |
| **Red** | Conexión entre contenedores |

## Docker Compose

Define y ejecuta múltiples contenedores como un solo servicio. En este proyecto:

```yaml
# docker-compose.yml — 3 servicios
services:
  postgres:    # Base de datos
  backend:     # API Express + Puppeteer
  frontend:    # Vite + React
```

### Servicios

```yaml
postgres:
  image: postgres:15-alpine
  ports: ["15432:5432"]          # Host:15432 → Container:5432
  volumes: [postgres_data:/var/lib/postgresql/data]  # Datos persistentes
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U cv_user -d cv_db"]

backend:
  build: ./backend               # Construye desde backend/Dockerfile
  ports: ["13001:3001"]
  environment:
    DATABASE_URL: postgresql://cv_user:cv_password@postgres:5432/cv_db
    FRONTEND_INTERNAL_URL: http://frontend:5173  # Para Puppeteer
  volumes:
    - ./backend/src:/app/src                    # Hot reload
    - ./backend/uploads:/app/uploads            # Persistir imágenes
  depends_on:
    postgres: { condition: service_healthy }    # Espera a PostgreSQL

frontend:
  build: ./frontend
  ports: ["15173:5173"]
  environment:
    VITE_API_URL: http://backend:3001           # Proxy → backend
  volumes:
    - ./frontend/src:/app/src                   # Hot reload
```

## Comandos útiles

```bash
# Construir y levantar
docker compose up --build -d     # -d = detach (fondo)
docker compose up --build        # Sin -d (logs en terminal)

# Detener
docker compose down              # Detiene y elimina contenedores
docker compose down -v           # También elimina volúmenes (¡pierde datos!)

# Logs
docker compose logs -f           # Seguir todos los logs
docker compose logs -f backend   # Solo backend

# Estado
docker compose ps                # Listar contenedores con su estado

# Ejecutar comando dentro de un contenedor
docker compose exec backend sh   # Terminal dentro del backend
docker compose exec postgres psql -U cv_user -d cv_db  # Consola PostgreSQL

# Construir sin cache
docker compose build --no-cache backend
```

## Volúmenes

Los volúmenes montan directorios del host dentro del contenedor:

| Volumen | Propósito |
|---------|-----------|
| `postgres_data` | Datos de PostgreSQL (nombrado, persiste entre reinicios) |
| `./backend/src:/app/src` | Código backend (hot reload con nodemon) |
| `./backend/uploads:/app/uploads` | Imágenes subidas |
| `./frontend/src:/app/src` | Código frontend (HMR de Vite) |

## Redes

Los contenedores se comunican entre sí a través de redes Docker. En este proyecto:

```
cv_network (bridge)
├── postgres (cv_postgres)
├── backend  (cv_backend) → se conecta a postgres:5432
└── frontend (cv_frontend) → se conecta a backend:3001
```

Los nombres de host (ej. `postgres`, `backend`, `frontend`) son los nombres de los servicios en `docker-compose.yml`. Esto permite URLs como `http://frontend:5173` desde el contenedor backend.

## Dockerfiles

### Backend (multi-etapa implícita)

```dockerfile
FROM node:20-alpine
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/ ./src/
RUN mkdir -p uploads
CMD ["npm", "run", "dev"]
```

Características:
- Alpine Linux (~5MB base) para imágenes pequeñas
- Chromium se instala como paquete del sistema (no el bundled de Puppeteer)
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` evita descargar Chromium duplicado

### Frontend

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

## start.sh — Wrapper

```bash
./start.sh up        # docker compose up --build -d
./start.sh down      # docker compose down
./start.sh logs      # docker compose logs -f
./start.sh reset     # down -v + up (pregunta confirmación)
./start.sh status    # docker compose ps
```

Verifica que Docker esté instalado y corriendo antes de ejecutar comandos.
