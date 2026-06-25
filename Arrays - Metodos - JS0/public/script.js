// Arrays - Metodos - JS0: practica interactiva de metodos de arrays.
// Cada ejercicio se ejecuta al tocar su boton y actualiza resultado + codigo.

const methods = [
  {
    name: "push()",
    description: "Agrega elementos al final de un array.",
    exercises: [
      exercise("Crear un array vacio y agregar tres frutas usando push().", () => {
        const frutas = [];
        frutas.push("manzana", "banana", "pera");
        return makeResponse("Frutas", frutas, `const frutas = [];
frutas.push("manzana", "banana", "pera");
// Resultado: ${toCode(frutas)}`);
      }),
      exercise("Agregar los nombres de 3 amigos a un array existente llamado amigos.", () => {
        const amigos = ["Martina"];
        amigos.push("Juan", "Sofia", "Nicolas");
        return makeResponse("Amigos", amigos, `const amigos = ["Martina"];
amigos.push("Juan", "Sofia", "Nicolas");
// Resultado: ${toCode(amigos)}`);
      }),
      exercise("Agregar un nuevo numero solo si es mayor que el ultimo numero.", ({ numero }) => {
        const numeros = [7, 14, 21];

        if (numero > numeros[numeros.length - 1]) {
          numeros.push(numero);
        }

        return makeResponse("Numeros", numeros, `const numeros = [7, 14, 21];
const nuevoNumero = ${numero};

if (nuevoNumero > numeros[numeros.length - 1]) {
  numeros.push(nuevoNumero);
}

// Resultado: ${toCode(numeros)}`);
      }, [numberField("numero", "Numero mayor que 21", 22)])
    ]
  },
  {
    name: "pop()",
    description: "Elimina y devuelve el ultimo elemento de un array.",
    exercises: [
      exercise("Eliminar el ultimo elemento de un array de animales.", () => {
        const animales = ["perro", "gato", "loro"];
        const eliminado = animales.pop();
        return makeResponse("Eliminado y array final", { eliminado, animales }, `const animales = ["perro", "gato", "loro"];
const eliminado = animales.pop();
// Eliminado: "${eliminado}"
// Resultado: ${toCode(animales)}`);
      }),
      exercise("Quitar el ultimo producto de una lista de compras y mostrar cual fue eliminado.", () => {
        const compras = ["pan", "queso", "jugo"];
        const eliminado = compras.pop();
        return makeResponse("Producto eliminado", { eliminado, compras }, `const compras = ["pan", "queso", "jugo"];
const eliminado = compras.pop();
// Eliminado: "${eliminado}"
// Resultado: ${toCode(compras)}`);
      }),
      exercise("Usar un bucle while para vaciar un array con pop().", () => {
        const pendientes = ["tarea 1", "tarea 2", "tarea 3"];
        const eliminados = [];

        while (pendientes.length > 0) {
          eliminados.push(pendientes.pop());
        }

        return makeResponse("Array vaciado", { eliminados, pendientes }, `const pendientes = ["tarea 1", "tarea 2", "tarea 3"];
const eliminados = [];

while (pendientes.length > 0) {
  eliminados.push(pendientes.pop());
}

// Eliminados: ${toCode(eliminados)}
// Resultado: ${toCode(pendientes)}`);
      })
    ]
  },
  {
    name: "unshift()",
    description: "Agrega elementos al principio de un array.",
    exercises: [
      exercise("Agregar tres colores al principio de un array vacio.", () => {
        const colores = [];
        colores.unshift("rojo", "azul", "verde");
        return makeResponse("Colores", colores, `const colores = [];
colores.unshift("rojo", "azul", "verde");
// Resultado: ${toCode(colores)}`);
      }),
      exercise("Agregar una nueva tarea urgente al principio.", () => {
        const tareas = ["estudiar arrays", "subir trabajo"];
        tareas.unshift("entregar actividad urgente");
        return makeResponse("Tareas", tareas, `const tareas = ["estudiar arrays", "subir trabajo"];
tareas.unshift("entregar actividad urgente");
// Resultado: ${toCode(tareas)}`);
      }),
      exercise("Insertar el nombre de un usuario al principio de conectados.", ({ usuario }) => {
        const conectados = ["Bruno", "Clara"];
        conectados.unshift(usuario);
        return makeResponse("Usuarios conectados", conectados, `const conectados = ["Bruno", "Clara"];
const usuario = "${escapeText(usuario)}";
conectados.unshift(usuario);
// Resultado: ${toCode(conectados)}`);
      }, [textField("usuario", "Usuario conectado", "Agustina")])
    ]
  },
  {
    name: "shift()",
    description: "Elimina y devuelve el primer elemento de un array.",
    exercises: [
      exercise("Quitar el primer numero de un array de enteros.", () => {
        const enteros = [8, 16, 24];
        const quitado = enteros.shift();
        return makeResponse("Primer numero quitado", { quitado, enteros }, `const enteros = [8, 16, 24];
const quitado = enteros.shift();
// Quitado: ${quitado}
// Resultado: ${toCode(enteros)}`);
      }),
      exercise("Eliminar el primer mensaje de un array de mensajes de chat.", () => {
        const mensajes = ["Hola", "Todo bien?", "Nos vemos"];
        const eliminado = mensajes.shift();
        return makeResponse("Mensaje eliminado", { eliminado, mensajes }, `const mensajes = ["Hola", "Todo bien?", "Nos vemos"];
const eliminado = mensajes.shift();
// Eliminado: "${eliminado}"
// Resultado: ${toCode(mensajes)}`);
      }),
      exercise("Usar shift() para simular una cola de atencion al cliente.", () => {
        const cola = ["Cliente A", "Cliente B", "Cliente C"];
        const atendido = cola.shift();
        return makeResponse("Cliente atendido", { atendido, cola }, `const cola = ["Cliente A", "Cliente B", "Cliente C"];
const atendido = cola.shift();
// Atendido: "${atendido}"
// Resultado: ${toCode(cola)}`);
      })
    ]
  },
  {
    name: "splice()",
    description: "Elimina, inserta o reemplaza elementos desde una posicion.",
    exercises: [
      exercise("Eliminar dos elementos desde la posicion 1 de un array de letras.", () => {
        const letras = ["a", "b", "c", "d", "e"];
        const eliminadas = letras.splice(1, 2);
        return makeResponse("Letras modificadas", { eliminadas, letras }, `const letras = ["a", "b", "c", "d", "e"];
const eliminadas = letras.splice(1, 2);
// Eliminadas: ${toCode(eliminadas)}
// Resultado: ${toCode(letras)}`);
      }),
      exercise("Insertar un nuevo nombre en la segunda posicion sin eliminar nada.", () => {
        const nombres = ["Ana", "Luis", "Mora"];
        nombres.splice(1, 0, "Pedro");
        return makeResponse("Nombres", nombres, `const nombres = ["Ana", "Luis", "Mora"];
nombres.splice(1, 0, "Pedro");
// Resultado: ${toCode(nombres)}`);
      }),
      exercise("Reemplazar dos elementos por otros nuevos desde una posicion determinada.", () => {
        const materias = ["Matematica", "Historia", "Arte", "Ingles"];
        const reemplazadas = materias.splice(1, 2, "Programacion", "Diseno");
        return makeResponse("Materias", { reemplazadas, materias }, `const materias = ["Matematica", "Historia", "Arte", "Ingles"];
const reemplazadas = materias.splice(1, 2, "Programacion", "Diseno");
// Reemplazadas: ${toCode(reemplazadas)}
// Resultado: ${toCode(materias)}`);
      })
    ]
  },
  {
    name: "slice()",
    description: "Copia una parte de un array sin modificar el original.",
    exercises: [
      exercise("Copiar los primeros 3 elementos de un array de numeros.", () => {
        const numeros = [10, 20, 30, 40, 50];
        const primerosTres = numeros.slice(0, 3);
        return makeResponse("Primeros tres", { primerosTres, numeros }, `const numeros = [10, 20, 30, 40, 50];
const primerosTres = numeros.slice(0, 3);
// Copia: ${toCode(primerosTres)}
// Original: ${toCode(numeros)}`);
      }),
      exercise("Crear una copia parcial de peliculas desde la posicion 2 hasta la 4.", () => {
        const peliculas = ["Matrix", "Shrek", "Coco", "Up", "Soul"];
        const copia = peliculas.slice(2, 5);
        return makeResponse("Copia parcial", { copia, peliculas }, `const peliculas = ["Matrix", "Shrek", "Coco", "Up", "Soul"];
const copia = peliculas.slice(2, 5);
// Copia: ${toCode(copia)}
// Original: ${toCode(peliculas)}`);
      }),
      exercise("Crear un array nuevo con los ultimos 3 elementos sin modificarlos.", () => {
        const notas = [4, 6, 7, 8, 9, 10];
        const ultimasTres = notas.slice(-3);
        return makeResponse("Ultimas tres", { ultimasTres, notas }, `const notas = [4, 6, 7, 8, 9, 10];
const ultimasTres = notas.slice(-3);
// Copia: ${toCode(ultimasTres)}
// Original: ${toCode(notas)}`);
      })
    ]
  },
  {
    name: "indexOf()",
    description: "Busca un valor y devuelve su indice, o -1 si no existe.",
    exercises: [
      exercise("Encontrar la posicion de la palabra perro en un array.", () => {
        const animales = ["gato", "perro", "canario"];
        const indice = animales.indexOf("perro");
        return makeResponse("Indice de perro", indice, `const animales = ["gato", "perro", "canario"];
const indice = animales.indexOf("perro");
// Resultado: ${indice}`);
      }),
      exercise("Verificar si el numero 50 esta en un array y en que posicion.", () => {
        const numeros = [10, 25, 50, 75];
        const indice = numeros.indexOf(50);
        const mensaje = indice === -1 ? "No esta" : `Esta en la posicion ${indice}`;
        return makeResponse("Busqueda de 50", mensaje, `const numeros = [10, 25, 50, 75];
const indice = numeros.indexOf(50);
// Resultado: "${mensaje}"`);
      }),
      exercise("Mostrar el indice de Madrid o un mensaje si no esta.", () => {
        const ciudades = ["Buenos Aires", "Roma", "Lima"];
        const indice = ciudades.indexOf("Madrid");
        const mensaje = indice === -1 ? "Madrid no esta en el array" : indice;
        return makeResponse("Busqueda de Madrid", mensaje, `const ciudades = ["Buenos Aires", "Roma", "Lima"];
const indice = ciudades.indexOf("Madrid");
// Resultado: ${toCode(mensaje)}`);
      })
    ]
  },
  {
    name: "includes()",
    description: "Comprueba si un array contiene un elemento.",
    exercises: [
      exercise("Comprobar si un array contiene la palabra admin.", () => {
        const roles = ["user", "admin", "editor"];
        const contieneAdmin = roles.includes("admin");
        return makeResponse("Contiene admin", contieneAdmin, `const roles = ["user", "admin", "editor"];
const contieneAdmin = roles.includes("admin");
// Resultado: ${contieneAdmin}`);
      }),
      exercise("Indicar si existe verde dentro de un array de colores.", () => {
        const colores = ["rojo", "azul", "verde"];
        const existeVerde = colores.includes("verde");
        return makeResponse("Existe verde", existeVerde, `const colores = ["rojo", "azul", "verde"];
const existeVerde = colores.includes("verde");
// Resultado: ${existeVerde}`);
      }),
      exercise("Verificar si un numero esta presente antes de sumarlo al array.", ({ numero }) => {
        const numeros = [2, 4, 6];

        if (!numeros.includes(numero)) {
          numeros.push(numero);
        }

        return makeResponse("Numeros", numeros, `const numeros = [2, 4, 6];
const numeroNuevo = ${numero};

if (!numeros.includes(numeroNuevo)) {
  numeros.push(numeroNuevo);
}

// Resultado: ${toCode(numeros)}`);
      }, [numberField("numero", "Numero para agregar", 8)])
    ]
  },
  {
    name: "forEach()",
    description: "Recorre cada elemento del array sin crear uno nuevo.",
    exercises: [
      exercise("Mostrar todos los nombres de un array con un saludo.", () => {
        const nombres = ["Ana", "Luis", "Mora"];
        const saludos = [];
        nombres.forEach(nombre => saludos.push(`Hola, ${nombre}`));
        return makeResponse("Saludos", saludos, `const nombres = ["Ana", "Luis", "Mora"];
const saludos = [];

nombres.forEach(nombre => {
  saludos.push("Hola, " + nombre);
});

// Resultado: ${toCode(saludos)}`);
      }),
      exercise("Imprimir el doble de cada numero de un array con forEach().", () => {
        const numeros = [3, 5, 9];
        const dobles = [];
        numeros.forEach(numero => dobles.push(numero * 2));
        return makeResponse("Dobles", dobles, `const numeros = [3, 5, 9];
const dobles = [];

numeros.forEach(numero => {
  dobles.push(numero * 2);
});

// Resultado: ${toCode(dobles)}`);
      }),
      exercise("Mostrar cada nombre con su edad desde un array de objetos.", () => {
        const personas = [{ nombre: "Sofia", edad: 17 }, { nombre: "Tomas", edad: 18 }];
        const datos = [];
        personas.forEach(persona => datos.push(`${persona.nombre} tiene ${persona.edad} anos`));
        return makeResponse("Personas", datos, `const personas = ${toCode(personas)};
const datos = [];

personas.forEach(persona => {
  datos.push(persona.nombre + " tiene " + persona.edad + " anos");
});

// Resultado: ${toCode(datos)}`);
      })
    ]
  },
  {
    name: "map()",
    description: "Crea un nuevo array transformando cada elemento.",
    exercises: [
      exercise("Crear un nuevo array con cada numero multiplicado por 3.", () => {
        const numeros = [2, 4, 6];
        const triples = numeros.map(numero => numero * 3);
        return makeResponse("Triples", triples, `const numeros = [2, 4, 6];
const triples = numeros.map(numero => numero * 3);
// Resultado: ${toCode(triples)}`);
      }),
      exercise("Convertir un array de nombres en mayusculas.", () => {
        const nombres = ["ana", "luis", "mora"];
        const mayusculas = nombres.map(nombre => nombre.toUpperCase());
        return makeResponse("Mayusculas", mayusculas, `const nombres = ["ana", "luis", "mora"];
const mayusculas = nombres.map(nombre => nombre.toUpperCase());
// Resultado: ${toCode(mayusculas)}`);
      }),
      exercise("Agregar el 21% de IVA a precios y crear un nuevo array.", () => {
        const precios = [100, 250, 500];
        const conIva = precios.map(precio => Number((precio * 1.21).toFixed(2)));
        return makeResponse("Precios con IVA", conIva, `const precios = [100, 250, 500];
const conIva = precios.map(precio => Number((precio * 1.21).toFixed(2)));
// Resultado: ${toCode(conIva)}`);
      })
    ]
  },
  {
    name: "filter()",
    description: "Crea un nuevo array con los elementos que cumplen una condicion.",
    exercises: [
      exercise("Filtrar los numeros mayores a 10 de un array.", () => {
        const numeros = [4, 12, 20, 8];
        const mayoresA10 = numeros.filter(numero => numero > 10);
        return makeResponse("Mayores a 10", mayoresA10, `const numeros = [4, 12, 20, 8];
const mayoresA10 = numeros.filter(numero => numero > 10);
// Resultado: ${toCode(mayoresA10)}`);
      }),
      exercise("Filtrar palabras que tengan mas de 5 letras.", () => {
        const palabras = ["sol", "ventana", "mesa", "escuela"];
        const largas = palabras.filter(palabra => palabra.length > 5);
        return makeResponse("Palabras largas", largas, `const palabras = ["sol", "ventana", "mesa", "escuela"];
const largas = palabras.filter(palabra => palabra.length > 5);
// Resultado: ${toCode(largas)}`);
      }),
      exercise("Filtrar usuarios activos de un array de objetos.", () => {
        const usuarios = [
          { nombre: "Ana", activo: true },
          { nombre: "Luis", activo: false },
          { nombre: "Mora", activo: true }
        ];
        const activos = usuarios.filter(usuario => usuario.activo);
        return makeResponse("Usuarios activos", activos, `const usuarios = ${toCode(usuarios)};
const activos = usuarios.filter(usuario => usuario.activo);
// Resultado: ${toCode(activos)}`);
      })
    ]
  },
  {
    name: "reduce()",
    description: "Reduce un array a un unico resultado acumulado.",
    exercises: [
      exercise("Sumar todos los elementos de un array.", () => {
        const numeros = [5, 10, 15];
        const suma = numeros.reduce((total, numero) => total + numero, 0);
        return makeResponse("Suma total", suma, `const numeros = [5, 10, 15];
const suma = numeros.reduce((total, numero) => total + numero, 0);
// Resultado: ${suma}`);
      }),
      exercise("Multiplicar todos los elementos de un array de enteros.", () => {
        const enteros = [2, 3, 4];
        const producto = enteros.reduce((total, numero) => total * numero, 1);
        return makeResponse("Multiplicacion total", producto, `const enteros = [2, 3, 4];
const producto = enteros.reduce((total, numero) => total * numero, 1);
// Resultado: ${producto}`);
      }),
      exercise("Obtener el total de precios de un array de objetos.", () => {
        const productos = [{ precio: 120 }, { precio: 80 }, { precio: 300 }];
        const total = productos.reduce((acum, producto) => acum + producto.precio, 0);
        return makeResponse("Total de precios", total, `const productos = ${toCode(productos)};
const total = productos.reduce((acum, producto) => acum + producto.precio, 0);
// Resultado: ${total}`);
      })
    ]
  },
  {
    name: "sort()",
    description: "Ordena los elementos de un array.",
    exercises: [
      exercise("Ordenar un array de numeros de menor a mayor.", () => {
        const numeros = [40, 5, 100, 12];
        numeros.sort((a, b) => a - b);
        return makeResponse("Numeros ordenados", numeros, `const numeros = [40, 5, 100, 12];
numeros.sort((a, b) => a - b);
// Resultado: ${toCode(numeros)}`);
      }),
      exercise("Ordenar un array de palabras alfabeticamente.", () => {
        const palabras = ["nube", "arbol", "casa", "barco"];
        palabras.sort();
        return makeResponse("Palabras ordenadas", palabras, `const palabras = ["nube", "arbol", "casa", "barco"];
palabras.sort();
// Resultado: ${toCode(palabras)}`);
      }),
      exercise("Ordenar objetos {nombre, edad} por edad.", () => {
        const personas = [{ nombre: "Ana", edad: 21 }, { nombre: "Luis", edad: 16 }, { nombre: "Mora", edad: 19 }];
        personas.sort((a, b) => a.edad - b.edad);
        return makeResponse("Personas por edad", personas, `const personas = ${toCode(personas)};
personas.sort((a, b) => a.edad - b.edad);
// Resultado: ${toCode(personas)}`);
      })
    ]
  },
  {
    name: "reverse()",
    description: "Invierte el orden de los elementos de un array.",
    exercises: [
      exercise("Invertir un array de letras.", () => {
        const letras = ["a", "b", "c", "d"];
        letras.reverse();
        return makeResponse("Letras invertidas", letras, `const letras = ["a", "b", "c", "d"];
letras.reverse();
// Resultado: ${toCode(letras)}`);
      }),
      exercise("Invertir el orden de un array de numeros.", () => {
        const numeros = [1, 2, 3, 4, 5];
        numeros.reverse();
        return makeResponse("Numeros invertidos", numeros, `const numeros = [1, 2, 3, 4, 5];
numeros.reverse();
// Resultado: ${toCode(numeros)}`);
      }),
      exercise("Convertir un string en array y revertir el texto.", ({ texto }) => {
        const letras = texto.split("");
        const invertido = letras.reverse().join("");
        return makeResponse("Texto invertido", invertido, `const texto = "${escapeText(texto)}";
const letras = texto.split("");
const invertido = letras.reverse().join("");
// Array modificado: ${toCode(letras)}
// Resultado: "${escapeText(invertido)}"`);
      }, [textField("texto", "Texto para invertir", "javascript")])
    ]
  }
];

