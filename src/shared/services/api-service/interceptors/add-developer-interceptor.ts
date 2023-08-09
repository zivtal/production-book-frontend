import type { AxiosRequestInterceptor } from '@/shared/services/api-service/models';
import type { AxiosError, AxiosRequestConfig } from 'axios';

export const addDeveloperInterceptor: AxiosRequestInterceptor = {
  onFulfilled: (request: AxiosRequestConfig) => {
    if (process.env.NODE_ENV !== 'production') {
      (request.headers || {}).mode = process.env.NODE_ENV;
    }

    return request;
  },
  onRejected: (error: AxiosError) => Promise.reject(error),
};
