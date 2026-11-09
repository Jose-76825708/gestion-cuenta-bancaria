import mongoose from 'mongoose';

/**
 * Usuario: credenciales de acceso vinculadas a una cuenta bancaria.
 * Cada usuario inicia sesión y accede únicamente a su cuenta.
 */
const usuarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: [true, 'El usuario es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    contrasena: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    cuenta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cuenta',
      required: [true, 'El usuario debe tener una cuenta asociada'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Usuario', usuarioSchema);
