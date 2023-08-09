import type { AxiosRequestInterceptor } from '@/shared/services/api-service/models';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import store from '@/store';
import { LANGUAGE } from '@/store/constants';

export const addLanguageInterceptor: AxiosRequestInterceptor = {
  onFulfilled: (request: AxiosRequestConfig) => {
    const currentLanguage = store.getters[LANGUAGE];

    if (currentLanguage) {
      (request.headers || {}).lang = currentLanguage;
    }

    return request;
  },
  onRejected: (error: AxiosError) => Promise.reject(error),
};
