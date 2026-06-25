import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

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

// Sirve el HTML, CSS y JS del punto 1.
function serveStaticFile(request, response) {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
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
  serveStaticFile(request, response);
});

// Muestra un mensaje claro si el puerto ya esta ocupado.
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`El punto 1 ya esta abierto o el puerto ${PORT} esta ocupado.`);
    console.log(`Proba entrar a http://localhost:${PORT} o cerra la terminal anterior.`);
    return;
  }

  console.log('No se pudo iniciar el punto 1.');
});

server.listen(PORT, () => {
  console.log(`Punto 1 iniciado en http://localhost:${PORT}`);
});
