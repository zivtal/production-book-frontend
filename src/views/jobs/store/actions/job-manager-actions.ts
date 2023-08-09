import type { ActionTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type { CreatePostJobReq, JobManagerFilters, ListJobs, UpdatePostJobReq } from '@/views/jobs/model/job';
import type { SocketReceivedMessage } from '@/shared/services/socket-service/models/socket-received-message';
import type { ConversationStatus } from '@/views/jobs/model/conversation';
import { RootState } from '@/store';
import {
  SEARCH_JOB_POSTS,
  SET_JOB_POSTS,
  CREATE_JOB_POST,
  LIST_SKILLS,
  GET_JOB_DETAILS,
  SET_JOB_DETAILS,
  UPDATE_CONVERSATION_STATUS,
  UPDATE_CONVERSATION,
  JOB_DETAILS,
  SEND_CONVERSATION_MESSAGE,
  PUSH_CONVERSATION_MESSAGE,
  SET_JOB_POSTS_FILTER,
  JOB_POSTS_PAGINATION,
  JOB_POSTS_FILTER,
  UPDATE_JOB_POST,
  CREATE_CONVERSATION,
} from '@/views/jobs/store/constants';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import { isEqual } from 'lodash';
import SocketService from '@/shared/services/socket-service/socket.service';
import { container } from 'tsyringe';
import JobService from '@/views/jobs/service/job-service';
import { BaseChatMessage } from '@/views/messenger/models';

const jobService = container.resolve(JobService);

const actions: ActionTree<JobState, RootState> = {
  [SEARCH_JOB_POSTS]: async ({ commit, state }, payload?: JobManagerFilters): Promise<ListJobs> => {
    const { page = { index: 0 }, ...filters } = payload || {};

    if (!isEqual(filters, state[JOB_POSTS_FILTER])) {
      page.index = 0;
    }

    try {
      const jobs = await jobService[SEARCH_JOB_POSTS]({ ...filters, page: { ...state[JOB_POSTS_PAGINATION], ...page } });
      commit(SET_JOB_POSTS_FILTER, filters);
      commit(SET_JOB_POSTS, jobs);

      return jobs;
    } catch (e) {
      commit(SET_JOB_POSTS);

      throw e;
    }
  },

  [CREATE_JOB_POST]: async ({ dispatch }, payload: CreatePostJobReq): Promise<void> => {
    await jobService[CREATE_JOB_POST](payload);

    await dispatch(SEARCH_JOB_POSTS);
  },

  [UPDATE_JOB_POST]: async ({ dispatch, state }, payload: UpdatePostJobReq): Promise<void> => {
    const deleted = state[JOB_DETAILS]!.positions.map(({ _id, conversations }) => ({ _id, conversations }))
      .filter(
        (position) =>
          !payload.positions.find(({ _id }) => _id === position._id) &&
          !(position.conversations || []).find(({ status }) => status.type === ConversationStatusType.FREELANCER_ACCEPT)
      )
      .map(({ _id }) => _id);

    await jobService[UPDATE_JOB_POST]({ ...payload, deleted });

    await dispatch(GET_JOB_DETAILS);
    await dispatch(SEARCH_JOB_POSTS);
  },

  [GET_JOB_DETAILS]: async ({ commit, state, dispatch }, jobId?: string): Promise<void> => {
    const id = jobId || state[JOB_DETAILS]?._id;

    if (!id) {
      return;
    }

    const res = await jobService[GET_JOB_DETAILS](id);
    await dispatch(LIST_SKILLS, { groups: [res.jobType] });
    const listIds = res.positions.reduce(
      (ids: Array<string>, position) => [...ids, position._id, ...position.conversations.map((conversation) => conversation._id)],
      []
    );

    SocketService.setup();
    SocketService.join([res._id, ...listIds]);

    SocketService.on(
      UPDATE_CONVERSATION_STATUS,
      (status: ConversationStatus, { chatId }: SocketReceivedMessage) => commit(UPDATE_CONVERSATION, { _id: chatId, ...status }),
      true
    );

    SocketService.on(
      SEND_CONVERSATION_MESSAGE,
      (message: BaseChatMessage, { chatId }: SocketReceivedMessage) => commit(PUSH_CONVERSATION_MESSAGE, { message, chatId }),
      true
    );

    SocketService.on(CREATE_CONVERSATION, () => dispatch(GET_JOB_DETAILS));

    commit(SET_JOB_DETAILS, res || null);
  },
};

export default actions;
