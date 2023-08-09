import type { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import { GET_NOTIFICATIONS, NOTIFICATIONS } from '@/store/notifications/constants';
import { NotificationState } from '@/store/notifications/types';

const getters: GetterTree<NotificationState, RootState> = {
  [GET_NOTIFICATIONS](state): any {
    return state[NOTIFICATIONS] || [];
  },
};

export default getters;
