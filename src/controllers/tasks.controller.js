import { send, parseBody } from "../utils.js"
import { Task } from "../models/task.model.js";
import { redis } from "../database/redis.js"
import { TTL } from "../config.js";

export async function getTasks(req, res, params){
    const cacheKey = `tasks:all`;

    try{
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Datos obtenidos de cache");
            return send(res, 200, JSON.parse(cached));
        }

        const tasks = await Task.findAll();
        await redis.set(cacheKey, JSON.stringify(tasks), { EX: TTL });
        console.log("Datos obtenidos de bd");
        return send(res, 200, tasks);
    }
    catch(error){
        return send(res, 500, { error: "Error interno al leer las salas" });  
    }
}

export async function getTaskById(req, res, params){
    const {id} = params;
    if (!id) { return send(res, 400, { error: "Mande el parámetro id en la url" }); }

    const cacheKey = `task:${id}`;

    try{
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Datos obtenidos de cache");
            return send(res, 200, JSON.parse(cached));
        }

        const task = await Task.findByPk(id);

        if(!task){ 
            return send(res, 404, {message:"La habitación solicitada no existe"});
        }
        else{
            await redis.set(cacheKey, JSON.stringify(task), { EX: TTL });
            console.log("Datos obtenidos de bd");
            return send(res, 200, task);
        }
    }
    catch(error){
        return send(res, 500, { error: "Error interno al leer las salas" });  
    }
}

export async function postTask(req, res, params) {
    const body = await parseBody(req);
    const {title} = body;
    let {description, completed} = body;

    if (!title) { return send(res, 400, { error: "Mande el parámetro 'title' en el body" }); }
    if (!description) { description = ""; }
    if (completed === undefined) { completed = false; }

    try{
        const task = await Task.create({title, description, completed});
        await redis.del("tasks:all");
        await redis.set(`task:${task.id}`, JSON.stringify(task), { EX: TTL });
        return send(res, 200, task);
    }catch(error){
        console.error(error);
        return send(res, 500, { error: "Error interno al crear la tarea"});  
    }
}

export async function updateTaskById(req, res, params) {
    const {id} = params;
    if (!id) { return send(res, 400, { error: "Mande el parámetro 'id' en la url" }); }
    
    const {title, description, completed} = await parseBody(req);
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    if (Object.keys(updates).length === 0) {
        return send(res, 400, { error: "Debe incluir al menos uno de los siguientes parámetros ['title', 'description', 'completed']" });
    }

    try{
        const task = await Task.findByPk(id);

        if(!task){ 
            return send(res, 404, {message:"La habitación solicitada no existe"});
        }
        else{
            await redis.del("tasks:all");
            await redis.set(`task:${id}`, JSON.stringify(task), { EX: TTL });
            await task.update(updates);
            return send(res, 200, task);
        }
    }
    catch(error){
        return send(res, 500, { error: "Error interno al actualizar las salas" });  
    }
}

export async function deleteTaskById(req, res, params) {
    const {id} = params;
    if (!id) { return send(res, 400, { error: "Mande el parámetro id en la url" }); }

    try{
        const task = await Task.findByPk(id);

        if(!task){ 
            return send(res, 404, {message:"La habitación solicitada no existe"});
        }
        else{
            await redis.del("tasks:all");
            await redis.del(`task:${id}`);
            const title = task.title;
            await task.destroy();
            return send(res, 200, { message: `La tarea "${title}" (ID: ${id}) ha sido borrada exitosamente.` });
        }
    }
    catch(error){
        return send(res, 500, { error: "Error interno al leer las salas" });  
    }
}
