<template>
  <div class="job-offer-table">
    <vz-tab-switcher class="job-offer-table__tabs" :tabs="[]" />

    <vz-data-table
      class="job-offer-table__container"
      :headers="tableHeaders"
      :items="jobOffersState || []"
      :current-page="currentPage"
      :total-items="totalItems"
      :loading="searchPositionsRequest.loading.value"
      :errors="searchPositionsRequest.error.value || {}"
      id-key="_id"
      @clear="onClear"
      @search="onSearch"
      @select="$emit('select', $event)"
      @update:current-page="onPageChange"
    >
      <template #search-panel="{ errors }">
        <vz-datepicker
          v-model="filters.dateFrom"
          clearable
          label="GENERAL.DATE_FROM"
          :max="filters.dateTo"
          :rules="{ required: [true] }"
          :error-message="errors?.dateFrom"
        />

        <vz-datepicker v-model="filters.dateTo" clearable label="GENERAL.DATE_TO" :min="filters.dateFrom" :error-message="errors?.dateTo" />

        <vz-select
          v-model="filters.jobType"
          clearable
          fixed
          type="multiselect"
          label="JOB_OFFER.JOB_CLASSIFICATION"
          :items="listClassificationRequest.results.value || []"
          :loading="listClassificationRequest.loading.value"
          :error-message="listClassificationRequest.error.value || errors?.jobType"
          @update:model-value="onSpecializationChange"
        />

        <vz-select
          v-model="filters.skills"
          clearable
          fixed
          type="multiselect"
          label="JOB_OFFER.REQUIREMENTS"
          :items="listSkillsRequest.results.value || []"
          :loading="listSkillsRequest.loading.value"
          :error-message="listSkillsRequest.error.value || errors?.skills"
        />

        <vz-select
          v-model="filters.location"
          clearable
          fixed
          type="select"
          label="GENERAL.ADDRESS"
          debounce="500"
          :items="listPlacesRequest.results.value || []"
          :loading="listPlacesRequest.loading.value"
          :error-message="listPlacesRequest.error.value || errors?.location"
          @search="(query: string) => listPlacesRequest.call(query)"
        />

        <vz-input
          v-model="filters.maxDistance"
          type="number"
          :rules="{ required: [true], type: ['Number'], max: [500] }"
          :label="`${$t('JOB_OFFER.MAX_DISTANCE')} (${$t('GENERAL.KM')})`"
          :error-message="errors?.maxDistance"
        />
      </template>

      <template #details="{ item }">
        <div class="job-offer-table__title">
          <p class="vz-font-size-14" :class="{ 'vz-font-weight-600': item.title }">{{ item.title || getJobType(item) }}</p>
          <p v-if="item.title" class="vz-font-size-12">({{ getJobType(item) }})</p>

          <vz-badge v-if="item.hasUpdated" class="ms-1" text="JOB.UPDATED" font-size="10" color="red-700" />
        </div>

        <p>
          <span class="vz-font-size-12 vz-font-weight-600">{{ formattedDate(item) }}</span>
          <span class="vz-font-size-12 ms-1">{{ formattedTime(item) }}</span>
        </p>
      </template>

      <template #location="{ item }">
        <p class="job-offer-table__location vz-font-size-14 vz-font-weight-600">
          <vz-image v-if="item.location?.icon" :src="item.location.icon" height="16" width="16" :alt="item.location?.title" />
          <span>{{ item.location?.title }}</span>
          <vz-badge text="GENERAL.KM" font-size="8" color="mono-700" :counter="Math.floor(item.distance / 1000)" />
        </p>

        <p class="vz-font-size-12">{{ item.location.address }}</p>
      </template>

      <template #position="{ item }">
        <div class="job-offer-table__position vz-font-size-12">
          <vz-badge v-for="({ title }, index) in item.type" :key="index" :text="title" />
        </div>
      </template>

      <template #status="{ item }">
        <vz-badge
          v-if="item.status?.createdAt"
          class="conversation-status-badge"
          multiline
          font-size="12"
          :color="statusColor[item.status.type]"
          v-bind="$attrs"
        >
          <span>{{ $t(`JOB_OFFER.STATUS.${item.status.type}`) }}</span>
          <span>{{ getDate(item.status.createdAt) }}</span>
        </vz-badge>
      </template>
    </vz-data-table>
  </div>
</template>

<script setup lang="ts">
import type { SearchPositionsReq } from '@/views/jobs/model/position/search-positions-req';
import type { TableHeader } from '@/shared/components/tables/models/table-header';
import type { UserLocation } from '@/models';
import type { BaseOptions } from '@/shared/models';
import { CLEAR_JOB_OFFERS, JOB_OFFERS, JOB_OFFERS_FILTER, JOB_OFFERS_PAGINATION, SEARCH_POSITIONS } from '@/views/jobs/store/constants';
import { computed, onBeforeMount, ref } from 'vue';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { usePromise } from '@/shared/composables';
import { formattedTime, formattedDate } from '@/views/calendar/helpers';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import useGeneralStore from '@/store/client/composables/use-general-store';
import { LIST_ADDRESSES } from '@/store/client/constants';
import { statusColor } from '@/views/jobs/constants/status-color-map';
import dayjs from 'dayjs';
import { GlobalVariables } from '@/shared/constants/global-variables';
import { SearchPositionsRes } from '@/views/jobs/model/position';

