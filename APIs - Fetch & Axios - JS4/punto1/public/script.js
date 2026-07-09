// API publica usada en el trabajo.
// JSONPlaceholder devuelve usuarios falsos de prueba con campos como name y email.
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

const fetchButton = document.getElementById('fetchButton');
const axiosButton = document.getElementById('axiosButton');
const clearButton = document.getElementById('clearButton');
const usersList = document.getElementById('usersList');
const message = document.getElementById('message');
const themeButton = document.getElementById('themeButton');
const themeIcon = document.getElementById('themeIcon');
const scrollTopButton = document.getElementById('scrollTopButton');

// Muestra mensajes de estado y errores.
function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

// Crea una tarjeta con nombre y email.
function createUserCard(user) {
  const article = document.createElement('article');
  article.className = 'card';
  article.innerHTML = `
    <h3>${user.name}</h3>
    <p>${user.email}</p>
  `;
  return article;
}

// Muestra todos los usuarios recibidos.
function renderUsers(users) {
  usersList.innerHTML = '';
  users.forEach((user) => usersList.appendChild(createUserCard(user)));
}

// Actualiza los botones segun haya datos o no.
function updateButtons(hasData) {
  fetchButton.disabled = hasData;
  axiosButton.disabled = hasData;
  clearButton.disabled = !hasData;
}

// Limpia los usuarios mostrados y permite volver a cargar.
function clearUsers() {
  usersList.innerHTML = '';
  showMessage('');
  updateButtons(false);
}

// Obtiene usuarios usando fetch.
// fetch es nativo del navegador: no necesita librerias externas.
// Primero devuelve un objeto Response, por eso se revisa response.ok.
// Despues se convierte manualmente la respuesta con response.json().
async function loadWithFetch() {
  try {
    showMessage('Cargando usuarios con fetch...');
    fetchButton.disabled = true;
    axiosButton.disabled = true;

    const response = await fetch(USERS_API_URL);

    if (!response.ok) {
      throw new Error('No se pudieron obtener los usuarios.');
    }

    const users = await response.json();
    renderUsers(users);
    showMessage('Usuarios cargados con fetch.', 'success');
    updateButtons(true);
  } catch (error) {
    showMessage(error.message, 'error');
    updateButtons(false);
  }
}

// Obtiene usuarios usando axios.
// axios viene desde el CDN agregado en el HTML.
// A diferencia de fetch, axios ya transforma el JSON y lo deja en response.data.
async function loadWithAxios() {
  try {
    showMessage('Cargando usuarios con axios...');
    fetchButton.disabled = true;
    axiosButton.disabled = true;

    const response = await axios.get(USERS_API_URL);
    renderUsers(response.data);
    showMessage('Usuarios cargados con axios.', 'success');
    updateButtons(true);
  } catch (error) {
    showMessage('No se pudieron obtener los usuarios con axios.', 'error');
    updateButtons(false);
  }
}

// Activa el modo dia/noche.
function toggleTheme() {
  document.body.classList.toggle('dark');
  themeIcon.textContent = document.body.classList.contains('dark') ? '☾' : '☀';
}

fetchButton.addEventListener('click', loadWithFetch);
axiosButton.addEventListener('click', loadWithAxios);
clearButton.addEventListener('click', clearUsers);
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
