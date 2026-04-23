const linksIniciales = [
    { href: 'https://google.com',    texto: 'Google' },
    { href: 'https://youtube.com',   texto: 'YouTube' },
    { href: 'https://facebook.com',  texto: 'Facebook' },
    { href: 'https://twitter.com',   texto: 'Twitter' },
    { href: 'https://instagram.com', texto: 'Instagram' },
];

function crearNodos() {
    const contenedor = document.getElementById('links');
    contenedor.innerHTML = ''; // Limpiamos el contenedor
    
    linksIniciales.forEach((link, i) => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.texto;
        a.id = `link-${i}`; // ID único: link-0, link-1, etc.
        a.target = '_blank';
        contenedor.appendChild(a);
    });
    log('Se crearon 5 nodos <a>');
}

/**
 * Función corregida para modificar el nodo
 * @param {number} indice - El índice del link (0 a 4)
 * @param {string} nuevaUrl - La URL a la que queremos cambiar
 */
function modificarNodo(indice, nuevaUrl) {
    const a = document.getElementById(`link-${indice}`);
    
    if (a) {
        const anterior = a.href;
        
        // Verificamos si la URL nueva es IGUAL a la actual para avisar
        if (anterior === nuevaUrl || anterior === nuevaUrl + '/') {
            log(`El Link ${indice + 1} ya es <strong>${nuevaUrl}</strong>. Intentá con otro.`);
            return;
        }

        // Aplicamos el cambio de atributo
        a.setAttribute('href', nuevaUrl);
        
        // Limpiamos el texto para que se vea la nueva dirección
        const textoLimpio = nuevaUrl.replace('https://', '').split('/')[0];
        a.textContent = textoLimpio;
        
        log(`Link ${indice + 1} modificado: <strong>${anterior}</strong> → <strong>${nuevaUrl}</strong>`);
    } else {
        log('Error: Primero debés crear los nodos con el botón principal.');
    }
}

function log(mensaje) {
    const logDiv = document.getElementById('log');
    if (!logDiv) return;
    
    const p = document.createElement('p');
    // Usamos una clase para el timestamp si aplicaste el CSS anterior
    p.innerHTML = `<span class="timestamp">[${new Date().toLocaleTimeString()}]</span> ${mensaje}`;
    logDiv.prepend(p);
}