<template>
  <vz-card :class="['messenger-chat-card', { 'messenger-chat-card--active': isActive }]" :clickable="!isActive">
    <div class="messenger-chat-card__avatar">
      <vz-avatar v-for="(avatar, index) in avatars" :key="index" :src="avatar" size="36" />
    </div>

    <div class="messenger-chat-card__participants">
      {{ participants }}
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { BaseChat } from '@/views/messenger/models';

const props = defineProps({
  data: { type: Object as PropType<Omit<BaseChat, 'messages'>>, required: true },
  isActive: { type: Boolean, default: false },
});

const avatars = computed(() => (props.data?.participants || []).map(({ avatar }) => avatar));
const participants = computed(() => (props.data?.participants || []).map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(' ,'));
</script>

<style scoped lang="scss">
.messenger-chat-card {
  display: flex;
  align-items: center;

  &--active {
    font-weight: var(--font-weight-medium);
  }

  &__avatar {
    display: flex;

    > *:not(:first-child) {
      margin-inline-start: -16px;
    }
  }

  &__participants {
    margin-inline-start: 0.25rem;
    font-size: var(--font-size-14);
    @include max-lines(3);
  }
}
</style>
