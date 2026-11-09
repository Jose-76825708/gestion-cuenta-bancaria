import mongoose from 'mongoose';
import Cuenta from '../models/Cuenta.js';
import Transaccion from '../models/Transaccion.js';

/** Valida que el id sea un ObjectId válido de MongoDB */
const esIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

/** Valida que el monto sea un número positivo */
const validarMonto = (monto) => {
  const valor = Number(monto);
  if (!Number.isFinite(valor) || valor <= 0) return null;
  return valor;
};

/**
 * GET /api/cuentas
 * Lista todas las cuentas (para el selector del frontend)
 */
export async function listarCuentas(req, res, next) {
  try {
    const cuentas = await Cuenta.find().sort({ numeroCuenta: 1 });
    res.json(cuentas);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/cuenta/:id
 * Obtiene saldo y datos de la cuenta
 */
export async function obtenerCuenta(req, res, next) {
  try {
    const { id } = req.params;

    if (!esIdValido(id)) {
      return res.status(400).json({ mensaje: 'Id de cuenta inválido' });
    }

    const cuenta = await Cuenta.findById(id);
    if (!cuenta) {
      return res.status(404).json({ mensaje: 'Cuenta no encontrada' });
    }

    res.json({
      _id: cuenta._id,
      numeroCuenta: cuenta.numeroCuenta,
      titular: cuenta.titular,
      saldo: cuenta.saldo,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cuenta/deposito
 * Registra un depósito aumentando el saldo de la cuenta
 */
export async function depositar(req, res, next) {
  try {
    const { cuentaId, monto } = req.body;

    if (!cuentaId || !esIdValido(cuentaId)) {
      return res.status(400).json({ mensaje: 'Id de cuenta inválido' });
    }

    const valor = validarMonto(monto);
    if (valor === null) {
      return res.status(400).json({ mensaje: 'El monto debe ser un número mayor a cero' });
    }

    const cuenta = await Cuenta.findByIdAndUpdate(
      cuentaId,
      { $inc: { saldo: valor } },
      { new: true, runValidators: true }
    );

    if (!cuenta) {
      return res.status(404).json({ mensaje: 'Cuenta no encontrada' });
    }

    const transaccion = await Transaccion.create({
      tipo: 'deposito',
      monto: valor,
      cuentaOrigen: cuenta._id,
      descripcion: `Depósito en cuenta ${cuenta.numeroCuenta}`,
    });

    res.status(201).json({
      mensaje: 'Depósito realizado con éxito',
      saldoActual: cuenta.saldo,
      transaccion,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cuenta/retiro
 * Registra un retiro validando que no supere el saldo disponible
 */
export async function retirar(req, res, next) {
  try {
    const { cuentaId, monto } = req.body;

    if (!cuentaId || !esIdValido(cuentaId)) {
      return res.status(400).json({ mensaje: 'Id de cuenta inválido' });
    }

    const valor = validarMonto(monto);
    if (valor === null) {
      return res.status(400).json({ mensaje: 'El monto debe ser un número mayor a cero' });
    }

    // Condición atómica: solo descuenta si el saldo es suficiente.
    // Evita saldos negativos incluso ante peticiones simultáneas.
    const cuenta = await Cuenta.findOneAndUpdate(
      { _id: cuentaId, saldo: { $gte: valor } },
      { $inc: { saldo: -valor } },
      { new: true, runValidators: true }
    );

    if (!cuenta) {
      const existe = await Cuenta.exists({ _id: cuentaId });
      if (!existe) {
        return res.status(404).json({ mensaje: 'Cuenta no encontrada' });
      }
      return res.status(400).json({ mensaje: 'Saldo insuficiente para realizar el retiro' });
    }

    const transaccion = await Transaccion.create({
      tipo: 'retiro',
      monto: valor,
      cuentaOrigen: cuenta._id,
      descripcion: `Retiro en cuenta ${cuenta.numeroCuenta}`,
    });

    res.status(201).json({
      mensaje: 'Retiro realizado con éxito',
      saldoActual: cuenta.saldo,
      transaccion,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cuenta/transferencia
 * Transfiere dinero entre cuentas.
 *
 * Estrategia atómica compatible con MongoDB standalone:
 *  1. Débito condicional en la cuenta origen ({ saldo: { $gte: monto } }),
 *     operación atómica que nunca permite saldos negativos.
 *  2. Crédito en la cuenta destino.
 *  3. Si el crédito falla, se reversa el débito (compensación).
 */
export async function transferir(req, res, next) {
  try {
    const { cuentaOrigenId, cuentaDestinoId, monto } = req.body;

    if (!cuentaOrigenId || !esIdValido(cuentaOrigenId)) {
      return res.status(400).json({ mensaje: 'Id de cuenta origen inválido' });
    }
    if (!cuentaDestinoId || !esIdValido(cuentaDestinoId)) {
      return res.status(400).json({ mensaje: 'Id de cuenta destino inválido' });
    }
    if (cuentaOrigenId === cuentaDestinoId) {
      return res.status(400).json({ mensaje: 'No se puede transferir a la misma cuenta' });
    }

    const valor = validarMonto(monto);
    if (valor === null) {
      return res.status(400).json({ mensaje: 'El monto debe ser un número mayor a cero' });
    }

    // 1) Validar existencia de la cuenta destino
    const destino = await Cuenta.findById(cuentaDestinoId);
    if (!destino) {
      return res.status(404).json({ mensaje: 'Cuenta destino no encontrada' });
    }

    // 2) Débito atómico condicionado al saldo disponible
    const origen = await Cuenta.findOneAndUpdate(
      { _id: cuentaOrigenId, saldo: { $gte: valor } },
      { $inc: { saldo: -valor } },
      { new: true, runValidators: true }
    );

    if (!origen) {
      const existe = await Cuenta.exists({ _id: cuentaOrigenId });
      if (!existe) {
        return res.status(404).json({ mensaje: 'Cuenta origen no encontrada' });
      }
      return res.status(400).json({ mensaje: 'Saldo insuficiente para realizar la transferencia' });
    }

    // 3) Crédito en el destino (compensar si falla)
    const destinoActualizado = await Cuenta.findByIdAndUpdate(
      cuentaDestinoId,
      { $inc: { saldo: valor } },
      { new: true, runValidators: true }
    );

    if (!destinoActualizado) {
      await Cuenta.findByIdAndUpdate(cuentaOrigenId, { $inc: { saldo: valor } });
      return res.status(404).json({ mensaje: 'Cuenta destino no encontrada' });
    }

    // 4) Registrar la transacción en el historial
    const transaccion = await Transaccion.create({
      tipo: 'transferencia',
      monto: valor,
      cuentaOrigen: origen._id,
      cuentaDestino: destinoActualizado._id,
      descripcion: `Transferencia de ${origen.numeroCuenta} a ${destinoActualizado.numeroCuenta}`,
    });

    res.status(201).json({
      mensaje: 'Transferencia realizada con éxito',
      saldoOrigen: origen.saldo,
      saldoDestino: destinoActualizado.saldo,
      transaccion,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/cuenta/:id/historial
 * Obtiene el registro de transacciones de la cuenta (origen o destino)
 */
export async function obtenerHistorial(req, res, next) {
  try {
    const { id } = req.params;

    if (!esIdValido(id)) {
      return res.status(400).json({ mensaje: 'Id de cuenta inválido' });
    }

    const cuenta = await Cuenta.findById(id);
    if (!cuenta) {
      return res.status(404).json({ mensaje: 'Cuenta no encontrada' });
    }

    const historial = await Transaccion.find({
      $or: [{ cuentaOrigen: id }, { cuentaDestino: id }],
    })
      .sort({ fecha: -1 })
      .limit(50)
      .populate('cuentaOrigen', 'numeroCuenta titular')
      .populate('cuentaDestino', 'numeroCuenta titular');

    res.json(historial);
  } catch (error) {
    next(error);
  }
}
