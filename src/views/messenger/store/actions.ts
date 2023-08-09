import type { ActionTree } from 'vuex';
import type { RootState } from '@/store';
import type { MessengerState } from '@/views/messenger/store/types';
import type { DeleteMessageReq, GetMessagesReq, GetMessagesRes, ListChatsRes, SendMessageReq } from '@/views/messenger/models';
import { container } from 'tsyringe';
import MessengerService from '@/views/messenger/service/messenger-service';
import { DELETE_MESSAGE, GET_MESSAGES, LIST_CHATS, SEND_MESSAGE } from '@/views/messenger/store/constants';
import { ListChatsReq } from '@/views/messenger/models/list-chats-req';

const messengerService = container.resolve(MessengerService);

const actions: ActionTree<MessengerState, RootState> = {
  [LIST_CHATS]: async ({ commit }, payload: ListChatsReq): Promise<ListChatsRes> => {
    return await messengerService[LIST_CHATS](payload);
  },

  [GET_MESSAGES]: async ({ commit }, payload: GetMessagesReq): Promise<GetMessagesRes> => {
    return await messengerService[GET_MESSAGES](payload);
  },

  [SEND_MESSAGE]: async ({ commit }, payload: SendMessageReq): Promise<void> => {
    await messengerService[SEND_MESSAGE](payload);
  },

  [DELETE_MESSAGE]: async ({ commit }, payload: DeleteMessageReq): Promise<void> => {
    await messengerService[DELETE_MESSAGE](payload);
  },
};

export default actions;