const methodsGrid = document.querySelector("#methodsGrid");
const themeToggle = document.querySelector("#themeToggle");
const themeText = document.querySelector("#themeText");
const themeIcon = document.querySelector(".theme-icon");
const scrollTopButton = document.querySelector("#scrollTopButton");

function exercise(text, run, fields = []) {
  return { text, run, fields };
}

function numberField(name, label, value) {
  return { type: "number", name, label, value, min: 0 };
}

function textField(name, label, value) {
  return { type: "text", name, label, value, minLength: 2 };
}

function toCode(value) {
  return JSON.stringify(value);
}

function escapeText(text) {
  return String(text).replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
}

function formatValue(value) {
  if (Array.isArray(value) || (value !== null && typeof value === "object")) {
    return JSON.stringify(value);
  }

  return String(value);
}

function makeResponse(label, value, code) {
  return {
    output: `${label}: ${formatValue(value)}`,
    code
  };
}

// Crea una tarjeta por metodo y un formulario por cada consigna.
function createMethodCard(method, index) {
  const article = document.createElement("article");
  article.className = "method-card";
  article.dataset.name = method.name.toLowerCase();

  const exercises = method.exercises
    .map((item, exerciseIndex) => createExerciseForm(item, index, exerciseIndex))
    .join("");

  article.innerHTML = `
    <div class="card-top">
      <h2 class="method-title">
        ${method.name}
        <span class="badge">Punto ${index + 1}</span>
      </h2>
      <p class="method-description">${method.description}</p>
    </div>
    <div class="exercise-actions">${exercises}</div>
    <div class="result-box" aria-live="polite">
      <h3>Resultado</h3>
      <p class="result-output">Completa un formulario o toca ejecutar.</p>
    </div>
    <pre class="code-block"><code>// El codigo se actualiza cuando ejecutas un ejercicio.</code></pre>
    <div class="card-actions">
      <button class="reset-button" type="button">Reiniciar punto</button>
    </div>
  `;

  return article;
}

