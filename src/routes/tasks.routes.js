const BASE_PATH = "/tasks";
import { getTaskById, getTasks, postTask, updateTaskById, deleteTaskById } from "../controllers/tasks.controller.js";
import { notImplemented } from "../utils.js"

export const tasksRoutes = [
    {
        method: "GET",
        path: `${BASE_PATH}`,
        controller: getTasks,
        description: "Listar tareas"
    },
    {
        method: "GET",
        path: `${BASE_PATH}/:id`,
        controller: getTaskById,
        description: "Obtener tarea por id"
    },
    {
        method: "POST",
        path: `${BASE_PATH}`,
        controller: postTask,
        description: "Crear tarea"
    },
    {
        method: "PUT",
        path: `${BASE_PATH}/:id`,
        controller: updateTaskById,
        description: "Actualizar tarea por id",
        body: {
            title: "Título de la tarea (obligatorio)",
            description: "Descripción de la tarea (opcional)",
            completed: "Estado de la tarea, por defecto false (opcional)"
        }
    },
    {
        method: "DELETE",
        path: `${BASE_PATH}/:id`,
        controller: deleteTaskById,
        description: "Borrar tarea por id"
    }
];
