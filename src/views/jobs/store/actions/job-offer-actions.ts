import type { ActionTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type { SearchPositionsReq, SearchPositionsRes } from '@/views/jobs/model/position';
import store, { RootState } from '@/store';
import {
  SEARCH_POSITIONS,
  SET_JOB_OFFERS,
  GET_CONVERSATION,
  GET_POSITION_DETAILS,
  POSITION_DETAILS,
  SET_POSITION_DETAILS,
  LIST_CLASSIFICATIONS,
  LIST_SKILLS,
  JOB_OFFERS_PAGINATION,
} from '@/views/jobs/store/constants';
import { container } from 'tsyringe';
import JobService from '@/views/jobs/service/job-service';
import { StoreNamespace } from '@/store/store-namespace';
import { GET_USER } from '@/store/auth/constants';

const jobService = container.resolve(JobService);

const actions: ActionTree<JobState, RootState> = {
  [SEARCH_POSITIONS]: async ({ commit, state, dispatch }, { page, ...filters }: SearchPositionsReq): Promise<SearchPositionsRes> => {
    const res = await jobService[SEARCH_POSITIONS]({ ...filters, page: { ...state[JOB_OFFERS_PAGINATION], ...(page || {}) } });
    await dispatch(LIST_CLASSIFICATIONS);

    commit(SET_JOB_OFFERS, res || {});

    return res;
  },

  [GET_POSITION_DETAILS]: async ({ commit, state, dispatch }, positionId?: string): Promise<void> => {
    const id = positionId || state[POSITION_DETAILS]?._id;

    if (!id) {
      return;
    }

    const { conversation, ...res } = await jobService[GET_POSITION_DETAILS](id);

    if (conversation?._id) {
      const user = store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_USER}`];
      await dispatch(GET_CONVERSATION, { conversationId: conversation?._id, ...(user.impersonate ? {} : { userId: user.id }) });
    }

    await dispatch(LIST_CLASSIFICATIONS);
    await dispatch(LIST_SKILLS, { groups: [res.jobType] });

    commit(SET_POSITION_DETAILS, res);
  },
};

export default actions;
