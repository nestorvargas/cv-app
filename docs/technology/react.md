# React

React es una biblioteca de JavaScript para construir interfaces de usuario basadas en componentes. En este proyecto se usa **React 18** con **Vite 5** (no Next.js).

## Conceptos clave

### Componentes
Funciones que retornan JSX (HTML escrito en JavaScript). Se reutilizan y combinan para formar la UI.

```jsx
// Ejemplo de este proyecto: frontend/src/components/Navbar.jsx
function Navbar({ profileName, language, onToggleLang, onSave, onDownloadPdf }) {
  return (
    <div className="navbar">
      <button onClick={onSave}>💾 Guardar</button>
      <button onClick={onDownloadPdf}>📄 Descargar PDF</button>
    </div>
  );
}
```

### JSX
Sintaxis que mezcla HTML y JavaScript. Las expresiones van entre `{}`.

```jsx
// JSX con expresión JS
<h1>{cvData.personal_info?.name || 'Sin nombre'}</h1>
```

### Props
Datos que un componente padre le pasa a un hijo (como atributos HTML).

```jsx
// App.jsx pasa props a Navbar
<Navbar
  profileName={profileName}
  language={language}
  onSave={handleSave}
/>
```

### Estado (state)
Datos que cambian con el tiempo y hacen que el componente se re-renderice.

```jsx
// Ejemplo de estado en App.jsx
const [cvData, setCvData] = useState(null);
const [language, setLanguage] = useState('es');

// Actualizar estado
setCvData(response.data);
```

### Hooks principales

| Hook | Propósito | Ejemplo en este proyecto |
|------|-----------|-------------------------|
| `useState` | Estado local | `cvData`, `language`, `page` en `App.jsx` |
| `useEffect` | Efectos secundarios | Cargar datos de API al montar, sincronizar localStorage |
| `useRef` | Referencia a elementos DOM | `innerRef` en `Paged.jsx` para medir altura del contenido |
| `useCallback` | Memoizar funciones | Evita renders innecesarios al pasar callbacks |

```jsx
// useEffect — cargar datos al montar el componente
useEffect(() => {
  loadCv(profileName, language).then(data => setCvData(data));
}, [profileName, language]);
```

### Renderizado condicional

```jsx
// App.jsx cambia entre página de índice y editor según el estado
return (
  <div>
    {page === 'index' ? (
      <CVIndex onSelect={handleSelectProfile} />
    ) : (
      <div className="editor-layout">
        <Navbar ... />
        <CVEditor ... />
        <CVPreview ... />
      </div>
    )}
  </div>
);
```

### Listas y keys

```jsx
// ExperienceForm.jsx — mapea experiencias a filas de formulario
{cvData.experience.map((exp, index) => (
  <div key={exp.id} className="experience-item">
    <input value={exp.company} onChange={...} />
  </div>
))}
```

### Elevación de estado
El estado vive en el componente padre más alto que lo necesita y se pasa hacia abajo via props. En este proyecto, **todo el estado está en `App.jsx`** (no hay Context, Redux, ni librerías externas de estado).

## Flujo de datos en este proyecto

```
App.jsx (dueño del estado)
  ├── Navbar — recibe callbacks (onSave, onDownloadPdf)
  ├── CVEditor — recibe cvData y setCvData (modifica)
  │   └── PersonalInfoForm, SummaryForm, etc. — actualizan cvData via props
  └── CVPreview — recibe cvData (solo lectura)
      └── Classic.jsx, Modern.jsx, etc. — renderizan los datos
```

## Diferencia con Next.js

| Característica     | React + Vite (este proyecto) | Next.js |
|--------------------|------------------------------|---------|
| Routing            | Manual (condicional en App.jsx) | Basado en sistema de archivos |
| Renderizado        | Solo client-side (CSR)       | SSR, SSG, ISR, CSR |
| Backend            | Servidor Express separado     | API Routes integradas |
| Compilación        | Vite                         | Webpack / Turbopack |
| Caso de uso        | SPAs, herramientas internas  | Apps que necesitan SEO o rendimiento en primera carga |

## Lo que React NO es

- No es un framework (es una biblioteca). Next.js sí es un framework.
- No incluye routing, fetching, ni manejo de estado global — eso se agregá con librerías externas o se implementa manualmente.
