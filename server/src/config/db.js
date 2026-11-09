import mongoose from 'mongoose';

/**
 * Establece la conexión persistente con MongoDB local.
 * Reintenta automáticamente si la base de datos no está disponible.
 */
export async function connectDB(uri) {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    console.log('Reintentando en 5 segundos...');
    setTimeout(() => connectDB(uri), 5000);
  }
}
