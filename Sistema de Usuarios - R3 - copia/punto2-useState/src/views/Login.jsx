import { useState } from 'react';
import { UserForm } from '../components/UserForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Login({ setScreen }) {
  const { login } = useAuth();
  const [message, setMessage] = useState('');

  const submit = async (values) => {
    setMessage('');
    try {
      await login(values);
      setScreen('panel');
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
        No tenes cuenta? <button className="text-button" onClick={() => setScreen('registro')}>Crear una</button>
      </p>
    </section>
  );
}
