<template>
  <vz-card class="job-conversation-messenger" :class="{ 'job-conversation-messenger--selected': !!conversationState }">
    <template v-if="conversationState && !loading">
      <job-conversation-header v-if="employee" class="absolute" :employee="employee" :loading="employee?._id === loadingUser" />

      <vz-messenger v-model="messageContent" :chat="conversationState" @send="onSendMessage" @select:participant="onUserClick" />

      <employee-view-modal />
    </template>

    <vz-spinner v-else-if="loading" class="vz-data-table vz-data-table--no-data" size="128" aria-label="JOB_OFFER.CONVERSATION" />
  </vz-card>
</template>

<script setup lang="ts">
import type { SendConversationMessageReq, GetConversationReq } from '@/views/jobs/model/conversation';
import type { BaseId } from '@/shared/models';
import { computed, defineAsyncComponent, nextTick, onBeforeMount, onUnmounted, ref, watch } from 'vue';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { usePromise } from '@/shared/composables';
import { CONVERSATION, GET_CONVERSATION, LEAVE_CONVERSATION, SEND_CONVERSATION_MESSAGE } from '@/views/jobs/store/constants';
import { useRouter } from 'vue-router';
import { GET_EMPLOYEE_DETAILS } from '@/views/employee/store/constants';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { emitter } from '@/main';
import { OPEN_EMPLOYEE_VIEW_MODAL } from '@/views/lobby/constants/lobby-events';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import SocketService from '@shared/services/socket-service/socket.service';

const EmployeeViewModal = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile" */ '@/views/lobby/modals/employee-view-modal.component.vue')
);

const JobConversationHeader = defineAsyncComponent(
  () => import(/* webpackChunkName: "job" */ '@/views/jobs/views/post-job/components/conversation-management/conversation-management-header.vue')
);

const props = defineProps({ disableRoute: { type: Boolean, default: false } });

const router = useRouter();

const { useState: useJobState, useActions: useJobActions } = useJobStore();
const { [CONVERSATION]: conversationState } = useJobState([CONVERSATION]);
const {
  [GET_CONVERSATION]: getConversationAction,
  [SEND_CONVERSATION_MESSAGE]: sendConversationMessageAction,
  [LEAVE_CONVERSATION]: leaveConversationAction,
} = useJobActions([GET_CONVERSATION, SEND_CONVERSATION_MESSAGE, LEAVE_CONVERSATION]);
const { [GET_EMPLOYEE_DETAILS]: getEmployeeDetailsAction } = useEmployeeStore().useActions([GET_EMPLOYEE_DETAILS]);

const sendConversationMessageRequest = usePromise(sendConversationMessageAction as (payload: SendConversationMessageReq) => Promise<void>);
const getConversationRequest = usePromise(getConversationAction as (payload: GetConversationReq) => Promise<void>);
const leaveConversationRequest = usePromise(leaveConversationAction as (conversationId?: string) => Promise<void>);
const { isMe } = useAuthUser();

const loadingUser = ref<string | null>(null);
const contentContainer = ref<HTMLDivElement>();
const messageContent = ref<string>('');

const employee = computed(() => (!props.disableRoute ? conversationState.value?.participants.find(({ _id }) => !isMe(_id)) : undefined));

const onUserClick = async (userId: BaseId, messageId?: string): Promise<void> => {
  try {
    loadingUser.value = messageId || userId;
    await router.push({ query: { userId } });
    await getEmployeeDetailsAction({ userId });
    emitter.emit(OPEN_EMPLOYEE_VIEW_MODAL);
  } catch (e) {
    await router.push({ query: {} });
  } finally {
    loadingUser.value = null;
  }
};

const onSendMessage = async (): Promise<void> => {
  if (!conversationState.value) {
    return;
  }

  await sendConversationMessageRequest.call({ id: conversationState.value._id, message: messageContent.value });
  messageContent.value = '';

  await nextTick(() => contentContainer.value?.scrollTo({ top: contentContainer.value?.scrollHeight }));
};

const loading = computed(() => getConversationRequest.loading.value || leaveConversationRequest.loading.value);

watch(
  () => conversationState.value?.messages,
  () => nextTick(() => contentContainer.value?.scrollTo({ top: contentContainer.value?.scrollHeight })),
  { immediate: true, deep: true }
);

watch(
  () => router.currentRoute.value.query.conversationId,
  async (id) => {
    if (props.disableRoute) {
      return;
    }

    if (!id) {
      await leaveConversationRequest.call();

      return;
    }

    await getConversationRequest.call({ conversationId: id });
  },
  { immediate: true }
);

onUnmounted(() => {
  leaveConversationAction();
  SocketService.terminate();
});
</script>

<style lang="scss">
.job-conversation-messenger {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;

  &__content {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    flex-grow: 1;
    margin-bottom: 1rem;

    &-container {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
    }

    &-message {
      display: flex;

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
        display: flex;
        padding: 16px;
        margin: 0 16px;
        background-color: var(--color-background-2);
        border-radius: 0 8px 8px 8px;
        font-size: var(--font-size-14);
        max-width: fit-content;

        &--end {
          justify-content: end;
          border-radius: 8px 0 8px 8px;
        }
      }
    }
  }
}
</style>
