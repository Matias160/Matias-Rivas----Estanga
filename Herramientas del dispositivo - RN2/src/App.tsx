import { useCallback, useEffect, useState } from 'react';
import { Camera, Fingerprint, Gauge, LocateFixed, Moon, QrCode, ShieldCheck, Smartphone, Sun, Wifi } from 'lucide-react';
import { CameraModal } from './components/CameraModal';
import { ToolCard } from './components/ToolCard';
import { useMotion } from './hooks/useMotion';
import { useTheme } from './hooks/useTheme';
import type { Notice, ToolId } from './types';

function App() {
  const { dark, toggleTheme } = useTheme();
  const motion = useMotion();
  const [modal, setModal] = useState<'camera' | 'scanner' | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [coordinates, setCoordinates] = useState<string>('Aún sin consultar');
  const secureConnection = window.isSecureContext;

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const notify = useCallback((message: string, error = false) => {
    setNotice({ message, type: error ? 'error' : 'success' });
  }, []);

  const locate = () => {
    if (!secureConnection) return notify('El navegador exige HTTPS para compartir la ubicación. Usá la versión APK.', true);
    if (!navigator.geolocation) return notify('La ubicación no está disponible en este dispositivo.', true);
    setCoordinates('Buscando ubicación…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)} · ±${Math.round(coords.accuracy)} m`);
        notify('Ubicación obtenida correctamente.');
      },
      () => {
        setCoordinates('Permiso denegado o señal no disponible');
        notify('No pudimos obtener tu ubicación.', true);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const authenticate = async () => {
    if (!secureConnection) return notify('La biometría requiere una conexión segura o la versión APK.', true);
    if (!window.PublicKeyCredential || !navigator.credentials) return notify('La autenticación biométrica no está disponible.', true);
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    notify(available ? 'El dispositivo admite biometría mediante WebAuthn.' : 'No se detectó un autenticador biométrico.', !available);
  };

  const activateMotion = async () => {
    if (!secureConnection) return notify('Los sensores requieren una conexión segura o la versión APK.', true);
    const granted = await motion.toggle();
    if (!granted) notify('No se concedió permiso para leer los sensores.', true);
  };

  const handleTool = (tool: ToolId) => {
    if (tool === 'camera' || tool === 'scanner') setModal(tool);
    if (tool === 'location') locate();
    if (tool === 'motion') activateMotion();
    if (tool === 'biometric') authenticate();
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Device Hub, inicio">
          <span><Smartphone /></span>
          <strong>DEVICE<span>HUB</span></strong>
        </a>
        <div className="topbar__actions">
          <span className="connection"><i /><Wifi /> Dispositivo listo</span>
          <button type="button" className="theme-button" onClick={toggleTheme} aria-label="Cambiar tema">
            {dark ? <Sun /> : <Moon />}<span>{dark ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
        </div>
      </header>

      <main id="inicio">
        {!secureConnection && (
          <aside className="security-warning" role="status">
            <ShieldCheck />
            <div><strong>Acceso móvil limitado por el navegador</strong><span>La interfaz funciona, pero HTTP bloquea cámara, GPS, sensores y biometría. Para probarlos necesitás el APK.</span></div>
          </aside>
        )}
        <section className="hero">
          <div className="eyebrow"><ShieldCheck /> CONTROL LOCAL Y SEGURO</div>
          <h1>Todo el poder de tu<br /><span>dispositivo.</span></h1>
          <p>Explorá las capacidades de tu teléfono desde un solo lugar. Probá cada herramienta de forma simple, privada y segura.</p>
          <div className="hero__meta"><span><i /> 5 herramientas disponibles</span><span>Sin datos enviados</span></div>
          <div className="orb orb--one" /><div className="orb orb--two" />
        </section>

        <section className="tools-section" aria-labelledby="tools-title">
          <div className="section-heading">
            <div><span>EXPLORAR</span><h2 id="tools-title">Herramientas del dispositivo</h2></div>
            <p>Elegí una tarjeta para comenzar</p>
          </div>
          <div className="tools-grid">
            <ToolCard title="Cámara" description="Capturá una foto usando la cámara principal de tu dispositivo." icon={<Camera />} accent="#8b5cf6" action="Abrir cámara" onAction={() => handleTool('camera')} />
            <ToolCard title="Lector de códigos" description="Escaneá códigos QR, EAN-13 y Code 128 desde la cámara." icon={<QrCode />} accent="#23c6b7" action="Iniciar escáner" onAction={() => handleTool('scanner')} />
            <ToolCard title="Ubicación y GPS" description="Obtené tus coordenadas y la precisión de la señal actual." icon={<LocateFixed />} accent="#f29c46" action="Obtener ubicación" onAction={() => handleTool('location')} active={coordinates.includes(',')}>
              <div className="reading reading--location"><small>LECTURA ACTUAL</small><strong>{coordinates}</strong></div>
            </ToolCard>
            <ToolCard title="Movimiento" description="Visualizá datos del acelerómetro y giroscopio en tiempo real." icon={<Gauge />} accent="#54a6ff" action={motion.active ? 'Detener sensores' : 'Activar sensores'} onAction={() => handleTool('motion')} active={motion.active}>
              <div className="sensor-readings">
                <span><small>ACEL.</small><b>{motion.reading.acceleration.toFixed(1)}</b><em>m/s²</em></span>
                <span><small>GIRO</small><b>{motion.reading.rotation.toFixed(0)}</b><em>°/s</em></span>
                <span><small>INCL.</small><b>{motion.reading.tilt.toFixed(0)}</b><em>°</em></span>
              </div>
            </ToolCard>
            <ToolCard title="Biometría" description="Verificá si tu dispositivo admite huella, rostro o PIN seguro." icon={<Fingerprint />} accent="#ef668e" action="Verificar biometría" onAction={() => handleTool('biometric')} />
          </div>
        </section>
      </main>

      <footer><span><Smartphone /> DEVICEHUB</span><p>Las herramientas se ejecutan localmente. Tu información no sale del dispositivo.</p><b>RN2 · 2026</b></footer>
      {notice && <div className={`toast toast--${notice.type}`} role="status"><i />{notice.message}</div>}
      {modal && <CameraModal mode={modal} onClose={() => setModal(null)} onMessage={notify} />}
    </div>
  );
}

export default App;
