<template>
  <footer class="app-bottom-navbar fit-screen-width">
    <div
      v-for="({ icon, name, label }, index) in menuItems"
      :key="index"
      class="app-bottom-navbar__button"
      role="button"
      tabindex="0"
      @click="() => router.replace({ name })"
    >
      <vz-icon v-if="icon" :name="icon" size="28" :color="router.currentRoute.value.name === name ? 'primary-900' : 'mono-500'" />

      <span>{{ $t(label) }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { topItems } from '@/views/lobby/components/top-navbar/constants/top-navbar-items';
import { useRouter } from 'vue-router';
import useMenuItems from '@/router/helpers/use-menu-items.handler';

const router = useRouter();
const menuItems = useMenuItems(topItems.center);
</script>

<style lang="scss">
.app-bottom-navbar {
  display: flex;
  justify-content: center;
  min-height: var(--footer-height);
  background-color: var(--color-background-1);
  padding: 0.25rem;
  border-radius: 1rem 1rem 0 0;
  border: 1px solid var(--color-background-2);
  box-shadow: var(--shadow-level-2);

  > * {
    padding: 0.25rem 0.75rem;
  }

  &__button {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: var(--font-size-8);
    text-transform: uppercase;
    font-weight: var(--font-weight-medium);

    > span {
      margin-top: 0.125rem;
    }
  }

  @include min-tablet-layout {
    display: none;
  }
}
</style>
