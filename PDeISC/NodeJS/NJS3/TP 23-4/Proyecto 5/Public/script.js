function agregarParrafo() {
    document.getElementById('contenedor').innerHTML += `
        <p class="elemento">Este es un párrafo agregado con innerHTML en ${new Date().toLocaleTimeString()}</p>`;
}

function agregarLista() {
    document.getElementById('contenedor').innerHTML += `
        <ul class="elemento">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>`;
}

function agregarTabla() {
    document.getElementById('contenedor').innerHTML += `
        <table class="elemento">
            <tr><th>Nombre</th><th>Edad</th></tr>
            <tr><td>Ana</td><td>25</td></tr>
            <tr><td>Luis</td><td>30</td></tr>
        </table>`;
}

function agregarFormulario() {
    document.getElementById('contenedor').innerHTML += `
        <form class="elemento">
            <input type="text" placeholder="Escribe algo:"/>
            <button type="button">Enviar</button>
        </form>`;
}

function agregarTarjeta() {
    document.getElementById('contenedor').innerHTML += `
        <div class="elemento tarjeta">
            <h3>Tarjeta ${Math.floor(Math.random() * 100)}</h3>
            <p>Contenido generado dinámicamente</p>
        </div>`;
}

function limpiar() {
    document.getElementById('contenedor').innerHTML = '';
}