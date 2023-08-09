<template>
  <vz-card class="job-conversation-details">
    <template v-if="positionDetailsState">
      <div v-if="getOwner" class="job-conversation-details__header">
        <vz-avatar :src="getOwner?.avatar || undefined" :size="56" />

        <div>
          <p class="vz-font-size-16 vz-font-weight-700">{{ getOwner?.firstName }} {{ getOwner?.lastName }} {{ getOwner?.nickName }}</p>

          <p class="vz-font-size-12 vz-font-weight-600">{{ getOwner?.company }}</p>
        </div>
      </div>

      <job-offer-conversation-actions />

      <div class="job-conversation-details__position">
        <p class="vz-font-size-24 vz-font-weight-700">{{ positionDetailsState.title || jobType }}</p>
        <p v-if="positionDetailsState.title" class="vz-font-size-14 vz-font-weight-600">{{ jobType }}</p>

        <div class="job-conversation-details__position-date">
          <p class="vz-font-size-18 vz-font-weight-600">{{ jobDate }}</p>
          <p class="vz-font-size-14">{{ jobTime }}</p>
        </div>

        <div class="job-conversation-details__position-types">
          <vz-badge v-for="({ title }, index) in positionDetailsState.type" :key="index" class="px-1 mb-1 mx-1" :text="title" />
        </div>

        <p class="job-conversation-details__position-location vz-font-size-14 vz-font-weight-600">
          <vz-image
            v-if="positionDetailsState.location?.icon"
            class="me-1"
            :src="positionDetailsState.location.icon"
            height="16"
            width="16"
            role="presentation"
          />

          <span>{{ positionDetailsState.location.place }}</span>
        </p>

        <p class="vz-font-size-12">{{ positionDetailsState.location.address }}</p>

        <div v-if="positionDetailsState.comment" class="job-conversation-details__position-comment">
          <p class="vz-font-size-12">{{ $t('GENERAL.COMMENT') }}</p>
          <p class="vz-font-size-14">{{ positionDetailsState.comment }}</p>
        </div>

        <div v-if="positionDetailsState.description" class="job-conversation-details__position-description">
          <p class="vz-font-size-12">{{ $t('GENERAL.DESCRIPTION') }}</p>
          <p class="vz-font-size-14">{{ positionDetailsState.description }}</p>
        </div>
      </div>
    </template>

    <vz-overlay v-if="!conversationState?.agreement" blur="5" size="small" name="job-offer-modal">
      <template #activator="{ open }">
        <vz-button class="mt-3" text="JOB_OFFER.PLACE_OFFER" @click="open" />
      </template>

      <template #default="{ close }">
        <create-edit-conversation-agreement :position-id="positionDetailsState._id" @close="close" @cancel="close" />
      </template>
    </vz-overlay>
  </vz-card>
</template>

<script setup lang="ts">
import type { ProfileBaseDetails } from '@/views/employee/models';
import { computed, defineAsyncComponent, onBeforeMount } from 'vue';
import { CONVERSATION, POSITION_DETAILS } from '@/views/jobs/store/constants';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { formattedTime, formattedDate } from '@/views/calendar/helpers';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';

const JobOfferConversationActions = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "job-offer" */ '@/views/jobs/views/job-offer/components/job-offer-conversation/job-offer-conversation-actions.vue')
);

const CreateEditConversationAgreement = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "job-offer" */
      '@/views/jobs/views/job-offer/components/job-offer-conversation/job-offer-conversation-agreement-create-edit.vue'
    )
);

const { isMe } = useAuthUser();
const { listClassificationRequest, getClassification } = useJobTypes();

const { useState: useJobState } = useJobStore();
const { [CONVERSATION]: conversationState, [POSITION_DETAILS]: positionDetailsState } = useJobState([CONVERSATION, POSITION_DETAILS]);

const jobType = computed(() => (positionDetailsState.value ? getClassification.value(positionDetailsState.value.jobType) : undefined));
const jobDate = computed(() => (positionDetailsState.value ? formattedDate(positionDetailsState.value) : undefined));
const jobTime = computed(() => (positionDetailsState.value ? formattedTime(positionDetailsState.value) : undefined));
const getOwner = computed((): ProfileBaseDetails | undefined => conversationState.value?.participants.find(({ _id }) => !isMe(_id)));

onBeforeMount(listClassificationRequest.call);
</script>

<style lang="scss" scoped>
.job-conversation-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  overflow-y: auto;

  &__submit-offer {
    margin-top: 1rem;
    max-width: 360px;
  }

  &__header {
    @include max-tablet-layout {
      display: none;
    }

    @include min-tablet-layout {
      display: flex;
      align-items: flex-start;
      width: 100%;

      > * {
        margin-inline-end: 0.25rem;
      }

      > div:last-child {
        flex-grow: 1;

        p {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }

  &__position {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;

    > * {
      margin-bottom: 0.25rem;
    }

    @include min-tablet-layout {
      &-date {
        margin-top: 0.25rem;
      }

      &-types {
        margin-top: 0.5rem;
      }

      &-location {
        display: flex;
        justify-content: center;
        margin-top: 0.75rem;
      }

      &-comment,
      &-description {
        margin-top: 1rem;
      }
    }
  }
}
</style>
