## Descripción de archivos del proyecto

- `server.js`  
  Archivo principal del proyecto. Crea el servidor web con el módulo `HTTP` de Node.js, recibe las solicitudes del navegador y muestra las distintas páginas del sitio.

- `package.json`  
  Archivo de configuración del proyecto. Contiene el nombre, la versión, los comandos de ejecución y las dependencias instaladas con NPM, como `upper-case`.

- `package-lock.json`  
  Archivo generado automáticamente por NPM. Guarda la información exacta de las versiones instaladas para que el proyecto funcione igual en otra computadora.

- `README.md`  
  Archivo de documentación. Explica cómo está organizado el proyecto, cómo se ejecuta y qué función cumple cada archivo.

- `modulesDemo.js`  
  Archivo de prueba que muestra por consola el funcionamiento de los módulos propios creados para el proyecto, como clima, cálculo y turismo.

- `urlDemo.js`  
  Archivo que utiliza el módulo `URL` de Node.js para analizar una dirección web y mostrar por consola datos como host, path, protocolo, query y href.

- `modules/menu.js`  
  Módulo que contiene el menú de navegación del sitio. Genera los enlaces hacia las distintas páginas y permite reutilizar el mismo menú en todo el proyecto.

- `modules/content.js`  
  Módulo encargado de armar la estructura general de las páginas HTML. Incluye el encabezado, el cuerpo, el menú, el contenido principal y el pie de página.

- `modules/pages.js`  
  Módulo que contiene el contenido de las páginas del sitio, como inicio, clima, cálculo, turismo, contacto, acerca del proyecto, archivo y URL.

- `modules/weather.js`  
  Módulo propio de clima. Contiene datos simulados de distintas ciudades y permite mostrar información como temperatura, estado del clima, humedad y viento.

- `modules/calculator.js`  
  Módulo propio de cálculo. Permite realizar operaciones matemáticas básicas como suma, resta, multiplicación y división, incluyendo validaciones.

- `modules/tourism.js`  
  Módulo propio de turismo. Contiene información simulada sobre destinos turísticos y permite mostrar datos organizados en el sitio.

- `modules/fileSystemComponent.js`  
  Módulo que utiliza `File System`. Se encarga de crear y leer un archivo HTML para demostrar el uso del sistema de archivos desde Node.js.

- `public/style.css`  
  Archivo de estilos del sitio. Define colores, tamaños, diseño de tarjetas, formulario, botones, menú y adaptación responsive para distintas pantallas.

- `public/main.js`  
  Archivo JavaScript que se ejecuta en el navegador. Controla el menú responsive y las validaciones del formulario de contacto.

- `public/generado.html`  
  Archivo HTML creado automáticamente mediante el módulo `File System`. Se utiliza para demostrar que Node.js puede crear y leer archivos.

- `node_modules/`  
  Carpeta generada automáticamente al ejecutar `npm install`. Contiene las dependencias instaladas con NPM. No se modifica manualmente.

- `public/`  
  Carpeta que contiene los archivos públicos del sitio, como CSS, JavaScript del navegador y archivos HTML generados.

- `modules/`  
  Carpeta que contiene los módulos propios del proyecto. Ayuda a mantener el código ordenado, dividido y reutilizable.