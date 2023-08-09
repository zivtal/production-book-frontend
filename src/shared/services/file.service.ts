import type { AttachFile } from '@/shared/types';

export default class FileService {
  public static async isFileExists(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      fetch(URL.createObjectURL(file))
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  public static isValidBase64(data: string): boolean {
    return !!(/data:([^"]+)*/g.exec(data) || []).length;
  }

  public static type(fileName: string): string | undefined {
    const ext = fileName?.split('.');

    return ext ? ext[ext.length - 1] : undefined;
  }

  public static async urlToBlob(url: string): Promise<Blob> {
    const urlData = await fetch(url);

    return await urlData.blob();
  }

  public static prefixBase64(dataBase64: string, type?: string): string {
    const data = dataBase64?.split(',')[1] || dataBase64;

    switch (type) {
      case 'jpg':
      case 'jpeg':
      case 'png': {
        return `data:image/${type};base64, ${data}`;
      }
      default: {
        return dataBase64 as string;
      }
    }
  }

  public static async urlToBase64(url: string): Promise<string | undefined> {
    const blob = await this.urlToBlob(url);
    const urlType = this.type(url);

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const dataBase64: string = reader.result as string;

        resolve(this.prefixBase64(dataBase64, urlType));
      };
    });
  }

  public static base64ToBlob(dataBase64: string, type: string): Blob {
    const blob = atob(dataBase64.split(',')[1]);
    const charCodes = [...Array(blob.length)].map((_, index) => blob.charCodeAt(index));

    return new Blob([new Uint8Array(charCodes)], { type });
  }

  public static base64ToFile(dataBase64: string, { name, type, lastModified }: AttachFile): File {
    return new File([this.base64ToBlob(dataBase64, type)], name, { type, lastModified });
  }

  public static async fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() ?? '');
      reader.onerror = (error) => reject(error);
    });
  }

  public static async uploadFile(options?: { accept?: Array<string>; multiple?: boolean }): Promise<FileList | null> {
    return new Promise((resolve, reject) => {
      const uploadInput: HTMLInputElement = document.createElement('input');
      uploadInput.multiple = options?.multiple || false;
      uploadInput.type = 'file';
      uploadInput.accept = (options?.accept || ['*']).join(',');
      uploadInput.click();

      uploadInput.onchange = () => {
        uploadInput.remove();
        resolve(uploadInput?.files);
      };

      uploadInput.onerror = () => {
        uploadInput.remove();
        reject();
      };

      uploadInput.oncancel = () => resolve(null);
    });
  }

  public static downloadBase64(dataBase64: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = dataBase64;
    link.download = fileName;
    link.click();
    link.remove();
  }
}
