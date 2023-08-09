import type { MutationTree } from 'vuex';
import type { NotificationState } from '@/store/notifications/types';
import type { Notifications } from '@/store/notifications/models/notifications';
import { SET_NOTIFICATIONS, NOTIFICATIONS } from '@/store/notifications/constants';
import { initialState } from '@/store/notifications/index';
import {NotificationRes} from "@/store/notifications/models/notification-res";

const mutations: MutationTree<NotificationState> = {
  [SET_NOTIFICATIONS]: (state, payload?: NotificationRes): void => {
    state[NOTIFICATIONS] = payload || initialState()[NOTIFICATIONS];
  },
};

export default mutations;
