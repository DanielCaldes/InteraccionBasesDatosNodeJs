# Interacción con Bases de Datos en Node.js

Este proyecto es parte del módulo de **Desarrollo Avanzado de Backend y APIs** del Máster en Desarrollo Web.
Se ha desarrollado una aplicación sencilla de gestión de **tareas (to-do app)** utilizando **Node.js**, almacenamiento en **SQLite con Sequelize**, y sistema de **cacheo con Redis**.
El enrutado y servidor HTTP están implementados de forma manual, sin frameworks.

## Características

- **Servidor HTTP** implementado manualmente con el módulo `http` de Node.js.
- **Base de datos SQLite** gestionada con **Sequelize** como ORM.
- **Modelo Task** con los campos: `id`, `title`, `description`, `completed`.
- **Sistema de rutas modular** reutilizado del proyecto anterior:
  - Rutas dinámicas gestionadas con expresiones regulares.
- **Controladores separados** para las operaciones CRUD sobre tareas.
- **Cache con Redis**:
  - Cacheo de respuestas GET (`tasks:all` y `task:id`).
  - Invalidación automática de caché tras POST, PUT y DELETE.
- **Ayuda integrada**: Ruta `/help` con descripciones de los endpoints disponibles.

## Requisitos

- Node.js  
- SQLite  
- Redis (Docker recomendado en Windows) 

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/DanielCaldes/InteraccionBasesDatosNodeJs.git
   cd InteraccionBasesDatosNodeJs
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Asegúrate de que Redis esté activo. Si estás en Windows, puedes levantar el contenedor:

   ```bash
   docker run -p 6379:6379 redis
   ```

4. Ejecuta el servidor:

   ```bash
   node .
   ```

5. El servidor estará disponible en:

   ```
   http://localhost:3000
   ```

## Estructura del proyecto

```
InteraccionBasesDatosNodeJs/
├── config.js
├── controllers/
│   └── task.controller.js
├── database/
│   ├── database.js
│   ├── redis.js
│   └── models/
│       └── task.model.js
├── routes/
│   ├── task.routes.js
│   └── help.routes.js
├── utils.js
├── index.js
├── router.js
└── server.js
```

## Endpoints principales

### Tareas

#### 1. Listar todas las tareas

- **Método**: GET  
  ```url
  /api/tasks
  ```
- **Descripción**: Devuelve una lista de todas las tareas.
- **Cache**: Usa Redis (`tasks:all`).
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "title": "Estudiar Node.js",
      "description": "Repasar Sequelize y Redis",
      "completed": false,
      "createdAt": "2025-07-15T13:04:29.961Z",
      "updatedAt": "2025-07-15T13:04:29.961Z"
    }
  ]
  ```

#### 2. Obtener una tarea por ID

- **Método**: GET  
  ```url
  /api/tasks/:id
  ```
- **Descripción**: Devuelve la información de una tarea específica por su ID.
- **Cache**: Usa Redis (`task:1`).
- **Respuesta**:
  ```json
  {
    "id": 1,
    "title": "Estudiar Node.js",
    "description": "Repasar Sequelize y Redis",
    "completed": false,
    "createdAt": "2025-07-15T13:04:29.961Z",
    "updatedAt": "2025-07-15T13:04:29.961Z"
  }
  ```

#### 3. Crear una nueva tarea

- **Método**: POST  
  ```url
  /api/tasks
  ```
- **Descripción**: Crea una nueva tarea.
- **Cuerpo de la solicitud**:
  ```json
  {
    "title": "Nueva tarea",
    "description": "Descripción opcional",
    "completed": false
  }
  ```
- **Acciones adicionales**: Invalida cache `tasks:all` y añade tarea a `task:id`.
- **Respuesta**:
  ```json
  {
    "id": 2,
    "title": "Nueva tarea",
    "description": "Descripción opcional",
    "completed": false,
    "updatedAt": "2025-07-18T18:26:33.219Z",
    "createdAt": "2025-07-18T18:26:33.219Z"
  }
  ```

#### 4. Actualizar una tarea

- **Método**: PUT  
  ```url
  /api/tasks/:id
  ```
- **Descripción**: Modifica una tarea existente.
- **Acciones adicionales**: Invalida `tasks:all` y actualiza `task:id`.
- **Cuerpo de la solicitud**:
  ```json
  {
    "title": "Tarea actualizada",
    "description": "Descripción actualizada",
    "completed": true
  }
  ```
- **Respuesta**:
  ```json
  {
    "id": 2,
    "title": "Nueva tarea cambiada",
    "description": "Actualizada",
    "completed": false,
    "createdAt": "2025-07-18T18:26:33.219Z",
    "updatedAt": "2025-07-18T18:27:15.576Z"
  }
  ```

#### 5. Borrar una tarea

- **Método**: DELETE  
  ```url
  /api/tasks/:id
  ```
- **Descripción**: Elimina una tarea existente por ID.
- **Acciones adicionales**: Invalida `tasks:all` y elimina `task:id`.
- **Respuesta**:
  ```json
  {
    "message": "Tarea 2 eliminada correctamente"
  }
  ```

---

### Ayuda (`/help`)

#### 1. Listar secciones de ayuda

- **Método**: GET  
  ```url
  /api/help
  ```
- **Descripción**: Lista las secciones disponibles para ayuda.
- **Respuesta**:
  ```json
  [
    {
      "section": "tasks",
      "description": "Rutas relacionadas con tareas"
    }
  ]
  ```

#### 2. Obtener ayuda de una sección específica

- **Método**: GET  
  ```url
  /api/help/:section
  ```
- **Descripción**: Devuelve información detallada sobre los endpoints de una sección.
- **Respuesta**:
  ```json
  [
    {
      "method": "GET",
      "path": "/api/tasks",
      "route": "Listar tareas"
    },
    {
      "method": "POST",
      "path": "/api/tasks",
      "route": "Crear nueva tarea"
    }
  ]
  ```

- **Error**:
  ```json
  {
    "error": "Sección no encontrada"
  }
  ```

## Redis y Cache

El sistema implementa cacheo inteligente con Redis:

- **GET /tasks** → cache en `tasks:all`
- **GET /tasks/:id** → cache en `task:id`
- **POST, PUT, DELETE** → invalidan `tasks:all` y actualizan o eliminan las claves `task:id` correspondientes.

Redis debe estar levantado previamente, especialmente si usas Docker en Windows.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más información.
