<template>
  <notifications-grid />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const NotificationsGrid = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/notifications/components/notifications-grid.vue')
);
</script>

<style lang="scss"></style>
