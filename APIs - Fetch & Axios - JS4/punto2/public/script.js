// API local creada en el backend del punto 2.
// Esta ruta guarda el usuario en usuarios.json y devuelve el usuario creado con ID.
const USERS_API_URL = '/api/usuarios';

const form = document.getElementById('userForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const submitButton = document.getElementById('submitButton');
const clearButton = document.getElementById('clearButton');
const message = document.getElementById('message');
const themeButton = document.getElementById('themeButton');
const themeIcon = document.getElementById('themeIcon');
const scrollTopButton = document.getElementById('scrollTopButton');

// Muestra mensajes de validacion y resultado.
function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

// Valida una estructura simple de email.
// Revisa que exista texto antes y despues de @, y tambien un punto final.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Valida que el nombre tenga solo letras y espacios.
// Los escapes Unicode representan vocales con tilde y la letra enie.
function isValidName(name) {
  return /^[A-Za-z\u00c1\u00c9\u00cd\u00d3\u00da\u00e1\u00e9\u00ed\u00f3\u00fa\u00d1\u00f1\s]+$/.test(name);
}

// Vuelve el formulario al estado inicial.
function clearForm() {
  form.reset();
  showMessage('');
  submitButton.disabled = false;
  clearButton.disabled = true;
}

// Reactiva el envio si el usuario modifica los datos.
// Tambien elimina numeros del campo nombre mientras se escribe.
function enableSubmit() {
  nameInput.value = nameInput.value.replace(/[0-9]/g, '');
  submitButton.disabled = false;
  clearButton.disabled = false;
}

// Envia el formulario con axios.post() a la API local.
// Antes de enviar se validan nombre y email para evitar datos incorrectos.
// La respuesta trae el ID real guardado en usuarios.json dentro de response.data.id.
async function sendUser(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (name.length < 3) {
    showMessage('El nombre debe tener al menos 3 caracteres.', 'error');
    return;
  }

  if (!isValidName(name)) {
    showMessage('El nombre no puede tener numeros ni simbolos.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showMessage('Ingrese un email valido.', 'error');
    return;
  }

  try {
    showMessage('Enviando usuario...');
    submitButton.disabled = true;

    const response = await axios.post(USERS_API_URL, { name, email });
    showMessage(`Usuario creado. ID de respuesta: ${response.data.id}`, 'success');
    clearButton.disabled = false;
  } catch (error) {
    showMessage('No se pudo enviar el usuario.', 'error');
    submitButton.disabled = false;
    clearButton.disabled = false;
  }
}

// Activa el modo dia/noche.
function toggleTheme() {
  document.body.classList.toggle('dark');
  themeIcon.textContent = document.body.classList.contains('dark') ? 'N' : 'D';
}

// Muestra el boton flotante cuando la pagina esta desplazada.
function toggleScrollButton() {
  scrollTopButton.classList.toggle('show', window.scrollY > 240);
}

// Sube suavemente al inicio de la pagina.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

form.addEventListener('submit', sendUser);
nameInput.addEventListener('input', enableSubmit);
emailInput.addEventListener('input', enableSubmit);
clearButton.addEventListener('click', clearForm);
themeButton.addEventListener('click', toggleTheme);
scrollTopButton.addEventListener('click', scrollToTop);
window.addEventListener('scroll', toggleScrollButton);
