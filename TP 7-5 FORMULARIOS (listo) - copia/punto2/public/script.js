"use strict";

// Seleccion de elementos de la pagina.
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Estado del catalogo.
const state = {
  products: [],
  storage: "push",
};

const form = $("[data-product-form]");
const list = $("[data-product-list]");
const count = $("[data-count]");
const consoleBox = $("[data-console]");
const activeStorage = $("[data-active-storage]");
const toast = $("[data-toast]");

// Mensaje visual dinamico.
function showToast(message, type = "ok") {
  toast.textContent = message;
  toast.className = `toast visible ${type}`;
  setTimeout(() => toast.className = "toast", 2200);
}

// Limpia errores visibles.
function clearErrors() {
  $$("[data-error]").forEach((error) => error.textContent = "");
}

// Marca un campo con error.
function setError(field, message) {
  $(`[data-error="${field}"]`).textContent = message;
}

// Lee todos los campos del formulario.
function readProduct() {
  const data = Object.fromEntries(new FormData(form).entries());

  return {
    id: crypto.randomUUID(),
    nombre: data.nombre.trim(),
    categoria: data.categoria,
    precio: Number(data.precio),
    stock: Number(data.stock),
    marca: data.marca.trim(),
    estado: data.estado,
    envio: data.envio,
    descripcion: data.descripcion.trim(),
    almacenadoCon: state.storage,
  };
}

// Validacion completa de los 8 campos.
function validateProduct(product) {
  clearErrors();
  let valid = true;

  if (product.nombre.length < 2) { setError("nombre", "Minimo 2 caracteres."); valid = false; }
  if (!product.categoria) { setError("categoria", "Selecciona una categoria."); valid = false; }
  if (!Number.isFinite(product.precio) || product.precio <= 0) { setError("precio", "Precio mayor a 0."); valid = false; }
  if (!Number.isInteger(product.stock) || product.stock < 0) { setError("stock", "Stock entero desde 0."); valid = false; }
  if (product.marca.length < 2) { setError("marca", "Minimo 2 caracteres."); valid = false; }
  if (!product.estado) { setError("estado", "Selecciona un estado."); valid = false; }
  if (!product.envio) { setError("envio", "Selecciona envio."); valid = false; }
  if (product.descripcion.length < 5) { setError("descripcion", "Minimo 5 caracteres."); valid = false; }

  return valid;
}

// Guarda usando el metodo elegido.
function storeProduct(product) {
  if (state.storage === "spread") {
    state.products = [...state.products, product];
    return;
  }

  if (state.storage === "concat") {
    state.products = state.products.concat([product]);
    return;
  }

  state.products.push(product);
}

// Tarjeta dinamica de articulo.
function productCard(product) {
  return `
    <article class="item-card product-card">
      <strong>$${product.precio.toLocaleString("es-AR")}</strong>
      <div>
        <h3>${product.nombre}</h3>
        <p>${product.categoria} - ${product.marca} - ${product.estado}</p>
        <p>${product.descripcion}</p>
      </div>
      <span>Stock ${product.stock}</span>
      <small>${product.envio} - ${product.almacenadoCon}</small>
      <button class="delete-btn" type="button" data-delete-product="${product.id}">Borrar</button>
    </article>
  `;
}

// Elimina un articulo cargado y refresca la lista.
function deleteProduct(productId) {
  state.products = state.products.filter((product) => product.id !== productId);
  render();
  showToast("Articulo borrado correctamente.");
}

// Renderiza catalogo y consola.
function render() {
  count.textContent = `${state.products.length} articulo${state.products.length === 1 ? "" : "s"}`;
  activeStorage.textContent = state.storage;

  list.innerHTML = state.products.length
    ? state.products.map(productCard).join("")
    : '<p class="empty">Todavia no hay articulos.</p>';

  consoleBox.textContent = [
    "// Array de articulos almacenado en memoria",
    `let articulos = ${JSON.stringify(state.products, null, 2)};`,
    "",
    "// Metodo activo de almacenaje",
    `metodo = "${state.storage}";`,
    "",
    "// Metodos demostrados: push(), spread [...array, item], concat()",
  ].join("\n");
}

// Selector de metodo de almacenaje.
$$("[data-storage]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-storage]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.storage = button.dataset.storage;
    render();
  });
});

// Alta dinamica sin recargar la pagina.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const product = readProduct();
  if (!validateProduct(product)) {
    showToast("Revisa los campos marcados.", "error");
    return;
  }

  storeProduct(product);
  form.reset();
  render();
  showToast("Articulo guardado correctamente.");
});

// Permite borrar recuadros creados dinamicamente.
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-product]");
  if (!button) return;
  deleteProduct(button.dataset.deleteProduct);
});

// Modo dia/noche.
$("[data-theme-toggle]").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
});

render();
