<template>
  <vz-tab-switcher
    v-if="isMobile"
    class="job-conversation-freelancer"
    :tabs="['GENERAL.DETAILS', { label: 'JOB_OFFER.CONVERSATION', style: { overflowY: 'hidden' } }]"
  >
    <template #content="{ index }">
      <job-conversation-details v-show="index === 0" />

      <job-conversation-messenger v-show="index === 1" :disable-route="!!conversationState?._id" />
    </template>
  </vz-tab-switcher>

  <div v-else class="job-conversation-freelancer">
    <job-conversation-details class="me-2" :class="{ 'max-width-400': !!conversationState?._id }" />

    <job-conversation-messenger :disable-route="!!conversationState?._id" />
  </div>
</template>

<script setup lang="ts">
import useJobStore from '@/views/jobs/composables/use-job-store';
import { CONVERSATION } from '@/views/jobs/store/constants';
import { defineAsyncComponent } from 'vue';
import { isMobile } from '@/shared/helpers';

const JobConversationMessenger = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/components/job-conversation-messenger.vue')
);

const JobConversationDetails = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "job-offer" */ '@/views/jobs/views/job-offer/components/job-offer-conversation/job-offer-conversation-details.vue')
);

defineEmits(['select']);

const { useState } = useJobStore();
const { [CONVERSATION]: conversationState } = useState([CONVERSATION]);
</script>

<style lang="scss">
.job-conversation-freelancer {
  display: flex;
  flex-grow: 1;

  @include max-mobile-layout {
    flex-direction: column;

    .messenger {
      max-height: 100%;
    }
  }
}
</style>
