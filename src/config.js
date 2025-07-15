import path from "node:path"

export const PORT = 3000;
export const REDIS_PORT = 6379;
export const TTL = 60 * 30; // 60 segundos(1 minuto) 30 veces -> 30 minutos

export const DATABASE_DIR = path.resolve("./data/");
export const DATABASE_FILE = path.join(DATABASE_DIR, "database.sqlite");