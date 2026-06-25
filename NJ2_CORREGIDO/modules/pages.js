// modules/pages.js
// Este modulo contiene la logica de contenido de cada pagina del sitio.
import { upperCase } from "upper-case";
import { calculate } from "./calculator.js";
import { escapeHtml } from "./content.js";
import { getAvailableCities, getWeather } from "./weather.js";
import { getDestinations } from "./tourism.js";

export function homePage() {
  return `
    <section class="hero-card">
      <p class="eyebrow">Trabajo practico Node.js</p>
      <h1>${upperCase("Sitio web modular")}</h1>
      <p>Proyecto desarrollado con modulos propios, HTTP, File System, URL y paquete instalado con NPM.</p>
      <div class="button-group">
        <a class="button-link" href="/clima">Ver clima</a>
        <a class="button-link secondary" href="/calculo">Usar calculadora</a>
      </div>
    </section>

    <section class="grid two-columns">
      <article class="info-card">
        <h2>Modularidad</h2>
        <p>El menu, el contenido, el clima, el calculo y el turismo estan separados en archivos independientes.</p>
      </article>
      <article class="info-card">
        <h2>Responsive</h2>
        <p>El diseño se adapta a escritorio, tablet y celular usando CSS y un menu desplegable en pantallas pequeñas.</p>
      </article>
    </section>
  `;
}

export function weatherPage(searchParams) {
  const selectedCity = searchParams.get("ciudad") || "mar-del-plata";
  const weather = getWeather(selectedCity);
  const cityOptions = getAvailableCities()
    .map((city) => {
      const selected = city.key === selectedCity ? " selected" : "";
      return `<option value="${city.key}"${selected}>${escapeHtml(city.name)}</option>`;
    })
    .join("");

  return `
    <section class="section-card">
      <p class="eyebrow">Modulo propio</p>
      <h1>Clima</h1>
      <p>Los datos son simulados y salen desde el modulo <strong>weather.js</strong>.</p>

      <form class="inline-form" method="GET" action="/clima">
        <label for="ciudad">Elegir ciudad</label>
        <select id="ciudad" name="ciudad">
          ${cityOptions}
        </select>
        <button type="submit">Consultar</button>
      </form>

      <div class="result-card">
        <h2>${escapeHtml(weather.city)}</h2>
        <p><strong>Temperatura:</strong> ${weather.temperature}°C</p>
        <p><strong>Estado:</strong> ${escapeHtml(weather.condition)}</p>
        <p><strong>Humedad:</strong> ${weather.humidity}%</p>
        <p><strong>Viento:</strong> ${escapeHtml(weather.wind)}</p>
      </div>
    </section>
  `;
}

export function calculatorPage(searchParams) {
  const operation = searchParams.get("operacion") || "suma";
  const a = searchParams.get("a") || "10";
  const b = searchParams.get("b") || "5";
  let resultHtml = "";

  try {
    const result = calculate(operation, a, b);
    resultHtml = `<div class="success-box">Resultado: <strong>${result}</strong></div>`;
  } catch (error) {
    resultHtml = `<div class="error-box">${escapeHtml(error.message)}</div>`;
  }

  return `
    <section class="section-card">
      <p class="eyebrow">Modulo propio</p>
      <h1>Calculadora</h1>
      <p>Operaciones realizadas desde el modulo <strong>calculator.js</strong>.</p>

      <form class="calculation-form" method="GET" action="/calculo">
        <div class="form-row">
          <label for="a">Primer numero</label>
          <input id="a" name="a" type="number" step="any" value="${escapeHtml(a)}" required>
        </div>

        <div class="form-row">
          <label for="b">Segundo numero</label>
          <input id="b" name="b" type="number" step="any" value="${escapeHtml(b)}" required>
        </div>

        <div class="form-row">
          <label for="operacion">Operacion</label>
          <select id="operacion" name="operacion">
            <option value="suma"${operation === "suma" ? " selected" : ""}>Suma</option>
            <option value="resta"${operation === "resta" ? " selected" : ""}>Resta</option>
            <option value="multiplicacion"${operation === "multiplicacion" ? " selected" : ""}>Multiplicacion</option>
            <option value="division"${operation === "division" ? " selected" : ""}>Division</option>
          </select>
        </div>

        <button type="submit">Calcular</button>
      </form>

      ${resultHtml}
    </section>
  `;
}

