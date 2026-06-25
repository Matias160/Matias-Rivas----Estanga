const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "text/javascript; charset=UTF-8"
};

// Servidor estático simple para abrir el proyecto sin dependencias externas.
const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const filePath = path.resolve(PUBLIC_DIR, requestedPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=UTF-8" });
    response.end("Acceso denegado");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=UTF-8" });
      response.end("Archivo no encontrado");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extension] || "text/plain; charset=UTF-8" });
    response.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Proyecto 1 disponible en http://localhost:${PORT}`);
});
