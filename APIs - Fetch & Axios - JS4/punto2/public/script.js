// URL de la API publica que devuelve un ID al crear un usuario.
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

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
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Valida que el nombre tenga solo letras y espacios.
function isValidName(name) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name);
}

// Vuelve el formulario al estado inicial.
function clearForm() {
  form.reset();
  showMessage('');
  submitButton.disabled = false;
  clearButton.disabled = true;
}

// Reactiva el envio si el usuario modifica los datos.
function enableSubmit() {
  nameInput.value = nameInput.value.replace(/[0-9]/g, '');
  submitButton.disabled = false;
  clearButton.disabled = false;
}

// Envia el formulario con axios.post().
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
  themeIcon.textContent = document.body.classList.contains('dark') ? '☾' : '☀';
}

form.addEventListener('submit', sendUser);
nameInput.addEventListener('input', enableSubmit);
emailInput.addEventListener('input', enableSubmit);
clearButton.addEventListener('click', clearForm);
themeButton.addEventListener('click', toggleTheme);

// Muestra el boton flotante cuando la pagina esta desplazada.
function toggleScrollButton() {
  scrollTopButton.classList.toggle('show', window.scrollY > 240);
}

// Sube suavemente al inicio de la pagina.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

scrollTopButton.addEventListener('click', scrollToTop);
window.addEventListener('scroll', toggleScrollButton);
