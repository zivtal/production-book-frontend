import CryptService from '@/shared/services/crypt.service';

export default class LocalStorageService {
  public static save = <T>(key: string, value: T, encryptCode?: string): void => {
    const data = ((): string => {
      const cache = JSON.stringify(value);

      return encryptCode ? CryptService.encrypt(cache, encryptCode) : cache;
    })();

    localStorage.setItem(key, data);
  };

  public static load = <T>(key: string, decryptCode?: string): T | undefined => {
    return (() => {
      try {
        const cache = localStorage.getItem(key);

        return cache ? JSON.parse(decryptCode ? CryptService.decrypt(cache, decryptCode) : cache) : undefined;
      } catch (e) {
        localStorage.removeItem(key);
      }
    })();
  };
}
