import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projects = [
  { name: 'Punto 1', folder: 'punto1', port: 3000 },
  { name: 'Punto 2', folder: 'punto2', port: 3011 },
  { name: 'Punto 3', folder: 'punto3', port: 3012 },
  { name: 'Punto 4', folder: 'punto4', port: 3003 }
];

// Levanta todos los proyectos a la vez, cada uno en su carpeta y puerto.
projects.forEach((project) => {
  const projectPath = path.join(__dirname, project.folder);

  const server = spawn('node', ['server.js'], {
    cwd: projectPath,
    env: {
      ...process.env,
      PORT: String(project.port)
    },
    stdio: 'inherit',
    shell: false
  });

  server.on('error', () => {
    console.log(`No se pudo iniciar ${project.name}.`);
  });
});

console.log('\nProyectos disponibles:');
projects.forEach((project) => {
  console.log(`${project.name}: http://localhost:${project.port}`);
});
console.log('\nPara detenerlos, presiona Ctrl + C.\n');
