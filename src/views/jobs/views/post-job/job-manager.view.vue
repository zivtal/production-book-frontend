<template>
  <vz-spinner v-if="getJobDetailsRequest.loading.value" class="job-manager--loading" size="128" />

  <template v-else>
    <job-tab-navigation>
      <template #content="{ index }">
        <job-management v-if="index === 0" />

        <positions-management v-else-if="index === 1" />

        <conversation-management v-else-if="index === 2 || index === 3" />

        <post-job-modal />
      </template>
    </job-tab-navigation>
  </template>
</template>

<script setup lang="ts">
import type { BaseId } from '@/shared/models';
import { computed, defineAsyncComponent, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { GET_JOB_DETAILS, SET_JOB_DETAILS } from '@/views/jobs/store/constants';
import { usePromise } from '@/shared/composables';
import SocketService from '@shared/services/socket-service/socket.service';

const JobTabNavigation = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/job-manager-tab-stepper.vue')
);

const ConversationManagement = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/conversation-management/conversation-management.vue')
);

const PositionsManagement = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/positions-management/positions-management.vue')
);

const JobManagement = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/job-management/job-management.vue')
);

const PostJobModal = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/modals/post-job-modal/post-job-modal.vue')
);

const router = useRouter();

const { useActions, useMutations } = useJobStore();
const { [GET_JOB_DETAILS]: getJobDetailsAction } = useActions([GET_JOB_DETAILS]);
const { [SET_JOB_DETAILS]: setJobDetailsAction } = useMutations([SET_JOB_DETAILS]);

const getJobDetailsRequest = usePromise(getJobDetailsAction as (jobId: BaseId) => Promise<void>);

const jobId = computed(() => router.currentRoute.value.params.jobId);

watch(
  () => jobId.value,
  async (id) => {
    if (!id) {
      setJobDetailsAction();

      return;
    }

    await getJobDetailsRequest.call(id);
  },
  { immediate: true }
);

onUnmounted(() => SocketService.terminate());
</script>

<style lang="scss">
.job-manager {
  &--loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.vz-data-table__data-participants {
  display: flex;

  .vz-avatar:not(:first-child) {
    margin-inline-start: -12px;
  }

  span {
    margin-inline-start: 2px;
    align-self: center;
  }
}
</style>
