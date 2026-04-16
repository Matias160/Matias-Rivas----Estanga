import { upperCase } from "upper-case";


import { sumar, restar, multiplicar } from './Modulos/calculo.js';
import { obtenerClima, obtenerHumedad } from './Modulos/clima.js';
import { saludar, despedir } from './Modulos/saludo.js'; 


console.log(upperCase("iniciando sistema de pruebas"));



console.log(saludar(("Matías"))); 





console.log("Cálculos Matemáticos:");
console.log(" -> Suma (10+5):", sumar(10, 5));
console.log(" -> Resta (10-5):", restar(10, 5));
console.log(" -> Multiplicación (10*5):", multiplicar(10, 5));



console.log("Reporte Meteorológico:");
console.log(" -> Clima en Buenos Aires:", obtenerClima("Buenos Aires"));
console.log(" -> Humedad en Córdoba:", obtenerHumedad("Córdoba"));

console.log(despedir("Matías"));


