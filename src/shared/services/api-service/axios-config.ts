import { AxiosRequestConfig } from 'axios';
import { DOMAIN } from '@/shared/constants/domain';

export const axiosGlobalConfig: AxiosRequestConfig = {
  withCredentials: true,
  baseURL: DOMAIN,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    VER: 1,
  },
};
