import type { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import type { GeneralState } from '@/store/client/types';
import type { BaseOptions } from '@/shared/models';
import type { UserLocation } from '@/models';
import type { ListCompaniesRes } from '@/views/employee/models';
import type { GetExchangeRatesRes } from '@/store/client/models';
import { ADDRESSES_CACHE, COMPANIES_CACHE, EXCHANGE_RATES, GET_EXCHANGE_RATES } from '@/store/client/constants';
import { StateCache } from '@/store/services/store.cache';

const getters: GetterTree<GeneralState, RootState> = {
  [GET_EXCHANGE_RATES](state): GetExchangeRatesRes['exchangeRates'] {
    return state[EXCHANGE_RATES].exchangeRates || [];
  },

  [COMPANIES_CACHE](state): StateCache<ListCompaniesRes['companies']> {
    return state[COMPANIES_CACHE] || ({} as StateCache<ListCompaniesRes['companies']>);
  },

  [ADDRESSES_CACHE](state): StateCache<BaseOptions<UserLocation>> {
    return state[ADDRESSES_CACHE] || ({} as StateCache<BaseOptions<UserLocation>>);
  },
};

export default getters;
