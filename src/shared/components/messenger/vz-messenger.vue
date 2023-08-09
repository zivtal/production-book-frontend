<template>
  <div class="messenger">
    <div ref="contentContainerRef">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="{ 'messenger--me': isMe(message.user._id), 'messenger--updated': index === activeIndex }"
      >
        <div class="messenger__message" v-on="!isMe(message.user._id) ? { click: () => $emit('select:participant', message.user._id) } : {}">
          <vz-avatar :src="message.user.avatar" size="36" />

          <div class="messenger__message-sender">
            <div>
              <span>{{ message.user.firstName }}</span>
              <span>{{ message.user.lastName }}</span>
              <span>{{ message.user.nickName }}</span>
            </div>

            <p>
              {{ dayjs(message.updatedAt).format(GlobalVariables.DAY_MONTH_YEAR_TIME_FORMAT + ':ss') }}
            </p>
          </div>
        </div>

        <div class="messenger__message-text">
          {{ message.message }}
        </div>
      </div>
    </div>

    <vz-input
      v-model="vModel"
      class="messenger__input"
      hide-details
      append-icon="svg:send"
      :rules="{ maxLength: [+maxLength] }"
      @keydown.enter.stop="onSendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, type PropType, ref, watch } from 'vue';
import type { BaseChat, BaseChatMessage } from '@/views/messenger/models';
import type { ProfileBaseDetails } from '@/views/employee/models';
import dayjs from 'dayjs';
import { GlobalVariables } from '@/shared/constants/global-variables';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import { scrollToView } from '@/shared/helpers';

type Messages = Array<Omit<BaseChatMessage, 'fromId'> & { user: ProfileBaseDetails }>;

const props = defineProps({
  modelValue: { type: [Object, Number, String, Array], required: true },
  chat: { type: Object as PropType<BaseChat>, required: true },
  maxLength: { type: [String, Number], default: 1024 },
});

const emit = defineEmits(['update:model-value', 'select:participant', 'send']);

const { isMe } = useAuthUser();

const contentContainerRef = ref<HTMLDivElement | undefined>();

const vModel = computed({
  get: (): any => props.modelValue,
  set: (value) => emit('update:model-value', value),
});

const messages = computed(
  (): Messages =>
    (props.chat?.messages || []).map(({ fromId, ...message }: BaseChatMessage) => ({
      ...message,
      user: (props.chat?.participants || []).find(({ _id }) => _id === fromId)!,
    }))
);

const activeIndex = computed(() => messages.value.findIndex((message) => message.updatedAt > props.chat.lastSeenAt));

const onSendMessage = (): void => {
  if (!vModel.value) {
    return;
  }

  emit('send', vModel.value);
  emit('update:model-value', null);
};

watch(
  () => contentContainerRef.value,
  () => {
    if (!contentContainerRef.value) {
      return;
    }

    if (activeIndex.value > 0) {
      scrollToView('.messenger-updates');
    } else {
      contentContainerRef.value?.scrollTo({ top: contentContainerRef.value?.scrollHeight });
    }
  },
  { immediate: true }
);

watch(
  () => messages.value,
  () => {
    nextTick(() => {
      if (!contentContainerRef.value) {
        return;
      }

      contentContainerRef.value.scrollTo({ top: contentContainerRef.value?.scrollHeight });
    });
  }
);
</script>

<style lang="scss">
.messenger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  height: 0;

  > div:first-child {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 0.25rem;

    > div {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
    }
  }

  &--me {
    > * {
      text-align: end;
      flex-direction: row-reverse;
      justify-content: flex-start;
      width: 100%;
    }
  }

  &__message {
    display: flex;

    &:not(&-me) {
      cursor: pointer;
    }

    &-sender {
      margin: 0 0.25rem;
      display: flex;
      flex-direction: column;

      > div:first-child {
        font-weight: 500;
        font-size: var(--font-size-12);

        span {
          padding: 0 2px;
        }
      }

      > p:last-child {
        font-size: var(--font-size-10);
      }
    }

    &-text {
      padding: 16px;
      background-color: var(--color-primary-100);
      font-size: var(--font-size-14);
      max-width: fit-content;
      border-radius: 0 8px 8px 8px;

      .messenger--me & {
        align-self: end;
        border-radius: 8px 0 8px 8px;
      }
    }
  }

  &__input {
    padding-bottom: 1rem;
  }
}
</style>
