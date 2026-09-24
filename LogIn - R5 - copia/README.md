# LogIn - R5

Proyecto de Sistema de Usuarios extendido con ingreso social (React 19 + Vite + Express + SQLite):

- `punto1-router`: navegacion con React Router e ingreso social real con Google, GitHub y Discord.
- `punto2-useState`: navegacion interna controlada con `useState` e Ingreso Social.
- `api`: backend con Express, autenticacion por JWT, ingreso tradicional, Google Identity Services, GitHub OAuth y endpoint `/api/social-login` con base de datos SQLite.

## Nuevas Caracteristicas (R5)

1. **Ingreso por Google**: boton oficial con el script de Google Identity Services en modo popup.
2. **Ingreso por GitHub**: ventana oficial de autorizacion con callback backend.
3. **Ingreso por Discord**: ventana oficial de autorizacion con callback backend.
4. **Badge de Proveedor**: Identificacion visual del metodo de ingreso en el panel privado y perfil del usuario.

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
- Punto 1: `http://localhost:5180`
- Punto 2: `http://localhost:5181`

## Google con Script Oficial

El ingreso con Google usa el script oficial:

```text
https://accounts.google.com/gsi/client
```

En Google Cloud, el origen JavaScript autorizado debe incluir:

```text
http://localhost:5180
```

Tu pantalla de login es:

```text
http://localhost:5180/login
```

Al tocar el boton, Google abre una ventana emergente de acceso/seleccion de cuenta, como ocurre en sitios externos. El frontend recibe el `credential` de Google y lo envia a la API. La API valida ese token contra Google antes de crear o iniciar sesion.

## GitHub OAuth

En la configuracion de la app de GitHub, el callback debe apuntar a:

```text
http://localhost:4000/api/oauth/github/callback
```

El boton de GitHub abre una ventana oficial de autorizacion de GitHub, la API canjea el `code` con el secreto de cliente y luego devuelve la sesion al frontend.

El Client ID usado por el frontend es:

```text
Ov23lizi5mXdONgenBGw
```

## Discord OAuth

En la configuracion de Discord Developer Portal, el redirect debe apuntar a:

```text
http://localhost:4000/api/oauth/discord/callback
```

El boton de Discord abre la ventana oficial de autorizacion, la API canjea el `code` con el secreto de cliente y devuelve la sesion al frontend.

## Funcionamiento

1. Iniciar sesion de forma tradicional, con Google, con GitHub o con Discord.
2. En Google o GitHub, seleccionar/autorizar la cuenta desde la ventana oficial.
3. El sistema valida la sesion, crea o vincula el usuario en SQLite y genera el token JWT.
4. Ver el panel privado con el badge del proveedor social activo.
5. Gestionar perfil y cambiar entre modo dia/noche.

## Usuario Admin

- Email: `admin@usuarios.com`
- Password: `Admin123`
