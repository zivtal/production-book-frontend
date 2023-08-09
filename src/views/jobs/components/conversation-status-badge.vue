<template>
  <vz-badge
    class="conversation-status-badge"
    font-size="12"
    :date="status.createdAt"
    :text="$t(`JOB_OFFER.STATUS.${status.type}`)"
    :color="statusColor[status.type]"
  />
</template>

<script setup lang="ts">
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import { type PropType } from 'vue';
import { statusColor } from '@/views/jobs/constants/status-color-map';

defineProps({
  status: { type: Object as PropType<GetConversationRes['status']>, required: true },
});
</script>

<style lang="scss">
.conversation-status-badge {
  width: fit-content;
}
</style>
