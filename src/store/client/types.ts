import type AugmentedActionContext from '@/store/types/augmented-action-context';
import type { BaseOptions } from '@/shared/models';
import type { UserLocation } from '@/models';
import type { ListCompaniesRes } from '@/views/employee/models';
import type { GetVideoDetailsRes, GetExchangeRatesRes } from '@/store/client/models';
import type { StateCache } from '@/store/services/store.cache';
import {
  ADDRESSES_CACHE,
  COMPANIES_CACHE,
  EXCHANGE_RATES,
  GET_EXCHANGE_RATE,
  GET_EXCHANGE_RATES,
  GET_VIDEO_DETAILS,
  LIST_ADDRESSES,
  LIST_COMPANIES,
  SET_ADDRESSES_CACHE,
  SET_COMPANIES_CACHE,
  SET_EXCHANGE_RATES,
} from '@/store/client/constants';

type StoreContext = AugmentedActionContext<GeneralState, GeneralMutations, GeneralActions>;

// store
export type GeneralState = {
  [EXCHANGE_RATES]: GetExchangeRatesRes;
  [COMPANIES_CACHE]: StateCache<ListCompaniesRes['companies']>;
  [ADDRESSES_CACHE]: StateCache<BaseOptions<UserLocation>>;
};

export interface GeneralActions {
  [GET_EXCHANGE_RATE]({ commit }: StoreContext, payload: { fromCurrency: string; toCurrency?: string; amount: number }): Promise<void>;
  [GET_EXCHANGE_RATES]({ commit, state }: StoreContext): Promise<void>;
  [LIST_COMPANIES](_: StoreContext, query: string): Promise<ListCompaniesRes['companies']>;
  [LIST_ADDRESSES](_: StoreContext, query: string): Promise<BaseOptions<UserLocation> | undefined>;
  [GET_VIDEO_DETAILS](_: StoreContext, videoId: string): Promise<GetVideoDetailsRes>;
}

export interface GeneralMutations<S = GeneralState> {
  [SET_EXCHANGE_RATES](state: S, payload?: GetExchangeRatesRes): void;
  [SET_COMPANIES_CACHE](state: S, payload: StateCache<ListCompaniesRes['companies']>): void;
  [SET_ADDRESSES_CACHE](state: S, payload?: StateCache<BaseOptions<UserLocation>>): void;
}

// eslint-disable-next-line
export interface GeneralGetters<S = GeneralState> {}
