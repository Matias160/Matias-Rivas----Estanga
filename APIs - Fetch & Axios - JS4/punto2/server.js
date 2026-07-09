import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 3011;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');
const usersPath = path.join(__dirname, 'usuarios.json');

// Define el tipo de archivo que se envia al navegador.
function getContentType(filePath) {
  const extension = path.extname(filePath);
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8'
  };

  return types[extension] || 'text/plain; charset=utf-8';
}

// Envia respuestas JSON desde la API local.
function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

// Lee el cuerpo JSON que llega en una peticion POST.
function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('JSON invalido.'));
      }
    });
  });
}

// Lee los usuarios guardados en el archivo JSON del backend.
async function readUsers() {
  const content = await fs.promises.readFile(usersPath, 'utf8');
  return JSON.parse(content);
}

// Guarda el nuevo usuario en usuarios.json y devuelve el usuario creado.
async function saveUser(newUser) {
  const users = await readUsers();
  const lastId = users.length > 0 ? users[users.length - 1].id : 0;
  const userToSave = {
    id: lastId + 1,
    name: newUser.name,
    email: newUser.email
  };

  users.push(userToSave);
  await fs.promises.writeFile(usersPath, JSON.stringify(users, null, 2));
  return userToSave;
}

// Maneja el POST /api/usuarios para guardar usuarios reales en el JSON local.
async function createUser(request, response) {
  try {
    const user = await readBody(request);

    if (!user.name || !user.email) {
      sendJson(response, 400, { error: 'Nombre y email son obligatorios.' });
      return;
    }

    const savedUser = await saveUser(user);
    sendJson(response, 201, savedUser);
  } catch (error) {
    sendJson(response, 400, { error: error.message });
  }
}

// Sirve los archivos del punto 2.
function serveStaticFile(response, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(publicPath, requestedPath);

  if (!filePath.startsWith(publicPath)) {
    response.writeHead(403);
    response.end('Acceso denegado');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end('Archivo no encontrado');
      return;
    }

    response.writeHead(200, { 'Content-Type': getContentType(filePath) });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname === '/api/usuarios' && request.method === 'POST') {
    await createUser(request, response);
    return;
  }

  if (pathname === '/api/usuarios' && request.method === 'GET') {
    sendJson(response, 200, await readUsers());
    return;
  }

  serveStaticFile(response, pathname);
});

// Muestra un mensaje claro si el puerto ya esta ocupado.
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`El punto 2 ya esta abierto o el puerto ${PORT} esta ocupado.`);
    console.log(`Proba entrar a http://localhost:${PORT} o cerra la terminal anterior.`);
    return;
  }

  console.log('No se pudo iniciar el punto 2.');
});

server.listen(PORT, () => {
  console.log(`Punto 2 iniciado en http://localhost:${PORT}`);
});
