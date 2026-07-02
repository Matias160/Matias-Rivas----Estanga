"use strict";

// Seleccion de nodos de la pagina.
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Clave de persistencia.
const STORAGE_KEY = "personasTP75";

// Estado leido desde localStorage.
const state = {
  people: JSON.parse(localStorage[STORAGE_KEY] || "[]"),
};

const form = $("[data-person-form]");
const list = $("[data-person-list]");
const count = $("[data-count]");
const consoleBox = $("[data-console]");
const childrenField = $("[data-children-field]");
const toast = $("[data-toast]");

// Mensajes dinamicos de guardado correcto o incorrecto.
function showToast(message, type = "ok") {
  toast.textContent = message;
  toast.className = `toast visible ${type}`;
  setTimeout(() => toast.className = "toast", 2400);
}

// Guarda el array completo en localStorage.
function persist() {
  localStorage[STORAGE_KEY] = JSON.stringify(state.people);
}

// Limpia errores del formulario.
function clearErrors() {
  $$("[data-error]").forEach((error) => error.textContent = "");
}

// Muestra error por campo.
function setError(field, message) {
  $(`[data-error="${field}"]`).textContent = message;
}

// Lee radio sin usar get.
function checkedValue(name) {
  return $(`[name="${name}"]:checked`, form)?.value || "";
}

// Lee todos los datos del formulario.
function readPerson() {
  const data = Object.fromEntries(new FormData(form).entries());

  return {
    id: crypto.randomUUID(),
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    edad: Number(data.edad),
    fechaNacimiento: data.fechaNacimiento,
    sexo: checkedValue("sexo"),
    documento: data.documento.trim(),
    estadoCivil: data.estadoCivil,
    nacionalidad: data.nacionalidad.trim(),
    telefono: data.telefono.trim(),
    mail: data.mail.trim(),
    tieneHijos: checkedValue("tieneHijos"),
    cantidadHijos: checkedValue("tieneHijos") === "Si" ? Number(data.cantidadHijos) : 0,
  };
}

// Valida todos los campos obligatorios.
function validatePerson(person) {
  clearErrors();
  let valid = true;

  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(person.nombre)) { setError("nombre", "Solo letras y espacios."); valid = false; }
  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(person.apellido)) { setError("apellido", "Solo letras y espacios."); valid = false; }
  if (!Number.isInteger(person.edad) || person.edad < 0 || person.edad > 120) { setError("edad", "Edad entre 0 y 120."); valid = false; }
  if (!person.fechaNacimiento) { setError("fechaNacimiento", "Selecciona una fecha."); valid = false; }
  if (!person.sexo) { setError("sexo", "Selecciona una opcion."); valid = false; }
  if (!/^\d{7,10}$/.test(person.documento)) { setError("documento", "DNI de 7 a 10 numeros."); valid = false; }
  if (state.people.some((item) => item.documento === person.documento)) { setError("documento", "Ese documento ya existe."); valid = false; }
  if (!person.estadoCivil) { setError("estadoCivil", "Selecciona estado civil."); valid = false; }
  if (!person.nacionalidad) { setError("nacionalidad", "Selecciona un pais de Sudamerica."); valid = false; }
  if (!/^[0-9+\-\s]{6,20}$/.test(person.telefono)) { setError("telefono", "Telefono invalido."); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(person.mail)) { setError("mail", "Mail invalido."); valid = false; }
  if (!person.tieneHijos) { setError("tieneHijos", "Selecciona si tiene hijos."); valid = false; }
  if (person.tieneHijos === "Si" && (!Number.isInteger(person.cantidadHijos) || person.cantidadHijos < 1 || person.cantidadHijos > 20)) {
    setError("cantidadHijos", "Cantidad entre 1 y 20.");
    valid = false;
  }

  return valid;
}

// Tarjeta resumida de persona.
function personCard(person) {
  const fullName = `${person.nombre} ${person.apellido}`;

  return `
    <article class="item-card person-card">
      <strong>${fullName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}</strong>
      <div>
        <h3>${fullName}</h3>
        <p>DNI ${person.documento} - ${person.mail}</p>
        <p>${person.nacionalidad} - ${person.estadoCivil}</p>
      </div>
      <span>${person.edad} anos</span>
      <button class="delete-btn" type="button" data-delete-person="${person.id}">Borrar</button>
    </article>
  `;
}

// Elimina una persona del array y vuelve a guardar localStorage.
function deletePerson(personId) {
  state.people = state.people.filter((person) => person.id !== personId);
  persist();
  render();
  showToast("Persona eliminada correctamente.");
}

// Renderiza listado y consola.
function render() {
  count.textContent = `${state.people.length} persona${state.people.length === 1 ? "" : "s"}`;

  list.innerHTML = state.people.length
    ? state.people.map(personCard).join("")
    : '<p class="empty">Todavia no hay personas guardadas.</p>';

  consoleBox.textContent = [
    "// Array persistido en localStorage",
    `const personas = ${JSON.stringify(state.people, null, 2)};`,
    "",
    "// Clave usada",
    `localStorage["${STORAGE_KEY}"]`,
  ].join("\n");
}

// Muestra u oculta el campo de cantidad de hijos.
function syncChildrenField() {
  const hasChildren = checkedValue("tieneHijos") === "Si";
  childrenField.classList.toggle("hidden", !hasChildren);
  if (!hasChildren) $('[name="cantidadHijos"]', form).value = "";
}

// Guardado dinamico en localStorage.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const person = readPerson();
  if (!validatePerson(person)) {
    showToast("Guardado incorrecto: revisa los campos.", "error");
    return;
  }

  state.people.push(person);
  persist();
  form.reset();
  syncChildrenField();
  render();
  showToast("Persona guardada correctamente.");
});

// Permite borrar personas creadas dinamicamente desde sus recuadros.
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-person]");
  if (!button) return;
  deletePerson(button.dataset.deletePerson);
});

// Reaccion dinamica al seleccionar hijos.
$$('[name="tieneHijos"]').forEach((radio) => {
  radio.addEventListener("change", syncChildrenField);
});

// Vaciar localStorage.
$("[data-clear]").addEventListener("click", () => {
  state.people = [];
  persist();
  render();
  showToast("LocalStorage vaciado.");
});

// Modo dia/noche.
$("[data-theme-toggle]").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
});

syncChildrenField();
render();
