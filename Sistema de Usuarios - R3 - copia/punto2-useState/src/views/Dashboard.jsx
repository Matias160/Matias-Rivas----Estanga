import { Database, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="dashboard">
      <div className="welcome">
        <p className="eyebrow">Panel privado</p>
        <h1>Hola, {user?.name}</h1>
        <p>La pantalla actual esta controlada por useState y la sesion se valida contra la API.</p>
      </div>
      <div className="grid">
        <article className="card">
          <ShieldCheck />
          <h2>Proteccion</h2>
          <p>Password protegida con sal y token de sesion.</p>
        </article>
        <article className="card">
          <Database />
          <h2>Base SQL</h2>
          <p>Datos persistidos en SQLite desde el backend.</p>
        </article>
        <article className="card">
          <RefreshCw />
          <h2>LocalStorage</h2>
          <p>Sesion y preferencia visual persistidas en el navegador.</p>
        </article>
      </div>
    </section>
  );
}
