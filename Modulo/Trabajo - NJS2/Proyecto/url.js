import { URL } from 'url';


const direccion = new URL('http://localhost:3000/productos?categoria=ropa&precio=100');

console.log("Host:",      direccion.host);
console.log("Pathname:",  direccion.pathname);
console.log("Protocolo:", direccion.protocol);
console.log("Puerto:",    direccion.port);
console.log("Search:",    direccion.search);
console.log("Parámetro categoria:", direccion.searchParams.get('categoria'));
console.log("Parámetro precio:",    direccion.searchParams.get('precio'));