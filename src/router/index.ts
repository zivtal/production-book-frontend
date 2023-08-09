import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '@/views/lobby/lobby.view.vue';
import Notifications from '@/views/notifications/notifications.view.vue';
import RoutesMap from '@/router/constants/routes-map';
import jobRoutes from '@/views/jobs';
import routerCheckAuth from '@/router/helpers/router-check';
import calendarRoutes from '@/views/calendar';
import messengerRoutes from '@/views/messenger';

const Employee = () => import(/* webpackChunkName: "employee-search" */ '@/views/employee/employee.view.vue');

const routes: Readonly<Array<RouteRecordRaw>> = [
  {
    path: RoutesMap.PATHS[RoutesMap.HOME],
    name: RoutesMap.HOME,
    component: Home,
    meta: {
      unprotected: true,
    },
  },
  {
    path: RoutesMap.PATHS[RoutesMap.NOTIFICATIONS],
    name: RoutesMap.NOTIFICATIONS,
    component: Notifications,
    meta: {
      unprotected: true,
    },
  },
  {
    path: RoutesMap.PATHS[RoutesMap.EMPLOYEE_SEARCH],
    name: RoutesMap.EMPLOYEE_SEARCH,
    component: Employee,
    meta: {
      unprotected: true,
    },
  },
  ...jobRoutes,
  ...calendarRoutes,
  ...messengerRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

routerCheckAuth(router);
export default router;
