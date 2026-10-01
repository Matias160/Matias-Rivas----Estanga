import { useEffect, useMemo, useState } from "react";
import { createTask, fetchTasks, removeTask, toggleTask, type NewTask } from "./api/tasksApi";
import { Task } from "./models/Task";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { ThemeToggle } from "./components/ThemeToggle";

type Filter = "todas" | "pendientes" | "completadas";
type Theme = "light" | "dark";

const filters: Filter[] = ["todas", "pendientes", "completadas"];

export default function App() {
  // Estados principales de la aplicacion.
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("todas");
  const [theme, setTheme] = useState<Theme>("light");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    // El tema se guarda en el elemento raiz para que CSS aplique dia/noche.
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    // Al iniciar, se piden las tareas guardadas en el servidor.
    fetchTasks()
      .then(setTasks)
      .catch(() => setMessage("No se pudo conectar con el servidor."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Muestra el boton de volver arriba cuando el usuario baja en la pagina.
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 420);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleTasks = useMemo(() => {
    // Se trabaja con una copia del vector para filtrar sin modificar el original.
    const taskVector = [...tasks];

    if (filter === "pendientes") return taskVector.filter((task) => !task.isDone);
    if (filter === "completadas") return taskVector.filter((task) => task.isDone);

    return taskVector;
  }, [filter, tasks]);

  const handleCreate = async (task: NewTask) => {
    // Crea una tarea en el servidor y luego actualiza la lista en pantalla.
    setSaving(true);
    setMessage("");

    try {
      const createdTask = await createTask(task);
      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      setMessage("Tarea guardada correctamente.");
    } catch {
      setMessage("Revisa los datos ingresados o inicia el servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    // Cambia el estado completada/pendiente desde el servidor.
    setMessage("");

    try {
      const updatedTask = await toggleTask(id);
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch {
      setMessage("No se pudo actualizar la tarea.");
    }
  };

  const handleRemove = async (id: string) => {
    // Elimina una tarea ya completada y sincroniza el estado local.
    setMessage("");

    try {
      await removeTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      setMessage("Tarea eliminada.");
    } catch {
      setMessage("No se pudo eliminar la tarea.");
    }
  };

  const scrollToTop = () => {
    // Evento del boton flotante para regresar al inicio con animacion suave.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <main className="app-shell">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">To-Do List con servidor</p>
            <h1>Organiza tus tareas con una lista clara y persistente.</h1>
            <p className="subtitle">
              Las tareas se validan, se guardan en NodeJS y se muestran con filtros para trabajar mas rapido.
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
        </section>

        <TaskStats tasks={tasks} />

        <section className="workspace">
          <TaskForm onCreate={handleCreate} busy={saving} />

          <div className="toolbar">
            <div className="filter-tabs" aria-label="Filtros">
              {filters.map((item) => (
                <button
                  className={filter === item ? "active" : ""}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="status-message" role="status">
              {message}
            </p>
          </div>

          {loading ? (
            <section className="loading-box">Cargando tareas...</section>
          ) : (
            <TaskList tasks={visibleTasks} onToggle={handleToggle} onRemove={handleRemove} />
          )}
        </section>
      </main>

      <button
        className={`scroll-top ${showTopButton ? "is-visible" : ""}`}
        onClick={scrollToTop}
        type="button"
        aria-label="Volver arriba"
      >
        ↑
      </button>
    </>
  );
}
