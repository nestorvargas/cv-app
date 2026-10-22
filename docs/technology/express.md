# Express

Express es un **framework web minimalista para Node.js**. Maneja rutas, middleware, y peticiones HTTP. En este proyecto es el servidor backend.

## Conceptos básicos

### Servidor
```js
const express = require('express');
const app = express();
app.listen(3001, () => console.log('Server on :3001'));
```

### Rutas
```js
// Método HTTP + URL + Handler
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Parámetros de URL
app.get('/api/cv/:profileName/:lang', handler);

// Query parameters: /api/pdf/desarrollador/es?template=classic&accentColor=red
// req.query → { template: 'classic', accentColor: 'red' }
```

### Request y Response

| Objeto | Propiedades comunes |
|--------|---------------------|
| `req`  | `req.params`, `req.query`, `req.body`, `req.headers` |
| `res`  | `res.json()`, `res.send()`, `res.status()`, `res.download()` |

```js
app.get('/api/cv/:name/:lang', (req, res) => {
  const { name, lang } = req.params;     // URL params
  const { template } = req.query;        // Query string
  const body = req.body;                 // JSON body (requiere middleware)
  res.status(200).json({ data: ... });
});
```

## Middleware

Funciones que se ejecutan antes de llegar al handler de ruta. Se encadenan con `app.use()`.

```js
// Middleware global
app.use(cors({ origin: '*' }));           // Permite peticiones de cualquier origen
app.use(express.json({ limit: '10mb' })); // Parsea JSON en req.body
app.use('/uploads', express.static(...)); // Sirve archivos estáticos

// Middleware específico de ruta
app.put('/api/cv/:name/:lang', validateBody, handler);
```

### Cors
Permite que el frontend (puerto 5173) llame al backend (puerto 3001) sin ser bloqueado por la política del mismo origen.

### express.json()
Convierte el body de las peticiones con `Content-Type: application/json` a un objeto JavaScript disponible en `req.body`.

## Estructura de rutas en este proyecto

```js
// index.js — monta sub-routers
app.use('/api/cv', cvRoutes);        // Todas las rutas CRUD de CV
app.use('/api/pdf', pdfRoutes);      // Generación de PDF
app.use('/api/upload', uploadRoutes); // Subida de imágenes
```

Cada router es un archivo separado:

```js
// routes/cv.js
const router = express.Router();

router.get('/', listProfiles);             // GET /api/cv
router.get('/:profileName/:lang', getCv);  // GET /api/cv/desarrollador/es

module.exports = router;
```

## Manejadores de errores

Express pasa errores a middleware especial con 4 parámetros:

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
```

En este proyecto no hay un middleware global de errores — cada controlador maneja sus propios errores con try/catch.

## Flujo de una petición

```
1. Browser → GET /api/cv/desarrollador/es
2. Express recibe la petición
3. cors() agrega headers CORS
4. express.json() parsea body (si aplica)
5. Express busca la ruta /api/cv/:profileName/:lang
6. Ejecuta el handler getCv
7. getCv consulta PostgreSQL via pg pool
8. getCv responde con res.json(data)
9. Browser recibe la respuesta JSON
```

## Diferencia con otros frameworks

| Framework | Características |
|-----------|----------------|
| **Express** | Minimalista, sin opiniones, flexible |
| NestJS    | Opinativo, decoradores, TypeScript, modular |
| Fastify   | Más rápido que Express, con schema validation |
| Koa       | Creado por el equipo de Express, usa async/await nativo |

Express se eligió aquí por simplicidad — es el framework Node.js más popular y suficiente para un backend con ~15 endpoints.
