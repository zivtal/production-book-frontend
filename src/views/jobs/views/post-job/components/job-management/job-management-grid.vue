<template>
  <vz-infinity-scroll :callback="searchJobPostsRequest" :payload="payload">
    <template #content="{ data }">
      <job-details-card v-for="(item, cardIndex) in data" :key="cardIndex" :item="item" @click="$emit('select', item._id)" />
    </template>
  </vz-infinity-scroll>
</template>

<script setup lang="ts">
import type { JobManagerFilters, ListJobs } from '@/views/jobs/model/job';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { JOB_POSTS_FILTER, SEARCH_JOB_POSTS } from '@/views/jobs/store/constants';
import JobDetailsCard from '@/views/jobs/views/post-job/components/job-management/job-management-card.vue';
import { ref } from 'vue';

defineEmits(['select']);

const { useActions, useState } = useJobStore();
const { [SEARCH_JOB_POSTS]: searchJobPostsAction } = useActions([SEARCH_JOB_POSTS]);
const { [JOB_POSTS_FILTER]: jobPostsFilterState } = useState([JOB_POSTS_FILTER]);

const searchJobPostsRequest = searchJobPostsAction as (payload: JobManagerFilters) => Promise<ListJobs>;

const payload = ref<JobManagerFilters>({
  dateFrom: Date.now(),
  ...jobPostsFilterState.value,
} as JobManagerFilters);
</script>

<style lang="scss" scoped>
.job-manager-grid {
  &__filters {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    &-actions {
      display: flex;

      > * {
        flex: 1 0 0;
      }
    }
  }
}
</style>
