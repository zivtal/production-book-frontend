<template>
  <vz-tab-switcher :tabs="['JOB_OFFER.JOB_OFFERS', 'JOB_OFFER.OPEN_OFFERS']">
    <template #append>
      <vz-button color="mono-500" background-color="mono-200" icon-name="svg:filter" height="38" width="38" @click="showFilters" />
    </template>

    <template #content="{ index }">
      <vz-infinity-scroll v-show="index === 0" :callback="searchPositionsRequest" :payload="payload">
        <template #content="{ data }">
          <job-offer-card v-for="(item, jobIndex) in data" :key="jobIndex" :item="item" @click="$emit('select', item._id)" />
        </template>
      </vz-infinity-scroll>

      <vz-infinity-scroll v-show="index === 1" :callback="searchPositionsRequest" :payload="{ ...payload, inConversation: true }">
        <template #content="{ data }">
          <job-offer-card v-for="(item, jobIndex) in data" :key="jobIndex" :item="item" @click="$emit('select', item._id)" />
        </template>
      </vz-infinity-scroll>
    </template>

    <template v-if="isFilterShown" #splash>
      <div class="job-offers-grid__filters">
        <form ref="filtersRef" role="form" autocomplete="off" @submit.prevent>
          <vz-datepicker v-model="filters.dateFrom" clearable label="GENERAL.DATE_FROM" :max="filters.dateTo" :rules="{ required: [true] }" />

          <vz-datepicker v-model="filters.dateTo" clearable label="GENERAL.DATE_TO" :min="filters.dateFrom" />

          <vz-select
            v-model="filters.jobType"
            clearable
            fixed
            type="multiselect"
            label="JOB_OFFER.JOB_CLASSIFICATION"
            :items="listClassificationRequest.results.value || []"
            :loading="listClassificationRequest.loading.value"
            :error-message="listClassificationRequest.error.value"
          />

          <vz-select
            v-model="filters.skills"
            clearable
            fixed
            type="multiselect"
            label="JOB_OFFER.REQUIREMENTS"
            :items="listSkillsRequest.results.value || []"
            :loading="listSkillsRequest.loading.value"
            :error-message="listSkillsRequest.error.value"
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
            :error-message="listPlacesRequest.error.value"
            @search="(query: string) => listPlacesRequest.call(query)"
          />

          <vz-input
            v-model="filters.maxDistance"
            type="number"
            :rules="{ required: [true], type: ['Number'], max: [500] }"
            :label="`${$t('JOB_OFFER.MAX_DISTANCE')} (${$t('GENERAL.KM')})`"
          />
        </form>

        <div class="job-offers-grid__filters-actions">
          <vz-button height="42" text="GENERAL.RESET" role="button" @click="onReset" />

          <vz-button height="42" text="GENERAL.SEARCH" role="button" @click="onSearch" />
        </div>
      </div>
    </template>
  </vz-tab-switcher>
</template>

<script setup lang="ts">
import type { BaseOptions } from '@/shared/models';
import type { UserLocation } from '@/models';
import type { JobManagerFilters } from '@/views/jobs/model/job';
import type { SearchPositionsReq, SearchPositionsRes } from '@/views/jobs/model/position';
import { SEARCH_POSITIONS } from '@/views/jobs/store/constants';
import { ref } from 'vue';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import JobOfferCard from '@/views/jobs/views/job-offer/components/job-offers/job-offer-card.vue';
import { cloneDeep } from 'lodash';
import { useFormValidator } from '@/shared/components/fields/helpers';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import { usePromise } from '@/shared/composables';
import { LIST_ADDRESSES } from '@/store/client/constants';
import useGeneralStore from '@/store/client/composables/use-general-store';

defineEmits(['select']);

const { useActions: useJobActions } = useJobStore();
const { [SEARCH_POSITIONS]: searchPositionsAction } = useJobActions([SEARCH_POSITIONS]);

const searchPositionsRequest = searchPositionsAction as (payload: SearchPositionsReq) => Promise<SearchPositionsRes>;

const { useActions: useGeneralActions } = useGeneralStore();
const { [LIST_ADDRESSES]: listPlacesAction } = useGeneralActions([LIST_ADDRESSES]);

const { activeUser } = useAuthUser();

const listPlacesRequest = usePromise<BaseOptions<UserLocation>>(listPlacesAction as (query: string) => Promise<BaseOptions<UserLocation>>);

const defaultPayload = {
  jobType: [...(activeUser.value?.specialization || [])],
  skills: [...(activeUser.value?.skills || [])],
  location: activeUser.value?.location || null,
  dateFrom: Date.now(),
  maxDistance: 250,
} as SearchPositionsReq;

const payload = ref<SearchPositionsReq>(defaultPayload);

const isFilterShown = ref<boolean>(false);

const filters = ref<JobManagerFilters>(payload.value);
const filtersRef = ref<Element | undefined>(undefined);

const { listClassificationRequest, listSkillsRequest } = useJobTypes();

const showFilters = (): void => {
  listClassificationRequest.call();
  listSkillsRequest.call({ groups: payload.value.jobType });
  filters.value = cloneDeep(payload.value);

  isFilterShown.value = !isFilterShown.value;
};

const onSearch = async (): Promise<void> => {
  const isValid = useFormValidator(filtersRef);

  if (!isValid()) {
    return;
  }

  isFilterShown.value = false;
  payload.value = filters.value;
};

const onReset = (): void => {
  payload.value = defaultPayload;
  isFilterShown.value = false;
};
</script>

<style lang="scss" scoped>
.job-offers-grid {
  &__filters {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    &-actions {
      display: flex;

      > * {
        flex: 1 0 0;

        &:not(:last-child) {
          margin-inline-end: 0.5rem;
        }
      }
    }
  }
}
</style>
