<template>
  <vz-infinity-scroll ref="infinityScroll" hide-first-load :callback="searchEmployeesRequest">
    <template #content="{ data }">
      <div class="users-grid">
        <employee-card
          v-for="(user, index) in data"
          :key="index"
          :user="user"
          :loading="employeeLoading === user._id"
          v-on="!router.currentRoute.value.query.userId ? { click: () => onClick(user._id) } : {}"
        />
      </div>
    </template>
  </vz-infinity-scroll>

  <employee-view-modal />
</template>

<script setup lang="ts">
import type { BaseId } from '@/shared/models';
import type { SearchEmployeesRes, SearchReq } from '@/views/employee/models';
import { ref, watch } from 'vue';
import { emitter } from '@/main';
import { GET_EMPLOYEE_DETAILS, SEARCH_EMPLOYEES } from '@/views/employee/store/constants';
import { OPEN_EMPLOYEE_VIEW_MODAL } from '@/views/lobby/constants/lobby-events';
import { useRouter } from 'vue-router';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import EmployeeCard from '@/views/lobby/components/employee-card.vue';
import EmployeeViewModal from '@/views/lobby/modals/employee-view-modal.component.vue';
import VzInfinityScroll from '@shared/components/infinity-scroll/vz-infinity-scroll.vue';

const { useActions: useEmployeeActions } = useEmployeeStore();
const { [GET_EMPLOYEE_DETAILS]: getEmployeeDetailsAction, [SEARCH_EMPLOYEES]: searchEmployeesAction } = useEmployeeActions([
  GET_EMPLOYEE_DETAILS,
  SEARCH_EMPLOYEES,
]);

const searchEmployeesRequest = searchEmployeesAction as (payload?: SearchReq) => Promise<SearchEmployeesRes>;

const { activeUser } = useAuthUser();

const employeeLoading = ref<string | null>(null);
const infinityScroll = ref<typeof VzInfinityScroll | undefined>(undefined);

const router = useRouter();

const onClick = async (userId: BaseId): Promise<void> => {
  if (router.currentRoute.value.query?.userId !== userId) {
    await router.push({ query: { userId } });

    return;
  }

  emitter.emit(OPEN_EMPLOYEE_VIEW_MODAL);
};

watch(
  () => [activeUser.value?._id],
  () => {
    if (!activeUser.value?._id) {
      return;
    }

    infinityScroll.value?.init();
  }
);

watch(
  () => router.currentRoute.value.query?.userId,
  async (userId) => {
    if (!userId) {
      return;
    }

    const id = userId as string;

    try {
      employeeLoading.value = id;
      await getEmployeeDetailsAction({ userId: id });
      emitter.emit(OPEN_EMPLOYEE_VIEW_MODAL);
    } catch (e) {
      await router.push({ query: undefined });
    } finally {
      employeeLoading.value = null;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  padding-bottom: calc(var(--footer-height));
}
</style>
