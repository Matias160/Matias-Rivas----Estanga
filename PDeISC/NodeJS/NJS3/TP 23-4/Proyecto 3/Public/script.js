// ── Navegación ────────────────────────────────────────
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto'));
    document.getElementById(id).classList.remove('oculto');
    ocultarInfo();
}

// ── Contar hijos ──────────────────────────────────────
function contarHijos(id) {
    const elemento  = document.getElementById(id);
    const hijos     = elemento.children.length;
    const info      = document.getElementById('info-hijos');
    const texto     = document.getElementById('texto-hijos');

    texto.textContent = `La sección "${id}" tiene ${hijos} hijos directos.`;
    info.classList.remove('oculto');
}

function ocultarInfo() {
    document.getElementById('info-hijos').classList.add('oculto');
}

// ── Inicio ────────────────────────────────────────────
const coloresFondo = ['#f0f0f0', '#d0e8ff', '#d0ffd0', '#ffd0d0', '#fff0d0', '#f0d0ff'];
let indiceFondo = 0;

function cambiarFondo() {
    indiceFondo = (indiceFondo + 1) % coloresFondo.length;
    document.body.style.background = coloresFondo[indiceFondo];
}

// ── Galería ───────────────────────────────────────────
let fotoNum = 1;

function agregarFoto() {
    const fotos = document.getElementById('fotos');
    const img   = document.createElement('img');
    img.src     = `https://picsum.photos/100/100?random=${fotoNum++}`;
    img.alt     = `Foto ${fotoNum}`;
    fotos.appendChild(img);
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
    const simbolo   = operacion === 'suma' ? '+' : '-';
    document.getElementById('resultado').textContent = `${a} ${simbolo} ${b} = ${resultado}`;
}

// ── Contador ──────────────────────────────────────────
let contador = 0;

function contar(valor) {
    contador += valor;
    document.getElementById('numeroContador').textContent = contador;
}

function resetContador() {
    contador = 0;
    document.getElementById('numeroContador').textContent = 0;
}

// ── Reloj ─────────────────────────────────────────────
let intervalo = null;

function iniciarReloj() {
    if (intervalo) return; // evita múltiples intervalos
    intervalo = setInterval(() => {
        document.getElementById('horaActual').textContent =
            new Date().toLocaleTimeString();
    }, 1000);
}

function detenerReloj() {
    clearInterval(intervalo);
    intervalo = null;
}