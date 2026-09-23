# Sistema de Usuarios - R3

Proyecto con dos sistemas de usuarios hechos con React 19 + Vite:

- `punto1-router`: navegacion con React Router.
- `punto2-useState`: navegacion interna controlada con `useState`.
- `api`: backend con Express y base de datos SQL SQLite.

La API no usa `require` y las consultas del frontend se hacen con `fetch`. Las rutas del backend trabajan con `POST`, validan datos, guardan passwords protegidas con sal y derivacion criptografica, y usan token para proteger datos privados.

## Instalacion

Desde esta carpeta:

```bash
npm install
```

## Ejecucion

Abrir tres terminales:

```bash
npm run api
```

```bash
npm run punto1
```

```bash
npm run punto2
```

Direcciones por defecto:

- API: `http://localhost:4000`
- Punto 1: `http://localhost:5173`
- Punto 2: `http://localhost:5174`

La API no es la pantalla principal del sistema. Si se abre `http://localhost:4000` en el navegador solo muestra el estado del backend. Para usar el sistema hay que entrar a `http://localhost:5173` o `http://localhost:5174`, dejando la API encendida en otra terminal.

Si aparece `Failed to fetch`, revisar que la terminal donde se ejecuto `npm run api` siga abierta y muestre `API disponible en http://localhost:4000`.

## Funcionamiento

1. Crear un usuario desde la pantalla de registro.
2. Iniciar sesion.
3. Ver el panel privado y la lista de usuarios.
4. Editar el perfil.
5. Cambiar entre modo dia y noche.

La sesion queda persistida en `localStorage`. Si el token no es valido, el sistema vuelve a pedir inicio de sesion.

## Estructura

```text
api/
  src/
    database.js
    server.js
punto1-router/
  public/
  src/
    api/
    components/
    context/
    pages/
    App.jsx
    main.jsx
  index.html
punto2-useState/
  public/
  src/
    api/
    components/
    context/
    views/
    App.jsx
    main.jsx
  index.html
```
