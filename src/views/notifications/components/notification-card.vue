<template>
  <vz-card :class="['notification-card', { clickable: clickable, skeleton: loading, 'notification-card--active': true }]">
    <div class="notification-card__content">
      <div class="flex align-center">
        <div class="notification-card__status"></div>

        <div v-if="user" class="notification-card__user px-5">
          <vz-avatar :src="avatarImg" :size="35" :verified="user.verified" />
          <div class="notification-card__name vz-font-size-16 vz-font-weight-700">
            <p>{{ user.firstName }}</p>
            <p>{{ user.lastName }}</p>
          </div>
        </div>
      </div>

      <div class="notification-card__message">
        <p class="vz-font-size-12 vz-font-weight-400">{{ $t(`NOTIFICATION.${item.type}`) }}</p>
      </div>

      <div class="mt-4">
        <div>
          <p class="vz-font-size-12 vz-font-weight-600">Job Details</p>
        </div>

        <div class="notification-card__footer">
          <div class="vz-font-size-16 vz-font-weight-600 flex align-center">
            <vz-icon name="svg:calendar" size="12" color="mono-900" />
            <p class="mx-2">{{ `${dateFrom} | ${dateFromTime} - ${dateToTime}` }}</p>
          </div>

          <div class="notification-card__time vz-font-size-12 vz-font-weight-600 flex align-center justify-space-between mt-4">
            <p>{{ updatedAt }} {{ updatedAtTime }}</p>

            <vz-button text="GENERAL.DELETE" class="px-5" background-color="primary-900" :disabled="loading" @click.stop="onDelete" />
          </div>
        </div>
      </div>
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import { GlobalVariables } from '@/shared/constants/global-variables';
import { ConversationMessageNotify } from '@/store/notifications/models/notification-res';
import dayjs from 'dayjs';
import { computed, type PropType } from 'vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  clickable: { type: Boolean, default: true },
  item: { type: Object as PropType<ConversationMessageNotify>, required: true },
});

const avatarImg = computed(() => (props.item?.from?.avatar ? props.item?.from?.avatar : ''));
const user = computed(() => props.item?.from);
const dateToTime = computed(() => dayjs(props.item?.dateTo).format(GlobalVariables.TIME_FORMAT));
const dateFrom = computed(() => dayjs(props.item?.dateFrom).format(GlobalVariables.WEEK_DAY_MONTH_YEAR_FORMAT));
const dateFromTime = computed(() => dayjs(props.item?.dateFrom).format(GlobalVariables.TIME_FORMAT));
const updatedAt = computed(() => dayjs(props.item?.updatedAt).format(GlobalVariables.WEEK_DAY_MONTH_YEAR_FORMAT));
const updatedAtTime = computed(() => dayjs(props.item?.updatedAt).format(GlobalVariables.TIME_FORMAT));

const onDelete = () => {
  console.log('delete', props.item._id);
};
</script>

<style lang="scss" scoped>
.notification-card {
  position: relative;
  overflow: hidden;
  height: min-content;
  margin: 0.5rem;
  padding: 20px;
  border: 1px solid transparent;

  &--active {
    background-color: var(--color-background-1) !important;
    border: 1px solid var(--color-mono-200);

    .notification-card__status {
      background-color: var(--color-primary-400);
    }
  }

  &__status {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-mono-600);
  }

  &__content {
    width: 100%;

    > img {
      object-fit: cover;
      height: 70px;
      width: 100%;
    }
  }

  &__message {
    margin-top: 5px;
  }

  &__user {
    display: flex;
    justify-content: start;
    align-items: center;
  }

  &__name {
    display: flex;
  }

  &__name,
  &__company {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-inline-start: 9px;
    line-height: var(--line-height-20);

    > * {
      padding-inline-end: 0.25rem;
      text-transform: capitalize;
    }
  }

  &__time {
    color: var(--color-mono-300);
  }

  &__address {
    color: var(--color-mono-700);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
