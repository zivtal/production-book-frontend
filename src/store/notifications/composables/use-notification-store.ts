import { createNamespacedHelpers } from 'vuex-composition-helpers';
import type { NotificationActions, NotificationMutations, NotificationState, NotificationGetters } from '@/store/notifications/types';
import { StoreNamespace } from '@/store/store-namespace';

const useNotificationStore = () =>
  createNamespacedHelpers<NotificationState, NotificationGetters, NotificationActions, NotificationMutations>(StoreNamespace.NOTIFICATION_MODULE);

export default useNotificationStore;
