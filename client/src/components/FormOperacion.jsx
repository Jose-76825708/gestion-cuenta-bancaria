import { useState } from 'react';

/**
 * FormOperacion: panel de operaciones con pestañas
 * (Depósito / Retiro / Transferencia) estilo app bancaria.
 * Controla sus inputs con useState y notifica vía callbacks.
 */
export default function FormOperacion({
  tipo,
  onCambiarTipo,
  cuentas = [],
  cuentaActualId,
  onOperacion,
  procesando,
}) {
  const [monto, setMonto] = useState('');
  const [cuentaDestinoId, setCuentaDestinoId] = useState('');

  const configuraciones = {
    deposito: {
      titulo: 'Depositar dinero',
      descripcion: 'Ingresa efectivo a tu cuenta al instante.',
      icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0-15 6 6m-6-6-6 6" />,
      color: 'from-emerald-500 to-green-600',
      boton: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
      placeholder: '0.00',
      textoBoton: 'Confirmar depósito',
    },
    retiro: {
      titulo: 'Retirar dinero',
      descripcion: 'Retira desde tu saldo disponible sin comisión.',
      icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 15 6-6m-6 6-6-6" />,
      color: 'from-amber-500 to-orange-600',
      boton: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
      placeholder: '0.00',
      textoBoton: 'Confirmar retiro',
    },
    transferencia: {
      titulo: 'Transferir dinero',
      descripcion: 'Envía a otra cuenta del banco en segundos.',
      icono: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      ),
      color: 'from-blue-500 to-indigo-600',
      boton: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      placeholder: '0.00',
      textoBoton: 'Confirmar transferencia',
    },
  };

  const config = configuraciones[tipo];
  const esTransferencia = tipo === 'transferencia';
  const cuentasDestino = cuentas.filter((c) => c._id !== cuentaActualId);
  const montoNum = parseFloat(monto) || 0;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!montoNum || montoNum <= 0) {
      onOperacion({ tipo, error: 'Ingresa un monto mayor a cero' });
      return;
    }

    if (esTransferencia && !cuentaDestinoId) {
      onOperacion({ tipo, error: 'Selecciona una cuenta destino' });
      return;
    }

    const resultado = await onOperacion({
      tipo,
      monto: montoNum,
      cuentaDestinoId: esTransferencia ? cuentaDestinoId : undefined,
    });

    if (!resultado?.error) {
      setMonto('');
      if (esTransferencia) setCuentaDestinoId('');
    }
  }

  const pestanas = [
    { id: 'deposito', label: 'Depósito' },
    { id: 'retiro', label: 'Retiro' },
    { id: 'transferencia', label: 'Transferencia' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      {/* Pestañas */}
      <div className="flex border-b border-slate-200">
        {pestanas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onCambiarTipo?.(p.id)}
            className={`flex-1 px-3 py-3.5 text-xs font-semibold transition-colors sm:text-sm ${
              tipo === p.id
                ? 'border-b-2 border-brand-600 text-brand-600'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        {/* Encabezado */}
        <div className="mb-5 flex items-start gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${config.color} text-white shadow-md`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {config.icono}
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{config.titulo}</h3>
            <p className="text-xs text-slate-400">{config.descripcion}</p>
          </div>
        </div>

        <div className="space-y-4">
          {esTransferencia && (
            <div>
              <label htmlFor="cuenta-destino" className="mb-1.5 block text-xs font-semibold text-slate-600">
                Cuenta destino
              </label>
              <select
                id="cuenta-destino"
                value={cuentaDestinoId}
                onChange={(e) => setCuentaDestinoId(e.target.value)}
                className="w-full appearance-none rounded-xl border-0 bg-slate-100 px-4 py-3 text-sm text-slate-700 ring-1 ring-transparent transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Seleccionar cuenta...</option>
                {cuentasDestino.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.numeroCuenta} — {c.titular}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="monto" className="mb-1.5 block text-xs font-semibold text-slate-600">
              Monto
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-slate-400">
                S/
              </span>
              <input
                id="monto"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder={config.placeholder}
                className="w-full rounded-xl border-0 bg-slate-100 py-3.5 pl-12 pr-4 text-lg font-bold text-slate-800 ring-1 ring-transparent transition placeholder:font-medium placeholder:text-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            {esTransferencia && montoNum > 0 && (
              <p className="mt-1.5 text-[11px] text-slate-400">
                La transferencia se acreditará al instante.
              </p>
            )}
          </div>

          {/* Montos rápidos */}
          <div className="flex gap-2">
            {[10, 50, 100, 200].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setMonto(String(v))}
                className="flex-1 rounded-lg bg-slate-100 py-2 text-xs font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                S/ {v}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={procesando}
            className={`w-full rounded-xl bg-gradient-to-r ${config.boton} py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {procesando ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Procesando...
              </span>
            ) : (
              config.textoBoton
            )}
          </button>

          <p className="text-center text-[10px] text-slate-400">
            🔒 Operación protegida con cifrado de extremo a extremo
          </p>
        </div>
      </form>
    </div>
  );
}
