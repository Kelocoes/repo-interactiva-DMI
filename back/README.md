# Backend - NestJS + TypeORM + SQLite

Backend desarrollado con **NestJS**, **TypeScript**, **TypeORM** y **SQLite** como base de datos embebida (sin necesidad de instalar servicios de bases de datos externos).

---

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- npm (incluido con Node.js)

---

## 📦 Instalación de Dependencias

Desde la raíz del repositorio o dentro de la carpeta `back`:

```bash
cd back
npm install
```

---

## 🛠️ Scripts de Ejecución

### Modo Desarrollo (con recarga automática / watch mode)
```bash
npm run start:dev
```

### Compilar Proyecto (TypeScript a JavaScript)
```bash
npm run build
```

### Modo Producción
```bash
npm run start:prod
```

### Ejecutar Pruebas
```bash
npm run test
```

El servidor iniciará por defecto en `http://localhost:3000`.

---

## 🗄️ Base de Datos Embebida (SQLite)

- **Archivo de BD:** `database.sqlite` (generado automáticamente en el directorio `back/` al iniciar el servidor).
- **ORM:** TypeORM configurado en `src/app.module.ts`:
  - `type: 'sqlite'`
  - `database: 'database.sqlite'`
  - `autoLoadEntities: true` (carga automáticamente todas las entidades registradas)
  - `synchronize: true` (sincroniza las tablas del esquema en tiempo de ejecución de desarrollo)

---

## 🌐 Configuración CORS

CORS se encuentra habilitado en `src/main.ts` (`app.enableCors()`) para permitir el consumo de la API desde cualquier aplicación Frontend (React, Vue, Angular, Svelte, vanilla HTML/JS, etc.).

---

## 📡 Endpoints de la API REST

### 1. Endpoint Base

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Retorna un saludo de verificación (`Hello World!`) |

---

### 2. Módulo de Tareas (`/tasks`)

| Método | Endpoint | Descripción | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `POST` | `/tasks` | Crear una nueva tarea | `{"title": "Título", "description": "Detalle (opcional)", "completed": false}` |
| `GET` | `/tasks` | Listar todas las tareas (ordenadas por fecha de creación descendente) | - |
| `GET` | `/tasks/:id` | Obtener el detalle de una tarea por su ID | - |
| `PATCH` | `/tasks/:id` | Actualizar campos de una tarea | `{"title": "Nuevo", "description": "...", "completed": true}` |
| `DELETE` | `/tasks/:id` | Eliminar una tarea por ID | - |

---

### 💡 Ejemplos de Peticiones con `cURL`

#### Crear una tarea:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Aprender NestJS\", \"description\": \"Configurar backend con SQLite y TypeORM\"}"
```

#### Listar todas las tareas:
```bash
curl -X GET http://localhost:3000/tasks
```

#### Obtener una tarea por ID:
```bash
curl -X GET http://localhost:3000/tasks/1
```

#### Actualizar una tarea (marcar completada):
```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"completed\": true}"
```

#### Eliminar una tarea:
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

## 📁 Estructura del Proyecto

```
back/
├── src/
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts   # DTO para creación con validaciones
│   │   │   └── update-task.dto.ts   # DTO para actualización
│   │   ├── entities/
│   │   │   └── task.entity.ts       # Entidad TypeORM para la tabla SQLite 'tasks'
│   │   ├── tasks.controller.ts      # Controlador REST para /tasks
│   │   ├── tasks.module.ts          # Módulo encapsulado de Tasks
│   │   └── tasks.service.ts         # Lógica de negocio y acceso a datos
│   ├── app.controller.ts            # Controlador raíz
│   ├── app.module.ts                # Módulo principal con TypeOrmModule
│   ├── app.service.ts               # Servicio raíz
│   └── main.ts                      # Bootstrap de NestJS con CORS y ValidationPipe
├── .gitignore                       # Ignora node_modules, dist y database.sqlite
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.json
```
