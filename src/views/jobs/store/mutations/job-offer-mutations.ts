import type { MutationTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type { SearchPositionFilters, SearchPositionsRes, GetPositionDetailsRes } from '@/views/jobs/model/position';
import {
  JOB_OFFERS,
  JOB_OFFERS_FILTER,
  SET_JOB_OFFERS,
  SET_JOB_OFFERS_FILTER,
  JOB_OFFERS_PAGINATION,
  CLEAR_JOB_OFFERS,
  SET_POSITION_DETAILS,
  POSITION_DETAILS,
} from '@/views/jobs/store/constants';
import { initialState } from '@/views/jobs/store';

const mutations: MutationTree<JobState> = {
  [SET_JOB_OFFERS]: (state, payload?: SearchPositionsRes) => {
    state[JOB_OFFERS] = payload?.data || initialState()[JOB_OFFERS];
    state[JOB_OFFERS_PAGINATION] = payload?.page || initialState()[JOB_OFFERS_PAGINATION];
  },

  [SET_JOB_OFFERS_FILTER]: (state, payload?: SearchPositionFilters) => {
    state[JOB_OFFERS_FILTER] = payload || initialState()[JOB_OFFERS_FILTER];
  },

  [CLEAR_JOB_OFFERS]: (state) => {
    state[JOB_OFFERS] = initialState()[JOB_OFFERS];
    state[JOB_OFFERS_FILTER] = initialState()[JOB_OFFERS_FILTER];
    state[JOB_OFFERS_PAGINATION] = initialState()[JOB_OFFERS_PAGINATION];
  },

  [SET_POSITION_DETAILS]: (state, payload?: GetPositionDetailsRes) => {
    state[POSITION_DETAILS] = payload || null;
  },
};

export default mutations;
