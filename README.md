# 🏦 Sistema de Gestión de Cuenta Bancaria Simplificada

**Asignatura:** Ingeniería Web | Unidad de Desarrollo Full-Stack (Node.js + React + MongoDB)

Aplicación web *Full-Stack* para la gestión de una cuenta bancaria simple: consulta de saldo, depósitos, retiros, transferencias entre cuentas e historial de movimientos.

---

## 📁 Estructura del Repositorio

```
cuenta-bancaria/
├── server/                  # Backend — Node.js + Express + MongoDB
│   ├── scripts/
│   │   └── seed.js          # Script seed: crea cuentas de prueba
│   ├── src/
│   │   ├── config/db.js     # Conexión persistente a MongoDB
│   │   ├── controllers/     # Lógica de negocio de la API
│   │   ├── middleware/      # Manejo de errores (400/404/500)
│   │   ├── models/          # Modelos Mongoose (Cuenta, Transaccion)
│   │   ├── routes/          # Rutas HTTP estandarizadas
│   │   └── index.js         # Punto de entrada del servidor
│   ├── .env.example         # Plantilla de variables de entorno
│   └── package.json
├── client/                  # Frontend — React + Vite + Tailwind CSS
│   └── src/
│       ├── components/      # Navbar, SaldoCard, FormOperacion, HistorialTransacciones
│       ├── services/api.js  # Cliente HTTP centralizado
│       ├── App.jsx          # Componente padre (estado global)
│       └── main.jsx
└── README.md
```

---

## 🔧 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) corriendo **localmente** en el puerto `27017`
- npm (incluido con Node.js)

---

## 🚀 Instalación y Ejecución

### 1. Backend (`/server`)

```bash
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno (copiar la plantilla)
# Windows:
copy .env.example .env
# macOS / Linux:
# cp .env.example .env

# Inicializar la base de datos con cuentas de prueba (script seed)
npm run seed

# Iniciar el servidor (en desarrollo, con recarga automática)
npm run dev
```

El backend quedará disponible en **http://localhost:4000**

### 2. Frontend (`/client`)

```bash
cd client

# Instalar dependencias
npm install

# Iniciar la aplicación React con Vite
npm run dev
```

La aplicación quedará disponible en **http://localhost:5173**

---

## 🌍 Variables de Entorno

El archivo `server/.env.example` documenta todas las variables requeridas:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor Express | `4000` |
| `MONGO_URI` | URL de conexión a MongoDB local | `mongodb://127.0.0.1:27017/cuenta_bancaria` |
| `CLIENT_URL` | Origen permitido para CORS (frontend Vite) | `http://localhost:5173` |

> ⚠️ Nunca subas el archivo `.env` a Git (ya está incluido en `.gitignore`).

---

## 🌱 Script Seed

```bash
cd server
npm run seed
```

Crea **3 cuentas de prueba** con saldo inicial y 3 transacciones de ejemplo:

| Número de cuenta | Titular | Saldo inicial |
|---|---|---|
| 001-1001 | Juan Pérez | S/ 1500.00 |
| 001-1002 | María Gómez | S/ 800.00 |
| 001-1003 | Carlos López | S/ 2500.00 |

El script limpia los datos anteriores y los regenera de forma idempotente.

---

## 📡 API REST

| Método | Ruta | Descripción | Éxito |
|---|---|---|---|
| `GET` | `/api/cuentas` | Lista todas las cuentas | `200` |
| `GET` | `/api/cuenta/:id` | Obtiene saldo y datos de la cuenta | `200` |
| `POST` | `/api/cuenta/deposito` | Registra un depósito | `201` |
| `POST` | `/api/cuenta/retiro` | Registra un retiro (valida saldo) | `201` |
| `POST` | `/api/cuenta/transferencia` | Transferencia atómica entre cuentas | `201` |
| `GET` | `/api/cuenta/:id/historial` | Últimos movimientos de la cuenta | `200` |

### Cuerpos de las peticiones POST

```json
// POST /api/cuenta/deposito  y  /api/cuenta/retiro
{ "cuentaId": "<id>", "monto": 100 }

// POST /api/cuenta/transferencia
{ "cuentaOrigenId": "<id>", "cuentaDestinoId": "<id>", "monto": 50 }
```

### Códigos de estado HTTP

- **400** — Datos inválidos, monto incorrecto o saldo insuficiente
- **404** — Cuenta no encontrada
- **500** — Error interno del servidor

### Ejemplo con cURL

```bash
curl -X POST http://localhost:4000/api/cuenta/deposito \
  -H "Content-Type: application/json" \
  -d '{"cuentaId":"ID_AQUI","monto":250}'
```

---

## ⚙️ Tecnologías

**Backend:** Node.js · Express.js · MongoDB (Mongoose) · dotenv · CORS  
**Frontend:** React 18 · Vite · Tailwind CSS · Hooks (`useState`, `useEffect`)  
**Calidad:** Transferencias atómicas con transacciones de MongoDB, validación de saldos a nivel de esquema y consulta, middleware centralizado de errores.

---

## 🧪 Casos de prueba sugeridos

1. **Depósito:** el saldo aumenta al instante en la UI.
2. **Retiro mayor al saldo:** devuelve `400 Saldo insuficiente` y el saldo no cambia.
3. **Transferencia a cuenta inexistente:** devuelve `404`.
4. **Transferencia válida:** ambos saldos se actualizan de forma atómica.
5. **Historial:** muestra las operaciones ordenadas de más reciente a más antigua.

---

*Ingeniería Web — Departamento de Ingeniería de Sistemas y Computación*
