<template>
  <div v-if="conversationState" class="job-conversation-actions">
    <job-conversation-agreement :agreement="conversationState.agreement" />

    <div class="my-2">
      <conversation-status-badge v-if="conversationState.status" :status="conversationState.status" />
    </div>

    <div class="mt-2">
      <job-status-button v-if="statusType === ConversationStatusType.OWNER_ACCEPT" class="mx-1" :type="ConversationStatusType.FREELANCER_REJECT" />

      <job-status-button v-if="statusType === ConversationStatusType.OWNER_ACCEPT" class="mx-1" :type="ConversationStatusType.FREELANCER_ACCEPT" />

      <job-status-button v-if="statusType === ConversationStatusType.FREELANCER_ACCEPT" class="mx-1" :type="ConversationStatusType.CANCELLATION" />

      <job-status-button v-if="isCancellable" class="mx-1" :type="ConversationStatusType.CANCEL" />

      <job-status-button
        v-if="statusType === ConversationStatusType.FREELANCER_INTERESTING"
        class="mx-1"
        :type="ConversationStatusType.FREELANCER_LEFT"
      />

      <vz-overlay v-if="statusType === ConversationStatusType.FREELANCER_INTERESTING" blur="5" size="small" name="job-offer-modal">
        <template #activator="{ open }">
          <vz-button
            v-if="statusType === ConversationStatusType.FREELANCER_INTERESTING"
            class="mx-1"
            text="JOB_OFFER.UPDATE_OFFER"
            color="mono-200"
            @click="open"
          />
        </template>

        <template #default="{ close }">
          <create-edit-conversation-agreement :position-id="conversationState.positionId" @close="close" @cancel="close" />
        </template>
      </vz-overlay>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { CONVERSATION } from '@/views/jobs/store/constants';
import { computed, defineAsyncComponent } from 'vue';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';

const JobStatusButton = defineAsyncComponent(() => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/components/job-status-button.vue'));

const ConversationStatusBadge = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/components/conversation-status-badge.vue')
);

const JobConversationAgreement = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/components/job-conversation-agreement.vue')
);

const CreateEditConversationAgreement = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "job-offer" */
      '@/views/jobs/views/job-offer/components/job-offer-conversation/job-offer-conversation-agreement-create-edit.vue'
    )
);

const { isMe } = useAuthUser();

const { useState: useJobState } = useJobStore();
const { [CONVERSATION]: conversationState } = useJobState([CONVERSATION]);

const statusType = computed(() => conversationState.value?.status.type);
const statusUser = computed(() => conversationState.value?.status.userId);

const isCancellable = computed(
  () =>
    statusUser.value &&
    isMe(statusUser.value) &&
    statusType.value !== ConversationStatusType.FREELANCER_ACCEPT &&
    statusType.value !== ConversationStatusType.FREELANCER_INTERESTING
);
</script>

<style lang="scss" scoped>
.job-conversation-actions {
  margin: 16px 0;
  padding: 16px 24px;
  min-width: calc(100% - 24px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  outline: 1px solid var(--color-mono-600);
  border-radius: var(--border-radius-1);
  box-shadow: var(--shadow-level-1);

  .vz-button {
    min-width: 5rem;
  }
}
</style>
