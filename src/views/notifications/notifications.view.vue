<template>
  <div class="notification fill-height px-2 mt-2">
    <notifications-tabs />
  </div>
</template>

<script setup lang="ts">
import NotificationsTabs from '@/views/notifications/components/notifications-tabs.vue';
import { onMounted } from 'vue';

onMounted(() => {
  localStorage.setItem('notificationCount', '0')
  window.dispatchEvent(new CustomEvent('foo-key-localstorage-changed', {
    detail: {
      storage: localStorage.getItem('notificationCount')
    }
  }));
})
</script>

<style lang="scss">
.notification {
  position: relative;
  max-height: calc(100vh - var(--header-height) - var(--footer-height));
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }
}
</style>
