import { useState, type FormEvent } from "react";
import type { NewTask } from "../api/tasksApi";
import type { Priority } from "../models/Task";

interface TaskFormProps {
  onCreate: (task: NewTask) => Promise<void>;
  busy: boolean;
}

const initialForm = {
  titulo: "",
  categoria: "",
  prioridad: "media" as Priority
};

export function TaskForm({ onCreate, busy }: TaskFormProps) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Evita que la pagina se recargue y permite validar antes de enviar.
    event.preventDefault();
    setError("");

    // Validaciones simples sin alertas ni pop-ups.
    if (form.titulo.trim().length < 3) {
      setError("Escribi una tarea de al menos 3 caracteres.");
      return;
    }

    if (form.categoria.trim().length < 2) {
      setError("Agrega una categoria para ordenar mejor la lista.");
      return;
    }

    // Si los datos son validos, se crea la tarea en el servidor.
    await onCreate({
      titulo: form.titulo.trim(),
      categoria: form.categoria.trim(),
      prioridad: form.prioridad
    });
    setForm(initialForm);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Tarea</span>
          <input
            value={form.titulo}
            onChange={(event) => setForm({ ...form, titulo: event.target.value })}
            placeholder="Ej: estudiar arrays"
            maxLength={70}
          />
        </label>

        <label>
          <span>Categoria</span>
          <input
            value={form.categoria}
            onChange={(event) => setForm({ ...form, categoria: event.target.value })}
            placeholder="Estudio, casa..."
            maxLength={30}
          />
        </label>

        <label>
          <span>Prioridad</span>
          <select
            value={form.prioridad}
            onChange={(event) => setForm({ ...form, prioridad: event.target.value as Priority })}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <p className="form-error" role="status">{error}</p>
        <button disabled={busy} type="submit">
          {busy ? "Guardando..." : "Agregar tarea"}
        </button>
      </div>
    </form>
  );
}
