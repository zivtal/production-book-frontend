<template>
  <nav class="app-top-navbar height-50 fit-screen-width" role="navigation">
    <div class="app-top-navbar__logo">
      <logo @click="onLogoClick" />
    </div>

    <div class="app-top-navbar__navigation">
      <div
        v-for="({ icon, name, label }, index) in centerItems"
        :key="index"
        class="app-top-navbar__navigation--button"
        role="button"
        :tabindex="2 + index"
        @click="() => router.replace({ name })"
      >
        <vz-icon v-if="icon" :name="icon" size="28" :color="router.currentRoute.value.name === name ? 'primary-900' : 'mono-500'" />

        <p v-if="label">{{ $t(label) }}</p>
      </div>
    </div>

    <div class="app-top-navbar__profile">
      <div
        v-for="({ icon, name }, index) in sideItems"
        :key="index"
        class="app-top-navbar__navigation--button"
        role="button"
        :tabindex="2 + index"
        @click="() => router.replace({ name })"
      >
        <vz-icon v-if="icon" :name="icon" size="24" :color="router.currentRoute.value.name === name ? 'primary-900' : 'mono-500'" />
      </div>

      <vz-popover-menu v-if="activeUser" :items="userItems" :uppercase="false">
        <template #activator>
          <vz-avatar class="ms-1" role="button" tabindex="0" :src="activeUser.avatar || undefined" :size="42" />
        </template>

        <template #top>
          <div class="flex align-center mx-1 my-1">
            <vz-avatar :src="activeUser.avatar || undefined" :size="18" />

            <span class="ms-1 font-weight-medium">{{ activeUser?.firstName }} {{ activeUser?.lastName }}</span>
          </div>

          <vz-divider />
        </template>
      </vz-popover-menu>

      <vz-avatar
        v-else
        class="ms-1"
        clickable
        role="button"
        tabindex="0"
        :size="38"
        @keydown.enter="emitter.emit(OPEN_LOGIN_MODAL, { isSignUp: false })"
        @click="emitter.emit(OPEN_LOGIN_MODAL, { isSignUp: false })"
      />

      <!--      <vz-popover-menu v-if="!isPwa" class="app-top-navbar__profile-nav-menu" :items="quickMenu" :uppercase="false">-->
      <!--        <template #activator>-->
      <!--          <vz-icon name="svg:menu" color="primary-900" size="24" />-->
      <!--        </template>-->
      <!--      </vz-popover-menu>-->
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/shared/components/menus/models/menu-item';
import { computed, onBeforeMount, ref } from 'vue';
import { SIGN_OUT } from '@/store/auth/constants';
import { topItems } from '@/views/lobby/components/top-navbar/constants/top-navbar-items';
import RoutesMap from '@/router/constants/routes-map';
import { useRouter } from 'vue-router';
import useMenuItems from '@/router/helpers/use-menu-items.handler';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';
import { emitter } from '@/main';
import { OPEN_LOGIN_MODAL } from '@/views/lobby/constants/lobby-events';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import CalendarRoutesMap from '@/views/calendar/constants/calendar-routes-map';
import Logo from '@/views/lobby/components/top-navbar/components/logo.vue';

const router = useRouter();
const centerItems = useMenuItems(topItems.center);
const sideItems = useMenuItems(topItems.side);

const { useActions: useAuthActions } = useAuthStore();
const { [SIGN_OUT]: signOutAction } = useAuthActions([SIGN_OUT]);
const { activeUser } = useAuthUser();
const notificationCount = ref<string | null>('0');

defineProps({ isPwa: { type: Boolean, default: false } });

const onLogoClick = (): void => {
  router.replace(activeUser.value ? { name: CalendarRoutesMap.UPCOMING_EVENT } : { name: RoutesMap.HOME });
};

onBeforeMount(() => {
  notificationCount.value = localStorage.getItem('notificationCount');
  window.addEventListener('foo-key-localstorage-changed', (event: any) => {
    notificationCount.value = event.detail.storage;
  });
});

const userItems = computed(
  (): Array<MenuItem> => [
    {
      text: 'PROFILE.SETTINGS',
      icon: 'svg:settings',
      click: () => {
        console.log('settings');
      },
    },
    {
      divider: 'before',
      text: activeUser.value?.impersonate ? 'IDENTITY_CARD.STOP_IMPERSONATE' : 'PROFILE.SIGN_OUT',
      icon: activeUser.value?.impersonate ? 'svg:impersonate' : 'svg:close',
      click: async () => {
        try {
          await signOutAction();
          await router.replace({ name: RoutesMap.HOME });
        } catch (e) {
          console.log(e);
        }
      },
    },
  ]
);

// const quickMenu = computed(
//   (): Array<MenuItem> =>
//     (menuItems.value || []).map(({ title, name, icon }) => ({
//       text: title!,
//       icon,
//       click: async () => router.replace({ name }),
//     }))
// );
</script>

<style lang="scss" scoped>
.app-top-navbar {
  padding: 0 1rem;
  position: relative;
  user-select: none;
  background-color: var(--color-background-1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--color-background-2);
  border-radius: 0 0 1rem 1rem;
  box-shadow: var(--shadow-level-2);

  > div {
    align-items: center;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  &__logo {
    display: flex;
    justify-content: flex-start;

    > svg {
      @include mobile-layout {
        height: 38px;
      }

      @include min-mobile-layout {
        height: 48px;
      }
    }
  }

  &__navigation {
    justify-content: center;
    padding: 0 0.5rem;
    color: var(--color-primary-900);

    @include min-tablet-layout {
      display: flex;
    }

    @include max-tablet-layout {
      display: none;
    }

    &--count {
      background-color: var(--color-red-600);
      color: var(--color-mono-100);
      width: 15px;
      height: 15px;
      border-radius: 50%;
      position: absolute;
      top: -5px;
      right: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &--button {
      position: relative;
      cursor: pointer;
      height: 100%;
      margin: 0 0.125rem;
      padding: 0 0.25rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: column;
      color: var(--color-primary-900);
      font-size: var(--font-size-8);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      z-index: 1;

      @include max-mobile-layout {
        p {
          display: none;
        }
      }

      @include min-mobile-layout {
        p {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          padding-top: 2px;
        }
      }
    }
  }

  &__profile {
    display: flex;
    justify-content: flex-end;

    &--desktop {
      display: flex;

      @media (max-width: 768px) {
        display: none;
      }
    }

    @include min-tablet-layout {
      &-nav-menu {
        display: none;
      }
    }
  }

  @include max-mobile-layout {
    padding: 0.25rem 0.5rem;
  }

  @include min-mobile-layout {
    > * {
      width: calc(100% / 3) !important;
    }
  }
}
</style>
