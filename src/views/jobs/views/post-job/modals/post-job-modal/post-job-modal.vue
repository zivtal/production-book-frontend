<template>
  <vz-overlay
    blur="5"
    opacity="0.7"
    name="create-edit-post-job-modal"
    :open-event="openEvent"
    :close-event="closeEvent"
    @close="() => emitter.emit(closeEvent)"
  >
    <create-edit-job @close="() => emitter.emit(closeEvent)" />
  </vz-overlay>
</template>

<script setup lang="ts">
import { emitter } from '@/main';
import { CLOSE_POST_JOB_MODAL, OPEN_POST_JOB_MODAL } from '@/views/jobs/views/post-job/constants/post-job-events';
import CreateEditJob from '@/views/jobs/views/post-job/modals/post-job-modal/components/create-edit-job.vue';

defineProps({
  openEvent: { type: String, default: OPEN_POST_JOB_MODAL },
  closeEvent: { type: String, default: CLOSE_POST_JOB_MODAL },
});
</script>

<style lang="scss" scoped>
.post-job-modal {
  width: 680px;
  background-color: var(--color-background-1);
}
</style>
