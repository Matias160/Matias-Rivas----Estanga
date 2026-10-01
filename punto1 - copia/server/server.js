import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "data", "tareas.json");
const port = 3001;

// Clase usada del lado del servidor para manejar cada tarea.
class TareaServidor {
  constructor({ id, titulo, categoria, prioridad, completada = false, creadaEn }) {
    this.id = id ?? crypto.randomUUID();
    this.titulo = titulo;
    this.categoria = categoria;
    this.prioridad = prioridad;
    this.completada = completada;
    this.creadaEn = creadaEn ?? new Date().toISOString();
  }

  get estaCompleta() {
    return this.completada;
  }

  set estado(valor) {
    this.completada = Boolean(valor);
  }
}

// Respuesta estandar en JSON para todos los endpoints.
const enviarJson = (respuesta, estado, datos) => {
  respuesta.writeHead(estado, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  respuesta.end(JSON.stringify(datos));
};

const leerCuerpo = async (pedido) => {
  // Lee el cuerpo enviado por POST o PATCH.
  const partes = [];

  for await (const parte of pedido) {
    partes.push(parte);
  }

  const texto = Buffer.concat(partes).toString();
  return texto ? JSON.parse(texto) : {};
};

const leerTareas = async () => {
  // Convierte el archivo JSON en un vector de clases.
  const contenido = await readFile(dataPath, "utf-8");
  const tareas = JSON.parse(contenido);
  return tareas.map((tarea) => new TareaServidor(tarea));
};

const guardarTareas = async (tareas) => {
  // Persiste los cambios para que no se pierdan al cerrar la app.
  await writeFile(dataPath, JSON.stringify(tareas, null, 2));
};

const validarTarea = ({ titulo, categoria, prioridad }) => {
  // Validacion del lado servidor para no guardar datos incompletos.
  const errores = [];

  if (!titulo || titulo.trim().length < 3) errores.push("El titulo debe tener al menos 3 caracteres.");
  if (!categoria || categoria.trim().length < 2) errores.push("La categoria es obligatoria.");
  if (!["baja", "media", "alta"].includes(prioridad)) errores.push("La prioridad no es valida.");

  return errores;
};

const manejarApi = async (pedido, respuesta) => {
  const url = new URL(pedido.url, `http://${pedido.headers.host}`);

  if (pedido.method === "OPTIONS") {
    enviarJson(respuesta, 204, {});
    return;
  }

  if (url.pathname !== "/api/tareas") {
    enviarJson(respuesta, 404, { mensaje: "Ruta no encontrada." });
    return;
  }

  const tareas = await leerTareas();

  if (pedido.method === "GET") {
    // Devuelve todas las tareas guardadas.
    enviarJson(respuesta, 200, tareas);
    return;
  }

  if (pedido.method === "POST") {
    // Crea una tarea nueva despues de validar los datos.
    const cuerpo = await leerCuerpo(pedido);
    const errores = validarTarea(cuerpo);

    if (errores.length > 0) {
      enviarJson(respuesta, 400, { errores });
      return;
    }

    const nuevaTarea = new TareaServidor({
      titulo: cuerpo.titulo.trim(),
      categoria: cuerpo.categoria.trim(),
      prioridad: cuerpo.prioridad
    });

    tareas.unshift(nuevaTarea);
    await guardarTareas(tareas);
    enviarJson(respuesta, 201, nuevaTarea);
    return;
  }

  if (pedido.method === "PATCH") {
    // Busca una tarea y alterna su estado completada/pendiente.
    const cuerpo = await leerCuerpo(pedido);
    const tareaBuscada = tareas.find((tarea) => tarea.id === cuerpo.id);

    if (!tareaBuscada) {
      enviarJson(respuesta, 404, { mensaje: "Tarea inexistente." });
      return;
    }

    tareaBuscada.estado = !tareaBuscada.estaCompleta;
    await guardarTareas(tareas);
    enviarJson(respuesta, 200, tareaBuscada);
    return;
  }

  if (pedido.method === "DELETE") {
    // Elimina la tarea cuyo id llega por parametro.
    const id = url.searchParams.get("id");
    const tareaBuscada = tareas.find((tarea) => tarea.id === id);

    if (!tareaBuscada) {
      enviarJson(respuesta, 404, { mensaje: "No se encontro la tarea." });
      return;
    }

    if (!tareaBuscada.estaCompleta) {
      enviarJson(respuesta, 409, { mensaje: "Completa la tarea antes de eliminarla." });
      return;
    }

    const tareasFiltradas = tareas.filter((tarea) => tarea.id !== id);

    await guardarTareas(tareasFiltradas);
    enviarJson(respuesta, 200, { id });
    return;
  }

  enviarJson(respuesta, 405, { mensaje: "Metodo no permitido." });
};

const servidor = createServer((pedido, respuesta) => {
  manejarApi(pedido, respuesta).catch(() => {
    enviarJson(respuesta, 500, { mensaje: "Error interno del servidor." });
  });
});

servidor.listen(port, () => {
  console.log(`Servidor activo en http://127.0.0.1:${port}`);
});
