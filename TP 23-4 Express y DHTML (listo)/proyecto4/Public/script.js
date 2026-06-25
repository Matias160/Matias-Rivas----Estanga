const linksIniciales = [
    { href: 'https://google.com',    texto: 'Google' },
    { href: 'https://youtube.com',   texto: 'YouTube' },
    { href: 'https://facebook.com',  texto: 'Facebook' },
    { href: 'https://twitter.com',   texto: 'Twitter' },
    { href: 'https://instagram.com', texto: 'Instagram' },
];

let nodosCreados = false;
let linksModificados = [false, false, false, false, false];

function actualizarEstadoBotones() {
    const btnCrearNodos = document.getElementById('btnCrearNodos');
    const btnReiniciar = document.getElementById('btnReiniciar');

    if (btnCrearNodos) {
        btnCrearNodos.disabled = nodosCreados;
    }

    if (btnReiniciar) {
        btnReiniciar.disabled = !nodosCreados;
    }

    linksModificados.forEach((modificado, indice) => {
        const boton = document.getElementById(`btnLink${indice}`);

        if (boton) {
            boton.disabled = !nodosCreados || modificado;
        }
    });
}

function crearNodos() {
    const contenedor = document.getElementById('links');
    contenedor.innerHTML = '';

    linksIniciales.forEach((link, i) => {
        const a = document.createElement('a');

        a.href = link.href;
        a.textContent = link.texto;
        a.id = `link-${i}`;
        a.target = '_blank';

        contenedor.appendChild(a);
    });

    nodosCreados = true;
    linksModificados = [false, false, false, false, false];

    log('Se crearon 5 nodos &lt;a&gt;');

    actualizarEstadoBotones();
}

function modificarNodo(indice, nuevaUrl) {
    const a = document.getElementById(`link-${indice}`);

    if (a) {
        const anterior = a.href;

        if (anterior === nuevaUrl || anterior === nuevaUrl + '/') {
            log(`El Link ${indice + 1} ya es <strong>${nuevaUrl}</strong>.`);
            linksModificados[indice] = true;
            actualizarEstadoBotones();
            return;
        }

        a.setAttribute('href', nuevaUrl);

        const textoLimpio = nuevaUrl.replace('https://', '').split('/')[0];
        a.textContent = textoLimpio;

        linksModificados[indice] = true;

        log(`Link ${indice + 1} modificado: <strong>${anterior}</strong> → <strong>${nuevaUrl}</strong>`);

        actualizarEstadoBotones();
    } else {
        log('Error: Primero debés crear los nodos con el botón principal.');
    }
}

function reiniciarProyecto() {
    const contenedor = document.getElementById('links');
    const logDiv = document.getElementById('log');

    contenedor.innerHTML = '';
    logDiv.innerHTML = '';

    nodosCreados = false;
    linksModificados = [false, false, false, false, false];

    actualizarEstadoBotones();
}

function log(mensaje) {
    const logDiv = document.getElementById('log');
    if (!logDiv) return;

    const p = document.createElement('p');
    p.innerHTML = `<span class="timestamp">[${new Date().toLocaleTimeString()}]</span> ${mensaje}`;
    logDiv.prepend(p);
}

actualizarEstadoBotones();

// ── Modo Día/Noche ────────────────────────────────────
const btnTheme = document.getElementById('btn-theme');

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    btnTheme.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});