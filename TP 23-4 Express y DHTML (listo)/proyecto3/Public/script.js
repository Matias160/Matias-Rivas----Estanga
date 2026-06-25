// ── Navegación ────────────────────────────────────────
function mostrarSeccion(id, botonNav) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto'));

    const seccion = document.getElementById(id);
    if (seccion) {
        seccion.classList.remove('oculto');
    }

    document.querySelectorAll('nav button').forEach(boton => {
        boton.classList.remove('active');
    });

    if (botonNav) {
        botonNav.classList.add('active');
    }

    ocultarInfo();
    actualizarEstadoBotones();
}

// ── Estado general de botones ─────────────────────────
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
        btnIniciarReloj.disabled = intervalo !== null;
        btnDetenerReloj.disabled = intervalo === null;
    }
}

// ── Contar hijos ──────────────────────────────────────
function contarHijos(id, boton) {
    const elemento = document.getElementById(id);
    const hijos = elemento.children.length;
    const info = document.getElementById('info-hijos');
    const texto = document.getElementById('texto-hijos');

    texto.textContent = `La sección "${id}" tiene ${hijos} hijos directos.`;
    info.classList.remove('oculto');

    // Como ya cumplió su función, queda desactivado
    if (boton) {
        boton.disabled = true;
    }
}

function ocultarInfo() {
    document.getElementById('info-hijos').classList.add('oculto');
}

// ── Reactivar botón de contar hijos cuando algo cambie ─
function reactivarBotonContar(idBoton) {
    const boton = document.getElementById(idBoton);

    if (boton) {
        boton.disabled = false;
    }
}

// ── Inicio ────────────────────────────────────────────
const coloresFondo = ['#f0f0f0', '#d0e8ff', '#d0ffd0', '#ffd0d0', '#fff0d0', '#f0d0ff'];
let indiceFondo = 0;

function cambiarFondo() {
    indiceFondo = (indiceFondo + 1) % coloresFondo.length;
    document.body.style.background = coloresFondo[indiceFondo];

    reactivarBotonContar('btnContarInicio');
}

// ── Galería ───────────────────────────────────────────
let fotoNum = 1;

function agregarFoto() {
    const fotos = document.getElementById('fotos');

    const img = document.createElement('img');
    img.src = `https://picsum.photos/100/100?random=${fotoNum++}`;
    img.alt = `Foto ${fotoNum}`;

    fotos.appendChild(img);

    reactivarBotonContar('btnContarGaleria');
    actualizarEstadoBotones();
}

function eliminarFoto() {
    const fotos = document.querySelectorAll('#fotos img');
    const ultimaFoto = fotos[fotos.length - 1];

    if (ultimaFoto) {
        ultimaFoto.remove();
    }

    reactivarBotonContar('btnContarGaleria');
    actualizarEstadoBotones();
}

// ── Calculadora ───────────────────────────────────────
function calcular(operacion) {
    const a = parseFloat(document.getElementById('num1').value);
    const b = parseFloat(document.getElementById('num2').value);

    if (isNaN(a) || isNaN(b)) {
        document.getElementById('resultado').textContent = 'Ingresá dos números válidos';
        return;
    }

    const resultado = operacion === 'suma' ? a + b : a - b;
    const simbolo = operacion === 'suma' ? '+' : '-';

    document.getElementById('resultado').textContent = `${a} ${simbolo} ${b} = ${resultado}`;

    reactivarBotonContar('btnContarCalculadora');
}

// ── Contador ──────────────────────────────────────────
let contador = 0;

function contar(valor) {
    contador += valor;
    document.getElementById('numeroContador').textContent = contador;

    reactivarBotonContar('btnContarContador');
    actualizarEstadoBotones();
}

function resetContador() {
    contador = 0;
    document.getElementById('numeroContador').textContent = 0;

    reactivarBotonContar('btnContarContador');
    actualizarEstadoBotones();
}

// ── Reloj ─────────────────────────────────────────────
let intervalo = null;

function iniciarReloj() {
    if (intervalo) return;

    document.getElementById('horaActual').textContent =
        new Date().toLocaleTimeString();

    intervalo = setInterval(() => {
        document.getElementById('horaActual').textContent =
            new Date().toLocaleTimeString();
    }, 1000);

    reactivarBotonContar('btnContarReloj');
    actualizarEstadoBotones();
}

function detenerReloj() {
    clearInterval(intervalo);
    intervalo = null;

    reactivarBotonContar('btnContarReloj');
    actualizarEstadoBotones();
}

// Estado inicial
actualizarEstadoBotones();

const btnTheme = document.getElementById('btn-theme');

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    btnTheme.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});