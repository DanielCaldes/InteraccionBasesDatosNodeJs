import path from "node:path"

export const PORT = 3000;
export const REDIS_PORT = 6379;

export const DATABASE_DIR = path.resolve("./data/");
export const DATABASE_FILE = path.join(DATABASE_DIR, "database.sqlite");