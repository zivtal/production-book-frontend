import type { AxiosRequestInterceptor } from '@/shared/services/api-service/models';
import { AxiosError, type AxiosRequestConfig } from 'axios';
import store from '@/store';
import { GET_USER } from '@/store/auth/constants';
import { StoreNamespace } from '@/store/store-namespace';
import { COORDINATES } from '@/store/constants';

export const addUserDetailsInterceptor: AxiosRequestInterceptor = {
  onFulfilled: (request: AxiosRequestConfig) => {
    const activeUser = store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_USER}`];
    const coordinates = store.getters[COORDINATES];

    if (activeUser?.skills) {
      (request.headers || {}).skills = activeUser.skills;
    }

    if (activeUser?.specialization) {
      (request.headers || {}).specialization = activeUser.specialization;
    }

    if (activeUser?.wage?.currencyType) {
      (request.headers || {}).currency = activeUser?.wage?.currencyType;
    }

    if (activeUser?.location.coordinates || coordinates) {
      (request.headers || {}).coordinates = activeUser?.location?.coordinates || coordinates;
    }

    return request;
  },
  onRejected: (error: AxiosError) => Promise.reject(error),
};
