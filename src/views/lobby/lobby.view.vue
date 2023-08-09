<template>
  <div>
    <welcome-message v-if="!activeUser" class="mt-1" />

    <vz-install-app />

    <users-grid />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';

const UsersGrid = defineAsyncComponent(() => import(/* webpackChunkName: "lobby" */ '@/views/lobby/components/users-grid.vue'));

const WelcomeMessage = defineAsyncComponent(() => import(/* webpackChunkName: "lobby" */ '@/views/lobby/components/welcome-message.vue'));

const { activeUser } = useAuthUser();
</script>
