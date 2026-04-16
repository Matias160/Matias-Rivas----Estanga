import { upperCase } from "upper-case";

export function saludar(nombre) {

    return `Hola, ${upperCase(nombre)}!`; 
}

export function despedir(nombre) {
    return `Hasta luego, ${(nombre)}!`;
}