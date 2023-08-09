import type { MutationTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type { StateCache } from '@/store/services/store.cache';
import type { BaseItem, BaseOptions } from '@/shared/models';
import {
  SET_SKILLS_CACHE,
  SKILLS,
  SET_JOB_TYPES,
  CLASSIFICATIONS,
  JOB_OFFERS,
  JOB_OFFERS_FILTER,
  JOB_OFFERS_PAGINATION,
  JOB_POSTS,
  JOB_POSTS_FILTER,
  JOB_POSTS_PAGINATION,
  JOB_DETAILS,
  POSITION_DETAILS,
  CONVERSATION,
} from '@/views/jobs/store/constants';
import jobManagerMutations from '@/views/jobs/store/mutations/job-manager-mutations';
import jobOfferMutations from '@/views/jobs/store/mutations/job-offer-mutations';
import jobConversationMutations from '@/views/jobs/store/mutations/job-conversation-mutations';
import { initialState } from '@/views/jobs/store/index';
import { RESET_STATE } from '@/store/constants';

const mutations: MutationTree<JobState> = {
  [RESET_STATE]: (state) => {
    state[JOB_OFFERS] = initialState()[JOB_OFFERS];
    state[JOB_OFFERS_FILTER] = initialState()[JOB_OFFERS_FILTER];
    state[JOB_OFFERS_PAGINATION] = initialState()[JOB_OFFERS_PAGINATION];
    state[JOB_POSTS] = initialState()[JOB_POSTS];
    state[JOB_POSTS_FILTER] = initialState()[JOB_POSTS_FILTER];
    state[JOB_POSTS_PAGINATION] = initialState()[JOB_POSTS_PAGINATION];
    state[JOB_DETAILS] = initialState()[JOB_DETAILS];
    state[POSITION_DETAILS] = initialState()[POSITION_DETAILS];
    state[CONVERSATION] = initialState()[CONVERSATION];
  },

  [SET_SKILLS_CACHE]: (state, payload: StateCache<Array<BaseItem>>) => {
    state[SKILLS] = payload;
  },

  [SET_JOB_TYPES]: (state, payload: BaseOptions<string>) => {
    state[CLASSIFICATIONS] = payload || [];
  },

  ...jobManagerMutations,
  ...jobOfferMutations,
  ...jobConversationMutations,
};

export default mutations;
