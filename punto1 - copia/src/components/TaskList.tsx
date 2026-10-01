import { useState } from "react";
import type { Task } from "../models/Task";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

const priorityLabels = {
  baja: "Baja",
  media: "Media",
  alta: "Alta"
};

export function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    await onRemove(taskToDelete.id);
    setTaskToDelete(null);
  };

  if (tasks.length === 0) {
    // Mensaje para cuando el filtro elegido no tiene resultados.
    return (
      <section className="empty-state">
        <h2>No hay tareas con este filtro</h2>
        <p>Agrega una nueva o cambia la vista para revisar el resto.</p>
      </section>
    );
  }

  return (
    <section className="task-list" aria-label="Listado de tareas">
      {tasks.map((task) => (
        // Cada tarjeta representa una instancia de la clase Task.
        <article className={`task-card ${task.isDone ? "is-done" : ""}`} key={task.id}>
          <button
            className="check-button"
            onClick={() => onToggle(task.id)}
            aria-label={task.isDone ? "Marcar como pendiente" : "Marcar como completa"}
          >
            {task.isDone ? "✓" : ""}
          </button>

          <div className="task-content">
            <div>
              <h3>{task.title}</h3>
              <p>{task.category}</p>
            </div>
            <span className={`priority priority-${task.priority}`}>
              {priorityLabels[task.priority]}
            </span>
          </div>

          <button
            className="delete-button"
            disabled={!task.isDone}
            onClick={() => setTaskToDelete(task)}
            title={task.isDone ? "Eliminar tarea" : "Completa la tarea antes de eliminarla"}
          >
            {task.isDone ? "Eliminar" : "Pendiente"}
          </button>
        </article>
      ))}

      {taskToDelete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <section className="confirm-modal">
            <div className="modal-header">
              <span className="modal-icon" aria-hidden="true">!</span>
              <div>
                <h2 id="delete-title">Eliminar tarea</h2>
                <p>Esta accion no se puede deshacer.</p>
              </div>
            </div>

            <div className="delete-summary">
              <span>Tarea seleccionada</span>
              <strong>{taskToDelete.title}</strong>
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setTaskToDelete(null)} type="button">
                Cancelar
              </button>
              <button className="confirm-button" onClick={confirmDelete} type="button">
                Si, eliminar
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
