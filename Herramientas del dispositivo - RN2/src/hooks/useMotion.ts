import { useCallback, useEffect, useState } from 'react';
import type { MotionReading } from '../types';

type PermissionEvent = typeof DeviceMotionEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

const emptyReading: MotionReading = { acceleration: 0, rotation: 0, tilt: 0 };

export function useMotion() {
  const [reading, setReading] = useState(emptyReading);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const onMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      setReading({
        acceleration: Math.hypot(acceleration?.x ?? 0, acceleration?.y ?? 0, acceleration?.z ?? 0),
        rotation: Math.hypot(event.rotationRate?.alpha ?? 0, event.rotationRate?.beta ?? 0, event.rotationRate?.gamma ?? 0),
        tilt: Math.atan2(acceleration?.x ?? 0, acceleration?.y ?? 1) * (180 / Math.PI),
      });
    };
    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [active]);

  const toggle = useCallback(async () => {
    if (active) {
      setActive(false);
      setReading(emptyReading);
      return true;
    }
    const MotionEvent = window.DeviceMotionEvent as PermissionEvent | undefined;
    if (!MotionEvent) return false;
    if (MotionEvent.requestPermission && (await MotionEvent.requestPermission()) !== 'granted') return false;
    setActive(true);
    return true;
  }, [active]);

  return { reading, active, toggle };
}
