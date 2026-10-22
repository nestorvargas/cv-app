# Claude / Claude Code

Claude es el **modelo de lenguaje de Anthropic** utilizado en este proyecto como asistente de desarrollo. Claude Code es su CLI oficial: un agente que corre directamente en tu terminal, lee el repositorio, escribe código y ejecuta comandos.

## Claude vs Claude Code

| Herramienta | Qué es | Cómo se usa |
|-------------|--------|-------------|
| **Claude** (modelo) | LLM de Anthropic — claude-sonnet-4-6, claude-opus-4-7, etc. | Conversación directa en claude.ai |
| **Claude Code** (CLI) | Agente que integra el modelo con tu repositorio local | `claude` en la terminal |
| **Claude Code** (desktop) | App de escritorio Mac/Windows con la misma CLI | Interfaz visual |
| **Claude Code** (IDE) | Extensión para VS Code / JetBrains | Integrado en el editor |

En este proyecto se usa **Claude Code CLI** (terminal) como herramienta principal de desarrollo asistido por IA.

---

## Instalación y uso básico

```bash
# Instalar globalmente
npm install -g @anthropic/claude-code

# Iniciar sesión
claude login

# Lanzar en el directorio del proyecto
cd /path/a/cv_dev_nestor
claude
```

### Comandos comunes dentro de Claude Code

```
/help              # Muestra ayuda y comandos disponibles
/clear             # Limpia el historial de la conversación actual
/compact           # Compacta el contexto (resume conversaciones largas)
/fast              # Activa Fast Mode (Claude Opus, salida más rápida)
/memory            # Gestiona memorias persistentes del proyecto
/review            # Lanza una revisión de código
/status            # Estado actual de la sesión
```

---

## Estructura `.claude/` en este proyecto

```
.claude/
├── CLAUDE.md              # Instrucciones base — leídas al inicio de cada sesión
├── agents/
│   ├── cv-pdf-sync.md     # Agente especializado: sincronizar templates PDF ↔ preview
│   └── cv-preview-reviewer.md  # Agente especializado: revisar paginado y visual del preview
├── settings.json          # Configuración local de Claude Code (permisos, hooks, etc.)
└── projects/
    └── .../memory/        # Memorias persistentes del proyecto (auto-generadas)
```

### CLAUDE.md

Archivo que Claude Code lee automáticamente al inicio de cada sesión. Define el contexto, convenciones y restricciones del proyecto:

```markdown
# CV Dev — Nestor
Backend: Express + PostgreSQL (CommonJS), puerto 13001
Frontend: Vite + React 18 (ESM), puerto 15173
...
```

---

## Agentes especializados

Claude Code puede lanzar **sub-agentes** para tareas específicas. Este proyecto tiene dos:

### cv-preview-reviewer

Revisa problemas visuales en el preview del CV: paginado A4, márgenes, overlays, cortes de contenido, comportamiento por plantilla.

```
# Claude Code lo invoca automáticamente cuando detecta problemas de preview
# También se puede pedir explícitamente:
"revisemos el preview del perfil desarrollador en la plantilla modern"
```

### cv-pdf-sync

Sincroniza los templates del PDF (backend Node.js) con los templates del preview (frontend React). Detecta y corrige diferencias visuales entre lo que se ve en pantalla y lo que sale al descargar el PDF.

```
# Se usa cuando el PDF descargado se ve diferente al preview
"el PDF del perfil lider-tecnico se ve diferente al preview, sincroniza los templates"
```

---

## Sistema de memoria

Claude Code mantiene memorias persistentes entre sesiones en `.claude/projects/.../memory/`. Se organizan por tipo:

| Tipo | Qué guarda |
|------|------------|
| `user` | Perfil del desarrollador, preferencias, nivel técnico |
| `feedback` | Correcciones y confirmaciones sobre el enfoque de trabajo |
| `project` | Decisiones de arquitectura, estado del proyecto, fechas |
| `reference` | Dónde encontrar información en sistemas externos |

Las memorias relevantes se cargan automáticamente al inicio de la sesión. Puedes pedirle a Claude que recuerde algo explícitamente:

```
"recuerda que en este proyecto no usamos TypeScript"
"recuerda que los contenedores corren en los puertos 15173 y 13001"
```

---

## Cómo pedir tareas en este proyecto

### Especificidad por capa

```
# Backend
"Agrega un campo 'website' al endpoint PUT /api/cv/:name/:lang.
 Solo el controlador en cvController.js, no toques el frontend."

# Frontend
"En PersonalInfoForm.jsx, agrega un input de website después del campo email.
 Usa el mismo patrón que los otros campos."

# PDF
"Sincroniza el nuevo campo website del preview (Modern.jsx) al template PDF
 del backend (templates/modern.js)."
```

### Tareas de preview / paginado

