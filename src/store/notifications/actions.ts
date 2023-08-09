import type { ActionTree } from 'vuex';
import { container } from 'tsyringe';
import NotificationService from '@/store/notifications/service/notifications.service';
import { type RootState } from '@/store';
import { NotificationState } from "@/store/notifications/types";
import {GET_NOTIFICATIONS, SAVE_TOKEN, SET_NOTIFICATIONS} from "@/store/notifications/constants";
import {GetNotificationReq, SaveTokenReq} from "@/store/notifications/models/get-notifications-req";

const notificationService = container.resolve(NotificationService);

const actions: ActionTree<NotificationState, RootState> = {
  [GET_NOTIFICATIONS]: async ({ commit, state }, payload: GetNotificationReq): Promise<any> => {

    const res = await notificationService[GET_NOTIFICATIONS](payload);

    commit(SET_NOTIFICATIONS, res || []);

    return res
  },

  [SAVE_TOKEN]: async ({ commit, state }, payload: SaveTokenReq): Promise<any> => {
    return await notificationService[SAVE_TOKEN](payload);
  },
};

export default actions;

