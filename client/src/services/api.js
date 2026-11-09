/**
 * Servicio centralizado de comunicación con la API REST del backend.
 */
const API_URL = 'http://localhost:4000/api';

async function solicitud(ruta, opciones = {}) {
  const res = await fetch(`${API_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensaje || 'Error en la solicitud');
  }

  return data;
}

export const api = {
  login: (usuario, contrasena) =>
    solicitud('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, contrasena }),
    }),

  listarCuentas: () => solicitud('/cuentas'),

  obtenerCuenta: (id) => solicitud(`/cuenta/${id}`),

  obtenerHistorial: (id) => solicitud(`/cuenta/${id}/historial`),

  depositar: (cuentaId, monto) =>
    solicitud('/cuenta/deposito', {
      method: 'POST',
      body: JSON.stringify({ cuentaId, monto }),
    }),

  retirar: (cuentaId, monto) =>
    solicitud('/cuenta/retiro', {
      method: 'POST',
      body: JSON.stringify({ cuentaId, monto }),
    }),

  transferir: (cuentaOrigenId, cuentaDestinoId, monto) =>
    solicitud('/cuenta/transferencia', {
      method: 'POST',
      body: JSON.stringify({ cuentaOrigenId, cuentaDestinoId, monto }),
    }),
};
