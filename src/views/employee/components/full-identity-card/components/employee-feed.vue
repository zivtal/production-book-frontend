<template>
  <vz-tab-switcher
    v-if="profile"
    :class="['employee-feed', { 'employee-feed--modal': isModal }]"
    :tabs="[
      'IDENTITY_CARD.TABS.ABOUT',
      { label: 'IDENTITY_CARD.TABS.PORTFOLIO', style: { overflowY: 'hidden' } },
      { label: 'IDENTITY_CARD.TABS.REVIEWS', style: { overflowY: 'hidden' } },
    ]"
    :mode="['outline']"
  >
    <template #header>
      <employee-cover class="mb-6" :editable="isEditable" />
    </template>

    <template #content="{ index }">
      <employee-information-tab v-if="index === 0" :editable="isEditable" :profile="profile" />
      <employee-gallery-tab v-if="index === 1" class="mb-6" :editable="isEditable" @select="onSelectAlbum" />
      <employee-reviews-tab v-else-if="index === 2" class="mb-6" @select-user="onSelectUser" />
    </template>
  </vz-tab-switcher>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Components from '@/views/employee/components/full-identity-card/components';
import { emitter } from '@/main';
import { OPEN_EMPLOYEE_ALBUM_MODAL } from '@/views/employee/constants/employee-events';
import type { BaseId } from '@/shared/models';
import { useRouter } from 'vue-router';
import { cloneDeep } from 'lodash';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { EMPLOYEE_DETAILS } from '@/views/employee/store/constants';

const { EmployeeInformationTab, EmployeeGalleryTab, EmployeeReviewsTab, EmployeeCover } = Components;

defineProps({ isModal: { type: Boolean, default: false } });

const { useState } = useEmployeeStore();
const { [EMPLOYEE_DETAILS]: employeeDetailsState } = useState([EMPLOYEE_DETAILS]);

const router = useRouter();
const { activeUser } = useAuthUser();

const profile = computed(() => cloneDeep(employeeDetailsState.value));
const isEditable = computed(() => activeUser.value?._id === employeeDetailsState.value?._id);

const onSelectAlbum = (): void => {
  emitter.emit(OPEN_EMPLOYEE_ALBUM_MODAL);
};

const onSelectUser = (id: BaseId) => {
  router.push({ query: { userId: id } });
};
</script>

<style lang="scss">
.employee-feed {
  &--modal {
    padding-bottom: calc(var(--safe-area-bottom) + 2.5rem);
  }
}
</style>
