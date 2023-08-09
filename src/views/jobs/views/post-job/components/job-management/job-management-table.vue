<template>
  <vz-data-table
    class="job-management-table"
    :headers="tableHeaders"
    :items="jobPostsState || []"
    :current-page="currentPage"
    :total-items="totalItems"
    :loading="searchJobPostsRequest.loading.value"
    id-key="_id"
    @clear="onClear"
    @search="onSearch"
    @select="$emit('select', $event)"
    @update:current-page="onPageChange"
  >
    <template #search-panel="{ errors }">
      <vz-datepicker v-model="filters.dateFrom" clearable label="GENERAL.DATE_FROM" :max="filters.dateTo" :error-message="errors?.dateFrom" />

      <vz-datepicker v-model="filters.dateTo" clearable label="GENERAL.DATE_TO" :min="filters.dateFrom" :error-message="errors?.dateTo" />

      <vz-select
        v-model="filters.jobType"
        clearable
        fixed
        type="multiselect"
        label="JOB_MANAGER.JOB_CLASSIFICATION"
        :rules="{ maxLength: [10] }"
        :items="listClassificationRequest.results.value || []"
        :loading="listClassificationRequest.loading.value"
        :error-message="listClassificationRequest.error.value || errors?.jobType"
      />

      <vz-input v-model="filters.value" clearable label="GENERAL.SEARCH" :rules="{ maxLength: [Length.TITLE] }" :error-message="errors?.value" />
    </template>

    <template #details="{ item }">
      <div class="job-management-table__item-title">
        <span class="vz-font-size-14 vz-font-weight-600">{{ item.title }}</span>
        <span class="vz-font-size-12">({{ getClassification(item.jobType) }})</span>

        <vz-badge v-if="hasUpdate(item.positions)" text="JOB.UPDATED" font-size="10" color="red-700" />
      </div>

      <p class="job-management-table__item-date">
        <span class="vz-font-size-12 vz-font-weight-600">{{ formattedDate(item) }}</span>
        <span class="vz-font-size-12">{{ formattedTime(item) }}</span>
      </p>
    </template>

    <template #location="{ item }">
      <p class="job-management-table__item-location vz-font-size-14 vz-font-weight-600">
        <vz-image v-if="item.location?.icon" class="me-1" :src="item.location.icon" height="16" width="16" />
        <span>{{ item.location.title }}</span>
      </p>
      <p class="vz-font-size-12">{{ item.location.address }}</p>
    </template>

    <template #position="{ item }">
      {{ item.positions.length }}
    </template>

    <template #unfilled="{ item }">
      {{ getUnfilled(item) }}
    </template>

    <template #participants="{ item }">
      <vz-avatar
        v-for="({ avatar, firstName, lastName }, index) in getParticipants(item.positions)"
        :key="index"
        :src="avatar || undefined"
        :size="32"
        :title="`${firstName} ${lastName}`"
      />
    </template>
  </vz-data-table>

  <post-job-modal />
</template>

<script setup lang="ts">
import type { JobManagerFilters, ListJobs } from '@/views/jobs/model/job';
import type { TableHeader } from '@/shared/components/tables/models/table-header';
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { CLEAR_JOB_POSTS, JOB_POSTS, JOB_POSTS_FILTER, JOB_POSTS_PAGINATION, SEARCH_JOB_POSTS } from '@/views/jobs/store/constants';
import { usePromise } from '@/shared/composables';
import { Length } from '@/shared/constants/length';
import { formattedTime, formattedDate } from '@/views/calendar/helpers';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import { getParticipants, getUnfilled, hasUpdate } from '../../helpers';

const PostJobModal = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/modals/post-job-modal/post-job-modal.vue')
);

defineEmits(['select']);

const { useActions, useState, useMutations } = useJobStore();
const {
  [JOB_POSTS]: jobPostsState,
  [JOB_POSTS_FILTER]: jobPostsFilterState,
  [JOB_POSTS_PAGINATION]: jobPostsPaginationState,
} = useState([JOB_POSTS, JOB_POSTS_FILTER, JOB_POSTS_PAGINATION]);
const { [SEARCH_JOB_POSTS]: searchJobPostsAction } = useActions([SEARCH_JOB_POSTS]);
const { [CLEAR_JOB_POSTS]: clearJobPostsMutation } = useMutations([CLEAR_JOB_POSTS]);

const searchJobPostsRequest = usePromise(searchJobPostsAction as (payload?: JobManagerFilters) => Promise<ListJobs>, {
  errorsCleanUpTime: 30 * 1000,
});

const { listClassificationRequest, getClassification } = useJobTypes();

const filters = ref<JobManagerFilters>({
  dateFrom: Date.now(),
  ...jobPostsFilterState.value,
  page: jobPostsPaginationState.value,
} as JobManagerFilters);

const tableHeaders: Array<TableHeader> = [
  { title: 'GENERAL.DETAILS', value: 'details' },
  { title: 'GENERAL.LOCATION', value: 'location' },
  { title: 'JOB_MANAGER.POSITIONS', value: 'position', style: { textAlign: 'center' } },
  { title: 'JOB_MANAGER.UNFILLED', value: 'unfilled', style: { textAlign: 'center' } },
  { title: 'JOB_MANAGER.PARTICIPANTS', value: 'participants' },
];

onBeforeMount(async (): Promise<void> => {
  await listClassificationRequest.call();
});

const currentPage = computed(() => jobPostsPaginationState.value?.index || 0);
const totalItems = computed(() => jobPostsPaginationState.value?.total || 0);

const onPageChange = async (value: number): Promise<void> => {
  await searchJobPostsRequest.call({ ...filters.value, page: { index: value, ...filters.value.page } });
};

const onSearch = async (): Promise<void> => {
  await searchJobPostsRequest.call(filters.value);
};

const onClear = async (): Promise<void> => {
  filters.value = { dateFrom: Date.now() };
  clearJobPostsMutation();
};
</script>

<style lang="scss">
.job-management-table {
  &__item-title {
    display: flex;
    align-items: center;
  }

  &__item {
    &-title,
    &-date {
      > *:not(:first-child) {
        margin-inline-start: 0.25rem;
      }
    }

    &-location {
      display: flex;
      align-items: center;
    }
  }

  @include max-tablet-layout {
    .vz-data-table {
      &__table-container {
        background-color: transparent;

        table tbody {
          td {
            padding: 0.25rem 0;
          }

          tr {
            border-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
