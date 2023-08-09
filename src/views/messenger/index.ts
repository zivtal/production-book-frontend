import MessengerRoutesMap from '@/views/messenger/constants/messenger-routes-map';

const Messenger = () => import(/* webpackChunkName: "messenger" */ '@/views/messenger/messenger.view.vue');

const messengerRoutes = [
  {
    path: MessengerRoutesMap.PATHS[MessengerRoutesMap.MESSENGER],
    name: MessengerRoutesMap.MESSENGER,
    component: Messenger,
    meta: {
      unprotected: true,
      signed: true,
    },
  },
];

export default messengerRoutes;
