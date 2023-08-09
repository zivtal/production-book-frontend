<template>
  <vz-card
    v-if="employeeList.length"
    class="conversation-management-participants"
    :class="{ 'conversation-management-participants--selected': !!activeConversationId }"
  >
    <div class="conversation-management-participants__filters">
      <template v-for="(value, name) in getSummery">
        <vz-badge
          v-if="value"
          :key="name"
          class="flex-grow-1 mx-1 my-2"
          clickable
          :selected="statusFilter === name"
          :text="`JOB_MANAGER.STATUS.${name}`"
          :counter="value"
          :color="statusColor[name]"
          @click="onStatusFilter(name)"
        />
      </template>
    </div>

    <vz-divider />

    <div class="conversation-management-participants__participants">
      <identity-card
        v-for="employee in employeeList"
        :key="employee._id"
        class="fill-width"
        clickable
        :employee="employee"
        :active="activeConversationId === employee.conversation._id"
        @select="onConversationSelect"
      />
    </div>
  </vz-card>

  <vz-card v-else class="conversation-management-participants conversation-management-participants--no-result">
    <img :src="require(`@/assets/images/server-error.svg`)" :alt="$t('JOB_MANAGER.NO_INTERESTED_YET')" />

    <p>{{ $t('JOB_MANAGER.NO_INTERESTED_YET') }}</p>
  </vz-card>
</template>

<script setup lang="ts">
import type { JobPosition } from '@/views/jobs/model/job';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import { computed } from 'vue';
import { statusColor } from '@/views/jobs/constants/status-color-map';
import { useConversationList } from '@/views/jobs/views/post-job/composables/use-conversation-list';
import { useConversationSummery } from '@/views/jobs/views/post-job/composables/use-conversation-summery';
import { useRouter } from 'vue-router';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { JOB_DETAILS } from '@/views/jobs/store/constants';
import IdentityCard from '@/views/employee/components/employee-card.vue';

const router = useRouter();

const { useState: useJobState } = useJobStore();
const { [JOB_DETAILS]: jobDetailsState } = useJobState([JOB_DETAILS]);

const positionState = computed(
  () => jobDetailsState.value?.positions.find(({ _id }) => _id === router.currentRoute.value.params.positionId) as JobPosition
);
const conversations = computed((): JobPosition['conversations'] => positionState.value?.conversations || []);

const { filter: statusFilter, result: employeeList } = useConversationList(conversations);
const getSummery = useConversationSummery(conversations);

const onConversationSelect = async ({ conversation }: { conversation: GetConversationRes }): Promise<void> => {
  await router.push({ query: { conversationId: conversation?._id } });
};

const onStatusFilter = (status: string) => (statusFilter.value = statusFilter.value === status ? null : status);

const activeConversationId = computed(() => router.currentRoute.value.query.conversationId);
</script>

<style lang="scss">
.conversation-management-participants {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;

  &--no-result {
    justify-content: center;
    align-items: center;

    img {
      object-fit: cover;
      width: calc(100% - 64px);
    }
  }

  &__participants {
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 8px;
    padding-inline-end: 8px;
  }

  &__filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 0.125rem;
  }
}
</style>
