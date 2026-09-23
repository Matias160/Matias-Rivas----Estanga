import { LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Shell({ screen, setScreen, children }) {
  const { user, theme, toggleTheme, logout } = useAuth();

  const closeSession = () => {
    logout();
    setScreen('home');
  };

  return (
    <div className="shell">
      <header className="topbar">
        <button className="brand as-button" onClick={() => setScreen('home')}>
          Usuarios SQL
        </button>
        <nav>
          {user ? (
            <>
              <button className={screen === 'panel' ? 'active' : ''} onClick={() => setScreen('panel')}>
                Panel
              </button>
              <button className={screen === 'usuarios' ? 'active' : ''} onClick={() => setScreen('usuarios')}>
                Usuarios
              </button>
              <button className={screen === 'perfil' ? 'active' : ''} onClick={() => setScreen('perfil')}>
                Perfil
              </button>
              <button className="icon-button" onClick={closeSession} title="Cerrar sesion">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <button className={screen === 'login' ? 'active' : ''} onClick={() => setScreen('login')}>
                Ingresar
              </button>
              <button className={screen === 'registro' ? 'active' : ''} onClick={() => setScreen('registro')}>
                Registro
              </button>
            </>
          )}
          <button className="icon-button" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
