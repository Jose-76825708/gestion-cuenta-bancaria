/**
 * Middleware centralizado de manejo de errores.
 * Devuelve 500 para errores internos no controlados.
 */
export function errorHandler(err, req, res, next) {
  console.error('🔥 Error interno:', err.message);

  // Errores de validación de Mongoose -> 400
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: mensajes.join(', ') });
  }

  // Errores de cast (ObjectId inválido) -> 400
  if (err.name === 'CastError') {
    return res.status(400).json({ mensaje: 'Formato de id inválido' });
  }

  // Errores de duplicado -> 400
  if (err.code === 11000) {
    return res.status(400).json({ mensaje: 'Registro duplicado' });
  }

  res.status(500).json({ mensaje: 'Error interno del servidor' });
}

/** Ruta no encontrada -> 404 */
export function notFound(req, res) {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
}