export function tourismPage() {
  const cards = getDestinations()
    .map((place) => `
      <article class="info-card">
        <h2>${escapeHtml(place.name)}</h2>
        <p><strong>Imperdible:</strong> ${escapeHtml(place.attraction)}</p>
        <p><strong>Temporada ideal:</strong> ${escapeHtml(place.season)}</p>
      </article>
    `)
    .join("");

  return `
    <section class="section-card">
      <p class="eyebrow">Modulo propio</p>
      <h1>Turismo nacional</h1>
      <p>Contenido generado desde el modulo <strong>tourism.js</strong>.</p>
      <div class="grid two-columns">${cards}</div>
    </section>
  `;
}

export function contactPage() {
  return `
    <section class="section-card">
      <p class="eyebrow">Validacion</p>
      <h1>Contacto</h1>
      <p>Formulario con validacion en HTML y JavaScript para mejorar la usabilidad.</p>

      <form id="contactForm" class="contact-form" novalidate>
        <div class="form-row">
          <label for="nombre">Nombre completo</label>
          <input id="nombre" name="nombre" type="text" minlength="3" required autocomplete="name">
          <span id="error-nombre" class="error-msg" aria-live="polite"></span>
        </div>

        <div class="form-row">
          <label for="email">Correo electronico</label>
          <input id="email" name="email" type="email" required autocomplete="email">
          <span id="error-email" class="error-msg" aria-live="polite"></span>
        </div>

        <div class="form-row">
          <label for="telefono">Telefono</label>
          <input id="telefono" name="telefono" type="tel" inputmode="numeric" required autocomplete="tel">
          <span id="error-telefono" class="error-msg" aria-live="polite"></span>
        </div>

        <div class="form-row">
          <label for="asunto">Asunto</label>
          <input id="asunto" name="asunto" type="text" minlength="4" required>
          <span id="error-asunto" class="error-msg" aria-live="polite"></span>
        </div>

        <div class="form-row">
          <label for="mensaje">Mensaje</label>
          <textarea id="mensaje" name="mensaje" minlength="10" required></textarea>
          <span id="error-mensaje" class="error-msg" aria-live="polite"></span>
        </div>

        <button type="submit">Enviar mensaje</button>
      </form>

      <div id="result" role="status" aria-live="polite"></div>
    </section>
  `;
}

export function aboutPage() {
  return `
    <section class="section-card">
      <p class="eyebrow">Completitud</p>
      <h1>Sobre el proyecto</h1>
      <p>Esta pagina resume como se cumplen las consignas solicitadas.</p>

      <ul class="check-list">
        <li>Modulos propios: menu, contenido, clima, calculo, turismo, paginas y File System.</li>
        <li>Servidor creado con el modulo HTTP nativo de Node.js.</li>
        <li>Archivo HTML generado y leido con File System.</li>
        <li>Modulo URL utilizado para analizar host, path, query y parametros.</li>
        <li>Paquete NPM <strong>upper-case</strong> instalado y utilizado en la portada.</li>
        <li>Menu modular con enlaces a mas de 5 paginas.</li>
        <li>Codigo comentado, validado, atomizado y responsive.</li>
      </ul>
    </section>
  `;
}

export function urlPage(currentUrl) {
  const rows = [
    ["Host", currentUrl.host],
    ["Hostname", currentUrl.hostname],
    ["Path", currentUrl.pathname],
    ["Query completa", currentUrl.search || "Sin query"],
    ["Protocolo", currentUrl.protocol],
    ["Href", currentUrl.href]
  ];

  const rowsHtml = rows
    .map(([label, value]) => `
      <tr>
        <th>${escapeHtml(label)}</th>
        <td>${escapeHtml(value)}</td>
      </tr>
    `)
    .join("");

  return `
    <section class="section-card">
      <p class="eyebrow">Modulo URL</p>
      <h1>Analisis de URL</h1>
      <p>Esta pagina muestra informacion obtenida con el modulo <strong>node:url</strong>. Tambien se imprime en consola cada vez que se recibe una peticion.</p>

      <div class="table-wrapper">
        <table>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>

      <a class="button-link" href="/url?curso=node&trabajo=modulos">Probar URL con parametros</a>
    </section>
  `;
}

export function notFoundPage() {
  return `
    <section class="section-card centered">
      <p class="eyebrow">Error 404</p>
      <h1>Pagina no encontrada</h1>
      <p>La ruta solicitada no existe.</p>
      <a class="button-link" href="/">Volver al inicio</a>
    </section>
  `;
}
