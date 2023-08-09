import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { routeCheck } from '@/router/helpers/route-check';

export const checkRouteAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: (to?: RouteLocationRaw | false | void) => void
): Promise<void> => {
  if (to.name && !routeCheck(to.name)) {
    next('/');

    return;
  }

  next();
};
