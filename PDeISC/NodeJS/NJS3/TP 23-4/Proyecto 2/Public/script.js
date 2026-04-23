// Navegación SPA corregida
function mostrarSeccion(id) {
    // 1. Ocultar todas las secciones usando la clase del CSS
    document.querySelectorAll('.seccion').forEach(s => {
        s.classList.remove('activa');
    });

    // 2. Quitar el estado activo de todos los botones de la navegación
    document.querySelectorAll('nav button').forEach(b => {
        b.classList.remove('active');
    });

    // 3. Mostrar la sección seleccionada
    const seccionAEscribir = document.getElementById(id);
    if (seccionAEscribir) {
        seccionAEscribir.classList.add('activa');
    }

    // 4. Marcar el botón clickeado como activo (azul)
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Inicio: Cambio de fondo dinámico
function cambiarFondo() {
    const colores = ['#f0f9ff', '#45366eff', '#519654ff', '#ac2650ff', '#174281ff'];
    document.body.style.background = colores[Math.floor(Math.random() * colores.length)];
}

// Galería: Fotos con ID único para evitar caché
let fotoNum = 1;
function agregarFoto() {
    const contenedorFotos = document.getElementById('fotos');
    if (contenedorFotos) {
        const img = document.createElement('img');
        // Usamos timestamp para que la imagen siempre sea distinta
        img.src = `https://picsum.photos/200/200?random=${new Date().getTime() + fotoNum++}`;
        img.alt = 'Foto aleatoria';
        contenedorFotos.appendChild(img);
    }
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
}

function resetContador() {
    contador = 0;
    document.getElementById('numeroContador').textContent = 0;
}

// Reloj dinámico
let intervalo;
function iniciarReloj() {
    // Actualización inmediata
    document.getElementById('horaActual').textContent = new Date().toLocaleTimeString();
    
    clearInterval(intervalo); 
    intervalo = setInterval(() => {
        const reloj = document.getElementById('horaActual');
        if (reloj) reloj.textContent = new Date().toLocaleTimeString();
    }, 1000);
}

function detenerReloj() { 
    clearInterval(intervalo); 
}