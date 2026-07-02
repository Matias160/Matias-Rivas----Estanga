# TP Array Formulario TXT

Proyecto dividido en dos modulos:

- `punto1`: carga entre 10 y 20 numeros enteros positivos y genera un archivo TXT.
- `punto2`: sube un TXT, analiza los numeros y exporta el resultado filtrado.

## Requisitos

- Node.js instalado.
- Dependencias instaladas en cada carpeta (`npm install` si hiciera falta).

## Como ejecutar

Abrir una terminal en cada modulo y ejecutar:

```bash
npm start
```

Puertos usados:

- Punto 1: `http://localhost:3000`
- Punto 2: `http://localhost:3002`

## Punto 1

Funcionamiento:

1. El usuario ingresa numeros enteros positivos.
2. La app valida que haya minimo 10 y maximo 20 numeros.
3. Los numeros se muestran en pantalla a medida que se cargan.
4. Al descargar, el backend guarda:
   - un archivo `.txt` con un numero por linea;
   - un archivo `.json` con el array completo.
5. La pantalla muestra una consola con:
   - estado actual;
   - array en memoria;
   - contenido del TXT;
   - nombres de archivos creados en el backend.

Formato del TXT generado:

```txt
525
123
7
44
120
6
101
89
24
22
```

## Punto 2

Funcionamiento:

1. El usuario sube un archivo `.txt`.
2. El backend lee numeros enteros del archivo.
3. Se separan los numeros en:
   - utiles;
   - no utiles;
   - factoriales.
4. Se calcula el porcentaje de numeros utiles.
5. Al exportar, el backend guarda:
   - un archivo `.txt` con el resumen;
   - un archivo `.json` con los arrays procesados.
6. La pantalla muestra una consola con:
   - numeros leidos;
   - array de utiles;
   - array de no utiles;
   - array de factoriales;
   - resumen del porcentaje;
   - nombres de archivos creados.

## Criterio de numeros utiles

Un numero es util cuando empieza y termina con el mismo digito.

Ejemplos:

- `525` es util porque empieza con `5` y termina con `5`.
- `44` es util porque empieza con `4` y termina con `4`.
- `123` no es util porque empieza con `1` y termina con `3`.

## Criterio de factoriales

Un numero es factorial si aparece como resultado de multiplicar desde `1` hasta otro numero.

Ejemplos:

- `3! = 1 * 2 * 3 = 6`
- `4! = 1 * 2 * 3 * 4 = 24`
- `5! = 1 * 2 * 3 * 4 * 5 = 120`

Entonces `6`, `24` y `120` son factoriales.

## Archivos importantes

Punto 1:

- `punto1/server.js`: servidor Express y guardado de TXT/JSON.
- `punto1/public/index.html`: estructura de la pantalla.
- `punto1/public/style.css`: estilos responsive y modo dia/noche.
- `punto1/public/app.js`: validacion, renderizado, consola y descarga.

Punto 2:

- `punto2/server.js`: subida, procesamiento, filtrado y exportacion.
- `punto2/public/index.html`: estructura de la pantalla.
- `punto2/public/style.css`: estilos responsive y modo dia/noche.
- `punto2/public/app.js`: subida, renderizado de resultados, consola y exportacion.

## Nota

Los archivos generados por el backend se guardan en:

- `punto1/archivos_guardados`
- `punto2/archivos_guardados`
