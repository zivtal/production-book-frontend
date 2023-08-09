import type { BaseId } from '@/shared/models';
import type { GetExchangeRatesRes } from '@/store/client/models';
import store from '@/store';
import { LOADING, SET_COORDINATES, SET_LANGUAGE, SET_LOADING, RESET_STATE } from '@/store/constants';
import { computed, ComputedRef } from 'vue';
import { StoreNamespace } from '@/store/store-namespace';
import { GET_CURRENCY } from '@/store/auth/constants';
import { GET_EXCHANGE_RATES } from '@/store/client/constants';

export const useRoot = () => ({
  [LOADING]: (id?: BaseId): ComputedRef<boolean> => computed((): boolean => store.getters[LOADING].includes(id)),

  [SET_LOADING]: (id?: string): void => store.commit(SET_LOADING, id),

  [SET_LANGUAGE]: (language?: string): void => store.commit(SET_LANGUAGE, language),

  [SET_COORDINATES]: (coordinates?: [number, number]): void => store.commit(SET_COORDINATES, coordinates),

  [RESET_STATE]: (): void => {
    store.commit(`${StoreNamespace.JOBS_MODULE}/${RESET_STATE}`);
  },

  [GET_CURRENCY]: (): string => store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_CURRENCY}`],

  [GET_EXCHANGE_RATES]: (): GetExchangeRatesRes['exchangeRates'] => store.getters[`${StoreNamespace.GENERAL_MODULE}/${GET_EXCHANGE_RATES}`],
});
