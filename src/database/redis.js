import { createClient } from "redis";
import { REDIS_PORT } from "../config.js";

export const redis = createClient({
  url: `redis://localhost:${REDIS_PORT}`
});

redis.on("error", (err) => console.error("Redis error:", err));

await redis.connect();