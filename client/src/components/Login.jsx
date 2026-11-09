/**
 * Login: pantalla de acceso estilo banca en línea.
 * Valida las credenciales contra el backend (POST /api/auth/login)
 * y muestra los usuarios de prueba disponibles.
 */
import { useState } from 'react';
import { api } from '../services/api.js';

// Usuarios de prueba creados por el script seed
const USUARIOS_DEMO = [
  { usuario: 'juan', contrasena: '1234', etiqueta: 'Juan · Cta. 001-1001' },
  { usuario: 'maria', contrasena: '1234', etiqueta: 'María · Cta. 001-1002' },
  { usuario: 'carlos', contrasena: '1234', etiqueta: 'Carlos · Cta. 001-1003' },
];

export default function Login({ onIniciarSesion }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [recordarme, setRecordarme] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  /** Autocompleta el formulario con un usuario de prueba */
  function autocompletar(u) {
    setUsuario(u.usuario);
    setContrasena(u.contrasena);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validación de campos vacíos
    if (!usuario.trim() || !contrasena.trim()) {
      setError('Completa usuario y contraseña para continuar.');
      return;
    }

    setCargando(true);

    try {
      // Validación real contra el backend (MongoDB)
      const datos = await api.login(usuario, contrasena);
      onIniciarSesion({ ...datos, recordarme });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Panel de marca */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-grape-600 lg:flex lg:flex-col lg:justify-between lg:p-10">
        {/* Decoraciones */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-black/20 blur-2xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-extrabold text-brand-700 shadow-lg">
            B
          </span>
          <div className="leading-none">
            <p className="text-lg font-extrabold text-white">
              Banco<span className="text-white/70">Simple</span>
            </p>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">
              Banca personal
            </p>
          </div>
        </div>

        {/* Mensaje */}
        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Tu dinero, siempre
            <br />
            bajo tu control.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Consulta tu saldo, deposita, retira y transfiere en segundos con la
            seguridad de una plataforma cifrada de extremo a extremo.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              'Transferencias al instante sin comisión',
              'Historial de movimientos en tiempo real',
              'Acceso desde cualquier dispositivo',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/85">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          © 2026 BancoSimple · Aplicación demostrativa académica
        </p>
      </div>

      {/* Panel del formulario */}
      <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo móvil */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-lg font-extrabold text-white shadow-brand">
              B
            </span>
            <p className="text-lg font-extrabold text-slate-900">
              Banco<span className="text-brand-600">Simple</span>
            </p>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Bienvenido de vuelta
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Ingresa tus datos para acceder a tu cuenta.
          </p>

          {/* Alerta de error */}
          {error && (
            <div className="animate-fade-in mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Usuario */}
            <div>
              <label htmlFor="usuario" className="mb-1.5 block text-xs font-semibold text-slate-600">
                Usuario
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0" />
                  </svg>
                </span>
                <input
                  id="usuario"
                  type="text"
                  autoComplete="username"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="tu_usuario"
                  className="w-full rounded-xl border-0 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 shadow-sm ring-1 ring-slate-200 transition placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="contrasena" className="mb-1.5 block text-xs font-semibold text-slate-600">
                Contraseña
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
                <input
                  id="contrasena"
                  type={verContrasena ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-0 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 shadow-sm ring-1 ring-slate-200 transition placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setVerContrasena((v) => !v)}
                  aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-3 my-auto grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    {verContrasena ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.066 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    )}
                    {!verContrasena && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Opciones */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                Recordarme
              </label>
              <button type="button" className="text-xs font-semibold text-brand-600 transition hover:text-brand-700">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-3.5 text-sm font-bold text-white shadow-brand transition-all hover:from-brand-700 hover:to-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {cargando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Verificando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Usuarios de prueba */}
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3.5">
            <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Usuarios de prueba
            </p>
            <div className="mt-2.5 space-y-1.5">
              {USUARIOS_DEMO.map((u) => (
                <button
                  key={u.usuario}
                  type="button"
                  onClick={() => autocompletar(u)}
                  className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-left transition hover:bg-brand-50"
                >
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {u.usuario} / {u.contrasena}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">{u.etiqueta}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              Cada usuario accede a su propia cuenta
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Conexión segura · Cifrado SSL
          </p>
        </div>
      </div>
    </div>
  );
}
