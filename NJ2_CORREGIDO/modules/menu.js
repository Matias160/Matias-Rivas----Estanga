// modules/menu.js
// Este modulo propio centraliza el menu para reutilizarlo en todas las paginas.
// Si se necesita agregar o quitar una seccion, se modifica este arreglo y se actualiza todo el sitio.
export const links = [
  { href: "/", label: "Inicio" },
  { href: "/clima", label: "Clima" },
  { href: "/calculo", label: "Calculo" },
  { href: "/turismo", label: "Turismo" },
  { href: "/contacto", label: "Contacto" },
  { href: "/acerca", label: "Acerca" },
  { href: "/archivo", label: "Archivo HTML" },
  { href: "/url", label: "Modulo URL" }
];

// Genera el HTML del menu y marca visualmente la pagina activa.
export function createMenu(activePath = "/") {
  const normalizedActivePath = activePath === "/index" ? "/" : activePath;

  const items = links
    .map((link) => {
      const isActive = link.href === normalizedActivePath;
      const activeClass = isActive ? " active" : "";
      const ariaCurrent = isActive ? ' aria-current="page"' : "";

      return `<a class="nav-link${activeClass}" href="${link.href}"${ariaCurrent}>${link.label}</a>`;
    })
    .join("\n        ");

  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Ir al inicio">NJ2</a>

      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="main-nav" aria-label="Menu principal">
        ${items}
      </nav>
    </header>
  `;
}
