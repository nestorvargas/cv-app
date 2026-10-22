# Estructura de proyectos — Guía de referencia

Una estructura de directorios clara y consistente hace que un proyecto sea predecible: cualquier desarrollador sabe dónde encontrar cada cosa sin necesidad de explorar.

---

## Frontend (React + Vite)

### Estructura canónica

```
src/
├── main.jsx                    # Entry point — monta React en el DOM
├── App.jsx                     # Componente raíz (ruteo, providers, layout global)
├── routes/                     # Páginas/rutas de la aplicación
│   ├── Home.jsx
│   ├── About.jsx
│   └── Profile.jsx
├── components/                 # Componentes reutilizables
│   ├── common/                 #   UI atómica (Button, Input, Modal, Card)
│   ├── layout/                 #   Layout (Header, Sidebar, Footer, Navbar)
│   └── features/               #   Componentes de dominio específico
│       ├── ProfileCard.jsx
│       └── SkillBadge.jsx
├── hooks/                      # Custom hooks
│   ├── useAuth.js
│   └── useLocalStorage.js
├── api/                        # Cliente HTTP (axios, fetch)
│   ├── client.js               #   Instancia de axios configurada
│   └── cvApi.js                #   Endpoints agrupados por recurso
├── context/                    # React Context (estado global)
│   └── AuthContext.jsx
├── utils/                      # Funciones de utilería puras
│   ├── formatters.js           #   formatDate(), capitalize()
│   └── validators.js           #   validateEmail()
├── constants/                  # Constantes, enum, config
│   └── templates.js            #   MAPA_TEMPLATES, COLORES_DEFAULT
├── styles/                     # Estilos globales
│   ├── globals.css
│   └── variables.css
├── assets/                     # Recursos estáticos
│   ├── images/
│   └── fonts/
└── __tests__/                  # Tests (o junto al componente: Button.test.jsx)
```

### Estructura actual del proyecto

```
frontend/src/
├── main.jsx                    ✅ Entry point
├── App.jsx                     ✅ Componente raíz (también maneja ruteo manual)
├── PrintPage.jsx               🟡 Debería ir en routes/print/PrintPage.jsx
├── api/
│   └── cvApi.js                ✅
├── components/
│   ├── CVIndex/                ✅ Feature: listado de perfiles
│   ├── CVEditor/               ✅ Feature: editor de CV
│   └── CVPreview/              ✅ Feature: previsualización
├── Navbar.jsx                  🟡 Debería ir en components/layout/
├── index.css                   🟡 Debería ir en styles/globals.css
└── LanguageToggle.jsx          🟡 No usado (muerto)
```

### Principios de organización

1. **Agrupar por dominio, no por tipo técnico** — `CVEditor/` contiene todo lo del editor (formularios, lógica, estilos), no separar `forms/`, `modals/`, `hooks/` del editor
2. **Componentes comunes van en `common/`** — botones, inputs, modales reutilizables
3. **Componentes de layout van en `layout/`** — Navbar, Sidebar, Footer (cosas que aparecen en múltiples páginas)
4. **Componentes de página van en `routes/` o `pages/`** — una carpeta por ruta
5. **Cada carpeta de feature puede tener su propio `index.jsx`** — punto de entrada único que exporta lo público

### Convención de archivos

```
ComponentName/
├── index.jsx         # Export principal (el componente)
├── ComponentName.jsx # (alternativa: el componente aquí)
├── ComponentName.css # Estilos específicos del componente
├── ComponentName.test.jsx  # Tests
└── useComponentName.js     # Hook específico (si aplica)
```

O plano (sin carpeta):

```
components/
├── Button.jsx
├── Button.css
└── Button.test.jsx
```

Usar carpetas cuando el componente tiene múltiples archivos asociados. Archivos planos cuando es un solo archivo.

---

## Backend (Node.js + Express)

### Estructura canónica

```
src/
├── index.js                     # Entry point — configura Express, conecta DB, inicia servidor
├── app.js                       # Configuración de Express (middleware, rutas) sin listen()
├── config/                      # Configuración
│   ├── index.js                 #   Carga variables de entorno
│   └── database.js              #   Configuración de la DB
├── db/                          # Base de datos
│   ├── index.js                 #   Pool de conexiones
│   ├── models/                  #   Modelos/consultas (o en src/models/)
│   │   ├── Profile.js
│   │   └── User.js
│   ├── migrations/              #   Migraciones (archivos SQL o JS)
│   └── seeds/                   #   Datos de semilla
├── routes/                      # Definición de rutas (solo routing)
│   ├── index.js                 #   Agrupa y exporta todas las rutas
│   ├── cv.routes.js
│   └── pdf.routes.js
├── controllers/                 # Lógica de los handlers (sin acceso directo a req/res)
│   ├── cv.controller.js
│   └── pdf.controller.js
├── services/                    # Lógica de negocio (independiente de Express)
│   ├── cv.service.js
│   └── pdf.service.js
├── middleware/                   # Middleware personalizado
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
├── templates/                   # Plantillas (HTML para PDF, emails, etc.)
│   ├── classicTemplate.js
│   └── modernTemplate.js
├── utils/                       # Funciones auxiliares
│   ├── slugify.js
│   └── imageHelper.js
├── validators/                  # Validación de schemas (Joi, Zod)
│   └── cv.schema.js
└── uploads/                     # Archivos subidos (no versionado)
```

