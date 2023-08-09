<template>
  <vz-infinity-scroll ref="infinityScrollRef" hide-first-load :payload="notificationPayload" :callback="listNotificationsRequest">
    <template #content="{ data }">
      <notification-card v-for="(item, index) in data" :key="index" :item="item" />
    </template>
  </vz-infinity-scroll>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GET_NOTIFICATIONS } from '@/store/notifications/constants';
import useNotificationStore from '@/store/notifications/composables/use-notification-store';
import NotificationCard from '@/views/notifications/components/notification-card.vue';
import { GetNotificationReq } from '@/store/notifications/models/get-notifications-req';

const { useActions: useNotificationActions } = useNotificationStore();
const { [GET_NOTIFICATIONS]: listNotificationsAction } = useNotificationActions([GET_NOTIFICATIONS]);

const listNotificationsRequest = listNotificationsAction as (payload?: GetNotificationReq) => Promise<GetNotificationReq>;

const notificationPayload = ref<Omit<GetNotificationReq, 'page'>>({});
</script>

<style lang="scss">
.notifications-grid {
  @include min-tablet-layout {
    padding-inline-end: 16px;
  }

  overflow-y: auto;
}
</style>