```
# Correcto
"El item de experiencia en el perfil desarrollador se corta entre páginas
 en la plantilla modern. Investiga por qué y propón un fix."

# Demasiado vago
"Arregla el PDF"
```

### Revisiones visuales

```
# Pedir al agente de revisión
"Usa cv-preview-reviewer para verificar que la plantilla classic queda
 bien para todos los perfiles."
```

---

## Flujo de trabajo típico con Claude Code

```
1. Describir el problema con contexto
   "En el perfil devops-linux, la plantilla executive muestra 3 páginas
    pero la tercera está casi vacía."

2. Claude investiga los archivos relevantes
   → lee Paged.jsx, Executive.jsx, el perfil en la DB

3. Claude propone un fix y lo aplica

4. Verificar en el browser
   http://localhost:15173 → selector de perfil y plantilla

5. Si no está bien, corregir con contexto adicional
   "Ese fix rompe el perfil complemento360, revisemos sin tocar Classic ni Minimal"
```

---

## Archivos clave que Claude Code suele modificar

| Archivo | Para qué |
|---------|----------|
| `frontend/src/components/CVPreview/Paged.jsx` | Motor de paginación A4 |
| `frontend/src/components/CVPreview/Modern.jsx` | Template modern (preview) |
| `frontend/src/components/CVPreview/modern.css` | Estilos del template modern |
| `backend/src/controllers/pdfController.js` | Generación de PDF con Puppeteer |
| `backend/src/db/init.sql` | Esquema y datos iniciales de la DB |
| `backend/src/routes/cv.js` | Rutas CRUD de perfiles |

---

## Limitaciones importantes

| Situación | Qué hacer |
|-----------|-----------|
| **Contexto largo agotado** | Usar `/compact` para resumir la sesión sin perder el trabajo |
| **Agente revierte cambios** | Si el linter o el sistema rechaza un cambio, preguntar la razón antes de volver a aplicar |
| **Dos columnas CSS** | El motor de paginación (`Paged.jsx`) trabaja con un solo flujo de documento; en layouts de dos columnas independientes los breakpoints pueden caer en posiciones incorrectas |
| **Preview ≠ PDF** | El preview usa React + CSS; el PDF usa HTML string en Node.js — son dos implementaciones separadas que deben sincronizarse manualmente |

---

## Modelos disponibles

| Modelo | ID | Cuándo usarlo |
|--------|----|----------------|
| **Sonnet 4.6** | `claude-sonnet-4-6` | Uso general — balance velocidad/calidad |
| **Opus 4.7** | `claude-opus-4-7` | Tareas complejas, razonamiento profundo |
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | Tareas simples, respuesta rápida |

Claude Code usa Sonnet 4.6 por defecto. Para activar Fast Mode (Opus más rápido): `/fast`.

---

---

## Agentes personalizados

Un **agente** es un sub-Claude especializado: tiene su propio contexto, instrucciones y herramientas. Claude Code puede lanzarlo automáticamente cuando detecta que la tarea encaja, o puedes pedirlo explícitamente.

### Para qué sirven

- **Especialización**: el agente sabe exactamente el dominio (paginado, PDF, etc.) sin tener que re-explicar cada vez
- **Proteger el contexto principal**: las operaciones pesadas (leer muchos archivos, hacer muchas búsquedas) corren en el agente, no en tu conversación principal
- **Paralelismo**: Claude Code puede lanzar varios agentes en paralelo para tareas independientes

### Dónde se definen

Los agentes del proyecto se guardan en `.claude/agents/`:

```
.claude/agents/
├── cv-pdf-sync.md          # Agente para sincronizar templates PDF ↔ preview
└── cv-preview-reviewer.md  # Agente para revisar el preview visual del CV
```

### Estructura de un agente

Cada agente es un archivo Markdown con **frontmatter YAML** obligatorio:

```markdown
---
name: nombre-del-agente
description: "Descripción de cuándo usar este agente.
  Incluir ejemplos concretos mejora la detección automática.

  <example>
  Context: El usuario reporta X.
  user: \"frase que dispara el agente\"
  assistant: \"Voy a usar nombre-del-agente para...\"
  <commentary>
  Por qué se usa este agente aquí.
  </commentary>
  </example>"
color: cyan   # cyan | orange | purple | green | blue | red | yellow
---

Eres un especialista en [dominio]. Tu área de trabajo es [archivos/carpetas].

## Contexto técnico
[Explicar la arquitectura del área que cubre el agente]

## Lo que debes revisar / hacer
[Lista de responsabilidades y checklist]

## Problemas conocidos
[Particularidades o bugs conocidos del área]

## Stack
[Tecnologías y versiones relevantes]
```

### Agentes de este proyecto

#### cv-preview-reviewer

```
Dominio:  frontend/src/components/CVPreview/
Trigger:  problemas de paginado, cortes de contenido, overlays incorrectos
Color:    cyan
```

