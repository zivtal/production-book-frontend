<template>
  <job-conversations-participants v-if="!isMobile || !conversationId" />

  <job-conversation-messenger />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { isMobile } from '@/shared/helpers';
import { useRoute } from 'vue-router';

const JobConversationMessenger = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/components/job-conversation-messenger.vue')
);

const JobConversationsParticipants = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/components/conversation-management/conversation-management-participants.vue'
    )
);

const route = useRoute();

const conversationId = computed(() => route.query.conversationId);
</script>
