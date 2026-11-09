import Usuario from '../models/Usuario.js';

/**
 * POST /api/auth/login
 * Valida las credenciales del usuario y devuelve sus datos
 * junto con la cuenta bancaria asociada.
 *
 * Códigos: 400 datos faltantes · 401 credenciales inválidas · 500 error interno
 */
export async function login(req, res, next) {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res
        .status(400)
        .json({ mensaje: 'Usuario y contraseña son obligatorios' });
    }

    const usuarioDb = await Usuario.findOne({
      usuario: String(usuario).trim().toLowerCase(),
    }).populate('cuenta', 'numeroCuenta titular saldo');

    // Respuesta genérica por seguridad (no revela cuál dato falló)
    if (!usuarioDb || usuarioDb.contrasena !== contrasena) {
      return res
        .status(401)
        .json({ mensaje: 'Usuario o contraseña incorrectos. Verifica tus datos.' });
    }

    if (!usuarioDb.cuenta) {
      return res
        .status(404)
        .json({ mensaje: 'El usuario no tiene una cuenta asociada' });
    }

    // Nunca se envía la contraseña al cliente
    res.json({
      usuario: usuarioDb.usuario,
      nombre: usuarioDb.nombre,
      cuentaId: usuarioDb.cuenta._id,
      numeroCuenta: usuarioDb.cuenta.numeroCuenta,
      titular: usuarioDb.cuenta.titular,
    });
  } catch (error) {
    next(error);
  }
}
