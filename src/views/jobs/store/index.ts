import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { JobState } from '@/views/jobs/store/types';
import type { JobManagerFilters } from '@/views/jobs/model/job';
import type { SearchPositionFilters } from '@/views/jobs/model/position/search-position-filters';
import type { BasePagination, BaseOptions } from '@/shared/models';
import type { StateCache } from '@/store/services/store.cache';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import {
  JOB_OFFERS,
  JOB_OFFERS_FILTER,
  JOB_POSTS,
  JOB_POSTS_FILTER,
  SKILLS,
  CLASSIFICATIONS,
  JOB_DETAILS,
  CONVERSATION,
  JOB_POSTS_PAGINATION,
  JOB_OFFERS_PAGINATION,
  POSITION_DETAILS,
} from '@/views/jobs/store/constants';

export const initialState = (): JobState => ({
  [JOB_OFFERS]: null,
  [JOB_OFFERS_FILTER]: {} as SearchPositionFilters,
  [JOB_OFFERS_PAGINATION]: { size: 10 } as BasePagination,
  [JOB_POSTS]: null,
  [JOB_POSTS_FILTER]: {} as JobManagerFilters,
  [JOB_POSTS_PAGINATION]: { size: 10 } as BasePagination,
  [SKILLS]: {} as StateCache<BaseOptions<string>>,
  [CLASSIFICATIONS]: null,
  [JOB_DETAILS]: null,
  [POSITION_DETAILS]: null,
  [CONVERSATION]: null,
});

const jobStore: Module<JobState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default jobStore;
