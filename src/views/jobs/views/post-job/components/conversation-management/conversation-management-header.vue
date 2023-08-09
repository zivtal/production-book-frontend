<template>
  <vz-collapse min-height="90">
    <div class="job-conversation-header">
      <vz-avatar
        :src="employee.avatar || undefined"
        :size="48"
        :verified="!!employee.verified"
        :loading="loading"
        @click="$emit('select', employee._id)"
      />

      <div class="job-conversation-header__user" @click="$emit('select', employee._id)">
        <div>
          <p class="vz-font-weight-600">
            <span>{{ employee?.firstName }}</span>
            <span class="ms-1">{{ employee?.lastName }}</span>
            <span v-if="employee?.nickName" class="ms-1">({{ employee?.nickName }})</span>
          </p>

          <vz-badge
            v-if="conversationStatus.status"
            class="ms-2"
            font-size="10"
            :date="conversationStatus.createdAt"
            :text="$t(`JOB_MANAGER.STATUS.${getStatus}`)"
            :color="statusColor[getStatus]"
          />
        </div>

        <p v-if="employee?.company" class="vz-font-size-12 vz-font-weight-600">{{ employee?.company }}</p>
      </div>

      <div class="job-conversation-header__offer">
        <job-conversation-agreement :agreement="conversationState.agreement" />

        <div>
          <template v-if="conversationStatus.type === ConversationStatusType.FREELANCER_INTERESTING">
            <job-status-button :type="ConversationStatusType.OWNER_ACCEPT" />

            <job-status-button :type="ConversationStatusType.OWNER_REJECT" />
          </template>

          <job-status-button v-else-if="isCancellable" :type="ConversationStatusType.CANCEL" />
        </div>
      </div>
    </div>
  </vz-collapse>

  <vz-divider />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type PropType } from 'vue';
import type { ProfileExtendDetails } from '@/views/employee/models';
import { CONVERSATION } from '@/views/jobs/store/constants';
import { statusColor } from '@/views/jobs/constants/status-color-map';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';

const JobStatusButton = defineAsyncComponent(() => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/components/job-status-button.vue'));

const JobConversationAgreement = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/components/job-conversation-agreement.vue')
);

defineProps({
  loading: { type: Boolean, default: false },
  employee: { type: Object as PropType<ProfileExtendDetails>, required: true },
});

defineEmits(['select']);

const { useState: useJobState } = useJobStore();
const { [CONVERSATION]: conversationState } = useJobState([CONVERSATION]);

const { isMe } = useAuthUser();

const isCancellable = computed(
  () =>
    conversationStatus.value &&
    isMe(conversationStatus.value.userId) &&
    (conversationStatus.value.type === ConversationStatusType.OWNER_ACCEPT || conversationStatus.value.type === ConversationStatusType.OWNER_REJECT)
);

const conversationStatus = computed(() => conversationState.value?.status);
const getStatus = computed((): string | undefined => conversationStatus.value?.type);
</script>

<style lang="scss">
.job-conversation-header {
  display: flex;
  flex-wrap: wrap;
  margin-inline-start: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.75rem;

  @include min-mobile-layout {
    justify-content: space-between;
  }

  @include mobile-layout {
    justify-content: flex-end;
  }

  > * {
    padding-inline-end: 0.5rem;
    height: 100%;
  }

  &__user {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-grow: 1;

    > div:first-child {
      display: flex;

      > p {
        display: flex;
        flex-wrap: wrap;
      }

      @include min-mobile-layout {
        font-size: var(--font-size-16);
      }

      @include mobile-layout {
        font-size: var(--font-size-14);
      }
    }
  }

  &__offer {
    > div:first-child {
      text-align: center;
    }

    > div:last-child {
      display: flex;
      justify-content: center;
      margin-top: 0.5rem;

      > * {
        margin: 0 0.25rem;
      }
    }
  }
}
</style>
