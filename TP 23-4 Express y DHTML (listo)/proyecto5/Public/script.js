function actualizarEstadoBotones() {
    const contenedor = document.getElementById('contenedor');

    document.getElementById('btnParrafo').disabled = !!document.getElementById('parrafoGenerado');
    document.getElementById('btnLista').disabled = !!document.getElementById('listaGenerada');
    document.getElementById('btnTabla').disabled = !!document.getElementById('tablaGenerada');
    document.getElementById('btnFormulario').disabled = !!document.getElementById('formularioGenerado');
    document.getElementById('btnTarjeta').disabled = !!document.getElementById('tarjetaGenerada');

    document.getElementById('btnLimpiar').disabled = contenedor.children.length === 0;
}

function agregarParrafo() {
    document.getElementById('contenedor').innerHTML += `
        <p id="parrafoGenerado" class="elemento">
            Este es un párrafo agregado con innerHTML en ${new Date().toLocaleTimeString()}
        </p>`;

    actualizarEstadoBotones();
}

function agregarLista() {
    document.getElementById('contenedor').innerHTML += `
        <ul id="listaGenerada" class="elemento">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>`;

    actualizarEstadoBotones();
}

function agregarTabla() {
    document.getElementById('contenedor').innerHTML += `
        <table id="tablaGenerada" class="elemento">
            <tr>
                <th>Nombre</th>
                <th>Edad</th>
            </tr>
            <tr>
                <td>Ana</td>
                <td>25</td>
            </tr>
            <tr>
                <td>Luis</td>
                <td>30</td>
            </tr>
        </table>`;

    actualizarEstadoBotones();
}

function agregarFormulario() {
    document.getElementById('contenedor').innerHTML += `
        <form id="formularioGenerado" class="elemento">
            <input type="text" placeholder="Escribe algo:"/>
            <button type="button">Enviar (simulado)</button>
        </form>`;

    actualizarEstadoBotones();
}

function agregarTarjeta() {
    document.getElementById('contenedor').innerHTML += `
        <div id="tarjetaGenerada" class="elemento tarjeta">
            <h3>Tarjeta ${Math.floor(Math.random() * 100)}</h3>
            <p>Contenido generado dinámicamente</p>
        </div>`;

    actualizarEstadoBotones();
}

function limpiar() {
    document.getElementById('contenedor').innerHTML = '';

    actualizarEstadoBotones();
}

actualizarEstadoBotones();
// ── Modo Día/Noche ────────────────────────────────────
const btnTheme = document.getElementById('btn-theme');

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    btnTheme.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});