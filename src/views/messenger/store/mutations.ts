import type { MutationTree } from 'vuex';
import type { MessengerState } from '@/views/messenger/store/types';
import { ACTIVE_CHAT, SET_ACTIVE_CHAT } from '@/views/messenger/store/constants';
import { GetMessagesRes } from '@/views/messenger/models';
import { initialState } from '@/views/messenger/store/index';

const mutations: MutationTree<MessengerState> = {
  [SET_ACTIVE_CHAT]: (state, payload?: GetMessagesRes): void => {
    state[ACTIVE_CHAT] = payload || initialState()[ACTIVE_CHAT];
  },
};

export default mutations;
