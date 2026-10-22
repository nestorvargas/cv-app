# Promesas, Async y Await

JavaScript es **single-threaded** pero no bloqueante gracias a su modelo asíncrono. Promesas y async/await son las herramientas modernas para manejar operaciones asíncronas.

## El problema: operaciones lentas

Leer un archivo, consultar una DB, o hacer una petición HTTP toman tiempo. Sin asincronía, el programa se detendría esperando:

```js
// ❌ Esto no funciona — getCv tarda y el return se ejecuta antes
function loadProfile() {
  let data;
  axios.get('/api/cv').then(r => data = r.data);  // No espera
  return data;  // undefined
}
```

## Callbacks (la forma antigua)

```js
fs.readFile('datos.txt', 'utf8', (err, data) => {
  if (err) console.error(err);
  else console.log(data);
});
// El código continúa aquí, no espera al archivo
```

Problema: **callback hell** — anidamiento excesivo que hace el código ilegible.

## Promesas

Una Promise representa un valor que estará disponible **en el futuro** (o fallará).

### Estados

| Estado    | Significado |
|-----------|-------------|
| `pending` | Operación en progreso |
| `fulfilled` | Operación exitosa, valor disponible |
| `rejected` | Operación falló, error disponible |

### Crear una promesa

```js
const miPromesa = new Promise((resolve, reject) => {
  setTimeout(() => {
    const exito = true;
    if (exito) resolve('✅ Hecho');
    else reject(new Error('❌ Falló'));
  }, 1000);
});
```

### Consumir una promesa con .then/.catch

```js
// Ejemplo de este proyecto: downloadPdf en cvApi.js
fetch(`/api/pdf/${profileName}/${lang}?template=${template}`)
  .then(response => response.blob())         // Primer .then
  .then(blob => {                            // Segundo .then
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  })
  .catch(error => console.error('Error:', error));  // Manejo de errores
```

### Encadenamiento

Cada `.then()` devuelve una nueva promesa, permitiendo cadenas:

```js
axios.get('/api/cv')
  .then(res => res.data[0])        // Toma el primer perfil
  .then(profile => profile.name)   // Extrae el nombre
  .then(name => console.log(name)) // "desarrollador"
  .catch(err => console.error(err));
```

### Promise.all — ejecutar en paralelo

```js
// Ejecuta múltiples promesas simultáneamente
const [es, en] = await Promise.all([
  getCv('desarrollador', 'es'),
  getCv('desarrollador', 'en'),
]);
```

## Async / Await (azúcar sintáctico sobre promesas)

`async/await` hace que el código asíncrono se lea como si fuera síncrono.

### async
Declara que una función retorna una promesa (implícitamente).

```js
async function loadCv() {
  return 'datos';  // Envuelto en Promise.resolve('datos')
}
// loadCv() retorna una Promise
```

### await
Pausa la ejecución hasta que la promesa se resuelva.

```js
// Ejemplo de App.jsx
async function handleSave() {
  try {
    const response = await updateCv(profileName, language, cvData);
    // El código NO sigue hasta que updateCv termine
    console.log('✅ Guardado:', response);
    alert('CV guardado exitosamente');
  } catch (error) {
    console.error('❌ Error al guardar:', error);
    alert('Error al guardar el CV');
  }
}
```

### try/catch con async/await

```js
async function loadData() {
  try {
    const data = await fetch('/api/cv');
    // Si fetch lanza error, se va al catch
    const profiles = await data.json();
    return profiles;
  } catch (error) {
    console.error('Error cargando datos:', error);
    return [];  // Valor por defecto en caso de error
  }
}
```

## Ejemplos en este proyecto

### Backend: consulta a PostgreSQL

```js
// db/index.js
async function initDb() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  await pool.query(sql);               // Espera a que la consulta termine
  console.log('Database initialized');  // Se ejecuta después
}

// index.js
initDb().then(() => {
  app.listen(PORT);                    // Solo escucha después de inicializar DB
});
```

### Backend: PDF generation con Puppeteer

```js
// controllers/pdfController.js
async function generatePdf(req, res) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const pages = await page.$$('.cv-page');
  // ... más awaits ...
  await browser.close();
}
```

### Frontend: carga de perfil

```js
// App.jsx — patrón típico
useEffect(() => {
  async function loadProfile() {
    try {
      const data = await getCv(profileName, language);
      setCvData(data);  // Actualiza el estado, React re-renderiza
      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message);
    }
  }
  loadProfile();
}, [profileName, language]);
```

## Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `await is only valid in async function` | Usar await fuera de async | Envolver en `async function` |
| `Unhandled Promise Rejection` | Promesa que falla sin .catch | Agregar `.catch()` o `try/catch` |
| `Cannot read properties of undefined` | Acceder a datos antes de que lleguen | Verificar con `?.` o condicional |
| Olvidar await | `const data = getData()` devuelve una Promise, no los datos | `const data = await getData()` |

## Event Loop (cómo funciona por dentro)

```
Call Stack                 Web APIs / Cola de callbacks
┌─────────┐               ┌────────────────────────┐
│ main()  │               │ setTimeout()            │
│ fetch() │───envía──▶   │ Promise.then()          │
│ log()   │               │ fs.readFile()           │
└─────────┘               └────────────────────────┘
       │                          │
       └──────Event Loop◀─────────┘
               (revisa la cola cuando el stack está vacío)
```

1. Las operaciones síncronas se ejecutan inmediatamente en el Call Stack
2. Las operaciones asíncronas (fetch, setTimeout, DB) se delegan al sistema
3. Cuando terminan, sus callbacks van a una cola
4. El Event Loop mueve callbacks de la cola al stack **solo cuando el stack está vacío**

```js
console.log('1');           // Síncrono — se ejecuta ya
setTimeout(() => {
  console.log('2');          // Asíncrono — va a la cola
}, 0);
Promise.resolve().then(() => {
  console.log('3');          // Microtask — antes que setTimeout
});
console.log('4');           // Síncrono

// Output: 1, 4, 3, 2
```