### Estructura actual del proyecto

```
backend/src/
├── index.js                     ✅ Entry point
├── db/
│   ├── index.js                 ✅ Pool + init
│   └── init.sql                 ✅ Seed (se llama desde initDb)
├── routes/                      ✅
│   ├── cv.js
│   ├── pdf.js
│   └── upload.js
├── controllers/                 ✅
│   ├── cvController.js
│   ├── pdfController.js
│   └── uploadController.js
├── templates/                   ✅ Plantillas PDF
│   ├── classicTemplate.js
│   ├── modernTemplate.js
│   ├── executiveTemplate.js
│   ├── creativeTemplate.js
│   ├── minimalTemplate.js
│   └── cvTemplate.js
└── uploads/                     ✅ (gitignored)
```

Faltarían (opcional, según necesidad): `middleware/`, `services/`, `validators/`, `config/`.

### Principios de organización

1. **Separación de responsabilidades**:
   - `routes/` — solo define método + URL + middleware + controlador
   - `controllers/` — recibe req/res, orquesta servicios, responde
   - `services/` — lógica de negocio pura (sin req/res), lanza errores con next()
   - `models/` — consultas a la base de datos
   - `validators/` — schemas de validación

2. **Un archivo por recurso** — `cv.routes.js` + `cv.controller.js` + `cv.service.js`
3. **Middleware reutilizable** — auth, logging, rate-limiting, error handler
4. **Configuración centralizada** — un archivo que exporta todas las variables de entorno validadas

### Separación app.js / index.js

```js
// app.js — configura Express (para tests sin abrir puerto)
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);
module.exports = app;

// index.js — solo inicia el servidor
const app = require('./app');
const { initDb } = require('./db');
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server on :${PORT}`));
});
```

Beneficio: los tests pueden importar `app.js` sin abrir un puerto real.

---

## Patrones comunes (aplica a ambos)

### 1. Barrel exports (index.js)

```js
// components/common/index.js
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';

// Uso limpio:
import { Button, Input } from './components/common';
// En lugar de:
import Button from './components/common/Button/Button';
import Input from './components/common/Input/Input';
```

### 2. Nombrar archivos

| Convención | Ejemplo | Cuándo usarlo |
|------------|---------|---------------|
| PascalCase | `ProfileCard.jsx` | Componentes React, clases |
| camelCase  | `cvApi.js`, `formatDate.js` | Utilidades, hooks, módulos no-React |
| kebab-case | `cv.routes.js`, `error-handler.js` | Backend (cada vez menos usado) |
| Punto separador | `ProfileCard.test.jsx`, `cv.controller.js` | Arquitectura limpia |

### 3. Separación de tests

```
src/
├── components/
│   └── Button.jsx
└── __tests__/
    └── Button.test.jsx

// O junto al componente (preferido en proyectos modernos):
src/
├── components/
│   ├── Button.jsx
│   └── Button.test.jsx
```

### 4. Evitar archivos huérfanos

Archivos que no se importan desde ningún lado son **dead code**. Ejemplo en este proyecto:
- `LanguageToggle.jsx` — no se importa, su función está inline en Navbar
- `CVPreview/index.css` — ningún componente lo importa

Eliminarlos o consolidarlos.

---

## Cuándo desviarse de la estructura canónica

| Situación | Acción |
|-----------|--------|
| Proyecto pequeño (< 10 archivos) | Estructura plana, sin subcarpetas |
| Microservicio | Una carpeta `src/` con estructura completa, pero minimalista |
| Monorepo | Usar workspaces de npm, una carpeta `packages/` por servicio |
| Prototipo rápido | Todo en un archivo, refactorizar después |
| Feature muy compleja | Subcarpetas dentro del feature: `CVEditor/forms/`, `CVEditor/hooks/` |

La estructura debe evolucionar con el proyecto. Comenzar plana y dividir cuando un directorio tiene > 7-10 archivos.
