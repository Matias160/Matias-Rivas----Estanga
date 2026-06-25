// modules/weather.js
// Modulo propio de clima con datos simulados para el trabajo practico.
const forecasts = {
  "buenos-aires": {
    city: "Buenos Aires",
    temperature: 22,
    condition: "Templado",
    humidity: 64,
    wind: "14 km/h"
  },
  "mar-del-plata": {
    city: "Mar del Plata",
    temperature: 18,
    condition: "Fresco",
    humidity: 72,
    wind: "20 km/h"
  },
  cordoba: {
    city: "Cordoba",
    temperature: 25,
    condition: "Soleado",
    humidity: 48,
    wind: "10 km/h"
  }
};

// Devuelve todas las ciudades disponibles para completar el selector HTML.
export function getAvailableCities() {
  return Object.entries(forecasts).map(([key, value]) => ({
    key,
    name: value.city
  }));
}

// Busca el clima por clave. Si la clave no existe, vuelve a Mar del Plata.
export function getWeather(cityKey = "mar-del-plata") {
  return forecasts[cityKey] || forecasts["mar-del-plata"];
}

// Devuelve el clima en formato texto para usarlo en consola o en la web.
export function formatWeather(cityKey = "mar-del-plata") {
  const weather = getWeather(cityKey);

  return `${weather.city}: ${weather.temperature} grados, ${weather.condition}, humedad ${weather.humidity}%, viento ${weather.wind}.`;
}
