"use strict";

// Cantidades pedidas por la consigna.
const MIN_NUMEROS = 10;
const MAX_NUMEROS = 20;

// Referencias principales del DOM.
const formNumero = document.getElementById("formNumero");
const inputNumero = document.getElementById("inputNumero");
const btnAgregar = document.getElementById("btnAgregar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnDescargar = document.getElementById("btnDescargar");
const listaEl = document.getElementById("listaNumeros");
const inputError = document.getElementById("inputError");
const inputCounter = document.getElementById("inputCounter");
const progressMin = document.getElementById("progressMin");
const progressFill = document.getElementById("progressFill");
const hintDescargar = document.getElementById("hintDescargar");
const consoleOutput = document.getElementById("consoleOutput");
const toastEl = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");
const progressBar = progressFill.parentElement;

// Estado del proyecto.
let numeros = [];
let toastTimer = null;

// Aplica y guarda modo dia/noche.
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem("tema_p1", tema);
}

// Cambia entre modo dia y modo noche.
function toggleTema() {
  const actual = document.documentElement.getAttribute("data-theme") || "light";
  aplicarTema(actual === "light" ? "dark" : "light");
}

// Muestra una notificacion temporal.
function mostrarToast(mensaje, tipo = "success", duracion = 2600) {
  if (toastTimer) clearTimeout(toastTimer);

  toastEl.textContent = mensaje;
  toastEl.className = `toast toast--visible toast--${tipo}`;

  toastTimer = setTimeout(() => {
    toastEl.className = "toast";
  }, duracion);
}

// Muestra u oculta errores del input.
function setError(mensaje) {
  inputError.textContent = mensaje;
  inputNumero.classList.toggle("input--error", Boolean(mensaje));
}

// Arma el contenido TXT con un numero por linea para que punto 2 lo lea directo.
function generarContenidoTxt() {
  return numeros.join("\n");
}

// Actualiza el panel tipo consola con el estado del array y del archivo.
function actualizarConsola(estado = "Esperando carga de numeros.", extra = "") {
  const contenidoTxt = generarContenidoTxt();

  consoleOutput.textContent = [
    "// Estado del punto 1",
    `estado: ${estado}`,
    `cantidad: ${numeros.length}`,
    "",
    "// Array guardado en memoria y enviado al backend",
    `const numeros = ${JSON.stringify(numeros, null, 2)};`,
    "",
    "// Contenido del TXT generado",
    contenidoTxt || "(todavia no hay numeros cargados)",
    extra ? "" : null,
    extra || null,
  ].filter((linea) => linea !== null).join("\n");
}

// Valida el numero ingresado antes de cargarlo.
function validarNumero(valorCrudo) {
  const texto = valorCrudo.trim();
  const valor = Number(texto);

  if (texto === "") {
    return { ok: false, error: "Ingresa un numero antes de agregar." };
  }

  if (!Number.isInteger(valor) || valor < 0) {
    return { ok: false, error: "Solo se aceptan numeros enteros positivos." };
  }

  if (numeros.length >= MAX_NUMEROS) {
    return { ok: false, error: `Ya alcanzaste el maximo de ${MAX_NUMEROS} numeros.` };
  }

  return { ok: true, valor };
}

// Actualiza progreso, contador y estado de botones.
function actualizarEstado() {
  const cantidad = numeros.length;
  const porcentaje = (cantidad / MAX_NUMEROS) * 100;
  const faltantes = Math.max(MIN_NUMEROS - cantidad, 0);

  progressFill.style.width = `${porcentaje}%`;
  progressBar.setAttribute("aria-valuenow", String(cantidad));
  inputCounter.textContent = `${cantidad} / ${MAX_NUMEROS} cargados`;
  progressMin.textContent = faltantes > 0 ? `Faltan ${faltantes}` : "Listo para descargar";
  progressMin.style.color = faltantes > 0 ? "var(--text-muted)" : "var(--success)";

  inputNumero.disabled = cantidad >= MAX_NUMEROS;
  btnAgregar.disabled = cantidad >= MAX_NUMEROS;
  btnLimpiar.disabled = cantidad === 0;
  btnDescargar.disabled = cantidad < MIN_NUMEROS;

  hintDescargar.textContent = cantidad < MIN_NUMEROS
    ? `Ingresa al menos ${MIN_NUMEROS} numeros para habilitar la descarga.`
    : `${cantidad} numeros listos para exportar.`;

  actualizarConsola();
}

