<template>
  <job-offers-grid v-if="isMobile" v-bind="$attrs" @select="$emit('select', $event)" />

  <job-offers-table v-else v-bind="$attrs" @select="$emit('select', $event)" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { isMobile } from '@/shared/helpers';

defineEmits(['select']);

const JobOffersGrid = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/views/job-offer/components/job-offers/job-offers-grid.vue')
);

const JobOffersTable = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/views/job-offer/components/job-offers/job-offers-table.vue')
);
</script>
