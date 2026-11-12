# CV Editor

Plataforma web multiusuario para crear, editar y exportar hojas de vida en español e inglés, con un asistente de redacción basado en un LLM auto-hospedado e importación de CVs existentes en PDF.

**En producción:** [cv.nestordevelop.online](https://cv.nestordevelop.online)

## Funcionalidades

**Asistente de IA**
- Mejora, acorta, genera y traduce secciones del CV (perfil profesional y descripciones de experiencia) con un modelo local servido por Ollama.
- Respuesta en streaming (Server-Sent Events) para ver el texto mientras se genera.
- Los prompts se construyen en el backend a partir de un conjunto fijo de acciones: el cliente nunca envía un prompt libre.
- Reglas de redacción en el prompt de sistema: no inventar datos, fechas ni tecnologías; estilo de hoja de vida sin primera persona; respuesta solo con el texto final.
- Cuota por usuario (una generación a la vez y límite por hora), timeouts y manejo de errores cuando el modelo no responde.

**Importación de CVs en PDF**
- Extracción del texto del PDF respetando el orden visual de la página.
- Clasificación de los párrafos de experiencia con el LLM mediante salidas JSON estructuradas, con reglas de respaldo cuando el modelo se equivoca o no está disponible.
- Detección de PDFs sin texto seleccionable (escaneados) con un mensaje claro para el usuario.

**Editor**
- Edición de todas las secciones: datos personales, foto, perfil, experiencia, educación, habilidades, certificados y referencias.
- Vista previa en vivo paginada en tamaño A4 y varias plantillas de diseño.
- Exportación a PDF con Puppeteer.
- Cambio de idioma entre español e inglés por perfil.

**Cuentas**
- Inicio de sesión con usuario y contraseña o con Google.
- Gestión de usuarios con roles `admin` y `editor`.
- Sesiones con cookies seguras.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite, PWA |
| Backend | Node.js, Express |
| Base de datos | PostgreSQL (JSONB) |
| IA | Ollama (por defecto `llama3.2:3b`), configurable |
| PDF | Puppeteer (generación), pdf-parse (importación) |
| Infraestructura | Docker Compose, Nginx, Cloudflare Tunnel |

## Arquitectura

```
Navegador ──▶ Frontend (React/Vite) ──▶ Backend (Express) ──▶ PostgreSQL
                                             │
                                             ├──▶ Ollama (asistente e importación)
                                             └──▶ Puppeteer (PDF)
```

Más detalle en [`docs/`](docs/): arquitectura, API, base de datos, generación de PDF y plantillas.

## Ejecutar en local

```bash
docker compose up --build
```

La aplicación queda en http://localhost:15173. El primer usuario administrador se crea a partir de `ADMIN_USERNAME` y `ADMIN_PASSWORD` mientras la tabla de usuarios esté vacía (ver `backend/.env.example`).

El asistente de IA es opcional: se activa al definir `OLLAMA_URL` y, si se quiere, `OLLAMA_MODEL`.

## Despliegue

```bash
cp .env.prod.example .env.prod   # definir DB_PASSWORD, ADMIN_USERNAME, ADMIN_PASSWORD
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

La aplicación escucha en `127.0.0.1:8075` y se publica mediante Cloudflare Tunnel.

## Desarrollo con IA

El proyecto se desarrolla con apoyo de agentes de IA. El repositorio incluye las instrucciones que usan: [`AGENTS.md`](AGENTS.md), [`.github/copilot-instructions.md`](.github/copilot-instructions.md) y agentes especializados en [`.claude/agents/`](.claude/agents/).

## Autor

Nestor Vargas · [nestordevelop.online](https://nestordevelop.online) · [LinkedIn](https://www.linkedin.com/in/nestorfabian92)
