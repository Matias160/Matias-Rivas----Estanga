import { Link } from 'react-router-dom';

export function Home() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">React Router + API SQL</p>
        <h1>Sistema de usuarios con sesion protegida</h1>
        <p>
          Registro, inicio de sesion, perfil editable, persistencia local y base de datos SQLite
          mediante un backend propio.
        </p>
        <div className="actions">
          <Link className="primary link-button" to="/registro">
            Crear cuenta
          </Link>
          <Link className="secondary link-button" to="/login">
            Ingresar
          </Link>
        </div>
      </div>
    </section>
  );
}
