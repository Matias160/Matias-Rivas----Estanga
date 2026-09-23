import { Link, useNavigate } from 'react-router-dom';
import { UserForm } from '../components/UserForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const submit = async (values) => {
    setMessage('');
    try {
      await login(values);
      navigate('/panel');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="panel narrow">
      <h1>Ingresar</h1>
      <UserForm mode="login" defaultValues={{ email: '', password: '' }} onSubmit={submit} submitText="Entrar" />
      {message && <p className="error">{message}</p>}
      <p className="muted">
        No tenes cuenta? <Link to="/registro">Crear una</Link>
      </p>
    </section>
  );
}
