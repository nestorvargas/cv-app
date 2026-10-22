# Node.js

Node.js es un **entorno de ejecución de JavaScript del lado del servidor**. Usa el motor V8 de Chrome. En este proyecto corre en **Node.js 20** dentro de contenedores Alpine.

## Características clave

| Característica | Descripción |
|----------------|-------------|
| Single-threaded | Un solo hilo para ejecutar código JS |
| Event loop | Maneja operaciones asíncronas (I/O, red, archivos) sin bloquear |
| Non-blocking I/O | Operaciones como leer archivos o consultar DB no detienen el programa |
| npm | Administrador de paquetes con ~2 millones de módulos |

## Módulos en Node.js

Node.js tiene dos sistemas de módulos. Este proyecto usa **ambos** (uno en cada capa):

### CommonJS (backend)
```js
// backend/src/index.js — CommonJS
const express = require('express');   // Importar
const { initDb } = require('./db');   // Importar con destructuring
module.exports = { pool, initDb };    // Exportar
// require() es síncrono
```

### ES Modules (frontend)
```js
// frontend/src/App.jsx — ESM
import axios from 'axios';
import Navbar from './components/Navbar';
export default function App() { ... }
export const BASE = '/api';
// import() es asíncrono (permite static analysis)
```

## npx vs npm

| Comando | Uso |
|---------|-----|
| `npm install` | Instala dependencias del `package.json` |
| `npm run dev` | Ejecuta script definido en `package.json` |
| `npx vite` | Ejecuta un paquete sin instalarlo globalmente |

## node_modules

- Carpeta donde npm guarda las dependencias instaladas
- No se versiona (está en `.gitignore`)
- Se regenera con `npm install`
- En Docker, se copia dentro de la imagen en el build

## package.json

Define metadatos del proyecto, scripts, y dependencias:

```json
{
  "name": "cv-editor-backend",
  "version": "1.0.0",
  "main": "src/index.js",          // Entry point
  "scripts": {
    "start": "node src/index.js",   // Producción
    "dev": "nodemon src/index.js"   // Desarrollo con hot reload
  },
  "dependencies": {                 // Producción
    "express": "^4.19.2",
    "pg": "^8.11.5"
  },
  "devDependencies": {              // Solo desarrollo
    "nodemon": "^3.1.3"
  }
}
```

## package-lock.json

- Archivo autogenerado que fija versiones exactas de todas las dependencias
- Garantiza que todos los desarrolladores tengan las mismas versiones
- Debe versionarse en git

## Dotenv y variables de entorno

```js
// backend/src/index.js
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const dbUrl = process.env.DATABASE_URL;
```

- `dotenv` carga variables desde un archivo `.env`
- `.env` está en `.gitignore` (no se sube a git)
- `backend/.env.example` sirve como plantilla
- Las variables también se pueden pasar en el entorno del contenedor Docker

## Versiones y compatibilidad

| Herramienta | Versión |
|-------------|---------|
| Node.js     | 20 LTS (Alpine) |
| npm         | 10.x (incluido con Node 20) |
| Imagen base | `node:20-alpine` (≈120MB) |

## npm scripts de este proyecto

```bash
# Backend
cd backend
npm start          # node src/index.js
npm run dev        # nodemon src/index.js (hot reload)

# Frontend
cd frontend
npm run dev        # vite (dev server con HMR)
npm run build      # vite build (producción)
npm run preview    # vite preview (servir build localmente)
```
