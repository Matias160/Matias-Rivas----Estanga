// Variable para el log (opcional, por si quieres ver mensajes en consola)
const escribirLog = (msg) => console.log(`%c[Log]: ${msg}`, "color: #2563eb; font-weight: bold;");

// 1. Toggle para el H1
function toggleH1(boton) {
    const contenedor = document.getElementById('contenedor');
    let h1 = document.getElementById('miH1');

    if (!h1) {
        h1 = document.createElement('h1');
        h1.id = 'miH1';
        h1.textContent = 'Hola DOM';
        contenedor.appendChild(h1);
        boton.textContent = 'Quitar H1';
        boton.style.background = '#ef4444'; // Rojo al quitar
        escribirLog("H1 creado");
    } else {
        h1.remove();
        boton.textContent = 'Agregar H1';
        boton.style.background = ''; // Vuelve al color del CSS
        escribirLog("H1 eliminado");
    }
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

// 2. Toggle para la Imagen (CORREGIDO)
function toggleImagen(boton) {
    const contenedor = document.getElementById('contenedor');
    let img = document.getElementById('miImagen');

    if (!img) {
        img = document.createElement('img');
        img.id = 'miImagen';
        // Agregamos el timestamp para que siempre sea una imagen nueva al agregar
        img.src = `https://picsum.photos/600/400?random=${new Date().getTime()}`;
        img.style.width = '200px'; // Seteamos ancho inicial para que funcione el toggle de tamaño
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
}

function cambiarImagen() {
    const img = document.getElementById('miImagen');
    if (img) {
        // Forzamos actualización de fuente con nuevo random
        img.src = `https://picsum.photos/600/400?random=${new Date().getTime()}`;
        escribirLog("Imagen rotada");
    } else {
        escribirLog("Error: No hay imagen en el contenedor");
    }
}

function cambiarTamano() {
    const img = document.getElementById('miImagen');
    if (img) {
        // IMPORTANTE: Leemos y escribimos en style.width para que el CSS haga la transición
        const anchoActual = img.style.width;
        img.style.width = (anchoActual === '200px') ? '400px' : '200px';
        escribirLog(`Tamaño cambiado a ${img.style.width}`);
    } else {
        escribirLog("Error: Agregá la imagen primero");
    }
}