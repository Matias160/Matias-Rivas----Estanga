const { spawn } = require('child_process');
const path = require('path');

const projects = [
  { name: 'Punto 1', folder: 'punto1', port: 3000 },
  { name: 'Punto 2', folder: 'punto2', port: 3001 },
  { name: 'Punto 3', folder: 'punto3', port: 3002 },
  { name: 'Punto 4', folder: 'punto4', port: 3003 }
];

// Levanta todos los proyectos a la vez, cada uno en su carpeta y puerto.
projects.forEach((project) => {
  const projectPath = path.join(__dirname, project.folder);

  const server = spawn('node', ['server.js'], {
    cwd: projectPath,
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
