// Navegación SPA corregida
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(s => {
        s.classList.remove('activa');
    });

    document.querySelectorAll('nav button').forEach(b => {
        b.classList.remove('active');
    });

    const seccionAEscribir = document.getElementById(id);

    if (seccionAEscribir) {
        seccionAEscribir.classList.add('activa');
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    actualizarEstadoBotones();
}

// Función general para activar o desactivar botones según el estado actual
function actualizarEstadoBotones() {
    const cantidadFotos = document.querySelectorAll('#fotos img').length;

    const btnEliminarFoto = document.getElementById('btnEliminarFoto');
    if (btnEliminarFoto) {
        btnEliminarFoto.disabled = cantidadFotos === 0;
    }

    const btnResetContador = document.getElementById('btnResetContador');
    if (btnResetContador) {
        btnResetContador.disabled = contador === 0;
    }

    const btnIniciarReloj = document.getElementById('btnIniciarReloj');
    const btnDetenerReloj = document.getElementById('btnDetenerReloj');

    if (btnIniciarReloj && btnDetenerReloj) {
        btnIniciarReloj.disabled = relojActivo;
        btnDetenerReloj.disabled = !relojActivo;
    }
}

// Inicio: Cambio de fondo dinámico
function cambiarFondo() {
    const colores = ['#f0f9ff', '#45366eff', '#519654ff', '#ac2650ff', '#174281ff'];
    document.body.style.background = colores[Math.floor(Math.random() * colores.length)];
}

// Galería
let fotoNum = 1;

function agregarFoto() {
    const contenedorFotos = document.getElementById('fotos');

    if (contenedorFotos) {
        const img = document.createElement('img');
        img.src = `https://picsum.photos/200/200?random=${new Date().getTime() + fotoNum++}`;
        img.alt = 'Foto aleatoria';
        contenedorFotos.appendChild(img);
    }

    actualizarEstadoBotones();
}

function eliminarFoto() {
    const fotos = document.querySelectorAll('#fotos img');
    const ultimaFoto = fotos[fotos.length - 1];

    if (ultimaFoto) {
        ultimaFoto.remove();
    }

    actualizarEstadoBotones();
}

// Calculadora
function calcular(operacion) {
    const a = parseFloat(document.getElementById('num1').value) || 0;
    const b = parseFloat(document.getElementById('num2').value) || 0;

    const resultado = operacion === 'suma' ? a + b : a - b;

    document.getElementById('resultado').textContent = `Resultado: ${resultado}`;
}

// Contador
let contador = 0;

function contar(valor) {
    contador += valor;
    document.getElementById('numeroContador').textContent = contador;

    actualizarEstadoBotones();
}

function resetContador() {
    contador = 0;
    document.getElementById('numeroContador').textContent = 0;

    actualizarEstadoBotones();
}

// Reloj dinámico
let intervalo;
let relojActivo = false;

function iniciarReloj() {
    document.getElementById('horaActual').textContent = new Date().toLocaleTimeString();

    clearInterval(intervalo);

    intervalo = setInterval(() => {
        const reloj = document.getElementById('horaActual');
        if (reloj) {
            reloj.textContent = new Date().toLocaleTimeString();
        }
    }, 1000);

    relojActivo = true;
    actualizarEstadoBotones();
}

function detenerReloj() {
    clearInterval(intervalo);

    relojActivo = false;
    actualizarEstadoBotones();
}

// Estado inicial al cargar la página
actualizarEstadoBotones();

// Seleccionamos el botón
const btnTheme = document.getElementById('btn-theme');

// Escuchamos el evento click
btnTheme.addEventListener('click', () => {
    // toggle agrega la clase si no está, y la quita si ya está
    document.body.classList.toggle('dark-mode');
    
    // Cambiamos el texto del botón según el modo actual
    if (document.body.classList.contains('dark-mode')) {
        btnTheme.innerHTML = '☀️ Modo Día';
    } else {
        btnTheme.innerHTML = '🌙 Modo Oscuro';
    }
});