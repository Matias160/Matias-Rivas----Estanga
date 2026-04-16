import http from 'http';
import fs from 'fs';


import { obtenerMenu } from './Modulos (Ejercicio 1)/menu.js';


const rutas = {
    '/':          './paginas (Ejercicio 5)/inicio.html',
    '/nosotros':  './paginas (Ejercicio 5)/nosotros.html',
    '/productos': './paginas (Ejercicio 5)/productos.html',
    '/contacto':  './paginas (Ejercicio 5)/contacto.html', 
    '/blog':      './paginas (Ejercicio 5)/blog.html'
};

const server = http.createServer((req, res) => {
    const archivo = rutas[req.url];

    if (!archivo) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Página no encontrada</h1>');
        return;
    }

    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error al cargar la página');
            return;
        }
        
        
        const pagina = data.replace('{{MENU}}', obtenerMenu());
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(pagina);
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});