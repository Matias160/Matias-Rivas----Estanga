import { FormEvent, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState('');

  // Cuenta pendientes desde el arreglo del estado.
  const pending = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanText = taskText.trim();

    // Evita agregar tareas vacias.
    if (!cleanText) {
      setError('Escribi una tarea antes de agregarla.');
      return;
    }

    setTasks((current) => [...current, { id: Date.now(), text: cleanText, completed: false }]);
    setTaskText('');
    setError('');
  }

  function toggleTask(id: number) {
    // Marca o desmarca una tarea puntual.
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  function deleteTask(id: number) {
    // Borra una tarea usando su id.
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <section className="glass task-card">
      <span className="tag">Punto 4</span>
      <h1>Lista de tareas</h1>
      <p>{pending} tareas pendientes</p>

      <form onSubmit={addTask} className="task-form">
        <label htmlFor="task">Nueva tarea</label>
        <div>
          <input id="task" value={taskText} onChange={(event) => setTaskText(event.target.value)} />
          <button>Agregar</button>
        </div>
        {error && <strong className="error">{error}</strong>}
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <label>
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
              <span>{task.text}</span>
            </label>
            <button className="delete-button" onClick={() => deleteTask(task.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // Alterna el tema global.
  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <main className="app" data-theme={theme}>
      <div className="page-shell">
        <button className="primary-button" onClick={toggleTheme}>
          {theme === 'light' ? 'Modo noche' : 'Modo dia'}
        </button>
        <TaskList />
      </div>
    </main>
  );
}
