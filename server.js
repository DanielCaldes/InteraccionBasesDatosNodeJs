import http from "node:http";
import { router } from "./src/router.js";
import { sequelize } from "./src/database/database.js";

export async function createServer() {
  try {
    
    await sequelize.sync();
    console.log("Base de datos sincronizada.");

    const server = http.createServer(async (req, res) => {
      try {
        await router(req, res);
      } catch (err) {
        console.error("Error en la petición:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error interno" }));
      }
    });

    return server;
  } catch (error) {
    console.error("Error creando el servidor:", error);
    throw error;
  }
}
