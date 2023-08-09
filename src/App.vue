<template>
  <top-navbar :is-pwa="isPWA" />

  <router-view class="app--container" />

  <bottom-navbar />

  <login-modal v-if="!isLoggedIn" />
</template>

<script setup lang="ts">
import '@/helpers/register-services';
import '@/helpers/add-api-interceptors';

import { defineAsyncComponent, onBeforeMount, watch, onMounted } from 'vue';
import store from '@/store';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';
import { AUTH_CHECK } from '@/store/auth/constants';
import { LANGUAGE } from '@/store/constants';
import { THEMES } from '@/shared/services/css-service/themes';
import { isPWA } from '@/shared/helpers';
import ThemeService from '@/shared/services/css-service/theme-service';
import { setLanguage } from '@/plugins/i18n/helpers';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import router from '@/router';
import { DEFAULT_PAGE_TITLE } from '@/router/constants/routes-map';
import { useI18n } from 'vue-i18n';
import firebase from './firebase';
import { usePromise } from '@/shared/composables';
import {SAVE_TOKEN} from "@/store/notifications/constants";
import useNotificationStore from "@/store/notifications/composables/use-notification-store";

const TopNavbar = defineAsyncComponent(() => import(/* webpackChunkName: "main" */ '@/views/lobby/components/top-navbar/app-top-navbar.vue'));

const BottomNavbar = defineAsyncComponent(
  () => import(/* webpackChunkName: "main" */ '@/views/lobby/components/bottom-navbar/app-bottom-navbar.vue')
);

const LoginModal = defineAsyncComponent(() => import(/* webpackChunkName: "main" */ '@/views/lobby/modals/login-modal/login-modal.component.vue'));

const { useActions: useAuthActions } = useAuthStore();
const { [AUTH_CHECK]: authCheck } = useAuthActions([AUTH_CHECK]);

const authCheckRequest = usePromise(authCheck as () => Promise<void>);
const { isLoggedIn, activeUser } = useAuthUser();
const theme = new ThemeService(THEMES, 'primary', 900);

const { t } = useI18n();

const { useActions: useNotificationActions } = useNotificationStore();
const { [SAVE_TOKEN]: saveTokenAction} = useNotificationActions([SAVE_TOKEN]);
const saveTokenActionRequest = usePromise(saveTokenAction as (payload: { token: string }) => Promise<void>);

onMounted(async () => {
  const token = await firebase.methods.firebaseInit();
  await saveTokenActionRequest.call({ token: token });
  console.log(token)
});

onBeforeMount(() => {
  authCheckRequest.call();
});

watch(
  () => activeUser.value,
  (user) => {
    if (user?.impersonate) {
      theme.set('warning');
    } else {
      theme.clear();
    }
  }
);

watch(() => store.state[LANGUAGE], setLanguage, { immediate: true });

watch(
  () => router.currentRoute.value.name,
  (name) => {
    document.title = name ? t(`MENU.${(name as string).toUpperCase()}`) : DEFAULT_PAGE_TITLE;
  },
  { immediate: true }
);
</script>

<style lang="scss">
.app {
  position: relative;
  height: 100vh;

  &--container {
    position: relative;
    max-height: calc(100% - var(--header-height) - 1rem);
    flex-grow: 1;
  }

  &--spinner {
    height: 100vh;
  }
}
</style>
