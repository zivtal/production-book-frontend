import type { AxiosResponseInterceptor } from '@/shared/services/api-service/models';
import axios, { type AxiosError, type AxiosResponse } from 'axios';

export const errorsInterceptor: AxiosResponseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    return response;
  },
  onRejected: async (error: AxiosError) => {
    const err: AxiosError = error;

    if (axios.isCancel(error)) {
      throw error;
    }

    throw err;
  },
};
