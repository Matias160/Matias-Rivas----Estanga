import { FormEvent, useState } from 'react';

type Theme = 'light' | 'dark';

const API_URL = `${window.location.protocol}//${window.location.hostname}:3001/nombre`;
const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

function SimpleForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();

    // Valida campo vacio.
    if (!cleanName) {
      setMessage('');
      setError('Ingresa tu nombre para continuar.');
      return;
    }

    if (!namePattern.test(cleanName)) {
      setMessage('');
      setError('El nombre no puede tener numeros ni simbolos.');
      return;
    }

    try {
      // Envia el nombre al backend local por POST.
      setIsSaving(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName }),
      });

      if (!response.ok) {
        throw new Error('Error de guardado');
      }

      setMessage(`Bienvenido/a, ${cleanName}. Nombre guardado.`);
      setError('');
      setName('');
    } catch {
      setMessage('');
      setError('No se pudo conectar con el backend. Ejecuta npm run server.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="glass form-card">
      <span className="tag">Punto 5</span>
      <h1>Formulario simple</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Escribi tu nombre"
        />
        <button disabled={isSaving}>{isSaving ? 'Guardando...' : 'Enviar'}</button>
        {error && <strong className="error">{error}</strong>}
        {message && <strong className="success">{message}</strong>}
      </form>
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // Cambia el modo visual.
  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <main className="app" data-theme={theme}>
      <div className="page-shell">
        <button className="primary-button" onClick={toggleTheme}>
          {theme === 'light' ? 'Modo noche' : 'Modo dia'}
        </button>
        <SimpleForm />
      </div>
    </main>
  );
}
