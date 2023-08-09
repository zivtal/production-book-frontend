import type { RouteItem } from '@/router/models/route-item';
import { computed, Ref } from 'vue';
import { AUTH_ACTIONS, AUTH_CHECK, USER, GET_AUTH_KEY, GET_AUTH_ACTIONS, IS_LOGGED_IN } from '@/store/auth/constants';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';
import { uniqueKey } from '@/shared/helpers';
import router from '@/router';
import store from '@/store';
import { StoreNamespace } from '@/store/store-namespace';

export default function useMenuItems(items: Array<RouteItem>): Ref<Array<RouteItem>> {
  const { useActions, useState, useGetters } = useAuthStore();

  const { [GET_AUTH_KEY]: getAuthKeyGetter, [GET_AUTH_ACTIONS]: getAuthActionsGetter } = useGetters([GET_AUTH_KEY, GET_AUTH_ACTIONS]);
  const { [AUTH_ACTIONS]: authActionsState } = useState([AUTH_ACTIONS, USER]);
  const { [AUTH_CHECK]: authCheckAction } = useActions([AUTH_CHECK]);

  if (!authActionsState.value) {
    authCheckAction();
  }

  const routes = router
    .getRoutes()
    .reduce((map: Record<string, Record<string, any>>, { name, meta }) => (name ? { ...map, [name]: meta || {} } : map), {});

  return computed(
    (): Array<RouteItem> =>
      items.filter(({ name }) => {
        // check if page available only for signed users
        if (routes[name]?.signed && !store.getters[`${StoreNamespace.AUTH_MODULE}/${IS_LOGGED_IN}`]) {
          return false;
        }

        // check if page is unprotected
        if (routes[name]?.unprotected) {
          return true;
        }

        // check if user allowed to access page
        return getAuthActionsGetter.value.includes(uniqueKey(name, getAuthKeyGetter.value));
      })
  );
}
