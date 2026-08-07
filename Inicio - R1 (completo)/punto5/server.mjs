import { createServer } from 'node:http';
import { appendFile, mkdir, open } from 'node:fs/promises';
import { join } from 'node:path';

const PORT = 3001;
const DATA_DIR = join(process.cwd(), 'data');
const FILE_PATH = join(DATA_DIR, 'nombres.txt');
const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

async function ensureTextFile() {
  // Crea la carpeta y el txt apenas arranca el backend.
  await mkdir(DATA_DIR, { recursive: true });
  const file = await open(FILE_PATH, 'a');
  await file.close();
}

function getHeaders(request) {
  // CORS permite conectar Vite con el backend local.
  const origin = request.headers.origin ?? 'http://localhost:5173';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function sendJson(response, request, status, data) {
  // Responde siempre en JSON.
  response.writeHead(status, {
    ...getHeaders(request),
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(data));
}

function readBody(request) {
  // Lee el cuerpo del POST.
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

const server = createServer(async (request, response) => {
  // OPTIONS responde la validacion previa del navegador.
  if (request.method === 'OPTIONS') {
    response.writeHead(204, getHeaders(request));
    response.end();
    return;
  }

  if (request.method !== 'POST' || request.url !== '/nombre') {
    sendJson(response, request, 404, { message: 'Ruta no disponible.' });
    return;
  }

  try {
    // Valida y guarda el nombre en el txt.
    const body = await readBody(request);
    const data = JSON.parse(String(body));
    const name = String(data.name ?? '').trim();

    if (!name || !namePattern.test(name)) {
      sendJson(response, request, 400, { message: 'Nombre invalido.' });
      return;
    }

    await appendFile(FILE_PATH, `${new Date().toISOString()} - ${name}\n`);
    sendJson(response, request, 201, { message: 'Nombre guardado.' });
  } catch {
    sendJson(response, request, 500, { message: 'No se pudo guardar.' });
  }
});

// Inicia el backend y deja disponible data/nombres.txt.
ensureTextFile()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Backend listo en http://localhost:${PORT}`);
      console.log(`TXT disponible en ${FILE_PATH}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo preparar data/nombres.txt.', error);
  });
