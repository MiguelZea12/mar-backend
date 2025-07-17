# 🍽️ Catering Management System - Backend

Sistema de gestión de catering desarrollado con **NestJS**, **TypeScript** y **PostgreSQL**. Incluye gestión completa de clientes, menús, pedidos, inventario y entregas con un panel de administración con métricas detalladas.

## 📋 Funcionalidades

### 👥 Gestión de Clientes
- ✅ Registro y edición de clientes
- ✅ Historial completo de pedidos
- ✅ Búsqueda avanzada por múltiples criterios
- ✅ Gestión de clientes recurrentes

### 🍕 Catálogo de Menús
- ✅ Categorización de alimentos
- ✅ Gestión de ingredientes y alérgenos
- ✅ Precios y tiempos de preparación
- ✅ Búsqueda por filtros avanzados (precio, ingredientes, etc.)

### 📋 Gestión de Pedidos
- ✅ Creación y personalización de pedidos
- ✅ Estados del pedido (pendiente, confirmado, preparando, etc.)
- ✅ Cálculo automático de totales con impuestos
- ✅ Generación automática de números de orden

### 📦 Inventario de Insumos
- ✅ Gestión básica de inventario
- ✅ Alertas de stock bajo
- ✅ Control de fechas de vencimiento
- ✅ Reportes de inventario

### 🚛 Planificación de Entregas
- ✅ Programación de entregas
- ✅ Estados de entrega
- ✅ Información de contacto y repartidor

### 📊 Panel de Administración
- ✅ Total de pedidos realizados
- ✅ Pedidos por día/semana/mes
- ✅ Menú más solicitado
- ✅ Clientes recurrentes
- ✅ Ingresos totales
- ✅ Métricas de inventario

## 🏗️ Arquitectura y Patrones de Diseño

### Patrones Implementados

#### 🏛️ Patrones Estructurales/Creacionales
1. **Repository Pattern** - Encapsula la lógica de acceso a datos
2. **Factory Pattern** - Generación de números de orden únicos
3. **Module Pattern** - Organización en módulos cohesivos

#### 🔄 Patrones de Comportamiento
1. **Observer Pattern** - Sistema de notificaciones y alertas
2. **Strategy Pattern** - Diferentes estrategias de búsqueda
3. **DTO Pattern** - Transferencia y validación de datos

### 📐 Arquitectura MVC
```
src/
├── entities/           # Modelos de datos (Model)
├── modules/
│   ├── clientes/      # Gestión de clientes
│   ├── menu/          # Catálogo de menús
│   ├── orders/        # Gestión de pedidos
│   └── inventario/    # Gestión de inventario
├── config/            # Configuraciones
└── main.ts           # Punto de entrada
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd mar-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
1. Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE catering_db;
```

2. Configurar variables de entorno en `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=catering_db

# JWT Configuration
JWT_SECRET=tu-clave-secreta-jwt
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 4. Ejecutar la aplicación

#### Desarrollo
```bash
npm run start:dev
```

#### Producción
```bash
npm run build
npm run start:prod
```

La aplicación estará disponible en:
- **API**: http://localhost:3000/api
- **Documentación Swagger**: http://localhost:3000/api/docs

## 📚 Documentación de la API

### Endpoints Principales

#### 👥 Clientes (`/api/clientes`)
- `GET /api/clientes` - Listar clientes con paginación
- `POST /api/clientes` - Crear nuevo cliente
- `GET /api/clientes/:id` - Obtener cliente por ID
- `PATCH /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente
- `GET /api/clientes/:id/historial-pedidos` - Historial de pedidos
- `GET /api/clientes/buscar` - Búsqueda avanzada

#### 🍕 Menú (`/api/menu`)
- `GET /api/menu/categorias` - Listar categorías
- `POST /api/menu/categorias` - Crear categoría
- `GET /api/menu/items` - Listar items del menú
- `POST /api/menu/items` - Crear item del menú
- `GET /api/menu/catalogo` - Catálogo completo
- `GET /api/menu/items/buscar` - Búsqueda avanzada de items

#### 📋 Pedidos (`/api/orders`)
- `GET /api/orders` - Listar pedidos con filtros
- `POST /api/orders` - Crear nuevo pedido
- `GET /api/orders/:id` - Obtener pedido por ID
- `PATCH /api/orders/:id/status` - Actualizar estado
- `PATCH /api/orders/:id/cancel` - Cancelar pedido
- `GET /api/orders/estadisticas` - Métricas y estadísticas

#### 📦 Inventario (`/api/inventario`)
- `GET /api/inventario` - Listar insumos
- `POST /api/inventario` - Crear insumo
- `GET /api/inventario/stock-bajo` - Insumos con stock bajo
- `GET /api/inventario/proximos-vencer` - Próximos a vencer
- `GET /api/inventario/estadisticas` - Estadísticas de inventario

### Ejemplos de Uso

#### Crear un cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "direccion": "Av. Principal 123"
  }'
```

#### Crear un pedido
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "fechaEntrega": "2025-07-20",
    "horaEntrega": "14:30",
    "direccionEntrega": "Av. Principal 123",
    "cantidadPersonas": 10,
    "items": [
      {
        "menuItemId": 1,
        "cantidad": 2,
        "personalizaciones": "Sin cebolla"
      }
    ]
  }'
```

## 🗄️ Estructura de Base de Datos

### Entidades Principales

- **Cliente**: Información de clientes y empresas
- **Categoría**: Categorías de menús
- **MenuItem**: Items individuales del menú
- **Order**: Pedidos realizados
- **OrderItem**: Items específicos de cada pedido
- **Insumo**: Inventario de insumos
- **Delivery**: Información de entregas

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Modo desarrollo con hot reload
npm run start:debug    # Modo debug

# Construcción
npm run build          # Compilar para producción
npm run start:prod     # Ejecutar en producción

# Calidad de código
npm run lint           # Ejecutar ESLint
npm run format         # Formatear código con Prettier
```

## 🔒 Consideraciones de Seguridad

- ✅ Validación de datos con `class-validator`
- ✅ Sanitización automática de inputs
- ✅ Variables de entorno para configuraciones sensibles
- ✅ Prepared statements para prevenir SQL injection
- ✅ CORS configurado apropiadamente

## 👨‍💻 Autor

Desarrollado con ❤️ para el sistema de gestión de catering.

---

**🚀 ¡La aplicación está lista para ser ejecutada! Revisa la documentación Swagger en `/api/docs` para explorar todos los endpoints disponibles.**
