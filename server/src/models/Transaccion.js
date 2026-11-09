import mongoose from 'mongoose';

const transaccionSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, 'El tipo de transacción es obligatorio'],
      enum: {
        values: ['deposito', 'retiro', 'transferencia'],
        message: 'Tipo de transacción no válido: {VALUE}',
      },
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0.01, 'El monto debe ser mayor a cero'],
    },
    cuentaOrigen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cuenta',
      required: function () {
        return this.tipo !== 'deposito';
      },
    },
    cuentaDestino: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cuenta',
      required: function () {
        return this.tipo === 'transferencia';
      },
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para consultar el historial por cuenta ordenado por fecha
transaccionSchema.index({ cuentaOrigen: 1, fecha: -1 });
transaccionSchema.index({ cuentaDestino: 1, fecha: -1 });

export default mongoose.model('Transaccion', transaccionSchema);
