import mongoose from 'mongoose';

const cuentaSchema = new mongoose.Schema(
  {
    numeroCuenta: {
      type: String,
      required: [true, 'El número de cuenta es obligatorio'],
      unique: true,
      trim: true,
    },
    titular: {
      type: String,
      required: [true, 'El titular es obligatorio'],
      trim: true,
    },
    saldo: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'El saldo no puede ser negativo'], // validación a nivel de esquema
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model('Cuenta', cuentaSchema);
