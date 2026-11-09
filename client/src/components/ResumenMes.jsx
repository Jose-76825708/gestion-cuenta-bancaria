/**
 * ResumenMes: tarjetas de resumen estilo banca en línea
 * (ingresos, egresos y balance del período) calculadas
 * a partir del historial de movimientos.
 */
export default function ResumenMes({ historial }) {
  const ingresos = historial
    .filter((t) => t.tipo === 'deposito' || (t.tipo === 'transferencia' && t.esEntrada))
    .reduce((suma, t) => suma + t.monto, 0);

  const egresos = historial
    .filter((t) => t.tipo === 'retiro' || (t.tipo === 'transferencia' && !t.esEntrada))
    .reduce((suma, t) => suma + t.monto, 0);

  const balance = ingresos - egresos;

  const formatear = (v) =>
    v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const tarjetas = [
    {
      label: 'Ingresos',
      valor: ingresos,
      clase: 'text-emerald-600',
      fondo: 'bg-emerald-50',
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 15 6-6m-6 6-6-6" />
      ),
      colorIcono: 'text-emerald-600',
    },
    {
      label: 'Egresos',
      valor: egresos,
      clase: 'text-rose-600',
      fondo: 'bg-rose-50',
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0-15 6 6m-6-6-6 6" />
      ),
      colorIcono: 'text-rose-600',
    },
    {
      label: 'Balance',
      valor: balance,
      clase: balance >= 0 ? 'text-slate-900' : 'text-rose-600',
      fondo: 'bg-slate-100',
      icono: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5"
        />
      ),
      colorIcono: 'text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
      <div className="rounded-2xl bg-white p-4 shadow-card sm:col-span-3 lg:col-span-1">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Resumen</h3>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
            Últimos movimientos
          </span>
        </div>

        <div className="space-y-3">
          {tarjetas.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${t.fondo}`}>
                <svg
                  className={`h-4.5 w-4.5 ${t.colorIcono}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {t.icono}
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">{t.label}</p>
                <p className={`truncate text-sm font-bold ${t.clase}`}>
                  S/ {formatear(t.valor)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-dashed border-slate-200 pt-3">
          <p className="text-[11px] leading-relaxed text-slate-400">
            Los montos se calculan según los movimientos registrados en esta cuenta.
          </p>
        </div>
      </div>
    </div>
  );
}
