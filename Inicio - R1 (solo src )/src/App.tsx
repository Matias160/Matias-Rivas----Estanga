import { useState } from 'react';

type Theme = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // Alterna el modo visual de la pagina.
  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <main className="app" data-theme={theme}>
      <section className="glass page-card">
        <span className="tag">Punto 1</span>
        <h1>Hola, mundo!</h1>
        <p>Componente simple con estilos, glassmorphism, modo dia/noche y diseño responsive.</p>
        <button className="primary-button" onClick={toggleTheme}>
          {theme === 'light' ? 'Modo noche' : 'Modo dia'}
        </button>
      </section>
    </main>
  );
}
