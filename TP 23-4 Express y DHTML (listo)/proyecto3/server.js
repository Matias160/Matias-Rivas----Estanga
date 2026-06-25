import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración necesaria para usar __dirname en versiones modernas de Node (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// Sirve archivos automáticos (CSS, imágenes) desde la carpeta 'Public'
app.use(express.static(path.join(__dirname, 'Public')));

// Ruta principal: envía el HTML uniendo la ruta de la carpeta actual con el nombre del archivo
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(3003, () => console.log('Proyecto 3 en http://localhost:3003'));