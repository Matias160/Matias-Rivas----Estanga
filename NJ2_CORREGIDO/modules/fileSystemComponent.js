// modules/fileSystemComponent.js
// Este componente utiliza el modulo FILE SYSTEM para crear y leer un archivo HTML.
import fs from "node:fs";
import path from "node:path";
import { createPage } from "./content.js";

// Crea un archivo HTML fisico dentro de /public para cumplir la consigna de File System.
export function ensureGeneratedHtmlFile(publicDirectory) {
  const generatedFilePath = path.join(publicDirectory, "generado.html");

  const generatedContent = createPage(
    "Archivo HTML generado",
    `
      <section class="hero-card">
        <p class="eyebrow">Modulo File System</p>
        <h1>Archivo HTML creado con FS</h1>
        <p>Esta pagina fue escrita como archivo fisico usando <strong>fs.writeFileSync()</strong> y luego es leida desde el servidor con <strong>fs.readFile()</strong>.</p>
        <a class="button-link" href="/">Volver al inicio</a>
      </section>
    `,
    "/archivo"
  );

  fs.mkdirSync(publicDirectory, { recursive: true });
  fs.writeFileSync(generatedFilePath, generatedContent, "utf8");

  return generatedFilePath;
}

// Lee el archivo creado para que el servidor lo pueda mostrar en el navegador.
export function readGeneratedHtmlFile(filePath, callback) {
  fs.readFile(filePath, "utf8", callback);
}
