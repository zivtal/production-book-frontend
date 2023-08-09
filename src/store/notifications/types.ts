import type AugmentedActionContext from '@/store/types/augmented-action-context';
import type { Notifications } from '@/store/notifications/models/notifications';
import type { GetNotificationReq } from '@/store/notifications/models/get-notifications-req';
import {
  NOTIFICATIONS_PAGINATION,
  NOTIFICATIONS,
  GET_NOTIFICATIONS, SET_NOTIFICATIONS, NOTIFICATIONS_TOTAL, SAVE_TOKEN
} from '@/store/notifications/constants';
import {GetNotificationRes} from "@/views/notifications/models";
import {BasePagination} from "@/shared/models";
import {ConversationMessageNotify} from "@/store/notifications/models/notification-res";
import {SaveTokenReq} from "@/store/notifications/models/get-notifications-req";

type StoreContext = AugmentedActionContext<NotificationState, NotificationActions, NotificationMutations>;

// store
export type NotificationState = {
  [NOTIFICATIONS]: ConversationMessageNotify | null;
  [NOTIFICATIONS_PAGINATION]: BasePagination | null;
  [NOTIFICATIONS_TOTAL]: number | null;
};

export interface NotificationActions {
  [GET_NOTIFICATIONS](_: StoreContext, payload: GetNotificationReq): Promise<GetNotificationRes>;
  [SAVE_TOKEN](_: StoreContext, payload: SaveTokenReq): Promise<void>;
}

export interface NotificationMutations<S = NotificationState> {
  [SET_NOTIFICATIONS](state: S, payload?: Notifications): void;
}

export interface NotificationGetters<S = NotificationState> {}
