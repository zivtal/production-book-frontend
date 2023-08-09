import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { GeneralState } from '@/store/client/types';
import type { GetExchangeRatesRes } from '@/store/client/models';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { ADDRESSES_CACHE, COMPANIES_CACHE, EXCHANGE_RATES } from '@/store/client/constants';

export const initialState = (): GeneralState => ({
  [EXCHANGE_RATES]: {} as GetExchangeRatesRes,
  [ADDRESSES_CACHE]: {},
  [COMPANIES_CACHE]: {},
});

const generalStore: Module<GeneralState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default generalStore;
