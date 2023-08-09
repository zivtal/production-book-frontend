const CANVAS_QUALITY = <const>[0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
export type CanvasQuality = (typeof CANVAS_QUALITY)[number];

export const IMAGE_TYPE = ['image/jpeg', 'image/png', 'image/jpg'];
export const CANVAS_TYPE = [...IMAGE_TYPE] as const;
export type CanvasType = (typeof CANVAS_TYPE)[number];

type Resize = {
  quality?: CanvasQuality;
  type?: CanvasType;
  size?: number;
};

export type ImageResize = Resize & { megaPixel?: number };

export type MultipleImageResize = Resize & { megaPixel: number };

export type CanvasFileExport = { quality?: number; type: string; name: string; lastModified: number };

export type CanvasBase64Export = { quality?: number; type: string };