function createExerciseForm(item, methodIndex, exerciseIndex) {
  const fields = item.fields.map(field => createField(field)).join("");

  return `
    <form class="exercise-form" data-method="${methodIndex}" data-exercise="${exerciseIndex}" novalidate>
      <p class="exercise-text"><span>Ejercicio ${exerciseIndex + 1}</span>${item.text}</p>
      ${fields}
      <p class="form-error" aria-live="polite"></p>
      <button class="exercise-button" type="submit">Ejecutar</button>
    </form>
  `;
}

function createField(field) {
  return `
    <label class="form-field">
      <span>${field.label}</span>
      <input
        name="${field.name}"
        type="${field.type}"
        value="${field.value}"
        ${field.type === "number" ? `min="${field.min}" step="1"` : `minlength="${field.minLength}"`}
        required
      >
    </label>
  `;
}

function renderMethods() {
  methodsGrid.innerHTML = "";
  methods.forEach((method, index) => {
    methodsGrid.appendChild(createMethodCard(method, index));
  });
}

function runExercise(event) {
  event.preventDefault();

  const form = event.target.closest(".exercise-form");
  if (!form) {
    return;
  }

  const card = form.closest(".method-card");
  const output = card.querySelector(".result-output");
  const codeBlock = card.querySelector(".code-block code");
  const error = form.querySelector(".form-error");
  const methodIndex = Number(form.dataset.method);
  const exerciseIndex = Number(form.dataset.exercise);
  const exerciseItem = methods[methodIndex].exercises[exerciseIndex];
  const values = getFormValues(form, exerciseItem.fields);

  if (!validateForm(values, exerciseItem.fields, error)) {
    return;
  }

  const response = exerciseItem.run(values);
  output.textContent = response.output;
  codeBlock.textContent = response.code;
  error.textContent = "";
  disableCompletedForm(form);
}

