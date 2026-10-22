# IA para desarrollo — Guía práctica

Cómo usar asistentes de IA (OpenCode, Claude, ChatGPT, Copilot) para programar de forma efectiva.

---

## OpenCode (esta terminal)

OpenCode es una herramienta CLI que ejecuta agentes de IA directamente en tu repositorio. Lee archivos, escribe código, ejecuta comandos.

### Comandos básicos

```
/help                 # Ayuda general
/task <descripción>   # Inicia una tarea compleja
/clear                # Limpia la conversación
```

### Cómo pedir cosas

| Hacer | No hacer |
|-------|----------|
| "Agrega un botón de exportar a PDF en el navbar" | "Haz cambios en el frontend" (muy vago) |
| "Refactoriza el formulario de skills para usar un JSON fijo en vez de categorías hardcodeadas" | "Mejora el código" |
| "Crea un endpoint GET /api/cv/stats que devuelva el conteo de perfiles por lenguaje" | "Agrega más APIs" |
| "Investiga por qué la imagen no aparece en el PDF" | "Arregla el PDF" |

### Archivos de instrucciones

OpenCode lee `AGENTS.md` al inicio de cada sesión para entender el proyecto. Si hay convenciones, comandos puntuales, o arquitectura que un agente nuevo debería saber, se documenta ahí.

```
AGENTS.md                          # Leído automáticamente por OpenCode
.github/copilot-instructions.md    # Leído por GitHub Copilot
.claude/agents/*.md                # Agentes especializados para Claude
```

### Patrones útiles

- Pedir cambios pequeños y específicos, no refactors masivos
- Si el agente se desvía, decir "no, concéntrate solo en X"
- Para tareas grandes, partir en pasos: "1. Crea el endpoint. 2. Prueba con curl. 3. Conecta el frontend"
- Revisar siempre el diff antes de aceptar

---

## Prompts efectivos

### Estructura

```
Contexto + Tarea + Formato + Restricciones
```

**Mal:** "Hazme un componente de login"  
**Bien:**

```
Tengo un proyecto React con Vite (sin TypeScript).
Necesito un componente LoginForm con email y contraseña,
que valide campos requeridos antes de llamar a POST /api/auth/login.
Usa axios para la petición. Los estilos deben ir en un archivo CSS aparte.
```

### Incluir ejemplos

```
La respuesta de la API tiene esta forma:
{
  "profile_name": "desarrollador",
  "personal_info": { "name": "Nestor", "title": "Dev" }
}
Genera un componente que muestre estos datos en una tarjeta.
```

### Pedir explicaciones

```
Explícame cómo funciona el sistema de paginación en Paged.jsx.
Incluye el propósito de EFFECTIVE_H y PAGE_INSET.
```

### Corregir errores

Cuando el agente da una respuesta incorrecta o incompleta:

```
Eso no funciona porque [razón]. En este proyecto usamos CommonJS en el backend,
no ESM. Reescribe usando require() y module.exports.
```

---

## Flujo de trabajo con IA

### 1. Exploración

```bash
# Dejar que la IA entienda el código antes de modificarlo
"Explícame cómo funciona el controlador de PDF"  
"Qué rutas existen en el backend?"
"Cómo se maneja la subida de imágenes?"
```

### 2. Planificación

```
"Necesito agregar un campo 'website' al formulario de información personal.
Qué archivos necesito modificar y en qué orden?"
```

### 3. Implementación

```
"Agrega el campo website al PersonalInfoForm.jsx.
El campo debe ir después de email. Usa el mismo patrón que los otros campos."
```

### 4. Verificación

```
"Verifica que el nuevo campo se guarde correctamente.
Busca en el controlador cómo se hace el update y confirma que website esté incluido."
```

### 5. Refinamiento

```
"El campo website se ve bien pero el placeholder debería decir 'https://...'.
También agrega validación de URL en el frontend."
```

---

## Limitaciones comunes de la IA

| Limitación | Qué hacer |
|------------|-----------|
| **Alucina APIs/funciones** que no existen | Pedir referencias a archivos: "Usa el método getCv de cvApi.js, no axios.get directamente" |
| **Olvida el contexto** en conversaciones largas | Recordatorio: "Recuerda que aquí usamos CommonJS, no ESM" |
| **Da soluciones genéricas** no adaptadas al proyecto | Agregar restricciones: "Usa el patrón de los otros formularios" |
| **Escribe código que no compila** | Pedir verificación: "Antes de mostrar el código, verifica que los imports existan" |
| **No conoce librerías internas** | Mostrar ejemplo: "Así se usa en el proyecto: [código]" |

---

## Recursos útiles

### Documentación oficial

| Recurso | URL |
|---------|-----|
| React docs | https://react.dev |
| Express | https://expressjs.com |
| Vite | https://vite.dev |
| PostgreSQL | https://postgresql.org/docs |
| Puppeteer | https://pptr.dev |
| MDN (JS, CSS, HTML) | https://developer.mozilla.org |
| Node.js | https://nodejs.org/docs |

### Herramientas

| Herramienta | Para qué |
|-------------|----------|
| `curl` | Probar APIs desde terminal |
| `jq` | Formatear y filtrar JSON en terminal |
| `psql` | Consultar PostgreSQL directamente |
| `npx serve` | Servir archivos estáticos rápidamente |
| `npx json-server` | Mock API REST con un archivo JSON |
| RegExp101 | Probar expresiones regulares: https://regex101.com |
| Can I Use | Compatibilidad de features web: https://caniuse.com |

### Conceptos clave para este proyecto

| Concepto | Dónde está explicado |
|----------|----------------------|
| Promesas / async-await | `docs/technology/promise-async-await.md` |
| React | `docs/technology/react.md` |
| Express | `docs/technology/express.md` |
| Docker | `docs/technology/docker.md` |
| JS moderno | `docs/technology/javascript-modern.md` |
| Estructura de proyectos | `docs/project-structure.md` |

### Troubleshooting común

**"El contenedor no arranca"**
```bash
docker compose logs backend
docker compose exec backend sh
```

**"La DB no responde"**
```bash
docker compose exec postgres psql -U cv_user -d cv_db
# O desde el host:
psql -h localhost -p 15432 -U cv_user -d cv_db
```

**"Los cambios del frontend no se ven"**
- Vite HMR debería funcionar automáticamente
- Si no: `docker compose restart frontend` o revisar los volúmenes montados

**"El PDF no se genera"**
- Revisar que `FRONTEND_INTERNAL_URL` esté configurada en el backend
- Revisar logs: `docker compose logs backend`
- Verificar que Puppeteer pueda lanzar Chromium

---

## IA como herramienta de aprendizaje

### Explicar conceptos

```
Explícame cómo funciona el Event Loop de Node.js con una analogía de cocina.
```

### Traducir código

```
Traduce este código de JavaScript clase a funciones modernas:
class Persona { constructor(nombre) { this.nombre = nombre; } saludar() { ... } }
```

### Encontrar bugs

```
Este código a veces no guarda los cambios en la DB. Por qué?
[código]
```

### Optimizar

```
Este componente se renderiza 20 veces al escribir en un input. Cómo lo optimizo?
[código]
```

### Generar mocks / tests

```
Genera un mock de la API para probar el listado de perfiles sin backend.
```
