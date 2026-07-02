// Servidor del punto 2.
// Recibe un archivo TXT, extrae numeros enteros y calcula:
// - numeros utiles;
// - numeros no utiles;
// - numeros factoriales;
// - porcentaje de utiles.
// Al exportar guarda TXT y JSON en el backend.

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3002;

const DIR_SALIDA = path.join(__dirname, "archivos_guardados");
if (!fs.existsSync(DIR_SALIDA)) fs.mkdirSync(DIR_SALIDA, { recursive: true });

// Multer guarda el archivo subido en memoria.
// No se escribe el archivo original en disco: solo se procesa su contenido.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const esTxt = file.mimetype === "text/plain" || path.extname(file.originalname).toLowerCase() === ".txt";
    cb(esTxt ? null : new Error("Solo se permiten archivos .txt"), esTxt);
  },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Extrae numeros aunque el TXT venga como "525" o con formato "[01] 525".
function parsearTxt(contenido) {
  const numeros = [];
  const rechazados = [];
  const lineas = contenido.split(/\r?\n/);

  lineas.forEach((linea) => {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#") || limpia.startsWith("Exportado") || limpia.startsWith("Total")) return;

    const matchNumerado = limpia.match(/^\[\d+\]\s*(-?\d+)$/);
    const matchSimple = limpia.match(/^-?\d+$/);
    const valor = matchNumerado ? matchNumerado[1] : matchSimple ? matchSimple[0] : null;

    if (valor === null) {
      rechazados.push(limpia);
      return;
    }

    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) {
      rechazados.push(limpia);
      return;
    }

    numeros.push(numero);
  });

  return { validos: numeros, rechazados };
}

// Verifica si el primer y ultimo digito son iguales.
// Ejemplo util: 525. Ejemplo no util: 123.
function cumpleFiltro(numero) {
  const texto = String(Math.abs(numero));
  return texto[0] === texto[texto.length - 1];
}

// Verifica si un numero pertenece a la serie factorial.
// Ejemplos: 6, 24 y 120.
function esFactorial(numero) {
  if (!Number.isInteger(numero) || numero < 1) return false;

  let factorial = 1;
  let multiplicador = 1;

  while (factorial < numero) {
    multiplicador += 1;
    factorial *= multiplicador;
  }

  return factorial === numero;
}

app.post("/procesar", upload.single("archivo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibio ningun archivo." });

  const contenido = req.file.buffer.toString("utf-8");
  const { validos, rechazados } = parsearTxt(contenido);

  if (validos.length === 0) {
    return res.status(422).json({ error: "El archivo no contiene numeros enteros validos." });
  }

  // Arrays pedidos por la consigna.
  const utiles = validos.filter(cumpleFiltro).sort((a, b) => a - b);
  const noUtiles = validos.filter((numero) => !cumpleFiltro(numero));
  const factoriales = validos.filter(esFactorial).sort((a, b) => a - b);
  const porcentaje = ((utiles.length / validos.length) * 100).toFixed(2);

  res.json({
    totalLeidos: validos.length,
    leidos: validos,
    utiles,
    noUtiles,
    factoriales,
    porcentaje,
    rechazados,
  });
});

app.post("/exportar", (req, res) => {
  const { leidos, utiles, noUtiles, factoriales, totalLeidos, porcentaje, rechazados } = req.body;

  if (!Array.isArray(utiles)) {
    return res.status(400).json({ error: "No hay datos para exportar." });
  }

  const fechaHora = new Date().toLocaleString("es-AR");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseArchivo = `filtrado_${timestamp}`;
  const nombreArchivo = `${baseArchivo}.txt`;
  const nombreJson = `${baseArchivo}.json`;

  const contenido = [
    `Resultado del filtrado - ${fechaHora}`,
    "========================================",
    `Total de numeros leidos: ${totalLeidos}`,
    `Numeros utiles: ${utiles.length}`,
    `Numeros no utiles: ${Array.isArray(noUtiles) ? noUtiles.length : totalLeidos - utiles.length}`,
    `Porcentaje utiles: ${porcentaje}%`,
    "",
    "Numeros leidos:",
    Array.isArray(leidos) && leidos.length ? leidos.join("\n") : "Sin numeros leidos",
    "",
    "Numeros utiles ordenados:",
    utiles.length ? utiles.join("\n") : "Sin resultados",
    "",
    "Numeros factoriales:",
    Array.isArray(factoriales) && factoriales.length ? factoriales.join("\n") : "Sin factoriales",
  ].join("\n");

  const rutaArchivo = path.join(DIR_SALIDA, nombreArchivo);
  const rutaJson = path.join(DIR_SALIDA, nombreJson);

  // El JSON deja documentado todo el procesamiento con arrays.
  const contenidoJson = JSON.stringify({
    fechaHora,
    totalLeidos,
    leidos: Array.isArray(leidos) ? leidos : [],
    utiles,
    noUtiles: Array.isArray(noUtiles) ? noUtiles : [],
    factoriales: Array.isArray(factoriales) ? factoriales : [],
    porcentaje,
    rechazados: Array.isArray(rechazados) ? rechazados : [],
  }, null, 2);

  try {
    // Guardado real del resultado en el backend.
    fs.writeFileSync(rutaArchivo, contenido, "utf8");
    fs.writeFileSync(rutaJson, contenidoJson, "utf8");
  } catch (err) {
    return res.status(500).json({ error: "No se pudo guardar el archivo en el servidor." });
  }

  // La respuesta descarga el TXT y expone los nombres para la consola del frontend.
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo}"`);
  res.setHeader("X-Archivo-Txt", nombreArchivo);
  res.setHeader("X-Archivo-Json", nombreJson);
  res.send(contenido);
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || "Error interno del servidor." });
});

app.listen(PORT, () => {
  console.log(`Punto 2 corriendo en http://localhost:${PORT}`);
});
