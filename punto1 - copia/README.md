# Organizador de tareas

Aplicacion web de tareas hecha con React 19, Vite y NodeJS. Permite crear, completar, filtrar y eliminar tareas. Los datos se guardan en `server/data/tareas.json`, por lo tanto quedan almacenados del lado del servidor.

## Temas incluidos

- React 19 con Vite.
- NodeJS con respuestas desde servidor.
- Arrays y vector de clases para manejar tareas.
- Clase `Task` con `get` y `set`.
- Import y export entre archivos.
- Fetch para cargar tareas.
- Axios para crear, actualizar y eliminar tareas.
- Eventos de formulario, botones, filtros y cambio de tema.
- Validacion sin alertas ni pop-ups.
- Modo dia/noche, responsive, animaciones y degradados.

## Como ejecutar

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar cliente y servidor:

```bash
npm run dev
```

3. Abrir la app en:

```txt
http://127.0.0.1:5173
```

El servidor funciona en `http://127.0.0.1:3001` y Vite redirige las llamadas `/api` automaticamente.

## Estructura

```txt
punto1
  public
  src
    api
    components
    models
    App.tsx
    main.tsx
    styles.css
  server
    data
    server.js
  index.html
  package.json
```
`tsconfig.json` sirve para configurar TypeScript en el proyecto. Le indica a la app cómo revisar los archivos `.ts` y `.tsx`, qué versión de JavaScript usar, cómo interpretar React, qué reglas estrictas aplicar y qué carpetas incluir.

En este proyecto, `tsconfig.json` ayuda a que Vite + React entiendan archivos como:

`App.tsx`, `main.tsx`, `Task.ts`, `tasksApi.ts`

También evita errores comunes porque activa revisión estricta de tipos. Por ejemplo, si una prioridad solo puede ser `"baja"`, `"media"` o `"alta"`, TypeScript avisa si se usa otro valor incorrecto.

**Funcionamiento Del Proyecto**

El proyecto es una aplicación de tareas con frontend y servidor.

La parte visual está en:

`C:\Users\rivas\OneDrive\Documentos\Profe Estanga\punto1\src`

Ahí está React. El usuario puede:

- Agregar tareas.
- Ver todas, pendientes o completadas.
- Marcar tareas como completadas.
- Eliminar solo las tareas completadas.
- Cambiar entre modo día y modo noche.
- Volver arriba con el botón flotante.

La parte del servidor está en:

`server`

El servidor usa NodeJS y guarda las tareas en:

`tareas.json`

Cuando se abre la app, React pide las tareas al servidor usando `fetch`.

Cuando se crea, completa o elimina una tarea, React usa `axios` para comunicarse con el servidor.

El servidor responde con JSON y actualiza el archivo `tareas.json`, por eso las tareas quedan guardadas aunque se cierre la página.

**Archivos Principales**

`main.tsx` inicia React y carga la app.

`App.tsx` controla el estado principal: tareas, filtros, mensajes, tema día/noche y botón de volver arriba.

`Task.ts` define la clase `Task`, con `get` y `set`.

`tasksApi.ts` contiene las funciones que se comunican con el servidor.

`TaskForm.tsx` maneja el formulario y las validaciones.

`TaskList.tsx` muestra las tareas y controla completar/eliminar.

`TaskStats.tsx` muestra total, pendientes, completadas y porcentaje de avance.

`server.js` crea el servidor NodeJS y maneja las respuestas para listar, crear, completar y eliminar tareas.