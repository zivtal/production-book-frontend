<template>
  <vz-button
    class="mx-1"
    :text="text || LABEL[type]"
    :color="statusColor[type]"
    :loading="updateConversationStatusRequest.loading.value"
    @click="onUpdateStatus"
  />
</template>

<script setup lang="ts">
import type { UpdateConversationStatusReq } from '@/views/jobs/model/conversation';
import { type PropType } from 'vue';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import { statusColor } from '@/views/jobs/constants/status-color-map';
import { CONVERSATION, SEND_CONVERSATION_MESSAGE, UPDATE_CONVERSATION_STATUS } from '@/views/jobs/store/constants';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { usePromise } from '@/shared/composables';

const LABEL: Partial<Record<keyof typeof ConversationStatusType, string>> = {
  CANCEL: 'GENERAL.CANCEL',
  OWNER_ACCEPT: 'GENERAL.APPROVE',
  OWNER_REJECT: 'GENERAL.REJECT',
  FREELANCER_ACCEPT: 'GENERAL.APPROVE',
  FREELANCER_INTERESTING: 'JOB_OFFER.STATUS.INTERESTING',
  FREELANCER_REJECT: 'GENERAL.REJECT',
  FREELANCER_LEFT: 'JOB_OFFER.CANCEL_OFFER',
  CANCELLATION: 'JOB.CANCELLATION_REQUEST',
};

const { useState: useJobState, useActions: useJobActions } = useJobStore();
const { [CONVERSATION]: conversationState } = useJobState([CONVERSATION]);
const { [UPDATE_CONVERSATION_STATUS]: updateConversationStatusAction } = useJobActions([UPDATE_CONVERSATION_STATUS, SEND_CONVERSATION_MESSAGE]);

const updateConversationStatusRequest = usePromise(updateConversationStatusAction as (payload: UpdateConversationStatusReq) => Promise<void>);

const props = defineProps({
  type: { type: String as PropType<keyof typeof ConversationStatusType>, required: true },
  text: { type: String, default: '' },
});

defineEmits(['update']);

const onUpdateStatus = async (): Promise<void> =>
  await updateConversationStatusRequest.call({ id: conversationState.value?._id, status: props.type });
</script>
