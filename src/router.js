import { send } from "./utils.js"

import { helpRoutes } from "./routes/help.router.js";
import { tasksRoutes } from "./routes/tasks.routes.js";

const routes = [...helpRoutes,...tasksRoutes];

function pathToRegex(path) {
    const paramNames = [];
    const regexPath = path.replace(/:([^\/]+)/g, (_,key) =>{
        paramNames.push(key);
        return "([^\\/]+)";
    });
    const regex = new RegExp(`^${regexPath}$`);
    return { regex, paramNames };
}

function getParams(match, paramNames) {
  const params = {};
  paramNames.forEach((name, i) => {
    params[name] = match[i + 1];
  });
  return params;
}

const preparedRoutes = routes.map(route => {
  const { regex, paramNames } = pathToRegex(route.path);
  return { ...route, regex, paramNames };
});

const routesByMethod = preparedRoutes.reduce((acc, route) => {
  if (!acc[route.method]) acc[route.method] = [];
  acc[route.method].push(route);
  return acc;
}, {});

export async function router(req, res){
    const {method, url} = req;
    
    const methodRoutes = routesByMethod[method] || [];

    for (const route of methodRoutes) {
        const match = url.match(route.regex);
        if (match) {
        const params = getParams(match, route.paramNames);
        return route.controller(req, res, params);
        }
    }

    send(res, 404, {error : "Endpoint not found"});
}