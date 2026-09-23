import { useState } from 'react';
import { UserForm } from '../components/UserForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Register({ setScreen }) {
  const { register: createUser } = useAuth();
  const [message, setMessage] = useState('');

  const submit = async (values) => {
    setMessage('');
    try {
      await createUser(values);
      setScreen('panel');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="panel narrow">
      <h1>Crear cuenta</h1>
      <UserForm
        mode="register"
        defaultValues={{ name: '', email: '', password: '' }}
        onSubmit={submit}
        submitText="Registrarme"
      />
      {message && <p className="error">{message}</p>}
    </section>
  );
}
