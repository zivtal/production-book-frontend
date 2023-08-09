<template>
  <div class="job-offer">
    <vz-spinner v-if="getPositionDetailsRequest.loading.value" class="job-offer--loading" size="128" />

    <template v-else>
      <job-offer-tab-stepper />

      <job-offers v-if="!positionDetailsState" :loading="getPositionDetailsRequest.loading.value" @select="onSelect" />

      <job-conversation-screen v-else @select="onSelect" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { GET_POSITION_DETAILS, POSITION_DETAILS, SET_POSITION_DETAILS } from '@/views/jobs/store/constants';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { usePromise } from '@/shared/composables';
import { useRouter } from 'vue-router';
import { defineAsyncComponent, ref, watch } from 'vue';
import JobOfferTabStepper from '@/views/jobs/views/job-offer/components/job-offer-tab-stepper.vue';

const JobOffers = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/views/job-offer/components/job-offers/job-offers.vue')
);

const JobConversationScreen = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/components/job-conversation-screen.vue')
);

const router = useRouter();

const { useState: useJobState, useActions: useJobActions, useMutations: useJobMutations } = useJobStore();
const { [POSITION_DETAILS]: positionDetailsState } = useJobState([POSITION_DETAILS]);
const { [GET_POSITION_DETAILS]: getPositionDetailsAction } = useJobActions([GET_POSITION_DETAILS]);
const { [SET_POSITION_DETAILS]: setPositionDetailsMutation } = useJobMutations([SET_POSITION_DETAILS]);

const getPositionDetailsRequest = usePromise(getPositionDetailsAction as (positionId?: string) => Promise<void>);
const forwardRoute = ref<typeof router.currentRoute.value.query>({});

const onSelect = async (positionId?: string): Promise<void> => {
  const { forward, ...query } = forwardRoute.value;

  if (forward) {
    await router.replace({ name: forward as string, query });

    return;
  }

  await router.push({ params: { positionId } });
};

watch(
  () => router.currentRoute.value.params.positionId,
  async (id): Promise<void> => {
    if (!id) {
      setPositionDetailsMutation();

      return;
    }

    forwardRoute.value = router.currentRoute.value.query;
    await getPositionDetailsRequest.call(id);
  },
  { immediate: true }
);
</script>

<style lang="scss">
.job-offer {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0 0.5rem;

  &--loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .job-conversation-freelancer {
    height: calc(100% - 3.5rem);

    @include mobile-layout {
      .tab-switcher-content {
        > * {
          height: 100%;
        }

        padding-bottom: 0 !important;
      }
    }
  }
}
</style>
