<template>
  <vz-tab-switcher
    v-if="!isMobile || tabs.length > 1"
    class="job-offer-tab-stepper"
    hide-next-button
    :mode="[...(!isMobile ? ['stepper'] : [])]"
    :tabs="tabs"
    :index="tabs.length - 1"
    :num-of-shown="isMobile ? 1 : undefined"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { POSITION_DETAILS } from '@/views/jobs/store/constants';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import JobRoutesMap from '@/views/jobs/constants/job-routes-map';
import { isMobile } from '@/shared/helpers';

const router = useRouter();
const { useState } = useJobStore();
const { getClassification } = useJobTypes();
const { [POSITION_DETAILS]: positionDetailsState } = useState([POSITION_DETAILS]);

const forwardRoute = ref<typeof router.currentRoute.value.query>({});
const positionId = computed(() => router.currentRoute.value.params.positionId);

const tabs = computed(() => {
  const { forward } = forwardRoute.value;
  const positionTitle = computed(() =>
    positionDetailsState.value ? positionDetailsState.value?.title || getClassification.value(positionDetailsState.value.jobType) : null
  );

  return [{ label: (forward as string) || 'JOB_OFFER.JOB_OFFERS', onClick }, ...(positionId.value ? [{ label: positionTitle.value, onClick }] : [])];
});

const onClick = async (level: number): Promise<void> => {
  switch (level) {
    case 0: {
      const { forward, ...query } = forwardRoute.value;

      if (forward) {
        await router.replace({
          name: (forward || JobRoutesMap.JOB_OFFER) as string,
          params: { positionId: '' },
          query,
        });
      } else {
        await router.replace({ params: { positionId: '' } });
      }

      break;
    }
  }
};
</script>

<style lang="scss">
.job-offer-tab-stepper {
  .tab-switcher-navigation__panel {
    height: 2.5rem;
  }
}
</style>
