import { Link, NavLink, Outlet } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout() {
  const { user, theme, toggleTheme, logout } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" to="/">
          Usuarios SQL
        </Link>
        <nav>
          {user ? (
            <>
              <NavLink to="/panel">Panel</NavLink>
              <NavLink to="/usuarios">Usuarios</NavLink>
              <NavLink to="/perfil">Perfil</NavLink>
              <button className="icon-button" onClick={logout} title="Cerrar sesion">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Ingresar</NavLink>
              <NavLink to="/registro">Registro</NavLink>
            </>
          )}
          <button className="icon-button" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
