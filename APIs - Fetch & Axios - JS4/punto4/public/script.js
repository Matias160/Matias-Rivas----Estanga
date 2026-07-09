const loadButton = document.getElementById('loadButton');
const clearButton = document.getElementById('clearButton');
const studentsList = document.getElementById('studentsList');
const message = document.getElementById('message');
const themeButton = document.getElementById('themeButton');
const themeIcon = document.getElementById('themeIcon');
const scrollTopButton = document.getElementById('scrollTopButton');

// Muestra mensajes de carga y errores.
function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

// Crea una tarjeta de alumno.
function createStudentCard(student) {
  const article = document.createElement('article');
  article.className = 'card';
  article.innerHTML = `
    <h3>${student.nombre}</h3>
    <p>Curso: ${student.curso}</p>
    <p>Email: ${student.email}</p>
  `;
  return article;
}

// Actualiza los botones segun haya alumnos en pantalla.
function updateButtons(hasData) {
  loadButton.disabled = hasData;
  clearButton.disabled = !hasData;
}

// Borra los alumnos mostrados y permite volver a cargar.
function clearStudents() {
  studentsList.innerHTML = '';
  showMessage('');
  updateButtons(false);
}

// Obtiene alumnos desde la API local.
// La ruta /api/alumnos pertenece al servidor Node de este mismo punto.
// El frontend usa fetch para pedir esos datos y luego los muestra en pantalla.
async function loadStudents() {
  try {
    showMessage('Cargando alumnos...');
    loadButton.disabled = true;

    const response = await fetch('/api/alumnos');

    if (!response.ok) {
      throw new Error('No se pudieron cargar los alumnos.');
    }

    const students = await response.json();
    studentsList.innerHTML = '';
    students.forEach((student) => studentsList.appendChild(createStudentCard(student)));
    showMessage('Alumnos cargados desde la API local.', 'success');
    updateButtons(true);
  } catch (error) {
    showMessage(error.message, 'error');
    updateButtons(false);
  }
}

// Activa el modo dia/noche.
function toggleTheme() {
  document.body.classList.toggle('dark');
  themeIcon.textContent = document.body.classList.contains('dark') ? '☾' : '☀';
}

loadButton.addEventListener('click', loadStudents);
clearButton.addEventListener('click', clearStudents);
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
