// URL de la API publica para obtener todos los usuarios.
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

const loadButton = document.getElementById('loadButton');
const clearButton = document.getElementById('clearButton');
const searchInput = document.getElementById('searchInput');
const usersList = document.getElementById('usersList');
const message = document.getElementById('message');
const themeButton = document.getElementById('themeButton');
const themeIcon = document.getElementById('themeIcon');
const scrollTopButton = document.getElementById('scrollTopButton');

let users = [];

// Muestra mensajes informativos.
function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

// Crea una tarjeta de usuario.
function createUserCard(user) {
  const article = document.createElement('article');
  article.className = 'card';
  article.innerHTML = `
    <h3>${user.name}</h3>
    <p>${user.email}</p>
  `;
  return article;
}

// Renderiza los usuarios filtrados.
function renderUsers(list) {
  usersList.innerHTML = '';

  if (list.length === 0) {
    usersList.innerHTML = '<p>No se encontraron usuarios.</p>';
    return;
  }

  list.forEach((user) => usersList.appendChild(createUserCard(user)));
}

// Actualiza controles segun haya usuarios cargados.
function updateControls(hasData) {
  loadButton.disabled = hasData;
  clearButton.disabled = !hasData;
  searchInput.disabled = !hasData;
}

// Borra usuarios, busqueda y mensajes.
function clearUsers() {
  users = [];
  usersList.innerHTML = '';
  searchInput.value = '';
  showMessage('');
  updateControls(false);
}

// Obtiene todos los usuarios una sola vez.
async function loadUsers() {
  try {
    showMessage('Cargando usuarios...');
    loadButton.disabled = true;

    const response = await fetch(USERS_API_URL);

    if (!response.ok) {
      throw new Error('No se pudieron obtener los usuarios.');
    }

    users = await response.json();
    renderUsers(users);
    showMessage('Usuarios cargados correctamente.', 'success');
    updateControls(true);
  } catch (error) {
    showMessage(error.message, 'error');
    updateControls(false);
  }
}

// Filtra por nombre mientras se escribe.
function filterUsers() {
  if (users.length === 0) {
    showMessage('Primero cargue los usuarios.', 'error');
    return;
  }

  const search = searchInput.value.trim().toLowerCase();
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search));
  renderUsers(filteredUsers);
}

// Activa el modo dia/noche.
function toggleTheme() {
  document.body.classList.toggle('dark');
  themeIcon.textContent = document.body.classList.contains('dark') ? '☾' : '☀';
}

loadButton.addEventListener('click', loadUsers);
clearButton.addEventListener('click', clearUsers);
searchInput.addEventListener('input', filterUsers);
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
