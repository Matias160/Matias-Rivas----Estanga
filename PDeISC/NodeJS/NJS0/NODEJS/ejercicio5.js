import { sumar, restar, multiplicar, dividir } from "./calculos.js";

const resultado1 = sumar(5, 3);
const resultado2 = restar(8, 6);
const resultado3 = multiplicar(3, 11);
const resultado4 = dividir(30, 5);

document.body.innerHTML = `
  <div class="contenedor">
    <h1>Resultados</h1>
    <table>
      <tr>
        <th>Números</th>
      </tr>
      <tr>
        <td>${resultado1}</td>
      </tr>
      <tr>
        <td>${resultado2}</td>
      </tr>
      <tr>
        <td>${resultado3}</td>
      </tr>
      <tr>
        <td>${resultado4}</td>
      </tr>
    </table>
  </div>
`;