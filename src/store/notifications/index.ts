import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { NotificationState } from '@/store/notifications/types';
import {NOTIFICATIONS, NOTIFICATIONS_PAGINATION, NOTIFICATIONS_TOTAL} from '@/store/notifications/constants';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export const initialState = (): NotificationState => ({
  [NOTIFICATIONS]: null,
  [NOTIFICATIONS_TOTAL]: null,
  [NOTIFICATIONS_PAGINATION]: null,
});

const notificationStore: Module<NotificationState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default notificationStore;
