# Vite

Vite es un **bundler y dev server** para proyectos web modernos. Reemplaza a Webpack. En este proyecto se usa **Vite 5** como build tool del frontend.

## Qué hace Vite

1. **Dev server** — Sirve archivos sin empaquetar (ESM nativo), con HMR instantáneo
2. **Build** — Empaqueta y minifica para producción (Rollup por debajo)
3. **Plugin system** — Extiende funcionalidad (React, TypeScript, CSS, etc.)

## Configuración del proyecto

```js
// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',          // Accesible desde Docker
    port: 5173,
    allowedHosts: true,         // Permite cualquier host (Docker)
    watch: { usePolling: true }, // Polling para compatibilidad con Docker
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

## Proxy de desarrollo

Vite redirige ciertas rutas al backend para que el frontend use URLs relativas:

| Ruta frontend | Proxy hacia       | Propósito        |
|---------------|-------------------|------------------|
| `/api/*`      | `localhost:3001`  | API REST         |
| `/uploads/*`  | `localhost:3001`  | Imágenes subidas |

```js
// El frontend llama a /api/cv (no a http://localhost:3001/api/cv)
await axios.get('/api/cv');
// Vite redirige al backend automágicamente
```

En Docker, el target cambia a `VITE_API_URL=http://backend:3001`.

## HMR (Hot Module Replacement)

- Los cambios en `.jsx` y `.css` se reflejan al instante sin recargar la página
- Mantiene el estado del componente
- En Docker usa `usePolling: true` porque los archivos están montados via volúmenes y los eventos del sistema de archivos no siempre funcionan

## Build de producción

```bash
npm run build    # Genera dist/ con archivos estáticos optimizados
npm run preview  # Sirve dist/ localmente para verificar el build
```

El build produce:
- HTML, CSS y JS minificados
- Code splitting automático por chunks
- Sin TypeScript en este proyecto (JSX plano)

## Diferencia con Webpack

| Aspecto         | Webpack                    | Vite                        |
|-----------------|----------------------------|-----------------------------|
| Dev server      | Empaqueta todo y sirve     | Sirve ESM nativo (sin bundle) |
| HMR             | Lento en proyectos grandes | Instantáneo (solo cambia el módulo modificado) |
| Configuración   | Compleja (loaders, plugins) | Mínima, plugins con convenciones |
| Build           | Empaquetado propio         | Rollup (más rápido en prod) |

## Plugins en este proyecto

```json
// frontend/package.json
"devDependencies": {
  "@vitejs/plugin-react": "^4.3.1",
  "vite": "^5.3.1"
}
```

`@vitejs/plugin-react` agrega:
- Soporte JSX (transformación automática)
- React Refresh (HMR que preserva estado)
- Sin necesidad de configurar Babel manualmente
