<template>
  <vz-overlay
    manual-close
    blur="5"
    size="large"
    name="employee-modal"
    :open-event="OPEN_EMPLOYEE_VIEW_MODAL"
    :close-event="CLOSE_EMPLOYEE_VIEW_MODAL"
    @close="onClose"
  >
    <template v-if="isActive" #default>
      <employee-feed class="employee-modal__content" />
    </template>
  </vz-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { emitter } from '@/main';
import { CLOSE_EMPLOYEE_VIEW_MODAL, OPEN_EMPLOYEE_VIEW_MODAL } from '@/views/lobby/constants/lobby-events';
import { useRouter } from 'vue-router';
import EmployeeFeed from '@/views/employee/components/full-identity-card/components/employee-feed.vue';

const router = useRouter();

const isActive = computed((): boolean => !!router.currentRoute.value.query?.userId);

const onClose = (): void => {
  emitter.emit(CLOSE_EMPLOYEE_VIEW_MODAL);
  router.push({ query: {} });
};
</script>

<style lang="scss">
.employee-modal {
  &__content {
    background-color: var(--color-background-1);

    > *:not(.employee-cover) {
      margin: 1rem;
    }

    @include mobile-layout {
      height: 100%;
    }

    @include min-mobile-layout {
      height: 90vh;
    }
  }
}
</style>
