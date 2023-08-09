<template>
  <vz-tab-switcher class="employee-view" :tabs="tabs" :index="tabs.length - 1" :mode="['stepper']">
    <template #content>
      <search-panel
        :class="[
          'employee-view-search-panel',
          { 'employee-view-search-panel--hidden': isMobile && (getEmployeeDetailsRequest.loading.value || employeeDetailsState) },
        ]"
      />

      <vz-spinner v-if="getEmployeeDetailsRequest.loading.value" size="80" class="align-center" />

      <employee-feed v-else-if="employeeDetailsState" class="ms-2 flex-grow-1" />

      <vz-card v-else-if="!isMobile" class="mx-2 flex-grow-1 flex align-center justify-center flex-column">
        <img :src="findEmployeeImage" :alt="$t('GENERAL.SEARCH_FOR_RESULTS')" />
        <p>{{ $t('IDENTITY_CARD.SELECT_EMPLOYEE_TO_SEE_DETAILS') }}</p>
      </vz-card>
    </template>
  </vz-tab-switcher>
</template>

<script setup lang="ts">
import type { BaseId } from '@/shared/models';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { EMPLOYEE_DETAILS, GET_EMPLOYEE_DETAILS, SET_EMPLOYEE_DETAILS } from '@/views/employee/store/constants';
import { useRouter } from 'vue-router';
import { computed, onBeforeMount, watch } from 'vue';
import { usePromise } from '@/shared/composables';

import SearchPanel from '@/views/employee/components/employee-search-panel/employee-search-panel.vue';
import EmployeeFeed from '@/views/employee/components/full-identity-card/components/employee-feed.vue';
import { isMobile } from '@/shared/helpers';

const { useState, useMutations, useActions } = useEmployeeStore();
const { [EMPLOYEE_DETAILS]: employeeDetailsState } = useState([EMPLOYEE_DETAILS]);
const { [GET_EMPLOYEE_DETAILS]: getEmployeeDetailsAction } = useActions([GET_EMPLOYEE_DETAILS]);
const { [SET_EMPLOYEE_DETAILS]: setEmployeeDetailsMutation } = useMutations([SET_EMPLOYEE_DETAILS]);
const router = useRouter();

const getEmployeeDetailsRequest = usePromise(getEmployeeDetailsAction as (payload: { userId: BaseId }) => Promise<void>);

const findEmployeeImage = computed(() => require('@/assets/images/find-employee.svg'));

const tabs = computed(() => [
  { label: 'GENERAL.SEARCH', style: { overflowY: 'hidden' }, onClick: () => router.push({ query: { userId: undefined } }) },
  ...(employeeDetailsState.value ? [{ label: `${employeeDetailsState.value.firstName} ${employeeDetailsState.value.lastName}` }] : []),
]);

onBeforeMount(async (): Promise<void> => {
  if (employeeDetailsState.value?._id) {
    await router.push({ query: { userId: employeeDetailsState.value._id } });
  }
});

watch(
  () => router.currentRoute.value.query?.userId,
  async (id) => {
    if (!id) {
      setEmployeeDetailsMutation();

      return;
    } else if (id === employeeDetailsState.value?._id) {
      return;
    }

    await getEmployeeDetailsRequest.call({ userId: id });
  },
  { immediate: true }
);
</script>

<style lang="scss">
.employee-view {
  &-search-panel {
    &--hidden {
      display: none;
    }
  }

  .tab-switcher-content {
    position: relative;

    @include min-mobile-layout {
      display: flex;
      flex-direction: row;

      > * {
        width: 100%;
      }
    }
  }
}
</style>
