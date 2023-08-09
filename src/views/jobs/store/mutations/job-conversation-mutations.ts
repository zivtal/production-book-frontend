import type { MutationTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type { GetJobDetailsRes } from '@/views/jobs/model/job';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import type { BaseId } from '@/shared/models';
import type { BaseChatMessage } from '@/views/messenger/models';
import {
  JOB_OFFERS,
  JOB_DETAILS,
  SET_CONVERSATION,
  CONVERSATION,
  UPDATE_CONVERSATION,
  UPDATE_CONVERSATION_LAST_SEEN,
  PUSH_CONVERSATION_MESSAGE,
} from '@/views/jobs/store/constants';
import updateJobConversationsState from '@/views/jobs/store/helpers/update-job-conversations-state';

const mutations: MutationTree<JobState> = {
  [SET_CONVERSATION]: (state, payload?: GetConversationRes) => {
    state[CONVERSATION] = payload || null;
  },

  [UPDATE_CONVERSATION]: (state, payload: Partial<GetConversationRes> = {}) => {
    const id = payload._id || state[CONVERSATION]?._id;

    if (!id) {
      return;
    }

    if (id === state[CONVERSATION]?._id) {
      state[CONVERSATION] = { ...state[CONVERSATION], ...payload } as GetConversationRes;
    }

    state[JOB_DETAILS] = state[JOB_DETAILS]
      ? { ...state[JOB_DETAILS], positions: updateJobConversationsState(state[JOB_DETAILS], id, payload) }
      : null;

    state[JOB_OFFERS] =
      state[JOB_OFFERS]?.map((position) => (position._id === state[CONVERSATION]?.positionId ? { ...position, status: payload.status } : position)) ||
      null;
  },

  [UPDATE_CONVERSATION_LAST_SEEN]: (state, { _id }: { positionId: BaseId; _id: BaseId }) => {
    if (!state[JOB_DETAILS]) {
      return;
    }

    state[JOB_DETAILS] = {
      ...state[JOB_DETAILS],
      positions: updateJobConversationsState(state[JOB_DETAILS], _id, { hasUpdated: false }),
    } as GetJobDetailsRes;
  },

  [PUSH_CONVERSATION_MESSAGE]: (state, { message, chatId }: { message: BaseChatMessage; chatId: string }) => {
    if (state[CONVERSATION]?._id === chatId && !state[CONVERSATION].messages.find(({ key }) => key === message.key)) {
      state[CONVERSATION] = {
        ...state[CONVERSATION],
        messages: [...state[CONVERSATION]!.messages, message],
      } as GetConversationRes;
    }

    if (!state[JOB_DETAILS]) {
      return;
    }

    state[JOB_DETAILS] = { ...state[JOB_DETAILS], positions: updateJobConversationsState(state[JOB_DETAILS], chatId) };
  },
};

export default mutations;
