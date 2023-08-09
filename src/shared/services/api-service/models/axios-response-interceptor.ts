import { AxiosError, AxiosResponse } from 'axios';

export interface AxiosResponseInterceptor {
  onFulfilled: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected: (error: AxiosError) => AxiosError | Promise<AxiosError> | any;
}
