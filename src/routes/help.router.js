const BASE_PATH = "/help";

import { send } from "../utils.js";

import { tasksRoutes } from "./tasks.routes.js";

const routesBySection = {
  tasks: tasksRoutes,
};

export const helpRoutes = [
    {
        method: "GET",
        path: BASE_PATH,
        controller: (req, res) => {
            const sections = Object.keys(routesBySection).map(section => ({
            section,
            description: `Rutas relacionadas con ${section}`
            }));
            return send(res, 200, sections);
        },
        description: "Lista de secciones de ayuda"
    },
    {
        method: "GET",
        path: `${BASE_PATH}/:section`,
        controller: (req, res, params) => {
            const { section } = params;
            const routes = routesBySection[section];
            if (!routes) {
                return send(res, 404, { error: "Sección no encontrada" });
            }
            const help = routes.map(({ method, path, description, body }) => {
            const routeHelp = { method, path, route: description };
            if (body) routeHelp.body = body;
                return routeHelp;
            });
            return send(res, 200, help);
        },
        description: "Ayuda específica por sección"
    }
];