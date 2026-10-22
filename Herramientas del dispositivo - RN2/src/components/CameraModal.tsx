import { useEffect, useRef, useState } from 'react';
import { Camera, ScanLine, X } from 'lucide-react';

interface CameraModalProps {
  mode: 'camera' | 'scanner';
  onClose: () => void;
  onMessage: (message: string, error?: boolean) => void;
}

export function CameraModal({ mode, onClose, onMessage }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    let stream: MediaStream | undefined;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      const message = 'El navegador bloqueó la cámara porque la conexión no es segura. Usá localhost o la versión APK.';
      setCameraError(message);
      onMessage(message, true);
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then((media) => {
        stream = media;
        if (videoRef.current) videoRef.current.srcObject = media;
        setReady(true);
      })
      .catch((error: DOMException) => {
        const message = error.name === 'NotAllowedError'
          ? 'Permiso de cámara rechazado. Habilitalo desde la configuración del navegador.'
          : 'No se encontró una cámara disponible.';
        setCameraError(message);
        onMessage(message, true);
      });
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [onMessage]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const link = document.createElement('a');
    link.download = `captura-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
    onMessage('Captura guardada correctamente.');
  };

  const scan = async () => {
    const Detector = (window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector;
    if (!Detector || !videoRef.current) {
      onMessage('El lector nativo no está disponible en este navegador.', true);
      return;
    }
    const codes = await new Detector({ formats: ['qr_code', 'ean_13', 'code_128'] }).detect(videoRef.current);
    onMessage(codes[0] ? `Código detectado: ${codes[0].rawValue}` : 'No se encontró un código. Intentá acercarlo.');
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={mode === 'camera' ? 'Cámara' : 'Lector de códigos'}>
      <div className="camera-modal">
        <div className="modal-head">
          <div><span>HERRAMIENTA</span><h2>{mode === 'camera' ? 'Cámara' : 'Lector de códigos'}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><X /></button>
        </div>
        <div className="viewfinder">
          <video ref={videoRef} autoPlay playsInline muted />
          {mode === 'scanner' && <div className="scan-frame"><i /></div>}
          {!ready && <div className={`camera-loading ${cameraError ? 'camera-loading--error' : ''}`}>
            {cameraError || 'Esperando permiso de cámara…'}
          </div>}
        </div>
        <canvas ref={canvasRef} hidden />
        <button type="button" className="primary-button" onClick={mode === 'camera' ? capture : scan} disabled={!ready}>
          {mode === 'camera' ? <Camera /> : <ScanLine />}
          {cameraError ? 'Cámara no disponible' : mode === 'camera' ? 'Tomar foto' : 'Escanear ahora'}
        </button>
      </div>
    </div>
  );
}
