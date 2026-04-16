import { upperCase } from "upper-case";

export function obtenerClima(ciudad) {
    const climas = {
        "BUENOS AIRES": "Soleado, 23°C",
        "CÓRDOBA": "Nublado, 18°C",
        "ROSARIO": "Lluvioso, 15°C"
    };
    
    const ciudadBusqueda = upperCase(ciudad);
    return climas[ciudadBusqueda] || "CIUDAD NO ENCONTRADA";
}

export function obtenerHumedad(ciudad) {
    const humedades = {
        "BUENOS AIRES": "65%",
        "CÓRDOBA": "70%",
        "ROSARIO": "80%"
    };
    const ciudadBusqueda = upperCase(ciudad);
    return humedades[ciudadBusqueda] || "DATO NO DISPONIBLE";
}