import type { ActionTree } from 'vuex';
import type { GeneralState } from '@/store/client/types';
import type { GetVideoDetailsRes } from '@/store/client/models';
import type { UserLocation } from '@/models';
import type { BaseOptions } from '@/shared/models';
import type { RootState } from '@/store';
import type { ListCompaniesRes } from '@/views/employee/models';
import {
  ADDRESSES_CACHE,
  COMPANIES_CACHE,
  EXCHANGE_RATES,
  GET_EXCHANGE_RATES,
  GET_VIDEO_DETAILS,
  LIST_ADDRESSES,
  LIST_COMPANIES,
  SET_ADDRESSES_CACHE,
  SET_COMPANIES_CACHE,
  SET_EXCHANGE_RATES,
} from '@/store/client/constants';
import { container } from 'tsyringe';
import GeneralServices from '@/store/client/service/general.services';
import StoreCache from '@/store/services/store.cache';
import { StoreNamespace } from '@/store/store-namespace';

const generalServices = container.resolve(GeneralServices);

const actions: ActionTree<GeneralState, RootState> = {
  [GET_EXCHANGE_RATES]: async ({ commit, state }): Promise<void> => {
    const today = new Date().toDateString();
    const createdAt = new Date(state[EXCHANGE_RATES].createdAt || 0).toDateString();

    if (today !== createdAt) {
      if (!state[EXCHANGE_RATES].createdAt) {
        state[EXCHANGE_RATES].createdAt = Date.now();
      }

      const res = await generalServices[GET_EXCHANGE_RATES]();

      commit(SET_EXCHANGE_RATES, res);
    }
  },

  [LIST_COMPANIES]: async (_, query: string): Promise<ListCompaniesRes['companies']> => {
    if ((query || []).length < 3) {
      return [];
    }

    const cacheService = new StoreCache(COMPANIES_CACHE, SET_COMPANIES_CACHE, StoreNamespace.GENERAL_MODULE);
    const cache = cacheService.get<string, ListCompaniesRes['companies']>(query);

    if (cache) {
      return cache;
    }

    const { companies } = await generalServices[LIST_COMPANIES](query);
    cacheService.set<{ query: string }, ListCompaniesRes['companies']>({ query }, companies, { expiredIn: 3 * 60 * 1000 });

    return companies;
  },

  [LIST_ADDRESSES]: async (_, query: string): Promise<BaseOptions<UserLocation>> => {
    if ((query || []).length < 3) {
      return [];
    }

    const cacheService = new StoreCache(ADDRESSES_CACHE, SET_ADDRESSES_CACHE, StoreNamespace.GENERAL_MODULE);
    const cache = cacheService.get<string, BaseOptions<UserLocation>>(query);

    if (cache) {
      return cache;
    }

    const { options } = await generalServices[LIST_ADDRESSES](query);
    cacheService.set<{ query: string }, BaseOptions<UserLocation>>({ query }, options, { expiredIn: 3 * 60 * 1000 });

    return options;
  },

  [GET_VIDEO_DETAILS]: async (_, videoUrl: string): Promise<GetVideoDetailsRes> => {
    return await generalServices[GET_VIDEO_DETAILS](videoUrl);
  },
};

export default actions;
