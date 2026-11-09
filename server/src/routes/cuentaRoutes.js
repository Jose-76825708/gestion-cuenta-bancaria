import { Router } from 'express';
import {
  listarCuentas,
  obtenerCuenta,
  depositar,
  retirar,
  transferir,
  obtenerHistorial,
} from '../controllers/cuentaController.js';

const router = Router();

router.get('/cuentas', listarCuentas);
router.get('/cuenta/:id', obtenerCuenta);
router.post('/cuenta/deposito', depositar);
router.post('/cuenta/retiro', retirar);
router.post('/cuenta/transferencia', transferir);
router.get('/cuenta/:id/historial', obtenerHistorial);

export default router;
