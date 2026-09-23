import { useEffect, useState } from 'react';
import { Shell } from './components/Shell.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Dashboard } from './views/Dashboard.jsx';
import { Home } from './views/Home.jsx';
import { Login } from './views/Login.jsx';
import { Profile } from './views/Profile.jsx';
import { Register } from './views/Register.jsx';
import { Users } from './views/Users.jsx';

const privateScreens = ['panel', 'usuarios', 'perfil'];

export default function App() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState('home');

  useEffect(() => {
    if (!loading && !user && privateScreens.includes(screen)) {
      setScreen('login');
    }
  }, [loading, user, screen]);

  const views = {
    home: <Home setScreen={setScreen} />,
    login: <Login setScreen={setScreen} />,
    registro: <Register setScreen={setScreen} />,
    panel: <Dashboard />,
    usuarios: <Users />,
    perfil: <Profile />
  };

  return (
    <Shell screen={screen} setScreen={setScreen}>
      {loading ? <p className="status">Validando sesion...</p> : views[screen]}
    </Shell>
  );
}
