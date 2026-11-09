/**
 * SaldoCard: tarjeta de débito visual estilo banco real,
 * con chip, número enmascarado y saldo disponible.
 * El saldo se actualiza en tiempo real tras cada operación.
 */
export default function SaldoCard({ saldo, titular, numeroCuenta, cargando }) {
  const formateado = Number(saldo ?? 0).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const ultimos4 = (numeroCuenta || '0000').replace(/\D/g, '').slice(-4);

  return (
    <div className="animate-slide-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-6 text-white shadow-card sm:p-7">
      {/* Decoraciones de fondo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-600/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-grape-500/20 blur-2xl" />

      {/* Fila superior: titular + saldo */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
            Saldo disponible
          </p>
          <p className="mt-1.5 text-4xl font-extrabold tracking-tight sm:text-[42px]">
            {cargando ? (
              <span className="inline-block h-10 w-44 animate-pulse rounded-lg bg-white/15" />
            ) : (
              <>
                <span className="text-xl font-semibold text-white/70">S/ </span>
                {formateado}
              </>
            )}
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/20">
          Débito
        </span>
      </div>

      {/* Chip + número */}
      <div className="relative mt-7 flex items-center gap-3">
        {/* Chip */}
        <span className="grid h-9 w-12 place-items-center rounded-md bg-gradient-to-br from-amber-200 to-amber-400 shadow-inner">
          <svg className="h-5 w-5 text-amber-800/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 8h16M4 16h16M9 4v16M15 4v16" />
          </svg>
        </span>
        {/* Contactless */}
        <svg className="h-5 w-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" d="M8.5 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M14.5 3.5a12 12 0 0 1 0 17" />
        </svg>

        <p className="ml-2 font-mono text-lg tracking-[0.25em] text-white/90 sm:text-xl">
          •••• •••• •••• {ultimos4}
        </p>
      </div>

      {/* Pie de tarjeta */}
      <div className="relative mt-6 flex items-end justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">
            Titular
          </p>
          <p className="mt-0.5 text-sm font-semibold uppercase tracking-wide">
            {titular || '—'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">
            Cuenta
          </p>
          <p className="mt-0.5 text-sm font-semibold">{numeroCuenta || '—'}</p>
        </div>
        <div className="flex -space-x-2">
          <span className="h-7 w-7 rounded-full bg-white/70" />
          <span className="h-7 w-7 rounded-full bg-brand-500/80" />
        </div>
      </div>
    </div>
  );
}
