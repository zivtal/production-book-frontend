import type { CameraSpecs } from './camera-specs';
import type { DroneSpecs } from './drone-specs';
import type { GimbalSpecs } from './gimbal-specs';
import type { LensSpecs } from './lens-specs';

export type Camera = CameraSpecs;
export type Drone = DroneSpecs;
export type Gimbal = GimbalSpecs;
export type Lens = LensSpecs;

export interface Specs<T> {
  title: string;
  specs: T;
}
