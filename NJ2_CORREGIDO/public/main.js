// public/main.js
// JavaScript del navegador: menu responsive y validacion del formulario de contacto.
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const contactForm = document.getElementById("contactForm");
  const result = document.getElementById("result");

  // Menu responsive para celulares.
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (!contactForm || !result) {
    return;
  }

  const fields = {
    nombre: document.getElementById("nombre"),
    email: document.getElementById("email"),
    telefono: document.getElementById("telefono"),
    asunto: document.getElementById("asunto"),
    mensaje: document.getElementById("mensaje")
  };

  const errors = {
    nombre: document.getElementById("error-nombre"),
    email: document.getElementById("error-email"),
    telefono: document.getElementById("error-telefono"),
    asunto: document.getElementById("error-asunto"),
    mensaje: document.getElementById("error-mensaje")
  };

  function setError(fieldName, message) {
    errors[fieldName].textContent = message;
    fields[fieldName].classList.toggle("input-error", Boolean(message));
  }

  function clearMessages() {
    Object.keys(errors).forEach((fieldName) => setError(fieldName, ""));
    result.className = "";
    result.textContent = "";
    result.style.display = "none";
  }

  function validateForm() {
    clearMessages();
    let isValid = true;

    const nombre = fields.nombre.value.trim();
    const email = fields.email.value.trim();
    const telefono = fields.telefono.value.trim();
    const asunto = fields.asunto.value.trim();
    const mensaje = fields.mensaje.value.trim();

    // Nombre: solo letras y espacios, minimo 3 caracteres.
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nombre) {
      setError("nombre", "El nombre es obligatorio.");
      isValid = false;
    } else if (nombre.length < 3) {
      setError("nombre", "Debe tener al menos 3 caracteres.");
      isValid = false;
    } else if (!nombreRegex.test(nombre)) {
      setError("nombre", "El nombre solo puede contener letras y espacios.");
      isValid = false;
    }

    // Email: formato comun y terminacion .com para cumplir la validacion pedida.
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
    if (!email) {
      setError("email", "El correo electronico es obligatorio.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setError("email", "El correo debe tener formato valido y terminar en .com.");
      isValid = false;
    }

    // Telefono: acepta solo numeros, entre 8 y 12 digitos.
    const telefonoRegex = /^\d{8,12}$/;
    if (!telefono) {
      setError("telefono", "El telefono es obligatorio.");
      isValid = false;
    } else if (!telefonoRegex.test(telefono)) {
      setError("telefono", "Debe contener entre 8 y 12 numeros, sin espacios ni guiones.");
      isValid = false;
    }

    if (!asunto) {
      setError("asunto", "El asunto es obligatorio.");
      isValid = false;
    } else if (asunto.length < 4) {
      setError("asunto", "El asunto debe tener al menos 4 caracteres.");
      isValid = false;
    }

    if (!mensaje) {
      setError("mensaje", "El mensaje es obligatorio.");
      isValid = false;
    } else if (mensaje.length < 10) {
      setError("mensaje", "El mensaje debe tener al menos 10 caracteres.");
      isValid = false;
    }

    return isValid;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (validateForm()) {
      result.textContent = "Formulario validado correctamente. Mensaje enviado de forma simulada.";
      result.className = "success-box";
      result.style.display = "block";
      contactForm.reset();
      return;
    }

    result.textContent = "Por favor, revisa los campos marcados antes de continuar.";
    result.className = "error-box";
    result.style.display = "block";
  });
});

// ── Modo oscuro / claro ───────────────────────────────────────

// Crea el botón de toggle y lo agrega al header
function crearToggleTheme() {
    const btn = document.createElement("button");
    btn.id          = "themeToggle";
    btn.type        = "button";
    btn.textContent = "🌙 Modo oscuro";
    btn.setAttribute("aria-label", "Cambiar tema");
    document.querySelector(".site-header").appendChild(btn);
    return btn;
}

// Aplica el tema guardado en localStorage al cargar la página
function aplicarTemaGuardado() {
    const guardado = localStorage.getItem("nj2-theme") || "light";
    document.documentElement.dataset.theme = guardado;
    return guardado;
}

// Cambia entre claro y oscuro y guarda la preferencia
function toggleTheme(btn) {
    const isDark = document.documentElement.dataset.theme === "dark";
    const nuevoTema = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nuevoTema;
    localStorage.setItem("nj2-theme", nuevoTema);
    btn.textContent = nuevoTema === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

// Inicializa el toggle
const temaActual = aplicarTemaGuardado();
const toggleBtn  = crearToggleTheme();
toggleBtn.textContent = temaActual === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
toggleBtn.addEventListener("click", () => toggleTheme(toggleBtn));
