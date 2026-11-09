/**
 * AccesosRapidos: botones circulares estilo app bancaria
 * (Depositar, Retirar, Transferir, etc.) que activan la operación.
 */
export default function AccesosRapidos({ activa, onSeleccionar }) {
  const acciones = [
    {
      id: 'deposito',
      label: 'Depositar',
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0-15 6 6m-6-6-6 6" />
      ),
      color: 'from-emerald-500 to-green-600',
      activo: 'bg-emerald-50 ring-2 ring-emerald-500',
    },
    {
      id: 'retiro',
      label: 'Retirar',
      icono: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 15 6-6m-6 6-6-6" />
      ),
      color: 'from-amber-500 to-orange-600',
      activo: 'bg-amber-50 ring-2 ring-amber-500',
    },
    {
      id: 'transferencia',
      label: 'Transferir',
      icono: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      ),
      color: 'from-blue-500 to-indigo-600',
      activo: 'bg-blue-50 ring-2 ring-blue-500',
    },
    {
      id: 'historial',
      label: 'Historial',
      icono: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      ),
      color: 'from-grape-500 to-grape-600',
      activo: 'bg-purple-50 ring-2 ring-grape-500',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {acciones.map((a) => {
        const seleccionada = activa === a.id;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSeleccionar(a.id)}
            className={`group flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-card sm:p-4 ${
              seleccionada ? a.activo : 'bg-white'
            }`}
          >
            <span
              className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${a.color} text-white shadow-md transition-transform group-hover:scale-105`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {a.icono}
              </svg>
            </span>
            <span className="text-[11px] font-semibold text-slate-600 sm:text-xs">{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}
