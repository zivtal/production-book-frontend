import type { AxiosResponseInterceptor } from '@/shared/services/api-service/models';
import type { AxiosError, AxiosResponse } from 'axios';

export const removeReturnCodeInterceptor: AxiosResponseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    if (response?.data?.returnCode === 0) {
      // tslint:disable-next-line
      delete response.data.returnCode;
    }

    return response;
  },
  onRejected: (error: AxiosError) => Promise.reject(error),
};
