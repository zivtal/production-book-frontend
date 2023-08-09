import type { MutationTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type { ListJobs, JobManagerFilters, GetJobDetailsRes } from '@/views/jobs/model/job';
import {
  JOB_POSTS,
  JOB_POSTS_FILTER,
  SET_JOB_POSTS,
  SET_JOB_POSTS_FILTER,
  SET_JOB_DETAILS,
  JOB_DETAILS,
  UPDATE_JOB_DETAILS,
  JOB_POSTS_PAGINATION,
  CLEAR_JOB_POSTS,
} from '@/views/jobs/store/constants';
import { initialState } from '@/views/jobs/store';

const mutations: MutationTree<JobState> = {
  [CLEAR_JOB_POSTS]: (state) => {
    state[JOB_POSTS] = initialState()[JOB_POSTS];
    state[JOB_POSTS_FILTER] = initialState()[JOB_POSTS_FILTER];
    state[JOB_POSTS_PAGINATION] = initialState()[JOB_POSTS_PAGINATION];
  },

  [SET_JOB_POSTS]: (state, payload?: ListJobs) => {
    state[JOB_POSTS] = payload?.data || initialState()[JOB_POSTS];
    state[JOB_POSTS_PAGINATION] = payload?.page || initialState()[JOB_POSTS_PAGINATION];
  },

  [SET_JOB_POSTS_FILTER]: (state, payload?: JobManagerFilters) => {
    state[JOB_POSTS_FILTER] = payload || initialState()[JOB_POSTS_FILTER];
  },

  [SET_JOB_DETAILS]: (state, payload?: GetJobDetailsRes) => {
    state[JOB_DETAILS] = payload || null;
  },

  [UPDATE_JOB_DETAILS]: (state, payload: Partial<GetJobDetailsRes>) => {
    if (!state[JOB_DETAILS]) {
      return;
    }

    state[JOB_DETAILS] = { ...state[JOB_DETAILS], ...payload } as GetJobDetailsRes;
  },
};

export default mutations;
