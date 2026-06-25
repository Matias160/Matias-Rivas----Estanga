const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;
const publicPath = path.join(__dirname, 'public');
const alumnosPath = path.join(__dirname, 'alumnos.json');

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

// Lee los alumnos desde un archivo JSON para no dejarlos escritos dentro del servidor.
function sendStudents(response) {
  fs.readFile(alumnosPath, 'utf8', (error, content) => {
    if (error) {
      sendJson(response, 500, { error: 'No se pudieron leer los alumnos.' });
      return;
    }

    sendJson(response, 200, JSON.parse(content));
  });
}

// Sirve los archivos del punto 4.
function serveStaticFile(request, response, pathname) {
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

const server = http.createServer((request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname === '/api/alumnos' && request.method === 'GET') {
    sendStudents(response);
    return;
  }

  serveStaticFile(request, response, pathname);
});

// Muestra un mensaje claro si el puerto ya esta ocupado.
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`El punto 4 ya esta abierto o el puerto ${PORT} esta ocupado.`);
    console.log(`Proba entrar a http://localhost:${PORT} o cerra la terminal anterior.`);
    return;
  }

  console.log('No se pudo iniciar el punto 4.');
});

server.listen(PORT, () => {
  console.log(`Punto 4 iniciado en http://localhost:${PORT}`);
});
