"use strict";

// Referencias principales del DOM.
const formUpload = document.getElementById("formUpload");
const inputArchivo = document.getElementById("inputArchivo");
const dropzone = document.getElementById("dropzone");
const archivoNombre = document.getElementById("archivoNombre");
const uploadError = document.getElementById("uploadError");
const btnProcesar = document.getElementById("btnProcesar");
const btnExportar = document.getElementById("btnExportar");
const loader = document.getElementById("loader");
const secResultados = document.getElementById("secResultados");
const metTotal = document.getElementById("metTotal");
const metUtiles = document.getElementById("metUtiles");
const metNoUtiles = document.getElementById("metNoUtiles");
const metPorcentaje = document.getElementById("metPorcentaje");
const pctBarFill = document.getElementById("pctBarFill");
const pctBarLabel = document.getElementById("pctBarLabel");
const listaUtiles = document.getElementById("listaUtiles");
const listaFactoriales = document.getElementById("listaFactoriales");
const utilesBadge = document.getElementById("utilesBadge");
const factorialesBadge = document.getElementById("factorialesBadge");
const consoleOutput = document.getElementById("consoleOutput");
const toastEl = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");

// Estado de trabajo.
let archivoActual = null;
let resultadoActual = null;
let toastTimer = null;

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

// Aplica y persiste el tema visual.
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem("tema_p2", tema);
}

// Alterna entre modo dia y modo noche.
function toggleTema() {
  const actual = document.documentElement.getAttribute("data-theme") || "light";
  aplicarTema(actual === "light" ? "dark" : "light");
}

// Muestra mensajes temporales al usuario.
function mostrarToast(msg, tipo = "success", dur = 2800) {
  if (toastTimer) clearTimeout(toastTimer);

  toastEl.textContent = msg;
  toastEl.className = `toast toast--visible toast--${tipo}`;

  toastTimer = setTimeout(() => {
    toastEl.className = "toast";
  }, dur);
}

// Limpia o muestra el error de subida.
function setError(msg) {
  uploadError.textContent = msg;
}

// Muestra en consola el estado del procesamiento y del guardado.
function actualizarConsola(estado = "Esperando archivo TXT.", extra = "") {
  const data = resultadoActual;

  consoleOutput.textContent = [
    "// Estado del punto 2",
    `estado: ${estado}`,
    `archivo: ${archivoActual ? archivoActual.name : "sin archivo"}`,
    "",
    "// Numeros leidos desde el TXT",
    `const leidos = ${JSON.stringify(data?.leidos || [], null, 2)};`,
    "",
    "// Numeros utiles: primer digito = ultimo digito",
    `const utiles = ${JSON.stringify(data?.utiles || [], null, 2)};`,
    "",
    "// Numeros no utiles",
    `const noUtiles = ${JSON.stringify(data?.noUtiles || [], null, 2)};`,
    "",
    "// Numeros factoriales encontrados",
    `const factoriales = ${JSON.stringify(data?.factoriales || [], null, 2)};`,
    "",
    "// Resumen",
    `totalLeidos: ${data?.totalLeidos || 0}`,
    `porcentajeUtiles: ${data?.porcentaje || "0.00"}%`,
    extra ? "" : null,
    extra || null,
  ].filter((linea) => linea !== null).join("\n");
}

// Valida extension, tipo y peso del archivo.
function validarArchivo(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext !== "txt" && file.type !== "text/plain") {
    return "Solo se permiten archivos .txt.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return `El archivo supera el maximo de 2 MB. Peso actual: ${(file.size / 1024).toFixed(1)} KB.`;
  }

  if (file.size === 0) {
    return "El archivo esta vacio.";
  }

  return "";
}

// Guarda el archivo seleccionado y habilita el procesamiento.
function seleccionarArchivo(file) {
  setError("");
  resultadoActual = null;
  secResultados.hidden = true;

  const error = validarArchivo(file);

  if (error) {
    setError(error);
    archivoActual = null;
    archivoNombre.textContent = "";
    btnProcesar.disabled = true;
    return;
  }

  archivoActual = file;
  archivoNombre.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  btnProcesar.disabled = false;
  actualizarConsola("Archivo seleccionado. Falta procesarlo.");
}

