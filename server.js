// server.js
// Servidor principal creado con modulos nativos de Node.js: HTTP, FILE SYSTEM, URL y PATH.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";

import { createPage } from "./modules/content.js";
import { ensureGeneratedHtmlFile, readGeneratedHtmlFile } from "./modules/fileSystemComponent.js";
import {
  aboutPage,
  calculatorPage,
  contactPage,
  homePage,
  notFoundPage,
  tourismPage,
  urlPage,
  weatherPage
} from "./modules/pages.js";

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.join(__dirname, "public");
const generatedHtmlPath = ensureGeneratedHtmlFile(publicDirectory);

// Tipos MIME basicos para servir archivos estaticos desde /public.
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".html": "text/html; charset=utf-8"
};

// Lee archivos estaticos con File System y los envia al navegador.
function serveStaticFile(fileName, response) {
  const safeFileName = path.basename(fileName);
  const filePath = path.join(publicDirectory, safeFileName);
  const extension = path.extname(filePath);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Archivo no encontrado.");
      return;
    }

    response.writeHead(200, { "Content-Type": mimeTypes[extension] || "text/plain; charset=utf-8" });
    response.end(data);
  });
}

// Imprime por consola los datos principales de la URL solicitada.
function logUrlInfo(currentUrl) {
  console.log("--- Modulo URL ---");
  console.log(`Host: ${currentUrl.host}`);
  console.log(`Hostname: ${currentUrl.hostname}`);
  console.log(`Path: ${currentUrl.pathname}`);
  console.log(`Query: ${currentUrl.search || "sin query"}`);
  console.log(`Href: ${currentUrl.href}`);
}

const server = http.createServer((request, response) => {
  const currentUrl = new URL(request.url, `http://${request.headers.host}`);
  const route = currentUrl.pathname === "/index" ? "/" : currentUrl.pathname;

  logUrlInfo(currentUrl);

  // Archivos estaticos del frontend.
  if (route === "/style.css" || route === "/main.js") {
    serveStaticFile(route, response);
    return;
  }

  // Ruta que muestra un archivo HTML fisico creado con el modulo File System.
  if (route === "/archivo") {
    readGeneratedHtmlFile(generatedHtmlPath, (error, html) => {
      if (error) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("No se pudo leer el archivo HTML generado.");
        return;
      }

      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(html);
    });
    return;
  }

  const routes = {
    "/": ["Inicio", homePage()],
    "/clima": ["Clima", weatherPage(currentUrl.searchParams)],
    "/calculo": ["Calculo", calculatorPage(currentUrl.searchParams)],
    "/turismo": ["Turismo", tourismPage()],
    "/contacto": ["Contacto", contactPage()],
    "/acerca": ["Acerca", aboutPage()],
    "/url": ["Modulo URL", urlPage(currentUrl)]
  };

  const selectedRoute = routes[route];

  if (!selectedRoute) {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(createPage("Pagina no encontrada", notFoundPage(), route));
    return;
  }

  const [title, body] = selectedRoute;
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(createPage(title, body, route));
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("Para detenerlo, presionar CTRL + C.");
});
