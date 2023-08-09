<template>
  <vz-infinity-scroll
    :class="['search-panel', { 'search-panel--selected': !!employeeDetailsState?._id }]"
    :callback="searchEmployeesRequest"
    :data="(employeesState||[]) as SearchEmployeesRes['data']"
    :page="employeesPaginationState as BasePagination"
    :payload="validPayload"
  >
    <template #header>
      <form ref="formRef" class="flex flex-column px-2" role="form" autocomplete="off" @submit.prevent>
        <div class="flex justify-space-between align-center">
          <vz-input
            v-model="searchPayload.search"
            class="flex-grow-1"
            label="GENERAL.SEARCH"
            :rules="{ maxLength: [Length.NAME] }"
            @keydown.enter="onSearch"
          />

          <vz-icon class="mx-2" clickable name="svg:filter" size="24" @click="showFilter = !showFilter" />
        </div>

        <template v-if="showFilter">
          <vz-select
            v-model="searchPayload.specialization"
            type="multiselect"
            label="PROFILE.SPECIALIZATION"
            :items="listClassificationRequest.results.value || []"
            :loading="listClassificationRequest.loading.value"
            @update:model-value="onSpecializationChange"
          />

          <vz-select
            v-model="searchPayload.skills"
            type="multiselect"
            label="PROFILE.SKILLS"
            :items="listSkillsRequest.results.value || []"
            :loading="listSkillsRequest.loading.value"
          />
        </template>

        <div class="flex justify-end">
          <vz-button text="GENERAL.SEARCH" @click="onSearch" />
          <vz-button text="GENERAL.CLEAR" @click="onClear" />
        </div>
      </form>
    </template>

    <template #content="{ data }">
      <employee-card v-for="employee in data" :key="employee._id" class="my-4 me-2" clickable :employee="employee" @select="setEmployee" />
    </template>
  </vz-infinity-scroll>
</template>

<script setup lang="ts">
import type { SearchReq, ProfileExtendDetails, SearchEmployeesRes } from '@/views/employee/models';
import type { BasePagination } from '@/shared/models';
import { EMPLOYEE_DETAILS, EMPLOYEES, EMPLOYEES_PAGINATION, SEARCH_EMPLOYEES } from '@/views/employee/store/constants';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { Length } from '@/shared/constants/length';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import { useFormValidator } from '@/shared/components/fields/helpers';
import EmployeeCard from '@/views/employee/components/employee-card.vue';

const { useActions: useEmployeeActions, useState: useEmployeeState } = useEmployeeStore();
const {
  [EMPLOYEES]: employeesState,
  [EMPLOYEES_PAGINATION]: employeesPaginationState,
  [EMPLOYEE_DETAILS]: employeeDetailsState,
} = useEmployeeState([EMPLOYEES, EMPLOYEES_PAGINATION, EMPLOYEE_DETAILS]);
const { [SEARCH_EMPLOYEES]: searchEmployeesAction } = useEmployeeActions([SEARCH_EMPLOYEES]);

const searchEmployeesRequest = searchEmployeesAction as (payload: SearchReq) => Promise<SearchEmployeesRes>;

const { listClassificationRequest, listSkillsRequest } = useJobTypes();
const router = useRouter();

const formRef = ref<Element | undefined>(undefined);
const showFilter = ref<boolean>(false);
const searchPayload = ref<Omit<SearchReq, 'page'>>({});
const validPayload = ref<Omit<SearchReq, 'page'>>({});

const onSearch = async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  validPayload.value = { ...searchPayload.value };
};

const onClear = (): void => {
  searchPayload.value = {};
  validPayload.value = searchPayload.value;
};

const setEmployee = async (employee: ProfileExtendDetails): Promise<void> => {
  await router.push({ query: { userId: employee._id } });
};

const onSpecializationChange = async (specialization: Array<string>): Promise<void> => {
  if (!specialization?.length) {
    listSkillsRequest.results.value = [];
    searchPayload.value.skills = [];

    return;
  }

  await listSkillsRequest.call({ groups: specialization });
  searchPayload.value.skills = searchPayload.value.skills?.filter((key) => !!listSkillsRequest.results.value?.find(({ value }) => value === key));
};

onMounted(async () => await listClassificationRequest.call());
</script>

<style lang="scss">
.search-panel {
  overflow-y: scroll;
  padding-inline-start: 12px;

  @include mobile-layout {
    width: 100%;
  }

  @include min-mobile-layout {
    min-width: calc(100% / 3);
    max-width: 400px;
  }

  form {
    padding: 0.5rem 0.125rem;

    button {
      width: 5rem;
      margin-inline-start: 0.25rem;
    }
  }
}
</style>
