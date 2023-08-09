/* eslint-disable */
import { Camera } from '@/models/equipments';

export const newDb: Array<Camera> = [
  {
    brand: 'Canon',
    model: 'PowerShot V10',
    releaseYear: 2023,
    type: 'CAMERA',
    dimensions: { mm: '63 x 90 x 34' },
    weight: { g: 211 },
    megaPixels: 15,
    bodyType: 'Compact',
    sensor: {
      sensorSize: '1" (13.2 x 8.8 mm)',
      sensorType: 'BSI-CMOS',
      effectivePixels: 15,
    },
    integratedLens: {
      focalLength: [18],
      maximumAperture: [2.8],
    },
    iso: {
      low: 125,
      high: 6400,
    },
    stabilization: {
      integrated: false,
    },
    shutter: {
      shutterSpeed: { min: '1 sec', max: '1/2000 sec' },
    },
    lcd: {
      articulated: 'Tilting',
      screenSize: 2,
      touchScreen: false,
      liveView: true,
    },
    storageMedia: {
      storageType: ['microSD'],
      numberOfSlots: 1,
    },
    power: {
      batteryLifeTime: '290 shots',
    },
    video: {
      resolution: ['3840 x 2160', '1920 x 1080'],
      recordingFormats: ['MPEG-4', 'H.264'],
    },
  },
  {
    brand: 'Canon',
    model: 'EOS R100',
    releaseYear: 2023,
    type: 'CAMERA',
    dimensions: { mm: '116 x 86 x 69' },
    weight: { g: 356 },
    megaPixels: 24,
    bodyType: 'SLR-style mirrorless',
    sensor: {
      sensorSize: 'APS-C (22.3 x 14.9 mm)',
      sensorType: 'CMOS',
      effectivePixels: 24,
      processor: 'Digic 8',
    },
    lensMount: ['Canon RF'],
    iso: {
      low: 100,
      high: 25600,
    },
    focus: {
      numberOfPoints: 3975,
    },
    stabilization: {
      integrated: false,
    },
    shutter: {
      shutterSpeed: { min: '1 sec', max: '1/4000 sec' },
    },
    lcd: {
      articulated: 'Fixed',
      screenSize: 3,
      touchScreen: false,
      liveView: true,
    },
    viewfinder: {
      viewfinderType: 'Electronic',
      viewfinderCoverage: 100,
      viewfinderResolution: 2360000,
    },
    storageMedia: {
      storageType: ['SD/UHS-I'],
      numberOfSlots: 1,
    },
    power: {
      compatibleBatteryType: ['Canon LP-E17 battery pack'],
    },
  },
];
