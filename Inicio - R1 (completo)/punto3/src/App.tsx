import { useState } from 'react';

type Theme = 'light' | 'dark';

function Counter() {
  const [count, setCount] = useState(0);

  // Estado local para incrementar y decrementar.
  return (
    <section className="glass counter-card">
      <span className="tag">Punto 3</span>
      <h1>Contador</h1>
      <div className="counter-box">
        <button onClick={() => setCount((value) => value - 1)}>-</button>
        <strong aria-live="polite">{count}</strong>
        <button onClick={() => setCount((value) => value + 1)}>+</button>
      </div>
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // Cambia entre modo dia y modo noche.
  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <main className="app" data-theme={theme}>
      <div className="page-shell">
        <button className="primary-button" onClick={toggleTheme}>
          {theme === 'light' ? 'Modo noche' : 'Modo dia'}
        </button>
        <Counter />
      </div>
    </main>
  );
}