// Crea chips para pintar listas de numeros.
function renderizarListaNumeros(contenedor, numeros, textoVacio) {
  contenedor.innerHTML = "";

  if (!numeros.length) {
    const empty = document.createElement("p");
    empty.className = "numeros-empty";
    empty.textContent = textoVacio;
    contenedor.appendChild(empty);
    return;
  }

  numeros.forEach((numero) => {
    const chip = document.createElement("span");
    chip.className = "numero-chip";
    chip.textContent = String(numero);
    contenedor.appendChild(chip);
  });
}

// Dibuja metricas, utiles y factoriales.
function renderizarResultados(data) {
  const { totalLeidos, utiles, noUtiles, porcentaje, factoriales } = data;
  const porcentajeNumero = Number.parseFloat(porcentaje);

  secResultados.hidden = false;
  metTotal.textContent = totalLeidos;
  metUtiles.textContent = utiles.length;
  metNoUtiles.textContent = noUtiles.length;
  metPorcentaje.textContent = `${porcentaje}%`;
  utilesBadge.textContent = utiles.length;
  factorialesBadge.textContent = factoriales.length;

  pctBarFill.style.width = `${porcentajeNumero}%`;
  pctBarFill.parentElement.setAttribute("aria-valuenow", String(porcentajeNumero));
  pctBarLabel.textContent = `${porcentaje}%`;

  renderizarListaNumeros(listaUtiles, utiles, "Ningun numero cumple el criterio.");
  renderizarListaNumeros(listaFactoriales, factoriales, "No se encontraron numeros factoriales.");

  btnExportar.disabled = utiles.length === 0;
  actualizarConsola("Archivo procesado correctamente.");
}

// Envia el TXT al servidor para analizarlo.
async function procesarArchivo() {
  if (!archivoActual) return;

  loader.hidden = false;
  secResultados.hidden = true;
  btnProcesar.disabled = true;
  setError("");

  try {
    const formData = new FormData();
    formData.append("archivo", archivoActual);

    const response = await fetch("/procesar", { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al procesar el archivo.");
    }

    resultadoActual = data;
    renderizarResultados(data);
    mostrarToast("Archivo procesado correctamente.", "success");
  } catch (err) {
    setError(err.message);
    actualizarConsola("Error al procesar el archivo.", `// Error\n${err.message}`);
    mostrarToast(`Error: ${err.message}`, "error", 4000);
  } finally {
    loader.hidden = true;
    btnProcesar.disabled = false;
  }
}

// Exporta el resultado filtrado a TXT.
async function exportarTxt() {
  if (!resultadoActual) return;

  btnExportar.disabled = true;
  btnExportar.textContent = "Generando...";

  try {
    const response = await fetch("/exportar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultadoActual),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Error al exportar.");
    }

    const blob = await response.blob();
    const nombreTxt = response.headers.get("X-Archivo-Txt") || "filtrado.txt";
    const nombreJson = response.headers.get("X-Archivo-Json") || "filtrado.json";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="([^"]+)"/);

    link.href = url;
    link.download = match ? match[1] : "filtrado.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    actualizarConsola(
      "Resultado guardado en backend y descargado.",
      [
        "// Archivos creados en el backend",
        `txt: ${nombreTxt}`,
        `json: ${nombreJson}`,
      ].join("\n")
    );
    mostrarToast("Resultado guardado y descargado.", "success");
  } catch (err) {
    actualizarConsola("Error al exportar el resultado.", `// Error\n${err.message}`);
    mostrarToast(`Error: ${err.message}`, "error", 4000);
  } finally {
    btnExportar.disabled = !resultadoActual || resultadoActual.utiles.length === 0;
    btnExportar.textContent = "Guardar resultado como TXT";
  }
}

// Eventos de archivo.
inputArchivo.addEventListener("change", () => {
  if (inputArchivo.files?.[0]) seleccionarArchivo(inputArchivo.files[0]);
});

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dropzone--over");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dropzone--over");
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dropzone--over");

  const file = event.dataTransfer?.files?.[0];
  if (file) seleccionarArchivo(file);
});

dropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    inputArchivo.click();
  }
});

// Eventos principales.
formUpload.addEventListener("submit", (event) => {
  event.preventDefault();
  procesarArchivo();
});

btnExportar.addEventListener("click", exportarTxt);
themeToggle.addEventListener("click", toggleTema);

// Inicio del modo visual.
(function inicializarTema() {
  const guardado = localStorage.getItem("tema_p2");

  if (guardado === "light" || guardado === "dark") {
    aplicarTema(guardado);
    actualizarConsola();
    return;
  }

  const prefiereDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  aplicarTema(prefiereDark ? "dark" : "light");
  actualizarConsola();
})();