defineEmits(['select']);

const { useActions: useJobActions, useState: useJobState, useMutations: useJobMutations } = useJobStore();

const {
  [JOB_OFFERS]: jobOffersState,
  [JOB_OFFERS_FILTER]: jobOffersFilterState,
  [JOB_OFFERS_PAGINATION]: jobOffersPaginationState,
} = useJobState([JOB_OFFERS, JOB_OFFERS_FILTER, JOB_OFFERS_PAGINATION]);
const { [SEARCH_POSITIONS]: searchPositionsAction } = useJobActions([SEARCH_POSITIONS]);
const { [CLEAR_JOB_OFFERS]: clearJobOffers } = useJobMutations([CLEAR_JOB_OFFERS]);

const { useActions: useGeneralActions } = useGeneralStore();
const { [LIST_ADDRESSES]: listPlacesAction } = useGeneralActions([LIST_ADDRESSES]);

const { activeUser } = useAuthUser();

const tableHeaders: Array<TableHeader> = [
  { title: 'GENERAL.DETAILS', value: 'details' },
  { title: 'GENERAL.LOCATION', value: 'location' },
  { title: 'JOB_OFFER.REQUIRED_SKILLS', value: 'position' },
  { title: 'GENERAL.STATUS', value: 'status' },
];

const filters = ref<SearchPositionsReq>({
  jobType: [...(activeUser.value?.specialization || [])],
  skills: [...(activeUser.value?.skills || [])],
  location: activeUser.value?.location || null,
  dateFrom: Date.now(),
  maxDistance: 250,
  ...(jobOffersFilterState.value || {}),
  page: jobOffersPaginationState.value,
} as SearchPositionsReq);

const searchPositionsRequest = usePromise(searchPositionsAction as (payload: SearchPositionsReq) => Promise<SearchPositionsRes>, {
  errorsCleanUpTime: 30 * 1000,
});
const listPlacesRequest = usePromise<BaseOptions<UserLocation>>(listPlacesAction as (query: string) => Promise<BaseOptions<UserLocation>>);

const { listClassificationRequest, listSkillsRequest } = useJobTypes();

const currentPage = computed(() => jobOffersPaginationState.value?.index || 0);
const totalItems = computed(() => jobOffersPaginationState.value?.total || 0);

const getDate = (date?: number) => (date ? dayjs(date).format(GlobalVariables.DAY_MONTH_YEAR_TIME_FORMAT) : undefined);

const getJobType = ({ jobType }: { jobType: string }): string =>
  listClassificationRequest.results.value?.find(({ value }) => value === jobType)?.title || jobType;

const onSpecializationChange = async (specialization: Array<string>): Promise<void> => {
  listSkillsRequest.results.value = [];

  if (specialization?.length) {
    await listSkillsRequest.call({ groups: specialization });
  }

  filters.value.skills = filters.value.skills?.filter((key) => !!listSkillsRequest.results.value?.find(({ value }) => value === key));
};

const onSearch = async (): Promise<void> => {
  await searchPositionsRequest.call(filters.value);
};

const onClear = async (): Promise<void> => {
  const addressQuery = activeUser.value?.location?.place || activeUser.value?.location?.address;

  if (addressQuery) {
    listPlacesRequest.call(addressQuery);
  }

  filters.value = {
    dateFrom: Date.now(),
    jobType: [...(activeUser.value?.specialization || [])],
    skills: [...(activeUser.value?.skills || [])],
    location: activeUser.value?.location || null,
    maxDistance: 250,
    page: { size: jobOffersPaginationState.value.size },
  };
  clearJobOffers();
};

const onPageChange = async (value: number): Promise<void> => {
  await searchPositionsRequest.call({ ...filters.value, page: { index: value } });
};

onBeforeMount(async () => {
  await listClassificationRequest.call();
  await listSkillsRequest.call({ groups: filters.value.jobType });

  if (filters.value?.location) {
    await listPlacesRequest.call(filters.value.location?.place || filters.value.location?.address);
  }
});
</script>

<style lang="scss" scoped>
.job-offer-table {
  position: relative;
  height: calc(100% - 2.5rem);

  &__title {
    display: flex;
    align-items: center;

    > *:not(:last-child) {
      margin-inline-end: 0.25rem;
    }
  }

  &__location {
    display: flex;
    align-items: center;

    > * {
      margin-inline-end: 0.25rem;
    }
  }

  &__position {
    display: flex;
    flex-wrap: wrap;

    > * {
      padding: 0 0.125rem;
      margin: 0 0.125rem 0.125rem 0.125rem;
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
