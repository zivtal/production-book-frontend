export interface BaseSpecs {
  brand: string;
  model: string;
  releaseYear?: number;
  type: 'LENS' | 'TELECONVERTER' | 'CAMERA' | 'CAMCORDER' | 'DRONE' | 'GIMBAL';
  dimensions?: Partial<{ inch: string; mm: string }>;
  weight?: Partial<{ oz: number; g: number }>;
}
