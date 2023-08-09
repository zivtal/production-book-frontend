<template>
  <vz-infinity-scroll
    :class="['messenger-search-panel', { 'messenger-search-panel--selected': !!activeChatState?._id }]"
    :callback="listChatsRequest"
    :payload="validPayload"
  >
    <template #header>
      <form ref="formRef" class="flex flex-column px-2" role="form" autocomplete="off" @submit.prevent>
        <vz-input v-model="searchPayload.search" label="GENERAL.SEARCH" :rules="{ maxLength: [Length.NAME] }" @update:model-value="onSearch" />
      </form>
    </template>

    <template #content="{ data }">
      <messenger-chat-card v-for="chat in data" :key="chat._id" :data="chat" @select="getMessages(chat._id)" />
    </template>
  </vz-infinity-scroll>
</template>

<script setup lang="ts">
import type { ListChatsReq, ListChatsRes } from '@/views/messenger/models';
import type { BaseId } from '@/shared/models';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Length } from '@/shared/constants/length';
import { useFormValidator } from '@/shared/components/fields/helpers';

import useMessengerStore from '@/views/messenger/composables/use-messenger-store';
import { ACTIVE_CHAT, LIST_CHATS } from '@/views/messenger/store/constants';

import MessengerChatCard from '@/views/messenger/components/messenger-chat-card.vue';
import { debounce } from 'lodash';

const { useActions: useMessengerActions, useState: useMessengerState } = useMessengerStore();
const { [ACTIVE_CHAT]: activeChatState } = useMessengerState([ACTIVE_CHAT]);
const { [LIST_CHATS]: listChatsAction } = useMessengerActions([LIST_CHATS]);

const listChatsRequest = listChatsAction as (payload: ListChatsReq) => Promise<ListChatsRes>;

const router = useRouter();

const formRef = ref<Element | undefined>(undefined);
const searchPayload = ref<Omit<ListChatsReq, 'page'>>({});
const validPayload = ref<Omit<ListChatsReq, 'page'>>({});

const onSearch = debounce(async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  validPayload.value = { ...searchPayload.value };
}, 500);

const getMessages = async (id: BaseId): Promise<void> => {
  console.log(id);
};
</script>

<style lang="scss">
.messenger-search-panel {
  overflow-y: scroll;
  padding-inline-start: 12px;

  @include mobile-layout {
    width: 100%;
  }

  @include min-mobile-layout {
    min-width: calc(100% / 3);
    max-width: 400px;
  }

  form {
    padding: 0.5rem 0.125rem;

    button {
      width: 5rem;
      margin-inline-start: 0.25rem;
    }
  }
}
</style>
