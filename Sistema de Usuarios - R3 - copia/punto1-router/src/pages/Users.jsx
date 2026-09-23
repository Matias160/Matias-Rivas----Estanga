import { useEffect, useState } from 'react';
import { apiPost } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('Cargando usuarios...');

  useEffect(() => {
    apiPost('/users', {}, token)
      .then((data) => {
        setUsers(data.users);
        setMessage('');
      })
      .catch((error) => setMessage(error.message));
  }, [token]);

  return (
    <section className="panel">
      <h1>Usuarios registrados</h1>
      {message && <p className="status">{message}</p>}
      <div className="table">
        {users.map((item) => (
          <article className="row" key={item.id}>
            <span>{item.name}</span>
            <span>{item.email}</span>
            <strong>{item.role}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
