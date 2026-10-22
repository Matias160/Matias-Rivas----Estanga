import { networkInterfaces } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';
import QRCode from 'qrcode';

const portArgument = process.argv.indexOf('--port');
const requestedPort = Number(portArgument >= 0 ? process.argv[portArgument + 1] : 5173);

const isPortAvailable = (port) => new Promise((resolve) => {
  const server = createServer();
  server.once('error', () => resolve(false));
  server.once('listening', () => server.close(() => resolve(true)));
  server.listen(port, '0.0.0.0');
});

let port = requestedPort;
while (!(await isPortAvailable(port))) port += 1;
const interfaces = networkInterfaces();
const address = Object.values(interfaces)
  .flat()
  .find((item) => item?.family === 'IPv4' && !item.internal && !item.address.startsWith('192.168.56.'))?.address;

const localUrl = `http://localhost:${port}/`;
const mobileUrl = address ? `http://${address}:${port}/` : localUrl;

console.log('\nDEVICE HUB · ACCESO DESDE EL CELULAR');
console.log(`Abrí: ${mobileUrl}`);
console.log('El celular y la computadora deben usar la misma red Wi-Fi.\n');
console.log(await QRCode.toString(mobileUrl, { type: 'terminal', small: true, errorCorrectionLevel: 'M' }));
console.log('Aviso: en HTTP móvil, el navegador puede bloquear cámara, GPS y sensores.');
console.log('Para acceso completo usá la versión APK indicada en el README.\n');

const vitePath = new URL('../node_modules/vite/bin/vite.js', import.meta.url);
const vite = spawn(process.execPath, [fileURLToPath(vitePath), '--host', '0.0.0.0', '--port', port, '--strictPort'], {
  stdio: 'inherit',
  shell: false,
});

process.on('SIGINT', () => vite.kill('SIGINT'));
process.on('SIGTERM', () => vite.kill('SIGTERM'));
vite.on('exit', (code) => process.exit(code ?? 0));
