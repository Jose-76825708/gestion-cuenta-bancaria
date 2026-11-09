import { useState } from 'react';

/**
 * HistorialTransacciones: lista de movimientos estilo Interbank/BCP
 * con filtros por tipo, iconos por operación y montos con signo.
 */
const estilosTipo = {
  deposito: {
    clase: 'bg-emerald-50 text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    texto: 'Depósito',
    icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0-15 6 6m-6-6-6 6" />,
  },
  retiro: {
    clase: 'bg-rose-50 text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    texto: 'Retiro',
    icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 15 6-6m-6 6-6-6" />,
  },
  transferencia: {
    clase: 'bg-blue-50 text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    texto: 'Transferencia',
    icono: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    ),
  },
};

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function esEntrada(transaccion, cuentaId) {
  return (
    transaccion.tipo === 'deposito' ||
    (transaccion.cuentaDestino && transaccion.cuentaDestino._id === cuentaId)
  );
}

export default function HistorialTransacciones({ historial, cargando, cuentaId }) {
  const [filtro, setFiltro] = useState('todos');

  const filtros = [
    { id: 'todos', label: 'Todos' },
    { id: 'deposito', label: 'Ingresos' },
    { id: 'retiro', label: 'Egresos' },
    { id: 'transferencia', label: 'Transferencias' },
  ];

  const filtrados =
    filtro === 'todos' ? historial : historial.filter((t) => t.tipo === filtro);

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-4 h-5 w-48 animate-pulse rounded bg-slate-100" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-card">
      {/* Encabezado + filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Movimientos</h2>
          <p className="text-xs text-slate-400">{historial.length} operaciones registradas</p>
        </div>

        <div className="flex gap-1 rounded-full bg-slate-100 p-1">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                filtro === f.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-2 text-sm text-slate-400">No hay movimientos en esta categoría.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50">
          {filtrados.map((t) => {
            const estilo = estilosTipo[t.tipo] || estilosTipo.deposito;
            const entrada = esEntrada(t, cuentaId);

            return (
              <li
                key={t._id}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${estilo.clase}`}
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    {estilo.icono}
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">{estilo.texto}</p>
                    <span className={`hidden rounded px-1.5 py-0.5 text-[9px] font-bold uppercase sm:inline ${estilo.badge}`}>
                      {entrada ? 'Ingreso' : 'Egreso'}
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-slate-400">{formatearFecha(t.fecha)}</p>
                  {t.tipo === 'transferencia' && (
                    <p className="truncate text-[11px] font-medium text-slate-500">
                      {t.cuentaOrigen?.numeroCuenta} → {t.cuentaDestino?.numeroCuenta}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 text-sm font-bold tabular-nums ${
                    entrada ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {entrada ? '+' : '−'} S/{' '}
                  {Number(t.monto).toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-slate-100 p-4 text-center">
        <button
          type="button"
          className="text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          Ver estado de cuenta completo →
        </button>
      </div>
    </div>
  );
}
