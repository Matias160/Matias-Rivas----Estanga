// modules/tourism.js
// Modulo propio con informacion turistica simulada para mostrar contenido atomizado.
const destinations = [
  {
    name: "Mar del Plata",
    attraction: "Playa Grande, el Puerto y los acantilados",
    season: "Verano"
  },
  {
    name: "Bariloche",
    attraction: "Cerro Catedral y Circuito Chico",
    season: "Invierno"
  },
  {
    name: "Cataratas del Iguazu",
    attraction: "Garganta del Diablo",
    season: "Todo el año"
  },
  {
    name: "Mendoza",
    attraction: "Bodegas y paisaje cordillerano",
    season: "Otoño y primavera"
  }
];

export function getDestinations() {
  return destinations;
}
