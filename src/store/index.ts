import { createStore } from 'vuex';
import { actions } from '@/store/actions';
import { getters } from '@/store/getters';
import { mutations } from '@/store/mutations';
import { StoreNamespace } from '@/store/store-namespace';
import lobbyStore from '@/views/lobby/store';
import authStore from '@/store/auth';
import generalStore from '@/store/client';
import { COORDINATES, LANGUAGE, LOADING } from '@/store/constants';
import { AvailableLanguages } from '@/plugins/i18n/available-languages.enum';
import jobStore from '@/views/jobs/store';
import employeeStore from '@/views/employee/store';
import notificationStore from '@/store/notifications';

export interface RootState {
  [LOADING]: Array<string>;
  [LANGUAGE]: keyof typeof AvailableLanguages;
  [COORDINATES]: [number, number] | null;
}

export const rootState: RootState = {
  [LOADING]: [],
  [LANGUAGE]: (window.navigator.languages![0] || window.navigator.language).slice(0, 2) as any,
  [COORDINATES]: null,
};

const store = createStore({
  state: rootState,
  getters,
  mutations,
  actions,
  modules: {
    [StoreNamespace.AUTH_MODULE]: authStore,
    [StoreNamespace.NOTIFICATION_MODULE]: notificationStore,
    [StoreNamespace.LOBBY_MODULE]: lobbyStore,
    [StoreNamespace.GENERAL_MODULE]: generalStore,
    [StoreNamespace.EMPLOYEES_MODULE]: employeeStore,
    [StoreNamespace.JOBS_MODULE]: jobStore,
  },
});

export default store;