Sabe que:
- `PAGE_W=794`, `PAGE_H=1123`, `PAGE_INSET=24`, `EFFECTIVE_H=1099`
- Los templates `classic`, `minimal`, `executive` usan sidebar oscura con `SIDEBAR_WIDTHS`
- `modern` y `creative` tienen header oscuro pero body sin sidebar registrada — el overlay puede no coincidir si el corte cae en el header

#### cv-pdf-sync

```
Dominio:  frontend/src/components/CVPreview/*.jsx + backend/src/templates/*Template.js
Trigger:  diferencias entre PDF descargado y preview en pantalla
Color:    orange
```

Conoce las divergencias conocidas:
- Labels de skills: `"DevOps"` en frontend vs `"DevOps & Herramientas"` en backend
- Tamaños de foto: classic 120px (preview) vs 110px (PDF)
- Escala tipográfica: `px` (frontend) vs `pt` (backend)

### Cómo crear un nuevo agente

```bash
# 1. Crear el archivo en .claude/agents/
touch .claude/agents/mi-agente.md

# 2. Agregar frontmatter + instrucciones
# (ver estructura arriba)

# 3. Claude Code lo detecta automáticamente en la siguiente sesión
```

**Ejemplo**: si frecuentemente necesitas revisar que la DB tenga datos consistentes entre perfiles, crea `db-checker.md` con instrucciones sobre el esquema y los campos a validar.

---

## Skills (habilidades personalizadas)

Una **skill** es un procedimiento reutilizable que Claude Code puede invocar como si fuera un comando slash (`/nombre`). A diferencia de los agentes (que son sub-instancias del modelo), una skill es un conjunto de instrucciones que Claude sigue en la conversación actual.

### Para qué sirven

- **Flujos repetibles**: verificar el estado del sistema, hacer un deploy, revisar todos los templates
- **Procedimientos con pasos fijos**: lanzar el servidor, correr los tests, revisar logs
- **Comandos de equipo**: estandarizar cómo se hacen ciertas tareas sin explicarlas cada vez

### Dónde se definen

```
.claude/skills/          # Skills propias del proyecto
~/.claude/skills/        # Skills globales (disponibles en todos los proyectos)
```

### Estructura de una skill

```markdown
---
name: nombre-skill
description: "Qué hace esta skill en una línea"
---

## Input
$ARGUMENTS   # Texto que el usuario pasa después del comando: /nombre-skill <argumentos>

## Instrucciones

1. Paso uno de lo que Claude debe hacer
2. Paso dos
3. Verificar con [comando específico]

## Output esperado
[Formato de respuesta o acción final]
```

### Invocar una skill

```
/nombre-skill                 # Sin argumentos
/nombre-skill perfil modern   # Con argumentos
```

### Ejemplo: skill para revisar un CV completo

Archivo `.claude/skills/revisar-cv.md`:

```markdown
---
name: revisar-cv
description: "Abre el preview de un perfil en todas las plantillas y reporta problemas"
---

## Input
$ARGUMENTS   # Nombre del perfil (ej: desarrollador)

Perfil a revisar: $ARGUMENTS

## Instrucciones

1. Verificar que el frontend esté corriendo en http://localhost:15173
2. Abrir el perfil $ARGUMENTS en los 5 templates: classic, modern, executive, creative, minimal
3. Para cada template, verificar:
   - ¿Cuántas páginas genera?
   - ¿Hay contenido cortado en los bordes de página?
   - ¿La página final tiene suficiente contenido (no casi vacía)?
4. Reportar en tabla: Template | Páginas | Estado | Problema encontrado
```

Uso: `/revisar-cv desarrollador`

---

## Diferencias: agente vs skill

| | Agente | Skill |
|---|--------|-------|
| **Qué es** | Sub-instancia del modelo con contexto propio | Instrucciones que sigue el modelo actual |
| **Cuándo se lanza** | Auto-detectado por descripción, o pedido explícitamente | Invocado con `/nombre` |
| **Contexto** | Aislado del hilo principal | Comparte el contexto de la conversación |
| **Cuándo usarlo** | Tarea especializada y repetida con mucho contexto propio | Flujo de trabajo estándar, pasos fijos |
| **Dónde vive** | `.claude/agents/*.md` | `.claude/skills/*.md` |
| **Ejemplo en este proyecto** | `cv-preview-reviewer`, `cv-pdf-sync` | (no hay skills aún — se pueden crear) |

---

## Recursos

| Recurso | URL |
|---------|-----|
| Claude Code docs | https://docs.anthropic.com/claude-code |
| Claude API | https://docs.anthropic.com/api |
| claude.ai | https://claude.ai |
| Reportar bugs de Claude Code | https://github.com/anthropics/claude-code/issues |
