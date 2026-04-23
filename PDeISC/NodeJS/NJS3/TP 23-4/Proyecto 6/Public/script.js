function registrar() {
    const contenedorErrores = document.getElementById('error-message'); // Asegúrate de tener este ID en tu HTML
    const datosContenedor = document.getElementById('datos');
    const resultado = document.getElementById('resultado');

    // Limpiar errores previos y ocultar resultado si existía
    if (contenedorErrores) {
        contenedorErrores.textContent = '';
        contenedorErrores.style.display = 'none';
    }
    resultado.classList.add('oculto');

    // 1. Captura de valores
    const nombre   = document.getElementById('nombre').value.trim();
    const email    = document.getElementById('email').value.trim();
    const edad     = document.getElementById('edad').value;
    const pais     = document.getElementById('pais').value;
    const genero   = document.querySelector('input[name="genero"]:checked');
    const checks   = document.querySelectorAll('input[type="checkbox"]:checked');

    // 2. VALIDACIONES LÓGICAS
    let error = "";

    // Nombre: Solo letras
    const regexNombre = /^[a-zA-ZÁéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombre || !regexNombre.test(nombre)) {
        error = "El nombre solo debe contener letras.";
    } 
    // Email: Debe tener @ y terminar en .com
    else if (!email.includes('@') || !email.toLowerCase().endsWith('.com')) {
        error = "El email debe tener '@' y terminar en '.com'";
    }
    // Edad: Entre 1 y 120
    else if (!edad || parseInt(edad) <= 0 || parseInt(edad) > 120) {
        error = "La edad debe ser un número entre 1 y 120.";
    }
    // País y Género
    else if (pais === "" || pais === "Seleccioná...") {
        error = "Por favor, seleccioná un país.";
    }
    else if (!genero) {
        error = "Por favor, elegí un género.";
    }

    // 3. MOSTRAR ERROR O PROCESAR
    if (error) {
        if (contenedorErrores) {
            contenedorErrores.textContent = error;
            contenedorErrores.style.display = 'block';
            contenedorErrores.style.color = '#ef4444'; // Rojo para el error
            contenedorErrores.style.marginBottom = '15px';
            contenedorErrores.style.fontWeight = 'bold';
        }
        return; // Detiene la ejecución
    }

    // Si no hay errores, procesamos los datos
    const intereses = Array.from(checks).map(c => c.value).join(', ') || 'Ninguno';

    datosContenedor.innerHTML = `
        <div class="dato"><span>Nombre:</span> ${nombre}</div>
        <div class="dato"><span>Email:</span> ${email}</div>
        <div class="dato"><span>Edad:</span> ${edad} años</div>
        <div class="dato"><span>Género:</span> ${genero.value}</div>
        <div class="dato"><span>País:</span> ${pais}</div>
        <div class="dato"><span>Intereses:</span> ${intereses}</div>
    `;

    resultado.classList.remove('oculto');
    resultado.scrollIntoView({ behavior: 'smooth' });
}