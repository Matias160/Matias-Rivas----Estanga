import { useState } from 'react';
import { UserForm } from '../components/UserForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [message, setMessage] = useState('');

  const submit = async (values) => {
    setMessage('');
    try {
      await updateProfile(values);
      setMessage('Perfil actualizado correctamente.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="panel narrow">
      <h1>Mi perfil</h1>
      <UserForm mode="profile" defaultValues={user} onSubmit={submit} submitText="Guardar cambios" />
      {message && <p className="status">{message}</p>}
    </section>
  );
}
