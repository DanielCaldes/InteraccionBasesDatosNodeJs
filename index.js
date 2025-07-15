import { PORT } from "./src/config.js";
import { createServer } from "./server.js";

async function start() {
  try {
    const server = await createServer();
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
      console.log(`Presiona ctrl + C para salir`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
}

start();