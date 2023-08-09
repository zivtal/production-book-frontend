import type { DeleteMessageReq, GetMessagesReq, GetMessagesRes, ListChatsRes, SendMessageReq } from '@/views/messenger/models';
import { ACTIVE_CHAT, DELETE_MESSAGE, GET_MESSAGES, LIST_CHATS, SEND_MESSAGE, SET_ACTIVE_CHAT } from '@/views/messenger/store/constants';
import AugmentedActionContext from '@/store/types/augmented-action-context';

type StoreContext = AugmentedActionContext<MessengerState, MessengerMutations, MessengerActions>;

export type MessengerState = {
  [ACTIVE_CHAT]: GetMessagesRes | null;
};

export interface MessengerActions<S = MessengerState> {
  [LIST_CHATS]({ commit }: StoreContext): Promise<ListChatsRes>;
  [GET_MESSAGES]({ commit }: StoreContext, payload: GetMessagesReq): Promise<GetMessagesRes>;
  [SEND_MESSAGE]({ commit }: StoreContext, payload: SendMessageReq): Promise<void>;
  [DELETE_MESSAGE]({ commit }: StoreContext, payload: DeleteMessageReq): Promise<void>;
}

export interface MessengerMutations<S = MessengerState> {
  [SET_ACTIVE_CHAT](state: S, payload?: GetMessagesRes): void;
}

export interface MessengerGetters<S = MessengerState> {}
