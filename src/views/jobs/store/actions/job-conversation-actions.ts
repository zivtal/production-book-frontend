import type { ActionTree } from 'vuex';
import type { JobState } from '@/views/jobs/store/types';
import type {
  UpdateConversationStatusReq,
  SendConversationMessageReq,
  GetConversationReq,
  ConversationStatus,
  CreateConversationReq,
  UpdateConversationAgreementReq,
} from '@/views/jobs/model/conversation';
import type { SocketReceivedMessage } from '@/shared/services/socket-service/models/socket-received-message';
import store, { RootState } from '@/store';
import {
  GET_JOB_DETAILS,
  GET_CONVERSATION,
  SET_CONVERSATION,
  UPDATE_CONVERSATION_STATUS,
  UPDATE_CONVERSATION,
  SEND_CONVERSATION_MESSAGE,
  CONVERSATION,
  UPDATE_CONVERSATION_LAST_SEEN,
  LEAVE_CONVERSATION,
  PUSH_CONVERSATION_MESSAGE,
  SET_POSITION_DETAILS,
  CREATE_CONVERSATION,
  UPDATE_CONVERSATION_AGREEMENTS,
} from '@/views/jobs/store/constants';
import SocketService from '@/shared/services/socket-service/socket.service';
import { container } from 'tsyringe';
import JobService from '@/views/jobs/service/job-service';
import { StoreNamespace } from '@/store/store-namespace';
import { GET_USER } from '@/store/auth/constants';
import { BaseChatMessage } from '@/views/messenger/models';

const jobService = container.resolve(JobService);

const actions: ActionTree<JobState, RootState> = {
  [CREATE_CONVERSATION]: async ({ dispatch }, payload: CreateConversationReq): Promise<void> => {
    const { conversationId } = await jobService[CREATE_CONVERSATION](payload);

    if (!conversationId) {
      return;
    }

    await dispatch(GET_CONVERSATION, { conversationId });
  },

  [GET_CONVERSATION]: async ({ commit, dispatch, state }, payload?: GetConversationReq): Promise<void> => {
    const { conversationId = state[CONVERSATION]!._id, userId = store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_USER}`] || undefined } =
      payload || {};

    if (!conversationId) {
      return;
    }

    if (conversationId !== state[CONVERSATION]?._id) {
      await dispatch(LEAVE_CONVERSATION);
    }

    const res = await jobService[GET_CONVERSATION](conversationId);

    SocketService.setup();
    SocketService.join(res._id);

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

    commit(SET_CONVERSATION, res);
    commit(UPDATE_CONVERSATION_LAST_SEEN, { ...res, userId });
  },

  [LEAVE_CONVERSATION]: async ({ commit, state }, conversationId?: string): Promise<void> => {
    const id = conversationId || state[CONVERSATION]?._id;
    if (!id) {
      return;
    }

    await jobService[LEAVE_CONVERSATION](id);

    commit(SET_CONVERSATION);
    commit(SET_POSITION_DETAILS);
  },

  [UPDATE_CONVERSATION_STATUS]: async ({ commit, dispatch }, payload: UpdateConversationStatusReq): Promise<void> => {
    await jobService[UPDATE_CONVERSATION_STATUS](payload);
    const { status } = await jobService[GET_CONVERSATION](payload.id);
    commit(UPDATE_CONVERSATION, { status });
    await dispatch(GET_JOB_DETAILS);
  },

  [SEND_CONVERSATION_MESSAGE]: async (_, payload: SendConversationMessageReq): Promise<void> => {
    SocketService.setup();
    SocketService.join(payload.id);

    await jobService[SEND_CONVERSATION_MESSAGE](payload);
  },

  [UPDATE_CONVERSATION_AGREEMENTS]: async ({ state, dispatch }, payload: UpdateConversationAgreementReq): Promise<void> => {
    const id = state[CONVERSATION]?._id;

    if (!id) {
      return;
    }

    await jobService[UPDATE_CONVERSATION_AGREEMENTS](payload, id);
    await dispatch(GET_CONVERSATION);
  },
};

export default actions;
