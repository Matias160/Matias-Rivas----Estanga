# Herramientas del dispositivo - RN2

Aplicación responsive creada con React 19, TypeScript y Vite. Centraliza cámara, lector de códigos, GPS, sensores de movimiento y verificación biométrica. Incluye modo día/noche, animaciones, validaciones y soporte PWA.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

Abrir la dirección local que informa Vite. Para cámara, ubicación y sensores se debe aceptar el permiso del navegador. Fuera de `localhost`, estas APIs necesitan HTTPS.

Al ejecutar `npm run dev`, la terminal muestra automáticamente un código QR con la dirección Wi-Fi. El QR permite abrir la interfaz desde otro dispositivo de la red. Por seguridad, los navegadores móviles bloquean cámara, GPS, sensores y biometría cuando esa dirección usa HTTP; esas funciones se prueban completamente desde el APK.

## Funciones

- Cámara: abre la cámara principal y descarga una captura.
- Lector: detecta QR, EAN-13 y Code 128 en navegadores compatibles.
- GPS: muestra latitud, longitud y precisión.
- Movimiento: visualiza aceleración, rotación e inclinación en vivo.
- Biometría: comprueba WebAuthn, que utiliza huella, rostro o PIN según el dispositivo.
- PWA: puede instalarse desde un navegador compatible.

## Generar un APK

Vite no es compatible con Expo EAS. Este proyecto usa Capacitor, la alternativa adecuada para empaquetar una aplicación web como APK:

```bash
npm install --save-dev @capacitor/cli @capacitor/android
npm run android:add
npm run android:sync
npm run android:open
```

En Android Studio seleccionar `Build > Generate App Bundles or APKs > Generate APKs`. El APK queda dentro de `android/app/build/outputs/apk/`.

## Estructura

```text
public/              Recursos públicos y el ícono de la PWA
src/components/      Componentes reutilizables
src/hooks/           Lógica de tema y sensores
src/App.tsx          Vista principal y coordinación de funciones
src/main.tsx         Punto de entrada
index.html           Documento HTML base
```

Los datos se procesan localmente y no se envían a servidores externos.
