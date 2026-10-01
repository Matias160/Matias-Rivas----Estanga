import axios from "axios";
import { Task, type Priority, type TaskData } from "../models/Task";

export interface NewTask {
  titulo: string;
  categoria: string;
  prioridad: Priority;
}

const apiUrl = "/api/tareas";

export const fetchTasks = async () => {
  // Fetch se usa para traer la lista completa desde NodeJS.
  const response = await fetch(apiUrl);
  const data: TaskData[] = await response.json();

  if (!response.ok) {
    throw new Error("No se pudieron cargar las tareas.");
  }

  return data.map((task) => new Task(task));
};

export const createTask = async (task: NewTask) => {
  // Axios envia los datos del formulario para crear una tarea nueva.
  const response = await axios.post<TaskData>(apiUrl, task);
  return new Task(response.data);
};

export const toggleTask = async (id: string) => {
  // PATCH alterna el estado de una tarea especifica.
  const response = await axios.patch<TaskData>(apiUrl, { id });
  return new Task(response.data);
};

export const removeTask = async (id: string) => {
  // DELETE borra la tarea del archivo JSON del servidor.
  await axios.delete(apiUrl, { params: { id } });
};
