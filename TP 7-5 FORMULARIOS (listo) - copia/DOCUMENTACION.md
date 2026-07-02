# TP 7-5 Formularios

Proyecto dividido en tres puntos, todos con pagina dinamica, validaciones con JavaScript, modo dia/noche, diseno responsive y ancho maximo de 1200px.

## Punto 1

Carga usuarios sin recargar la pagina. Demuestra tres formas de lectura de formularios:

- `querySelector`
- `FormData`
- `form.elements`

Valida nombre sin numeros, usuario unico, email correcto y rol seleccionado. Los usuarios se muestran en recuadros y se pueden borrar.

## Punto 2

Carga articulos con 8 campos y los almacena en un array usando diferentes metodos:

- `push()`
- spread: `[...array, item]`
- `concat()`

Los articulos se muestran en recuadros, se actualiza la consola visual y se pueden borrar.

## Punto 3

Carga personas y guarda los datos en `localStorage`. Valida nombre y apellido sin numeros, DNI, edad, mail, telefono, estado civil, hijos y nacionalidad.

La nacionalidad se elige desde una lista de paises de Sudamerica. Las personas guardadas se muestran en recuadros y se pueden eliminar, actualizando tambien `localStorage`.

## Servidores

Cada punto tiene su propio servidor estatico sin `require` y sin rutas `GET` propias:

- Punto 1: `http://localhost:3001`
- Punto 2: `http://localhost:3002`
- Punto 3: `http://localhost:3003`

Los archivos JavaScript incluyen comentarios con `//` para documentar estado, lectura, validaciones, renderizado, guardado y eliminacion.
