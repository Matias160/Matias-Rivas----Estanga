export type ToolId = 'camera' | 'scanner' | 'location' | 'motion' | 'biometric';

export interface Notice {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface MotionReading {
  acceleration: number;
  rotation: number;
  tilt: number;
}
