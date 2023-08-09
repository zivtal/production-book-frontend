<template>
  <div
    class="create-edit-conversation-agreement"
    :class="{
      'create-edit-conversation-agreement--exists': !!conversationState?.agreement,
    }"
  >
    <form ref="formRef" role="form" autocomplete="off" @submit.prevent>
      <vz-input v-model="conversationPayload.amount" type="number" label="GENERAL.AMOUNT" :rules="{ required: [true] }" />

      <vz-select
        v-model="conversationPayload.currencyType"
        type="select"
        label="GENERAL.CURRENCY_TYPE"
        :items="currencies"
        :rules="{ required: [true] }"
      />
    </form>

    <div class="create-edit-conversation-agreement__controls">
      <vz-button
        text="GENERAL.CANCEL"
        :disabled="createConversationRequest.loading.value || updateConversationRequest.loading.value"
        @click="onCancel"
      />

      <vz-button
        text="GENERAL.SUBMIT"
        :loading="createConversationRequest.loading.value || updateConversationRequest.loading.value"
        v-on="{ click: conversationState?.agreement ? () => onUpdate() : () => onCreate() }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateConversationReq, UpdateConversationAgreementReq } from '@/views/jobs/model/conversation';
import currencies from '@/json/currency.json';
import { ref } from 'vue';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { CONVERSATION, CREATE_CONVERSATION, UPDATE_CONVERSATION_AGREEMENTS } from '@/views/jobs/store/constants';
import { usePromise } from '@/shared/composables';
import { useFormValidator } from '@/shared/components/fields/helpers';

const emit = defineEmits(['cancel', 'close']);
const props = defineProps({ positionId: { type: String, required: true } });

const { useState: useJobState, useActions: useJobActions } = useJobStore();
const { [CONVERSATION]: conversationState } = useJobState([CONVERSATION]);
const { [CREATE_CONVERSATION]: createConversationAction, [UPDATE_CONVERSATION_AGREEMENTS]: updateConversationAgreementsAction } = useJobActions([
  CREATE_CONVERSATION,
  UPDATE_CONVERSATION_AGREEMENTS,
]);

const createConversationRequest = usePromise(createConversationAction as (payload: CreateConversationReq) => Promise<void>);
const updateConversationRequest = usePromise(updateConversationAgreementsAction as (payload: UpdateConversationAgreementReq) => Promise<void>);

const formRef = ref<Element | undefined>(undefined);
const conversationPayload = ref<CreateConversationReq | UpdateConversationAgreementReq>({
  positionId: props.positionId,
  currencyType: conversationState.value?.agreement?.currencyType || useAuthUser().activeUser.value?.wage?.currencyType,
  amount: conversationState.value?.agreement?.amount || useAuthUser().activeUser.value?.wage?.daily,
  includeTax: conversationState.value?.agreement?.includeTax || useAuthUser().activeUser.value?.wage?.includeTax,
} as CreateConversationReq);

const onCancel = (): void => {
  emit('cancel');
};

const onCreate = async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  await createConversationRequest.call({ positionId: props.positionId, ...conversationPayload.value });
  emit('close');
};

const onUpdate = async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  await updateConversationRequest.call({ positionId: props.positionId, ...conversationPayload.value });
  emit('close');
};
</script>

<style lang="scss">
.create-edit-conversation-agreement {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 3rem 2rem 1rem 2rem;
  border-radius: var(--border-radius-1);
  border: 1px solid var(--color-mono-500);
  box-shadow: var(--shadow-level-1);
  background-color: var(--color-background-1);

  @include max-mobile-layout {
    height: 100vh;
    padding: 4rem 1rem 6rem 1rem;
  }

  > * {
    width: 100%;

    &:not(:last-child) {
      padding-bottom: 0.5rem;
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: center;

    > * {
      margin: 0 0.5rem;
    }
  }
}
</style>
