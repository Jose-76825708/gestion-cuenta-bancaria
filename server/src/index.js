import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cuentaRoutes from './routes/cuentaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cuenta_bancaria';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middlewares globales
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Rutas API
app.use('/api', authRoutes);
app.use('/api', cuentaRoutes);

// Ruta de salud del servidor
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Cuenta Bancaria funcionando ✅' });
});

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Conexión a MongoDB y arranque del servidor
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend en http://localhost:${PORT}`);
  });
});
