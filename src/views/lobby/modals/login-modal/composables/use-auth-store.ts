import { StoreNamespace } from '@/store/store-namespace';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { AuthActions, AuthGetters, AuthMutations, AuthState } from '@/store/auth/types';
import store from '@/store';
import authStore from '@/store/auth';

const useAuthStore = () => {
  if (!store.hasModule(StoreNamespace.AUTH_MODULE)) {
    store.registerModule(StoreNamespace.AUTH_MODULE, authStore);
  }

  return createNamespacedHelpers<AuthState, AuthGetters, AuthActions, AuthMutations>(StoreNamespace.AUTH_MODULE);
};

export default useAuthStore;
