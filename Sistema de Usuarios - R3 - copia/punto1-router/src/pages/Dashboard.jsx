import { ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="dashboard">
      <div className="welcome">
        <p className="eyebrow">Panel privado</p>
        <h1>Hola, {user?.name}</h1>
        <p>Tu sesion esta validada por token y los datos se leen desde SQLite mediante la API.</p>
      </div>
      <div className="grid">
        <article className="card">
          <ShieldCheck />
          <h2>Proteccion</h2>
          <p>Password protegida con sal y derivacion criptografica.</p>
        </article>
        <article className="card">
          <Database />
          <h2>Persistencia SQL</h2>
          <p>Usuarios guardados en una base SQLite real.</p>
        </article>
        <article className="card">
          <RefreshCw />
          <h2>Persistencia local</h2>
          <p>La sesion y el tema se mantienen con localStorage.</p>
        </article>
      </div>
    </section>
  );
}