function disableCompletedForm(form) {
  form.classList.add("is-completed");
  form.querySelectorAll("input, button").forEach(element => {
    element.disabled = true;
  });
}

function resetCard(event) {
  const button = event.target.closest(".reset-button");

  if (!button) {
    return;
  }

  const card = button.closest(".method-card");
  const output = card.querySelector(".result-output");
  const codeBlock = card.querySelector(".code-block code");

  output.textContent = "Completa un formulario o toca ejecutar.";
  codeBlock.textContent = "// El codigo se actualiza cuando ejecutas un ejercicio.";

  card.querySelectorAll(".exercise-form").forEach(form => {
    form.reset();
    form.classList.remove("is-completed");
    form.querySelector(".form-error").textContent = "";
    form.querySelectorAll("input, button").forEach(element => {
      element.disabled = false;
    });
  });
}

function getFormValues(form, fields) {
  return fields.reduce((values, field) => {
    const input = form.elements[field.name];
    const value = input ? input.value.trim() : "";
    values[field.name] = field.type === "number" && value === "" ? NaN : Number(value);

    if (field.type === "text") {
      values[field.name] = value;
    }
    return values;
  }, {});
}

// Valida con mensajes dentro de la tarjeta.
function validateForm(values, fields, error) {
  for (const field of fields) {
    const value = values[field.name];

    if (field.type === "number" && !Number.isFinite(value)) {
      error.textContent = "Ingrese un numero valido.";
      return false;
    }

    if (field.type === "text" && value.length < field.minLength) {
      error.textContent = `Ingrese al menos ${field.minLength} caracteres.`;
      return false;
    }
  }

  return true;
}

// Guarda el modo elegido para conservarlo al recargar la pagina.
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeText.textContent = isDark ? "Modo noche" : "Modo dia";
  themeIcon.textContent = isDark ? "N" : "D";
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function toggleScrollTopButton() {
  const shouldShow = window.scrollY > 360;
  scrollTopButton.classList.toggle("is-visible", shouldShow);
}

renderMethods();
applyTheme(localStorage.getItem("theme") || "light");
methodsGrid.addEventListener("submit", runExercise);
methodsGrid.addEventListener("click", resetCard);
themeToggle.addEventListener("click", toggleTheme);
scrollTopButton.addEventListener("click", scrollToTop);
window.addEventListener("scroll", toggleScrollTopButton);
toggleScrollTopButton();
