import type { Router } from 'vue-router';
import { checkRouteAuth } from '@/router/helpers/check-route-auth';

export default (router: Router): void => {
  router.beforeEach(checkRouteAuth);
};
