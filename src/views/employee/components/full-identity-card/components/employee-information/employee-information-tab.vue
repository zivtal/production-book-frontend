<template>
  <div v-if="profile" class="employee-information-tab">
    <employee-communicate :editable="editable" :user="profile" />
    <employee-wage :editable="editable" :user="profile" />
    <employee-general-info :editable="editable" :user="profile" />
    <employee-skills :editable="editable" :skills="profile.skills" :specialization="profile.specialization" />
    <employee-about v-if="profile.about || editable" :editable="editable" :about="profile.about" />
  </div>
</template>

<script setup lang="ts">
import Components from '@/views/employee/components/full-identity-card/components';
import { PropType } from 'vue';
import { ProfileFullDetails } from '@/views/employee/models';

defineProps({
  editable: { type: Boolean, default: false },
  profile: { type: Object as PropType<ProfileFullDetails | undefined>, default: undefined },
});

const { EmployeeCommunicate, EmployeeWage, EmployeeSkills, EmployeeAbout, EmployeeGeneralInfo } = Components;
</script>

<style lang="scss">
.tab-switcher-content:has(.employee-information-tab) {
  overflow-y: auto !important;
  padding-inline-end: 0.5rem;
}
</style>
