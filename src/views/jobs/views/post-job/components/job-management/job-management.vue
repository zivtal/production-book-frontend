<template>
  <job-management-grid v-if="isMobile" v-bind="$attrs" @select="onSelect" />

  <job-management-table v-else v-bind="$attrs" @select="onSelect" />
</template>

<script setup lang="ts">
import { isMobile } from '@/shared/helpers';
import { defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

const JobManagementTable = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/job-management/job-management-table.vue')
);

const JobManagementGrid = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/job-management/job-management-grid.vue')
);

const router = useRouter();

const onSelect = async (jobId: string) => {
  await router.push({ params: { jobId } });
};
</script>

<style scoped lang="scss"></style>
