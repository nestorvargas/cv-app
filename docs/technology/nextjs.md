# Next.js

Next.js es un **framework de React** que agrega routing, renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG), y API routes. Este proyecto **no usa Next.js** — usa React + Vite — pero se incluye esta guía como referencia conceptual.

## Qué Next.js resuelve

React puro renderiza todo en el cliente (CSR). Esto tiene desventajas:

| Problema            | React + Vite          | Next.js                            |
|---------------------|-----------------------|------------------------------------|
| SEO                 | El HTML inicial está vacío | SSR/SSG genera HTML completo   |
| Primera carga lenta | Descarga todo el JS primero | Sirve HTML ya renderizado  |
| Routing             | Hay que implementarlo manual | Automático basado en `pages/` o `app/` |
| API endpoints       | Servidor separado     | API Routes dentro del mismo proyecto |

## Arquitectura de Next.js

```
pages/                    (App Router: app/)
├── index.jsx             → /
├── about.jsx             → /about
└── api/
    └── hello.js          → /api/hello (API Route)

getServerSideProps()      — Renderiza en servidor por cada request
getStaticProps()          — Genera HTML estático en build time
getStaticPaths()          — Define rutas dinámicas para SSG
```

## App Router (Next.js 13+)

```jsx
// app/page.jsx — nueva convención
export default function Home() {
  return <h1>Inicio</h1>;
}

// app/layout.jsx — layout compartido (reemplaza _app.jsx + _document.jsx)
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}
```

## En este proyecto

Si migraramos de Vite a Next.js:

| Aspecto actual (Vite)     | Equivalente en Next.js         |
|---------------------------|--------------------------------|
| `main.jsx`                | `app/layout.jsx`               |
| Routing manual (App.jsx) | `app/page.jsx`, `app/[profile]/page.jsx` |
| `api/cvApi.js` (axios)   | Server Actions o Route Handlers|
| `PrintPage.jsx`           | `app/print/[profile]/[lang]/page.jsx` |
| Proxy de Vite            | Rewrites en `next.config.js`    |
| Servidor Express aparte   | API Routes + Route Handlers    |

## SSR vs CSR en este proyecto

Actualmente el PDF usa Puppeteer para renderizar la página en un navegador headless — un SSR artificial. Con Next.js, el PDF podría generarse directamente desde el servidor sin Puppeteer, usando el mismo HTML que ya se sirve al cliente.
