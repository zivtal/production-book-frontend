<template>
  <positions-management-grid v-if="isMobile" v-bind="$attrs" @select="onSelect" />

  <positions-management-table v-else v-bind="$attrs" @select="onSelect" />
</template>

<script setup lang="ts">
import { isMobile } from '@/shared/helpers';
import { defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

const PositionsManagementTable = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/positions-management/positions-management-table.vue')
);

const PositionsManagementGrid = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/positions-management/positions-management-grid.vue')
);

defineEmits(['select']);

const router = useRouter();

const onSelect = async (positionId: string): Promise<void> => {
  await router.push({ params: { positionId } });
};
</script>
