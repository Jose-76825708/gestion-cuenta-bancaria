/**
 * Navbar: barra superior estilo banca en línea (BCP / Interbank).
 * Logo, navegación principal, alertas y avatar del titular.
 */
export default function Navbar({ titular, onCerrarSesion }) {
  const iniciales = (titular || 'U')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const enlaces = ['Inicio', 'Transferencias', 'Pagos', 'Beneficiarios'];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-lg font-extrabold text-white shadow-brand">
            B
          </span>
          <div className="leading-none">
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900">
              Banco<span className="text-brand-600">Simple</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Banca personal
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="hidden items-center gap-1 lg:flex">
          {enlaces.map((enlace, i) => (
            <a
              key={enlace}
              href="#"
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                i === 0
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {enlace}
            </a>
          ))}
        </nav>

        {/* Acciones usuario */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative grid h-9 w-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-800">{titular || 'Usuario'}</p>
            <p className="text-[10px] text-slate-400">Sesión segura</p>
          </div>

          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-grape-500 to-grape-600 text-xs font-bold text-white">
            {iniciales}
          </span>

          <button
            type="button"
            onClick={onCerrarSesion}
            title="Cerrar sesión"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
