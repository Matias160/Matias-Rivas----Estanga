import type { Task } from "../models/Task";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  // Calculos derivados del vector de tareas.
  const total = tasks.length;
  const completed = tasks.filter((task) => task.isDone).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="stats-panel" aria-label="Resumen de tareas">
      <div>
        <span>Total</span>
        <strong>{total}</strong>
      </div>
      <div>
        <span>Pendientes</span>
        <strong>{pending}</strong>
      </div>
      <div>
        <span>Completadas</span>
        <strong>{completed}</strong>
      </div>
      <div className="progress-box">
        <span>Avance</span>
        <strong>{progress}%</strong>
        <div className="progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
