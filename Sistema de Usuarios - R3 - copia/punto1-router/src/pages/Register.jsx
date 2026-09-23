import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components/UserForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Register() {
  const { register: createUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const submit = async (values) => {
    setMessage('');
    try {
      await createUser(values);
      navigate('/panel');
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
