<template>
  <vz-tab-switcher
    class="job-manager-tab-stepper"
    :index="tabs.length - 1"
    hide-next-button
    :mode="[...(!isMobile ? ['stepper'] : [])]"
    :tabs="tabs"
    :num-of-shown="isMobile ? 1 : undefined"
  >
    <template v-if="tabs.length <= 2" #prepend="{ index }">
      <vz-button
        :icon-name="index === 0 ? 'svg:add' : 'svg:edit'"
        mode="none"
        color="mono-500"
        background-color="mono-opacity-100"
        width="38"
        height="38"
        @click="emitter.emit(OPEN_POST_JOB_MODAL)"
      />
    </template>

    <template #content="{ index }">
      <slot name="content" :index="index" />
    </template>
  </vz-tab-switcher>
</template>

<script setup lang="ts">
import { emitter } from '@/main';
import { OPEN_POST_JOB_MODAL } from '@/views/jobs/views/post-job/constants/post-job-events';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { JOB_DETAILS } from '@/views/jobs/store/constants';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import JobRoutesMap from '@/views/jobs/constants/job-routes-map';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import { isMobile } from '@/shared/helpers';

const router = useRouter();
const { useState } = useJobStore();
const { getSkill } = useJobTypes();
const { isMe } = useAuthUser();
const { [JOB_DETAILS]: jobDetailsState } = useState([JOB_DETAILS]);

const forwardRoute = router.currentRoute.value.query;

const jobId = computed(() => router.currentRoute.value.params.jobId || undefined);
const positionId = computed(() => router.currentRoute.value.params.positionId || undefined);
const conversationId = computed(() => router.currentRoute.value.query.conversationId || undefined);

const position = computed(() => jobDetailsState.value?.positions?.find(({ _id }) => _id === positionId.value));
const conversation = computed(() => position.value?.conversations.find(({ _id }) => _id === conversationId.value));

const onClick = async (level: number): Promise<void> => {
  switch (level) {
    case 0: {
      const { forward, ...query } = forwardRoute;

      if (forward) {
        await router.replace({
          name: (forward || JobRoutesMap.JOB_MANAGER) as string,
          query: { ...(query || {}), conversationId: undefined },
          params: { positionId: '', jobId: '' },
        });
      } else {
        await router.replace({ query: { conversationId: undefined }, params: { positionId: '', jobId: '' } });
      }

      return;
    }
    case 1: {
      await router.replace({ params: { positionId: '' } });
      break;
    }
    case 2: {
      await router.replace({ query: { conversationId: undefined } });
      break;
    }
  }
};

const tabs = computed(() => {
  const { forward } = forwardRoute;

  const mainTitle = forward ? `MENU.${forward.toString().toUpperCase()}` : 'JOB_MANAGER.POST_JOB_MANAGEMENT';
  const jobTitle = jobId.value && jobDetailsState.value ? jobDetailsState.value?.title : null;
  const positionTitle = position.value ? position.value?.type.map((type) => getSkill.value(type)) : null;
  const conversationUser = conversation.value?.participants.find(({ _id }) => !isMe(_id));

  return [
    { label: mainTitle, style: { overflowY: 'hidden' }, onClick },
    ...(jobTitle ? [{ label: jobDetailsState.value?.title, style: { overflowY: 'hidden' }, onClick }] : []),
    ...(positionTitle ? [{ label: positionTitle, style: { overflowY: 'hidden' }, onClick }] : []),
    ...(conversationUser ? [{ label: `${conversationUser.firstName} ${conversationUser.lastName}`, style: { overflowY: 'hidden' }, onClick }] : []),
  ];
});
</script>

<style lang="scss">
.job-manager-tab-stepper {
  .tab-switcher-navigation__panel {
    height: 2.5rem;
  }

  .tab-switcher-content-3 {
    @include max-tablet-layout {
      .conversation-management-participants--selected {
        display: none !important;
      }

      .job-conversation-messenger {
        &:not(&--selected) {
          display: none !important;
        }
      }
    }

    @include min-mobile-layout {
      display: flex;

      .conversation-management-participants {
        max-width: 400px;
        margin-inline-end: 0.5rem;
      }
    }
  }
}
</style>
