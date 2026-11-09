import { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import SaldoCard from './components/SaldoCard.jsx';
import AccesosRapidos from './components/AccesosRapidos.jsx';
import ResumenMes from './components/ResumenMes.jsx';
import FormOperacion from './components/FormOperacion.jsx';
import HistorialTransacciones from './components/HistorialTransacciones.jsx';
import { api } from './services/api.js';

/** Saludo con fecha en español estilo app bancaria */
function obtenerSaludo() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function obtenerFecha() {
  return new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Lee la sesión guardada (si existe y es válida) */
function leerSesion() {
  try {
    const crudo = localStorage.getItem('sesionBanco');
    if (!crudo) return null;
    const datos = JSON.parse(crudo);
    return datos?.cuentaId ? datos : null;
  } catch {
    return null;
  }
}

/**
 * App: componente padre con el layout de banca en línea.
 * Cada usuario inicia sesión y accede únicamente a SU cuenta.
 */
export default function App() {
  // Sesión del usuario autenticado (usuario, nombre, cuentaId...)
  const [sesion, setSesion] = useState(leerSesion);

  const [cuentas, setCuentas] = useState([]); // todas (para transferencias)
  const [cuentaId, setCuentaId] = useState(sesion?.cuentaId || '');
  const [cuenta, setCuenta] = useState(null);
  const [historial, setHistorial] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [operacionActiva, setOperacionActiva] = useState('deposito');

  const [mensaje, setMensaje] = useState(null); // { tipo: 'exito' | 'error', texto }

  /** Muestra un mensaje temporal (3.5 s) */
  const mostrarMensaje = useCallback((tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3500);
  }, []);

  /** Al iniciar sesión desde el login (datos validados por el backend) */
  function manejarInicioSesion(datos) {
    const { recordarme, ...usuario } = datos;
    if (recordarme) localStorage.setItem('sesionBanco', JSON.stringify(usuario));
    else sessionStorage.setItem('sesionBanco', JSON.stringify(usuario));

    setSesion(usuario);
    setCuentaId(usuario.cuentaId);
    setCargando(true);
  }

  /** Cerrar sesión y volver al login */
  function manejarCierreSesion() {
    localStorage.removeItem('sesionBanco');
    sessionStorage.removeItem('sesionBanco');
    setSesion(null);
    setCuenta(null);
    setHistorial([]);
    setCuentas([]);
    setCuentaId('');
    setCargando(true);
  }

  /** Refresca saldo + historial sin recargar la página */
  const refrescar = useCallback(async (id) => {
    if (!id) return;
    const [datos, movimientos] = await Promise.all([
      api.obtenerCuenta(id),
      api.obtenerHistorial(id),
    ]);
    setCuenta(datos);
    setHistorial(movimientos);
  }, []);

  // Al iniciar sesión: cargar la lista de cuentas (para transferir a otros)
  // y fijar la cuenta del usuario
  useEffect(() => {
    if (!sesion) return;
    let cancelado = false;

    (async () => {
      try {
        const lista = await api.listarCuentas();
        if (cancelado) return;
        setCuentas(lista);
        setCuentaId(sesion.cuentaId);
      } catch (error) {
        mostrarMensaje(
          'error',
          'No se pudo conectar con el backend. Verifica que esté corriendo.'
        );
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [sesion, mostrarMensaje]);

  // Cargar saldo e historial de la cuenta del usuario
  useEffect(() => {
    if (!cuentaId) return;
    (async () => {
      try {
        setCargando(true);
        await refrescar(cuentaId);
      } catch (error) {
        mostrarMensaje('error', error.message);
      } finally {
        setCargando(false);
      }
    })();
  }, [cuentaId, refrescar, mostrarMensaje]);

  /** Historial con marca de entrada/salida para el resumen */
  const historialConDireccion = useMemo(
    () =>
      historial.map((t) => ({
        ...t,
        esEntrada:
          t.tipo === 'deposito' ||
          (t.cuentaDestino && t.cuentaDestino._id === cuentaId),
      })),
    [historial, cuentaId]
  );

  /** Accesos rápidos: cambia la operación o desplaza al historial */
  function manejarAccesoRapido(id) {
    if (id === 'historial') {
      document
        .getElementById('historial')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setOperacionActiva(id);
    document.getElementById('operaciones')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /** Manejador único de operaciones bancarias */
  async function manejarOperacion({ tipo, monto, cuentaDestinoId, error }) {
    if (error) {
      mostrarMensaje('error', error);
      return { error };
    }

    setProcesando(true);
    try {
      let respuesta;

      if (tipo === 'deposito') {
        respuesta = await api.depositar(cuentaId, monto);
      } else if (tipo === 'retiro') {
        respuesta = await api.retirar(cuentaId, monto);
      } else {
        respuesta = await api.transferir(cuentaId, cuentaDestinoId, monto);
      }

      await refrescar(cuentaId);
      setCuentas(await api.listarCuentas());

      mostrarMensaje('exito', respuesta.mensaje);
      return {};
    } catch (e) {
      mostrarMensaje('error', e.message);
      return { error: e.message };
    } finally {
      setProcesando(false);
    }
  }

  // Sin sesión activa: pantalla de acceso
  if (!sesion) {
    return <Login onIniciarSesion={manejarInicioSesion} />;
  }

  const nombreTitular = sesion.nombre?.split(' ')[0] || 'cliente';

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar titular={sesion.nombre} onCerrarSesion={manejarCierreSesion} />

      {/* Mensajes de éxito / error */}
      {mensaje && (
        <div
          className={`animate-fade-in fixed left-1/2 top-20 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl ${
            mensaje.tipo === 'exito' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {mensaje.tipo === 'exito' ? '✅' : '⚠️'} {mensaje.texto}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Saludo */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {obtenerSaludo()}, {nombreTitular} 👋
            </h1>
            <p className="mt-0.5 text-sm capitalize text-slate-400">{obtenerFecha()}</p>
          </div>
          <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
            🔐 @{sesion.usuario}
          </span>
        </div>

        {/* Fila 1: Tarjeta + Accesos rápidos | Resumen */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {/* Cuenta personal del usuario */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="cuenta-chip bg-brand-600 text-white shadow-brand">
                Mi cuenta · {sesion.numeroCuenta || cuenta?.numeroCuenta}
              </span>
              <span className="cuenta-chip bg-white text-slate-500 ring-1 ring-slate-200">
                {sesion.nombre}
              </span>
            </div>

            <SaldoCard
              saldo={cuenta?.saldo}
              titular={cuenta?.titular}
              numeroCuenta={cuenta?.numeroCuenta}
              cargando={cargando}
            />

            <AccesosRapidos
              activa={operacionActiva}
              onSeleccionar={manejarAccesoRapido}
            />
          </div>

          <div>
            <ResumenMes historial={historialConDireccion} />
          </div>
        </section>

        {/* Fila 2: Operaciones | Historial */}
        <section id="operaciones" className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="animate-slide-up">
            <FormOperacion
              tipo={operacionActiva}
              onCambiarTipo={setOperacionActiva}
              cuentas={cuentas}
              cuentaActualId={cuentaId}
              onOperacion={manejarOperacion}
              procesando={procesando}
            />
          </div>

          <div id="historial" className="lg:col-span-2 scroll-mt-24">
            <HistorialTransacciones
              historial={historial}
              cargando={cargando}
              cuentaId={cuentaId}
            />
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          <p>BancoSimple © 2026 — Ingeniería Web · Trabajo Práctico</p>
          <p className="mt-1">Aplicación demostrativa con fines académicos.</p>
        </footer>
      </main>
    </div>
  );
}
