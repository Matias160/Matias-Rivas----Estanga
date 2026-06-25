// modules/content.js
// Este modulo propio arma la estructura base de cada pagina HTML.
import { createMenu } from "./menu.js";

// Evita que texto recibido como parametro rompa el HTML o inyecte codigo no deseado.
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Crea una pagina completa reutilizando el menu modular.
export function createPage(title, bodyContent, activePath = "/") {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Proyecto de Node.js con modulos propios, HTTP, File System, URL y NPM.">
  <title>${escapeHtml(title)} | NJ2</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  ${createMenu(activePath)}

  <main class="page-shell">
    ${bodyContent}
  </main>

  <footer class="site-footer">
    <p>Proyecto Node.js: modulos propios, HTTP, File System, URL, NPM y sitio web responsive.</p>
  </footer>

  <script src="/main.js"></script>
</body>
</html>`;
}
