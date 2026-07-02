// Servidor del punto 1.
// Recibe el array cargado desde el frontend.
// Valida que tenga entre 10 y 20 numeros enteros positivos.
// Guarda dos archivos en el backend:
// - TXT: un numero por linea, listo para usar en el punto 2.
// - JSON: el array original, para documentar la estructura enviada.

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DIR_SALIDA = path.join(__dirname, "archivos_guardados");
if (!fs.existsSync(DIR_SALIDA)) fs.mkdirSync(DIR_SALIDA, { recursive: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/descargar", (req, res) => {
  const { numeros } = req.body;

  // Validacion de completitud y tipo de dato.
  const listaValida =
    Array.isArray(numeros) &&
    numeros.length >= 10 &&
    numeros.length <= 20 &&
    numeros.every((numero) => Number.isInteger(numero) && numero >= 0);

  if (!listaValida) {
    return res.status(400).json({
      error: "La lista debe tener entre 10 y 20 numeros enteros positivos.",
    });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseArchivo = `numeros_${timestamp}`;
  const nombreArchivo = `${baseArchivo}.txt`;
  const nombreArray = `${baseArchivo}.json`;

  // El TXT queda simple para que el punto 2 lo pueda leer sin conversiones raras.
  const contenido = `${numeros.join("\n")}\n`;
  const rutaArchivo = path.join(DIR_SALIDA, nombreArchivo);
  const rutaArray = path.join(DIR_SALIDA, nombreArray);
  const contenidoArray = JSON.stringify({ numeros }, null, 2);

  try {
    // Guardado real en el backend.
    fs.writeFileSync(rutaArchivo, contenido, "utf8");
    fs.writeFileSync(rutaArray, contenidoArray, "utf8");
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo guardar el archivo en el servidor.",
    });
  }

  // La respuesta descarga el TXT y expone los nombres para mostrarlos en consola.
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo}"`);
  res.setHeader("X-Archivo-Txt", nombreArchivo);
  res.setHeader("X-Archivo-Json", nombreArray);
  res.send(contenido);
});

app.listen(PORT, () => {
  console.log(`Punto 1 corriendo en http://localhost:${PORT}`);
});
