import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="status">Validando sesion...</p>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
