# Sistema Médico - Gestión de Pacientes

Un sistema completo de gestión de pacientes con frontend React y backend Node.js/Express.

## Requisitos

- Node.js (v18 o superior)
- npm o yarn
- Docker y Docker Compose (opcional)

## Instalación y Ejecución

### Opción 1: Ejecución Local (Desarrollo)

#### 1. Instalar Backend

```bash
cd backend
npm install
npm start
```

El backend se ejecutará en: `http://localhost:5000`

#### 2. Instalar Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecutará en: `http://localhost:5173`

### Opción 2: Usando Docker Compose

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

- Backend disponible en: `http://localhost:5000`
- Frontend disponible en: `http://localhost:5173`

## Funcionalidades

### Backend (Express)

**Endpoints disponibles:**

- `GET /api/pacientes` - Obtener lista de todos los pacientes
- `POST /api/pacientes` - Crear nuevo paciente
  ```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "fechaNacimiento": "1990-01-15"
  }
  ```
- `GET /api/pacientes/:id` - Obtener paciente por ID
- `PUT /api/pacientes/:id` - Actualizar paciente
- `DELETE /api/pacientes/:id` - Eliminar paciente
- `GET /health` - Verificar estado del servidor

### Frontend (React + Vite)

**Características:**

- ✅ Registro de nuevos pacientes con formulario validado
- ✅ Visualización de lista de pacientes en tabla
- ✅ Eliminación de pacientes
- ✅ Interfaz responsiva y moderna
- ✅ Gestión de errores y estados de carga

## Estructura del Proyecto

```
sistemamedico/
├── backend/
│   ├── package.json
│   ├── server.js          # Servidor Express principal
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Componente principal con navegación
│   │   ├── pages/
│   │   │   └── Pacientes.jsx  # Componente de gestión de pacientes
│   │   ├── styles/
│   │   │   └── Pacientes.css
│   │   └── ...
│   ├── package.json
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml     # Configuración de Docker
```

## Notas Técnicas

- **Base de datos**: Por ahora usa un array en memoria. Para producción, conectar a una BD real (PostgreSQL, MongoDB, etc.)
- **CORS**: Configurado para aceptar solicitudes desde `http://localhost:5173`
- **API URL**: `http://localhost:5000/api`

## Pasos Siguientes

Para mejorar el sistema:

1. Conectar a una base de datos real (PostgreSQL, MongoDB)
2. Agregar autenticación y autorización
3. Validación más robusta de datos
4. Tests automatizados
5. Despliegue a producción

## Troubleshooting

**Error: "Cannot connect to backend"**
- Asegúrate de que el backend está corriendo en `http://localhost:5000`
- Verifica que CORS está habilitado

**Error: "Port already in use"**
- Cambia el puerto en `.env` o usa `lsof -i :5000` para ver qué proceso usa el puerto

## Licencia

MIT
