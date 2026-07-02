"use strict";

// Atajos de seleccion de elementos de la pagina.
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Estado principal del modulo.
const state = {
  users: [],
  method: "query",
};

// Referencias de pantalla.
const form = $("[data-user-form]");
const list = $("[data-user-list]");
const count = $("[data-count]");
const consoleBox = $("[data-console]");
const activeMethod = $("[data-active-method]");
const toast = $("[data-toast]");

// Mensaje dinamico de resultado.
function showToast(message, type = "ok") {
  toast.textContent = message;
  toast.className = `toast visible ${type}`;
  setTimeout(() => toast.className = "toast", 2200);
}

// Limpia mensajes de validacion.
function clearErrors() {
  $$("[data-error]").forEach((error) => error.textContent = "");
}

// Muestra un error puntual debajo del campo.
function setError(field, message) {
  $(`[data-error="${field}"]`).textContent = message;
}

// Lectura 1: usando querySelector sobre los campos del formulario.
function readWithQuerySelector() {
  return {
    nombre: $('[name="nombre"]', form).value.trim(),
    usuario: $('[name="usuario"]', form).value.trim(),
    email: $('[name="email"]', form).value.trim(),
    rol: $('[name="rol"]', form).value,
  };
}

// Lectura 2: usando FormData y Object.fromEntries.
function readWithFormData() {
  const data = Object.fromEntries(new FormData(form).entries());

  return {
    nombre: data.nombre.trim(),
    usuario: data.usuario.trim(),
    email: data.email.trim(),
    rol: data.rol,
  };
}

// Lectura 3: usando la coleccion form.elements.
function readWithElements() {
  const fields = form.elements;

  return {
    nombre: fields.nombre.value.trim(),
    usuario: fields.usuario.value.trim(),
    email: fields.email.value.trim(),
    rol: fields.rol.value,
  };
}

// Decide que estrategia de lectura ejecutar.
function readForm() {
  if (state.method === "formdata") return readWithFormData();
  if (state.method === "elements") return readWithElements();
  return readWithQuerySelector();
}

// Valida todos los campos antes de guardar.
function validateUser(user) {
  clearErrors();
  let valid = true;

  if (!/^[a-zA-ZÀ-ÿ\s]{3,60}$/.test(user.nombre)) {
    setError("nombre", "Solo letras y espacios, minimo 3 caracteres.");
    valid = false;
  }

  if (!/^[a-zA-Z0-9_]{4,20}$/.test(user.usuario)) {
    setError("usuario", "Usa 4 a 20 letras, numeros o guion bajo.");
    valid = false;
  }

  if (state.users.some((item) => item.usuario.toLowerCase() === user.usuario.toLowerCase())) {
    setError("usuario", "Ese usuario ya existe.");
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(user.email)) {
    setError("email", "Email invalido.");
    valid = false;
  }

  if (!user.rol) {
    setError("rol", "Selecciona un rol.");
    valid = false;
  }

  return valid;
}

// Crea una tarjeta visible para cada usuario.
function userCard(user) {
  const initials = user.nombre.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

  return `
    <article class="item-card user-card">
      <strong>${initials}</strong>
      <div>
        <h3>${user.nombre}</h3>
        <p>@${user.usuario} - ${user.email}</p>
      </div>
      <span>${user.rol}</span>
      <button class="delete-btn" type="button" data-delete-user="${user.id}">Borrar</button>
    </article>
  `;
}

// Elimina un usuario cargado y actualiza la lista.
function deleteUser(userId) {
  state.users = state.users.filter((user) => user.id !== userId);
  render();
  showToast("Usuario borrado correctamente.");
}

// Renderiza lista, contador y consola.
function render() {
  count.textContent = `${state.users.length} usuario${state.users.length === 1 ? "" : "s"}`;
  activeMethod.textContent = state.method;

  list.innerHTML = state.users.length
    ? state.users.map(userCard).join("")
    : '<p class="empty">Todavia no hay usuarios cargados.</p>';

  consoleBox.textContent = [
    "// Usuarios almacenados en memoria",
    `const usuarios = ${JSON.stringify(state.users, null, 2)};`,
    "",
    "// Metodo activo de lectura",
    `metodo = "${state.method}";`,
  ].join("\n");
}

// Cambia el metodo de lectura activo.
$$("[data-method]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-method]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.method = button.dataset.method;
    render();
  });
});

// Alta dinamica de usuario sin recargar la pagina.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = readForm();
  if (!validateUser(user)) {
    showToast("Revisa los campos marcados.", "error");
    return;
  }

  state.users.push({ id: crypto.randomUUID(), ...user });
  form.reset();
  render();
  showToast("Usuario guardado correctamente.");
});

// Usa delegacion de eventos para borrar tarjetas creadas dinamicamente.
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-user]");
  if (!button) return;
  deleteUser(button.dataset.deleteUser);
});

// Modo dia/noche.
$("[data-theme-toggle]").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
});

render();
