import type { ActionTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type { BaseItem, BaseOptions } from '@/shared/models';
import type { ListSkillsReq } from '@/views/jobs/model/list-skills-req';
import type { RootState } from '@/store';
import { CLASSIFICATIONS, LIST_CLASSIFICATIONS, LIST_SKILLS, SET_JOB_TYPES, SET_SKILLS_CACHE, SKILLS } from '@/views/jobs/store/constants';
import { container } from 'tsyringe';
import JobService from '@/views/jobs/service/job-service';
import jobManagerActions from '@/views/jobs/store/actions/job-manager-actions';
import jobConversationActions from '@/views/jobs/store/actions/job-conversation-actions';
import jobOfferActions from '@/views/jobs/store/actions/job-offer-actions';
import StoreCache from '@/store/services/store.cache';
import { StoreNamespace } from '@/store/store-namespace';

const jobService = container.resolve(JobService);

const actions: ActionTree<JobState, RootState> = {
  [LIST_CLASSIFICATIONS]: async ({ commit, state }): Promise<BaseOptions<string> | null> => {
    if (!state[CLASSIFICATIONS]) {
      const { options = [] } = await jobService[LIST_CLASSIFICATIONS]();
      commit(SET_JOB_TYPES, options);
    }

    return state[CLASSIFICATIONS];
  },

  [LIST_SKILLS]: async (_, payload: ListSkillsReq): Promise<Array<BaseItem>> => {
    if (!payload.groups.filter((value) => !!value).length) {
      return [];
    }

    const cacheService = new StoreCache(SKILLS, SET_SKILLS_CACHE, StoreNamespace.JOBS_MODULE);
    const cache = cacheService.get<ListSkillsReq, Array<BaseItem>>(payload);

    if (cache) {
      return cache;
    }

    const { options = [] } = await jobService[LIST_SKILLS](payload);
    cacheService.set<ListSkillsReq, Array<BaseItem>>(payload, options);

    return options;
  },

  ...jobManagerActions,
  ...jobOfferActions,
  ...jobConversationActions,
};

export default actions;
