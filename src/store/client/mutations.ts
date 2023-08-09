import type { MutationTree } from 'vuex';
import type { GeneralState } from '@/store/client/types';
import type { BaseOptions } from '@/shared/models';
import type { ListCompaniesRes } from '@/views/employee/models';
import type { UserLocation } from '@/models';
import type { StateCache } from '@/store/services/store.cache';
import type { GetExchangeRatesRes } from '@/store/client/models';

import {
  ADDRESSES_CACHE,
  COMPANIES_CACHE,
  EXCHANGE_RATES,
  SET_ADDRESSES_CACHE,
  SET_COMPANIES_CACHE,
  SET_EXCHANGE_RATES,
} from '@/store/client/constants';
import { initialState } from '@/store/client/index';

const mutations: MutationTree<GeneralState> = {
  [SET_COMPANIES_CACHE]: (state, payload: StateCache<ListCompaniesRes['companies']>) => {
    state[COMPANIES_CACHE] = payload;
  },

  [SET_ADDRESSES_CACHE]: (state, payload: StateCache<BaseOptions<UserLocation>>) => {
    state[ADDRESSES_CACHE] = payload;
  },

  [SET_EXCHANGE_RATES]: (state, payload?: GetExchangeRatesRes) => {
    state[EXCHANGE_RATES] = payload || initialState()[EXCHANGE_RATES];
  },
};

export default mutations;
