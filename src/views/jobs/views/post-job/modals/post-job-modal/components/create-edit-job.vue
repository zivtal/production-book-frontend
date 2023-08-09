<template>
  <vz-stepper v-model="postJob" class="post-job-modal" :components="components" @cancel="$emit('close')" @submit="$emit('close')"> </vz-stepper>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import type { CreatePostJobReq, UpdatePostJobReq } from '@/views/jobs/model/job';
import type { Position } from '@/views/jobs/model/position';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { CREATE_JOB_POST, JOB_DETAILS, UPDATE_JOB_POST } from '@/views/jobs/store/constants';
import { Stepper } from '@/shared/components/stepper/models/stepper';
import PostJobNameAndType from '@/views/jobs/views/post-job/modals/post-job-modal/components/create-edit-job-name-and-type.vue';
import PostJobAddSkills from '@/views/jobs/views/post-job/modals/post-job-modal/components/create-edit-job-positions.vue';
import PostJobTimeAndLocation from '@/views/jobs/views/post-job/modals/post-job-modal/components/create-edit-job-time-and-location.vue';
import PostJobDescription from '@/views/jobs/views/post-job/modals/post-job-modal/components/create-edit-job-description.vue';
import { cloneDeep } from 'lodash';

defineProps({ payload: { type: Object as PropType<UpdatePostJobReq | undefined>, default: undefined } });

defineEmits(['close']);

const { useState } = useJobStore();
const { [JOB_DETAILS]: jobDetailsState } = useState([JOB_DETAILS]);

const postJob = ref<CreatePostJobReq | UpdatePostJobReq>(
  cloneDeep(
    jobDetailsState.value
      ? {
          ...jobDetailsState.value,
          maxDistance: (jobDetailsState.value?.maxDistance || 0) / 1000 || 250,
        }
      : {
          title: '',
          positions: [{ amount: 1 }],
          location: null,
          maxDistance: 250,
        }
  ) as CreatePostJobReq | UpdatePostJobReq
);

const { useActions } = useJobStore();
const { [CREATE_JOB_POST]: createJobPostAction, [UPDATE_JOB_POST]: updateJobPostAction } = useActions([CREATE_JOB_POST, UPDATE_JOB_POST]);

const components = computed(
  (): Stepper<CreatePostJobReq & Position> => [
    {
      component: PostJobNameAndType,
      title: `JOB_MANAGER.CREATE_JOB_POST_MODAL.TITLE.${jobDetailsState.value ? 'UPDATE' : 'CREATE'}`,
      properties: ['title', 'jobType'],
    },
    { component: PostJobAddSkills, properties: ['positions', 'amount', 'type', 'comment'] },
    { component: PostJobTimeAndLocation, properties: ['location', 'dateTo', 'dateFrom', 'maxDistance'] },
    {
      component: PostJobDescription,
      properties: ['description'],
      callback: () =>
        jobDetailsState.value ? updateJobPostAction(postJob.value as UpdatePostJobReq) : createJobPostAction(postJob.value as CreatePostJobReq),
    },
  ]
);
</script>

<style scoped lang="scss"></style>
