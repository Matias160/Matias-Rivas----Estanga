import { useState } from 'react';

type Theme = 'light' | 'dark';

type CardProps = {
  nombre: string;
  apellido: string;
  profesion: string;
  imagen: string;
};

function PresentationCard({ nombre, apellido, profesion, imagen }: CardProps) {
  // La tarjeta usa props para recibir sus datos.
  return (
    <article className="glass card">
      <img src={imagen} alt={`${nombre} ${apellido}`} />
      <div>
        <span className="tag">Punto 2</span>
        <h1>{nombre} {apellido}</h1>
        <p>{profesion}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // Cambia el tema de toda la pagina.
  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <main className="app" data-theme={theme}>
      <section className="page-shell">
        <button className="primary-button" onClick={toggleTheme}>
          {theme === 'light' ? 'Modo noche' : 'Modo dia'}
        </button>
        <PresentationCard
          nombre="Sofia"
          apellido="Martinez"
          profesion="Desarrolladora Frontend"
          imagen="/Gemini_Generated_Image_smsvolsmsvolsmsv.png"
        />
      </section>
    </main>
  );
}
