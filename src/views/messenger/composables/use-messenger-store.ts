import type { MessengerActions, MessengerGetters, MessengerMutations, MessengerState } from '@/views/messenger/store/types';
import { StoreNamespace } from '@/store/store-namespace';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import store from '@/store';
import messengerStore from '@/views/messenger/store';

const useMessengerStore = () => {
  if (!store.hasModule(StoreNamespace.MESSENGER_MODULE)) {
    store.registerModule(StoreNamespace.MESSENGER_MODULE, messengerStore);
  }

  return createNamespacedHelpers<MessengerState, MessengerGetters, MessengerActions, MessengerMutations>(StoreNamespace.MESSENGER_MODULE);
};

export default useMessengerStore;