// Dibuja toda la lista de numeros.
function renderizarLista() {
  listaEl.innerHTML = "";

  if (numeros.length === 0) {
    const empty = document.createElement("p");
    empty.className = "numeros-empty";
    empty.id = "emptyMsg";
    empty.textContent = "Todavia no ingresaste ningun numero.";
    listaEl.appendChild(empty);
    return;
  }

  numeros.forEach((numero, index) => {
    const chip = document.createElement("div");
    chip.className = "numero-chip";
    chip.innerHTML = `
      <span class="numero-chip__index">#${index + 1}</span>
      <span class="numero-chip__value">${numero}</span>
      <button class="numero-chip__remove" type="button" aria-label="Eliminar numero ${numero}">x</button>
    `;

    chip.querySelector("button").addEventListener("click", () => {
      numeros.splice(index, 1);
      renderizarLista();
      actualizarEstado();
    });

    listaEl.appendChild(chip);
  });
}

// Agrega un numero valido al arreglo.
function agregarNumero() {
  setError("");

  const resultado = validarNumero(inputNumero.value);

  if (!resultado.ok) {
    setError(resultado.error);
    inputNumero.focus();
    return;
  }

  numeros.push(resultado.valor);
  inputNumero.value = "";
  renderizarLista();
  actualizarEstado();
  inputNumero.focus();

  if (numeros.length === MIN_NUMEROS) {
    mostrarToast("Minimo alcanzado. Ya podes descargar el TXT.");
  }

  if (numeros.length === MAX_NUMEROS) {
    mostrarToast("Maximo de 20 numeros alcanzado.");
  }
}

// Reinicia el formulario completo.
function limpiarLista() {
  numeros = [];
  inputNumero.value = "";
  setError("");
  renderizarLista();
  actualizarEstado();
  inputNumero.disabled = false;
  inputNumero.focus();
  mostrarToast("Lista limpiada.", "success", 1800);
  actualizarConsola("Lista reiniciada.");
}

// Pide al servidor guardar y devolver el TXT.
async function descargarTxt() {
  if (numeros.length < MIN_NUMEROS) return;

  btnDescargar.disabled = true;
  btnDescargar.textContent = "Generando...";

  try {
    const response = await fetch("/descargar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numeros }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "No se pudo generar el archivo.");
    }

    const blob = await response.blob();
    const nombreTxt = response.headers.get("X-Archivo-Txt") || "numeros.txt";
    const nombreJson = response.headers.get("X-Archivo-Json") || "array.json";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="([^"]+)"/);

    link.href = url;
    link.download = match ? match[1] : "numeros.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    actualizarConsola(
      "Archivo guardado en backend y descargado.",
      [
        "// Archivos creados en el backend",
        `txt: ${nombreTxt}`,
        `json: ${nombreJson}`,
      ].join("\n")
    );
    mostrarToast("Archivo TXT generado correctamente.");
  } catch (error) {
    actualizarConsola("Error al guardar el archivo.", `// Error\n${error.message}`);
    mostrarToast(`Error: ${error.message}`, "error", 4000);
  } finally {
    btnDescargar.textContent = "Guardar numeros como TXT";
    actualizarEstado();
  }
}

// Eventos principales.
formNumero.addEventListener("submit", (event) => {
  event.preventDefault();
  agregarNumero();
});

btnLimpiar.addEventListener("click", limpiarLista);
btnDescargar.addEventListener("click", descargarTxt);
themeToggle.addEventListener("click", toggleTema);

inputNumero.addEventListener("input", () => {
  if (inputError.textContent) setError("");
});

// Inicio de la pantalla.
(function iniciar() {
  const guardado = localStorage.getItem("tema_p1");

  if (guardado === "light" || guardado === "dark") {
    aplicarTema(guardado);
  } else {
    const prefiereDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    aplicarTema(prefiereDark ? "dark" : "light");
  }

  renderizarLista();
  actualizarEstado();
  actualizarConsola();
  inputNumero.focus();
})();
