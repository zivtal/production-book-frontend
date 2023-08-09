import { RouteRecordName } from 'vue-router';
import { AUTH_CHECK, GET_AUTH_ACTIONS, GET_AUTH_KEY, IS_LOGGED_IN } from '@/store/auth/constants';
import router from '@/router';
import store from '@/store';
import { StoreNamespace } from '@/store/store-namespace';
import { uniqueKey } from '@shared/helpers';

export const routeCheck = (name: RouteRecordName | string): boolean => {
  const routeKey = name as string;

  if (!store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_AUTH_ACTIONS}`]) {
    (async (): Promise<void> => store.dispatch(`${StoreNamespace.AUTH_MODULE}/${AUTH_CHECK}`))();
  }

  const routes = router
    .getRoutes()
    .reduce((map: Record<string, Record<string, any>>, { name, meta }) => (name ? { ...map, [name]: meta || {} } : map), {});

  const getAuthKey = store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_AUTH_KEY}`];
  const authActions = store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_AUTH_ACTIONS}`];

  // check if page available only for signed users
  if (routes[routeKey]?.signed && !store.getters[`${StoreNamespace.AUTH_MODULE}/${IS_LOGGED_IN}`]) {
    return false;
  }

  // check if user allowed to access page
  return routes[routeKey]?.unprotected || authActions.includes(uniqueKey(routeKey, getAuthKey));
};
