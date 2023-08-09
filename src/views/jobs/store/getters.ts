import type { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import type { JobState } from '@/views/jobs/store/types';
import type { ListJobs } from '@/views/jobs/model/job';
import type { SearchPositionsRes } from '@/views/jobs/model/position/search-positions-res';
import type { BaseOptions } from '@/shared/models';
import type { StateCache } from '@/store/services/store.cache';
import { GET_JOB_OFFERS, GET_JOB_POSTS, JOB_OFFERS, JOB_POSTS, SKILLS } from '@/views/jobs/store/constants';

const getters: GetterTree<JobState, RootState> = {
  [GET_JOB_POSTS](state): ListJobs['data'] {
    return state[JOB_POSTS] || [];
  },

  [GET_JOB_OFFERS](state): SearchPositionsRes['data'] {
    return state[JOB_OFFERS] || [];
  },

  [SKILLS](state): StateCache<BaseOptions<string>> {
    return state[SKILLS] || ({} as StateCache<BaseOptions<string>>);
  },
};

export default getters;
