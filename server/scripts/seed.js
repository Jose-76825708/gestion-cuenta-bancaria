import 'dotenv/config';
import mongoose from 'mongoose';
import Cuenta from '../src/models/Cuenta.js';
import Transaccion from '../src/models/Transaccion.js';
import Usuario from '../src/models/Usuario.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cuenta_bancaria';

/**
 * Script de inicialización de la base de datos.
 * Crea cuentas de prueba y transacciones de ejemplo.
 * Uso: npm run seed
 */
async function seed() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a:', mongoose.connection.name);

    // Limpiar datos anteriores
    await Cuenta.deleteMany({});
    await Transaccion.deleteMany({});
    await Usuario.deleteMany({});
    console.log('🧹 Datos anteriores eliminados');

    // Crear cuentas de prueba
    const cuentas = await Cuenta.create([
      { numeroCuenta: '001-1001', titular: 'Juan Pérez', saldo: 1500 },
      { numeroCuenta: '001-1002', titular: 'María Gómez', saldo: 800 },
      { numeroCuenta: '001-1003', titular: 'Carlos López', saldo: 2500 },
    ]);
    console.log('💳 Cuentas creadas:');
    cuentas.forEach((c) =>
      console.log(`   - ${c.numeroCuenta} | ${c.titular} | Saldo: $${c.saldo}`)
    );

    // Crear un usuario de acceso por cada cuenta (login)
    const usuarios = await Usuario.create([
      { usuario: 'juan', contrasena: '1234', nombre: 'Juan Pérez', cuenta: cuentas[0]._id },
      { usuario: 'maria', contrasena: '1234', nombre: 'María Gómez', cuenta: cuentas[1]._id },
      { usuario: 'carlos', contrasena: '1234', nombre: 'Carlos López', cuenta: cuentas[2]._id },
    ]);
    console.log('🔐 Usuarios de acceso creados:');
    usuarios.forEach((u) =>
      console.log(`   - ${u.usuario} / 1234 → ${u.nombre} (cuenta ${cuentas.find((c) => c._id.equals(u.cuenta))?.numeroCuenta})`)
    );

    // Crear transacciones de ejemplo
    const transacciones = await Transaccion.create([
      {
        tipo: 'deposito',
        monto: 500,
        cuentaOrigen: cuentas[0]._id,
        descripcion: 'Depósito inicial en cuenta 001-1001',
        fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        tipo: 'retiro',
        monto: 200,
        cuentaOrigen: cuentas[0]._id,
        descripcion: 'Retiro en cuenta 001-1001',
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        tipo: 'transferencia',
        monto: 300,
        cuentaOrigen: cuentas[0]._id,
        cuentaDestino: cuentas[1]._id,
        descripcion: 'Transferencia de 001-1001 a 001-1002',
        fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`📝 ${transacciones.length} transacciones de ejemplo creadas`);

    console.log('\n🎉 Base de datos inicializada correctamente');
    console.log('\nIDs de cuenta para pruebas:');
    cuentas.forEach((c) => console.log(`   ${c.titular}: ${c._id}`));

    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
