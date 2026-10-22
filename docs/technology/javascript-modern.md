# JavaScript Moderno (ES6+)

Características del lenguaje usadas en este proyecto.

## Let y Const

| Keyword | Mutabilidad | Scope | Cuándo usar |
|---------|-------------|-------|-------------|
| `const` | No reasignable | Bloque (`{}`) | Por defecto |
| `let`   | Reasignable  | Bloque (`{}`) | Cuando necesites reasignar |
| `var`   | Reasignable  | Función | No usar (obsoleto) |

```js
const nombre = 'Nestor';  // ✅ No cambiará
let edad = 30;            // ✅ Cambiará
edad = 31;                // ✅ Válido
nombre = 'Otro';          // ❌ TypeError: Assignment to constant variable
```

## Arrow functions

Sintaxis más corta y sin `this` propio:

```js
// Tradicional
function sum(a, b) { return a + b; }

// Arrow function
const sum = (a, b) => a + b;

// Con un solo parámetro (sin paréntesis)
const double = n => n * 2;

// Sin parámetros
const greet = () => 'Hola';

// Con cuerpo de bloque (necesita return explícito)
const formatName = (name) => {
  return name.toUpperCase();
};
```

En el proyecto:

```js
// App.jsx
const filteredProfiles = profiles.filter(p => p.profile_name !== currentName);

// Paged.jsx
const pageCount = Math.max(1, Math.ceil((h - PAGE_INSET) / EFFECTIVE_H));
```

## Destructuring

Extraer valores de objetos o arrays en variables:

```js
// Objetos
const cvData = { personal_info: { name: 'Nestor', title: 'Developer' } };
const { name, title } = cvData.personal_info;
// name = 'Nestor', title = 'Developer'

// Parámetros de función (muy común en React)
function Navbar({ profileName, language, onSave }) {
  // profileName, language, onSave ya están extraídos
}

// Arrays
const [first, second] = ['a', 'b', 'c'];
// first = 'a', second = 'b'
```

## Spread operator (`...`)

Expandir elementos de un array o propiedades de un objeto:

```js
// Arrays — copiar y agregar
const newExperience = [...cvData.experience, newEntry];

// Objetos — copiar y sobrescribir
const updatedCv = {
  ...cvData,
  personal_info: { ...cvData.personal_info, name: 'Nuevo' },
};

// En el proyecto: skills como array
const skills = [...cvData.skills.technical, 'PHP', 'Laravel'];
```

## Template literals (`` ` ``)

Strings con interpolación y multilínea:

```js
const name = 'Nestor';
const greeting = `Hola, ${name}!`;       // "Hola, Nestor!"
const url = `/api/cv/${profileName}/${language}`;

// Multilínea sin \n
const html = `
  <div class="card">
    <h2>${profileName}</h2>
  </div>
`;
```

## Optional chaining (`?.`)

Acceder a propiedades sin error si algo es null/undefined:

```js
const name = cvData?.personal_info?.name || 'Sin nombre';
// Si cvData es null → undefined → 'Sin nombre'
// Si personal_info es undefined → undefined → 'Sin nombre'

const company = cvData?.experience?.[0]?.company;
// Seguro incluso si experience está vacío
```

## Nullish coalescing (`??`)

Usar valor por defecto solo si es null/undefined (no para otros falsy):

```js
const port = process.env.PORT ?? 3001;   // si PORT es undefined → 3001
// vs || (or) que toma cualquier falsy: '' | 0 | false
const value = '' || 'default';            // 'default' (mal si '' es válido)
const value = '' ?? 'default';            // '' (correcto)
```

## Métodos de array

```js
// map — transformar cada elemento
cvData.experience.map(exp => ({
  ...exp,
  company: exp.company.toUpperCase(),
}));

// filter — filtrar elementos
const visible = items.filter(item => !item.hidden);

// find — encontrar el primer match
const profile = profiles.find(p => p.profile_name === 'desarrollador');

// some — ¿alguno cumple?
const hasSkill = skills.some(s => s.includes('React'));

// forEach — iterar (no devuelve nada)
skills.forEach(skill => console.log(skill));

// reduce — acumular
const total = numbers.reduce((acc, n) => acc + n, 0);
```

## Módulos (import/export)

Ver `docs/technology/nodejs.md` para la diferencia entre ESM y CommonJS.

```js
// Exportar (ESM)
export default function App() { ... }
export const BASE_URL = '/api';
export { function1, function2 };

// Importar (ESM)
import App from './App';              // default import
import { BASE_URL } from './config';  // named import
import * as API from './api';         // namespace import
```

## Operador ternario

```js
const label = language === 'es' ? 'Español' : 'Inglés';

// En JSX:
{page === 'index' ? <CVIndex /> : <Editor />}
```

##&& para renderizado condicional

```js
// Solo se renderiza si la condición es true
{loading && <div className="spinner">Cargando...</div>}
{error && <div className="error">{error}</div>}
```

## Objetos: atajo

```js
const name = 'Nestor';
const age = 30;

// Antes
const obj = { name: name, age: age };

// Ahora
const obj = { name, age };
```

## Array methods: push vs spread (inmutabilidad)

```js
// ❌ Mutante — modifica el array original
cvData.experience.push(newItem);

// ✅ Inmutable — crea un nuevo array
const updated = [...cvData.experience, newItem];
setCvData({ ...cvData, experience: updated });
```

React requiere inmutabilidad para detectar cambios correctamente.
