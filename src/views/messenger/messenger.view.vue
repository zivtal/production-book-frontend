<template>
  <vz-tab-switcher class="messenger-view" :tabs="tabs" :index="tabs.length - 1" :mode="['stepper']">
    <template #content>
      <messenger-search-panel :class="['messenger-view-search-panel', { 'messenger-view-search-panel--hidden': isMobile && activeChatState }]" />

      <!--      <div v-else-if="activeChatState" class="flex-grow-1"></div>-->

      <vz-card v-if="!isMobile" class="mx-2 flex-grow-1 flex align-center justify-center flex-column">
        <img :src="searchForChat" :alt="$t('GENERAL.SEARCH_FOR_RESULTS')" />
        <p>{{ $t('IDENTITY_CARD.SELECT_EMPLOYEE_TO_SEE_DETAILS') }}</p>
      </vz-card>
    </template>
  </vz-tab-switcher>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isMobile } from '@/shared/helpers';
import useMessengerStore from '@/views/messenger/composables/use-messenger-store';
import { ACTIVE_CHAT, SET_ACTIVE_CHAT } from '@/views/messenger/store/constants';

import MessengerSearchPanel from '@/views/messenger/components/messenger-search-panel.vue';

const { useState, useMutations } = useMessengerStore();
const { [ACTIVE_CHAT]: activeChatState } = useState([ACTIVE_CHAT]);
const { [SET_ACTIVE_CHAT]: setActiveChat } = useMutations([SET_ACTIVE_CHAT]);

const searchForChat = computed(() => require('@/assets/images/find-employee.svg'));

const tabs = computed(() => {
  const participants = activeChatState.value?.participants?.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ');

  return [{ label: 'MESSENGER.TITLE', onClick: setActiveChat }, ...(participants ? [{ label: participants }] : [])];
});
</script>

<style lang="scss">
.messenger-view {
  &-search-panel {
    &--hidden {
      display: none;
    }
  }

  .tab-switcher-content {
    position: relative;

    @include min-mobile-layout {
      display: flex;
      flex-direction: row;

      > * {
        width: 100%;
      }
    }
  }
}
</style>
