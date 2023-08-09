<template>
  <div class="post-job-time-and-location">
    <vz-calendar
      :day="new Date(vModel.dateFrom).getDate()"
      :month="new Date(vModel.dateFrom).getMonth() + 1"
      :year="new Date(vModel.dateFrom).getFullYear()"
      @select="onSetDate"
    />

    <!--    <vz-datepicker-->
    <!--      v-model="vModel.dateFrom"-->
    <!--      class="me-1"-->
    <!--      type="datetime-local"-->
    <!--      label="GENERAL.DATE_FROM"-->
    <!--      :max="vModel.dateTo"-->
    <!--      :rules="{ required: [true] }"-->
    <!--      :error-message="fieldMessage?.dateFrom"-->
    <!--    />-->

    <div class="flex fill-width">
      <vz-datepicker
        v-model="startTime"
        class="me-2 flex-grow-1"
        type="time"
        label="GENERAL.START_TIME"
        :min="endTime"
        @update:model-value="() => onSetDate()"
      />

      <vz-datepicker
        v-model="endTime"
        class="mx-1 flex-grow-1"
        type="time"
        label="GENERAL.END_TIME"
        :min="startTime"
        @update:model-value="() => onSetDate()"
      />
    </div>

    <vz-select
      v-model="vModel.location"
      type="select"
      label="GENERAL.ADDRESS"
      debounce="500"
      :item-title="({ title, place, address }) => title || `${place} - ${address}`"
      :items="listPlacesRequest.results.value || []"
      :loading="listPlacesRequest.loading.value"
      :rules="{ required: [true] }"
      :error-message="fieldMessage?.location"
      @search="(query: string) => listPlacesRequest.call(query)"
    />

    <vz-input
      v-model="vModel.maxDistance"
      type="number"
      label="JOB_MANAGER.CREATE_JOB_POST_MODAL.MAX_DISTANCE"
      :rules="{ required: [true], min: [50], max: [500] }"
      :error-message="fieldMessage?.maxDistance"
    />
  </div>
</template>

<script setup lang="ts">
import type { CreatePostJobReq } from '@/views/jobs/model/job';
import type { UserLocation } from '@/models';
import type { BaseOptions } from '@/shared/models';
import { computed, onBeforeMount, PropType, ref } from 'vue';
import { LIST_ADDRESSES } from '@/store/client/constants';
import useGeneralStore from '@/store/client/composables/use-general-store';
import { usePromise } from '@/shared/composables';

const props = defineProps({
  modelValue: { type: Object as PropType<CreatePostJobReq>, required: true },
  fieldMessage: { type: Object as PropType<Record<keyof CreatePostJobReq, string> | undefined>, default: undefined },
});
const emit = defineEmits(['update:model-value']);

const startTime = ref<number>(Date.now().valueOf());
const endTime = ref<number>(Date.now().valueOf());

const vModel = computed({
  get: (): CreatePostJobReq => props.modelValue,
  set: (value) => emit('update:model-value', { ...props.modelValue, ...value }),
});

const { useActions } = useGeneralStore();
const { [LIST_ADDRESSES]: listPlacesAction } = useActions([LIST_ADDRESSES]);

const listPlacesRequest = usePromise<BaseOptions<UserLocation>>(listPlacesAction as (query: string) => Promise<BaseOptions<UserLocation>>);

const joinTimeAndDate = (dateTimestamp: number, timeTimestamp: number): number => {
  const date = new Date(dateTimestamp);
  const time = new Date(timeTimestamp);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = time.getHours();
  const minutes = time.getMinutes();

  return new Date(year, month, day, hour, minutes).valueOf();
};

const onSetDate = (timestamp?: number) => {
  vModel.value.dateFrom = joinTimeAndDate(timestamp || vModel.value.dateFrom, startTime.value);
  vModel.value.dateTo = joinTimeAndDate(timestamp || vModel.value.dateFrom, endTime.value);
};

const onLocationUpdate = async (value: string): Promise<void> => {
  await listPlacesRequest.call(value);
};

onBeforeMount(async () => {
  if (!vModel.value.location?.place) {
    return;
  }

  await onLocationUpdate(vModel.value.location.place);
});
</script>

<style lang="scss">
.post-job-time-and-location {
}
</style>
