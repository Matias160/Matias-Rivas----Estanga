// Log de consola con estilo
const escribirLog = (msg) => console.log(`%c[Log]: ${msg}`, "color: #2563eb; font-weight: bold;");

// ── Habilita/deshabilita botones según exista H1 o imagen ─────
function actualizarEstadoBotones() {
    const existeH1      = document.getElementById('miH1');
    const existeImagen  = document.getElementById('miImagen');

    document.getElementById('btnCambiarTexto').disabled  = !existeH1;
    document.getElementById('btnCambiarColor').disabled  = !existeH1;
    document.getElementById('btnCambiarImagen').disabled = !existeImagen;
    document.getElementById('btnCambiarTamano').disabled = !existeImagen;
}

// ── H1 ─────────────────────────────────────────────────────────
function toggleH1(boton) {
    const contenedor = document.getElementById('contenedor');
    let h1 = document.getElementById('miH1');

    if (!h1) {
        h1 = document.createElement('h1');
        h1.id = 'miH1';
        h1.textContent = 'Hola DOM';
        contenedor.appendChild(h1);

        boton.textContent = 'Quitar H1';
        boton.style.background = '#ef4444';
        escribirLog("H1 creado");
    } else {
        h1.remove();
        boton.textContent = 'Agregar H1';
        boton.style.background = '';
        escribirLog("H1 eliminado");
    }

    actualizarEstadoBotones();
}

function cambiarTexto() {
    const h1 = document.getElementById('miH1');
    if (h1) {
        h1.textContent = h1.textContent === 'Hola DOM' ? 'Chau DOM' : 'Hola DOM';
    } else {
        escribirLog("Error: No hay H1 que modificar");
    }
}

function cambiarColor() {
    const h1 = document.getElementById('miH1');
    if (h1) {
        const colores = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        h1.style.color = colores[Math.floor(Math.random() * colores.length)];
    }
}

// ── Imagen ───────────────────────────────────────────────────
function toggleImagen(boton) {
    const contenedor = document.getElementById('contenedor');
    let img = document.getElementById('miImagen');

    if (!img) {
        img = document.createElement('img');
        img.id = 'miImagen';
        img.src = `https://picsum.photos/600/400?random=${new Date().getTime()}`;
        img.style.width = '200px';
        contenedor.appendChild(img);

        boton.textContent = 'Quitar Imagen';
        boton.style.background = '#ef4444';
        escribirLog("Imagen agregada");
    } else {
        img.remove();
        boton.textContent = 'Agregar Imagen';
        boton.style.background = '';
        escribirLog("Imagen quitada");
    }

    actualizarEstadoBotones();
}

function cambiarImagen() {
    const img = document.getElementById('miImagen');
    if (img) {
        img.src = `https://picsum.photos/600/400?random=${new Date().getTime()}`;
        escribirLog("Imagen rotada");
    } else {
        escribirLog("Error: No hay imagen en el contenedor");
    }
}

function cambiarTamano() {
    const img = document.getElementById('miImagen');
    if (img) {
        const anchoActual = img.style.width;
        img.style.width = (anchoActual === '200px') ? '400px' : '200px';
        escribirLog(`Tamaño cambiado a ${img.style.width}`);
    } else {
        escribirLog("Error: Agregá la imagen primero");
    }
}

// ── Modo oscuro / claro ───────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');

// Aplica el tema guardado al cargar la página
function aplicarTemaGuardado() {
    const guardado = localStorage.getItem('p1-theme') || 'light';
    document.documentElement.dataset.theme = guardado;
    themeToggle.textContent = guardado === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro';
}

// Cambia el tema y lo guarda
themeToggle.addEventListener('click', () => {
    const actual = document.documentElement.dataset.theme;
    const nuevo  = actual === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nuevo;
    localStorage.setItem('p1-theme', nuevo);
    themeToggle.textContent = nuevo === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro';
});

aplicarTemaGuardado();