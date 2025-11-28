# 🛫 SKYTRACK - Sistema de Búsqueda de Vuelos

Sistema integral de búsqueda y reserva de vuelos desarrollado por **Squad 3** como parte del Trabajo Práctico Obligatorio de UADE. La aplicación permite a los usuarios buscar vuelos, gestionar reservas y recibir recomendaciones personalizadas a través de una arquitectura moderna de microservicios.

---

## 📋 Índice

- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Comandos Disponibles](#-comandos-disponibles)
- [API y Endpoints](#-api-y-endpoints)
- [Base de Datos](#-base-de-datos)
- [Sistema de Eventos](#-sistema-de-eventos)
- [Infraestructura](#-infraestructura)
- [Testing](#-testing)
- [Documentación Adicional](#-documentación-adicional)

---

## ✨ Características Principales

- **Búsqueda Avanzada de Vuelos**: Búsqueda con múltiples criterios (origen, destino, fechas, rangos de flexibilidad)
- **Autenticación y Autorización**: Sistema completo de registro, login y gestión de usuarios con JWT
- **Gestión de Reservas**: Creación de intenciones de reserva y seguimiento del estado
- **Sistema de Métricas**: Registro y análisis de búsquedas para mejorar la experiencia del usuario
- **Integración con Microservicios**: Comunicación con otros servicios mediante Kafka y API REST
- **Interfaz Responsive**: Diseño adaptable para dispositivos móviles y de escritorio
- **Historial de Búsquedas**: Los usuarios pueden consultar sus búsquedas anteriores

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura de **microservicios** con los siguientes componentes:

```
┌─────────────────┐
│   Frontend      │ React + Vite + Material-UI
│   (Port 5173)   │
└────────┬────────┘
         │ HTTPS/REST
         ▼
┌─────────────────┐
│   Backend API   │ Node.js + Express + TypeScript
│   (Port 8080)   │
└────┬────────┬───┘
     │        │
     │        └─────────┐
     ▼                  ▼
┌──────────┐      ┌──────────────┐
│PostgreSQL│      │    Kafka     │ Sistema de Mensajería
│ (Prisma) │      │   Eventos    │
└──────────┘      └──────────────┘
                       │
                       ▼
              ┌────────────────┐
              │ Otros Servicios│
              │ - Vuelos       │
              │ - Reservas     │
              │ - Usuarios     │
              └────────────────┘
```

### Flujo de Datos

1. **Cliente → Frontend**: El usuario interactúa con la interfaz React
2. **Frontend → Backend**: Peticiones REST API para búsquedas y operaciones
3. **Backend → Base de Datos**: Consultas a PostgreSQL mediante Prisma ORM
4. **Backend → Kafka**: Publicación de eventos (búsquedas, reservas, métricas)
5. **Kafka → Backend**: Consumo de eventos de otros microservicios (vuelos, usuarios, reservas)

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React**: Librería para interfaces de usuario
- **Vite**: Build tool y dev server ultrarrápido
- **Material-UI**: Framework de componentes UI
- **React Router**: Navegación y enrutamiento
- **Axios**: Cliente HTTP para consumir APIs
- **Day.js**: Manipulación de fechas
- **@mui/x-date-pickers**: Componentes de selección de fechas
- **Jest + Testing Library**: Testing unitario y de integración

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework REST minimalista
- **TypeScript**: Superset de JavaScript con tipado estático
- **Prisma**: ORM moderno para PostgreSQL
- **Zod**: Validación de esquemas y tipos
- **JWT (jsonwebtoken)**: Autenticación basada en tokens
- **KafkaJS**: Cliente de Apache Kafka para Node.js
- **Jest + Supertest**: Testing de APIs
- **ESLint + Prettier**: Linting y formateo de código

### Base de Datos
- **PostgreSQL**: Base de datos relacional principal
- **Prisma ORM**: Gestión de esquemas y migraciones

### DevOps e Infraestructura
- **Terraform**: Infrastructure as Code (IaC)
- **Google Cloud Platform (GCP)**: Hosting y servicios cloud
  - Cloud Run: Despliegue de contenedores
  - Artifact Registry: Registro de imágenes Docker
- **Docker**: Containerización de aplicaciones
- **Nginx**: Servidor web para el frontend en producción
- **pnpm**: Gestor de paquetes eficiente

### Mensajería y Eventos
- **Apache Kafka**: Sistema de streaming de eventos distribuido
- **KafkaJS**: Cliente Kafka para integración con microservicios

---

## 📁 Estructura del Proyecto

```
squad-3-busqueda-de-vuelos/
│
├── front/                      # Aplicación Frontend
│   ├── src/
│   │   ├── components/        # Componentes React reutilizables
│   │   ├── contexts/          # Context API para estado global
│   │   ├── services/          # Servicios de API
│   │   ├── config/            # Configuración de la app
│   │   ├── App.jsx            # Componente raíz
│   │   ├── main.jsx           # Punto de entrada
│   │   └── theme.js           # Tema de Material-UI
│   ├── public/                # Archivos estáticos
│   ├── Dockerfile             # Imagen Docker para producción
│   ├── nginx.conf             # Configuración de Nginx
│   ├── vite.config.js         # Configuración de Vite
│   └── package.json
│
├── back/                       # Aplicación Backend
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/            # Definición de rutas
│   │   ├── middlewares/       # Middlewares de Express
│   │   ├── schemas/           # Esquemas de validación Zod
│   │   ├── kafka/             # Integración con Kafka
│   │   ├── prisma/            # Configuración de Prisma
│   │   ├── utils/             # Utilidades
│   │   ├── app.ts             # Configuración de Express
│   │   └── server.ts          # Punto de entrada del servidor
│   ├── prisma/
│   │   └── schema.prisma      # Esquema de base de datos
│   ├── coverage/              # Reportes de cobertura de tests
│   ├── Dockerfile             # Imagen Docker para producción
│   ├── swagger.yaml           # Documentación OpenAPI
│   ├── jest.config.js         # Configuración de Jest
│   ├── tsconfig.json          # Configuración de TypeScript
│   └── package.json
│
├── infra/                      # Infraestructura como código
│   ├── dev/                   # Ambiente de desarrollo
│   │   ├── main.tf            # Configuración principal
│   │   ├── backend.tf         # Recursos del backend
│   │   ├── frontend.tf        # Recursos del frontend
│   │   └── artifacts.tf       # Artifact Registry
│   └── prod/                  # Ambiente de producción
│       └── (misma estructura)
│
├── package.json               # Workspace principal (npm)
├── pnpm-lock.yaml             # Lockfile de pnpm
└── README.md                  # Este archivo
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js**: >= 18.0.0
- **npm** o **pnpm**: >= 8.0.0
- **PostgreSQL**: >= 14
- **Docker** (opcional, para contenedores)

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/matpurita/squad-3-busqueda-de-vuelos.git
   cd squad-3-busqueda-de-vuelos
   ```

2. **Instalar dependencias**
   ```bash
   # Con npm workspaces
   npm run install:all
   
   # O manualmente en cada carpeta
   cd front && pnpm install
   cd ../back && pnpm install
   ```

3. **Configurar variables de entorno**

   **Backend** (`back/.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/flightsearch"
   DIRECT_URL="postgresql://user:password@localhost:5432/flightsearch"
   JWT_SECRET="your-secret-key"
   KAFKA_BROKER="localhost:9092"
   CORE_URL="http://core-service-url"
   PORT=8080
   ```

   **Frontend** (`front/.env`):
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. **Configurar la base de datos**
   ```bash
   cd back
   pnpm prisma:generate
   pnpm prisma:push
   ```

5. **Ejecutar en modo desarrollo**
   ```bash
   # Desde la raíz (ejecuta frontend y backend)
   npm run dev
   
   # O individualmente
   cd front && pnpm dev  # Frontend en http://localhost:5173
   cd back && pnpm dev   # Backend en http://localhost:8080
   ```

---

## 📜 Comandos Disponibles

### Workspace Principal (raíz)

```bash
npm run install:all    # Instalar todas las dependencias
npm run dev           # Ejecutar frontend y backend en paralelo
npm run start         # Ejecutar en modo producción
npm run test          # Ejecutar tests con cobertura
```

### Frontend (`front/`)

```bash
pnpm dev              # Servidor de desarrollo (puerto 5173)
pnpm build            # Build de producción
pnpm preview          # Preview del build
pnpm lint             # Ejecutar ESLint
pnpm test             # Tests unitarios
pnpm test:cov         # Tests con reporte de cobertura
```

### Backend (`back/`)

```bash
pnpm dev              # Servidor con hot-reload
pnpm start            # Servidor de producción
pnpm build            # Compilar TypeScript
pnpm lint             # Ejecutar ESLint
pnpm test             # Tests unitarios
pnpm test:cov         # Tests con cobertura
pnpm prisma:push      # Sincronizar esquema con DB
pnpm prisma:generate  # Generar cliente de Prisma
pnpm prisma:format    # Formatear schema.prisma
pnpm prisma:mock      # Cargar datos de prueba
```

---

## 🔌 API y Endpoints

La API REST está documentada en formato OpenAPI 3.0 (ver `back/swagger.yaml`).

### Autenticación

| Método | Endpoint         | Descripción               | Auth |
|--------|------------------|---------------------------|------|
| POST   | `/auth/register` | Registrar nuevo usuario   | No   |
| POST   | `/auth/login`    | Iniciar sesión            | No   |
| GET    | `/auth/user`     | Obtener datos del usuario | Sí   |

### Búsqueda de Vuelos

| Método | Endpoint              | Descripción                | Auth |
|--------|-----------------------|----------------------------|------|
| GET    | `/search`             | Buscar vuelos              | No   |
| GET    | `/search/suggestions` | Obtener sugerencias        | No   |
| GET    | `/search/history`     | Historial de búsquedas     | Sí   |
| POST   | `/search/intent`      | Crear intención de reserva | Sí   |

### Aeropuertos

| Método | Endpoint        | Descripción                  | Auth |
|--------|-----------------|------------------------------|------|
| GET    | `/airport`      | Listar todos los aeropuertos | No   |
| GET    | `/airport/AITA` | Obtener códigos IATA         | No   |

### Métricas

| Método | Endpoint          | Descripción                   | Auth |
|--------|-------------------|-------------------------------|------|
| POST   | `/metrics/search` | Registrar métrica de búsqueda | No   |

### Ejemplo de Búsqueda

```bash
GET /search?origin=EZE&destination=MIA&departureDate=2025-12-15&returnDate=2025-12-20&passengers=2&currency=USD&limit=10&offset=0
```

**Respuesta:**
```json
{
  "results": [
    {
      "departure": {
        "id": "flight-123",
        "flightNumber": "AA1234",
        "departure": "2025-12-15T10:00:00Z",
        "arrival": "2025-12-15T18:30:00Z",
        "origin": { "code": "EZE", "city": "Buenos Aires" },
        "destination": { "code": "MIA", "city": "Miami" },
        "airline": { "code": "AA", "name": "American Airlines" },
        "minPrice": 850,
        "currency": "USD"
      },
      "return": { /* ... */ },
      "totalPrice": 1700
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

---

## 🗄️ Base de Datos

### Esquema de Datos (Prisma)

El sistema utiliza **PostgreSQL** con los siguientes modelos principales:

#### Modelos de Datos

- **Airport**: Aeropuertos con código IATA, ciudad y país
- **Airline**: Aerolíneas con código y nombre
- **Plane**: Modelos de aviones con capacidad
- **Flight**: Vuelos con origen, destino, fechas, precio y estado
- **User**: Usuarios registrados
- **Booking**: Reservas confirmadas
- **BookingIntent**: Intenciones de reserva (carrito)
- **SearchMetrics**: Métricas de búsquedas realizadas
- **EventLog**: Registro de eventos de Kafka

### Relaciones

```
Airport ──< Flight >── Airline
            │
            └── Plane
            │
            └──< Booking >── User
            │
            └──< BookingIntent >── User
```

### Migraciones

```bash
cd back
pnpm prisma:push      # Aplicar cambios al esquema
pnpm prisma:generate  # Regenerar cliente
```

---

## 📡 Sistema de Eventos

La aplicación consume y produce eventos a través de **Apache Kafka** para la comunicación entre microservicios.

### Eventos Consumidos (Topic: `search.events`)

| Evento                             | Descripción         | Acción                     |
|------------------------------------|---------------------|----------------------------|
| `flights.flight.created`           | Nuevo vuelo creado  | Crear vuelo en DB          |
| `flights.flight.updated`           | Vuelo actualizado   | Actualizar estado/horarios |
| `reservations.reservation.created` | Reserva creada      | Registrar booking          |
| `reservations.reservation.updated` | Reserva actualizada | Actualizar estado          |
| `users.user.created`               | Usuario creado      | Crear usuario en DB        |
| `users.user.updated`               | Usuario actualizado | Actualizar datos           |
| `users.user.deleted`               | Usuario eliminado   | Eliminar usuario           |

### Eventos Producidos

| Evento                    | Descripción              | Payload         |
|---------------------------|--------------------------|-----------------|
| `search.search.performed` | Búsqueda realizada       | SearchMetric    |
| `search.cart.item.added`  | Vuelo añadido al carrito | BookingIntent   |
| `users.user.created`      | Registro de usuario      | RegisterPayload |

### Estructura de Evento

```typescript
{
  messageId: "msg-1734567890123",
  eventType: "search.search.performed",
  schemaVersion: "1.0",
  occurredAt: "2025-11-28T12:00:00Z",
  producer: "search-service",
  correlationId: "corr-1734567890123",
  idempotencyKey: "search-1734567890123",
  payload: "{...}"
}
```

---

## ☁️ Infraestructura

### Despliegue en Google Cloud Platform

La infraestructura está gestionada con **Terraform** y desplegada en **GCP**.

#### Recursos Provisionados

- **Cloud Run**: Servicios containerizados para frontend y backend
- **Artifact Registry**: Registro privado de imágenes Docker
- **VPC Network**: Red privada virtual
- **Cloud SQL** (opcional): PostgreSQL gestionado

#### Ambientes

- **Desarrollo** (`infra/dev/`): Ambiente de desarrollo y testing
- **Producción** (`infra/prod/`): Ambiente productivo

#### Despliegue

```bash
cd infra/dev  # o infra/prod
terraform init
terraform plan
terraform apply
```

### Docker

Ambos frontend y backend tienen **Dockerfile** para containerización:

```bash
# Backend
cd back
docker build -t skytrack-backend .
docker run -p 8080:8080 skytrack-backend

# Frontend
cd front
docker build -t skytrack-frontend .
docker run -p 80:80 skytrack-frontend
```

---

## 🧪 Testing

### Cobertura de Tests

El proyecto mantiene alta cobertura de tests unitarios e integración:

```bash
# Tests completos con cobertura
npm run test          # Desde raíz (front + back)

# Solo backend
cd back && pnpm test:cov

# Solo frontend
cd front && pnpm test:cov
```

### Tecnologías de Testing

- **Jest**: Framework de testing
- **Supertest**: Testing de APIs HTTP
- **Testing Library**: Testing de componentes React
- **jest-mock-extended**: Mocks avanzados

### Reportes

Los reportes de cobertura se generan en:
- `back/coverage/lcov-report/index.html`
- `front/coverage/lcov-report/index.html`

---

## 📚 Documentación Adicional

### Enlaces Útiles

- **Trello (Gestión de Tareas)**: [Squad 3 - Reserva de Vuelos](https://trello.com/b/XPvm4Yif/squad3reservavuelos)
- **Documentación TPO**: [Google Docs](https://docs.google.com/document/d/1V8aasdXoWq9PEpiYb9Inc2g9NWTr5xsz5o1uAQWQ-iI/edit?tab=t.0)
- **Diagrama de Flujo**: `front/public/diagrama_flujo.jpeg`

### Diagrama de Flujo

![Flujo de búsqueda de vuelos](front/public/diagrama_flujo.jpeg)

---

## 👥 Equipo

**Squad 3** - UADE 2025

---

## 📄 Licencia

MIT License - Copyright (c) 2025 Squad 3

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

**Desarrollado con ❤️ por Squad 3**