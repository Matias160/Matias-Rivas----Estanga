export type Priority = "baja" | "media" | "alta";

export interface TaskData {
  id: string;
  titulo: string;
  categoria: string;
  prioridad: Priority;
  completada: boolean;
  creadaEn: string;
}

// Clase que ordena los datos de una tarea y expone getters/setters.
export class Task {
  constructor(private data: TaskData) {}

  get id() {
    return this.data.id;
  }

  get title() {
    return this.data.titulo;
  }

  get category() {
    return this.data.categoria;
  }

  get priority() {
    return this.data.prioridad;
  }

  get createdAt() {
    return new Date(this.data.creadaEn);
  }

  get isDone() {
    return this.data.completada;
  }

  // Setter usado para cambiar el estado de completada.
  set done(value: boolean) {
    this.data.completada = value;
  }

  // Devuelve una copia simple para enviar o guardar datos.
  toJSON(): TaskData {
    return { ...this.data };
  }
}
