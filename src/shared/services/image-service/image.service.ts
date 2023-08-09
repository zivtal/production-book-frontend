import FileService from '@/shared/services/file.service';
import type { ImageDimensions } from '@/shared/types';
import type { CanvasBase64Export, CanvasFileExport, ImageResize, MultipleImageResize } from '@/shared/services/image-service/models';

export default class ImageService {
  public static async loadImageFile(file: File): Promise<HTMLImageElement> {
    const data = await FileService.fileToBase64(file);

    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new Image();
      img.src = data;
      img.onload = () => resolve(img);
      img.onerror = () => reject();
    });
  }

  public static async imageDimensions(data: string): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new Image();
      img.src = data;
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject();
    });
  }

  public static async imageResize(
    file: File,
    { quality, type, ...options }: ImageResize
  ): Promise<{ file: () => Promise<File>; base64: () => string }> {
    const canvas = ImageService.canvasResize(await ImageService.loadImageFile(file), options);

    return {
      file: async (): Promise<File> =>
        await ImageService.canvasToFile(canvas, { name: file.name, type: type || file.type, lastModified: file.lastModified, quality }),
      base64: (): string => ImageService.canvasToBase64(canvas, { quality, type: type || file.type }),
    };
  }

  public static async imageMultiResize(file: File, options: Array<MultipleImageResize>): Promise<Array<{ file: File; base64: string }>> {
    const bulk: { [key: number]: File } = {};
    const res: Record<number, { file: File; base64: string }> = {};

    for (const params of [...options].sort(({ megaPixel: a }, { megaPixel: b }) => b - a)) {
      const values = Object.values(bulk);
      const source = values[values.length - 1] || file;
      const { megaPixel } = params;
      const canvas = await ImageService.imageResize(source, params);

      res[megaPixel] = { file: await canvas.file(), base64: canvas.base64() };
    }

    return options.map(({ megaPixel }) => res[megaPixel]);
  }

  public static canvasToBase64(canvas: HTMLCanvasElement, { quality, type }: CanvasBase64Export): string {
    return canvas.toDataURL(type, quality);
  }
  public static async canvasToFile(canvas: HTMLCanvasElement, { quality, type, name, lastModified }: CanvasFileExport): Promise<File> {
    const imageBlob: Blob = await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), type, quality || 0.9));

    return new File([imageBlob], name, { type, lastModified });
  }

  public static canvasResize(source: HTMLImageElement | HTMLCanvasElement, { megaPixel, size }: ImageResize, rounds = 2): HTMLCanvasElement {
    const { width, height } = source;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const canvasCopy1 = document.createElement('canvas');
    const copyContext1 = canvasCopy1.getContext('2d');

    const canvasCopy2 = document.createElement('canvas');
    const copyContext2 = canvasCopy2.getContext('2d');

    const { width: calcWidth, height: calcHeight } = megaPixel
      ? ImageService.calcByMegaPixel({ width, height }, megaPixel)
      : ImageService.calcBySize({ width, height }, size || 0);

    canvasCopy1.width = width;
    canvasCopy1.height = height;
    copyContext1?.drawImage(source, 0, 0);

    canvasCopy2.width = width;
    canvasCopy2.height = height;
    copyContext2?.drawImage(canvasCopy1, 0, 0, canvasCopy1.width, canvasCopy1.height, 0, 0, canvasCopy2.width, canvasCopy2.height);

    [...Array(rounds)].forEach((_, index) => {
      const roundWidth = width - (width - calcWidth) / (rounds - index);
      const roundHeight = height - (height - calcHeight) / (rounds - index);

      canvasCopy1.width = roundWidth;
      canvasCopy1.height = roundHeight;
      copyContext1?.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy1.width, canvasCopy1.height);

      canvasCopy2.width = roundWidth;
      canvasCopy2.height = roundHeight;
      copyContext2?.drawImage(canvasCopy1, 0, 0, canvasCopy1.width, canvasCopy1.height, 0, 0, canvasCopy2.width, canvasCopy2.height);
    });

    canvas.width = calcWidth;
    canvas.height = calcHeight;
    context?.drawImage(canvasCopy2, 0, 0);

    return canvas;
  }

  private static calcByMegaPixel({ width, height }: ImageDimensions, megaPixel?: number, upscale = false): ImageDimensions {
    if (!megaPixel) {
      return { width, height };
    }

    const calcHeight = Math.sqrt(megaPixel * 1000000 * (height / width));
    const calcWidth = Math.sqrt(megaPixel * 1000000 * (width / height));

    return upscale
      ? { width: calcWidth / width, height: calcHeight / height }
      : { width: Math.min(calcWidth, width), height: Math.min(calcHeight, height) };
  }

  private static calcBySize({ width, height }: ImageDimensions, size?: number, upscale = false): ImageDimensions {
    if (!size) {
      return { width, height };
    }

    const calcHeight = height > width ? size : Math.ceil((size * height) / width);
    const calcWidth = height < width ? size : Math.ceil((size * width) / height);

    return upscale ? { width: calcWidth, height: calcHeight } : { width: Math.min(calcWidth, width), height: Math.min(calcHeight, height) };
  }
}
