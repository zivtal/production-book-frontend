<template>
  <vz-infinity-scroll
    class="employee-reviews-tab"
    disable-payload-watcher
    :callback="getReviewsRequest"
    :payload="{ userId: employeeDetailsState._id }"
    :page="employeeReviewsState?.page"
    :data="employeeReviewsState?.data"
  >
    <template #content="{ data }">
      <div class="employee-reviews-tab__header">
        <div class="flex flex-column justify-center align-center pe-10">
          <p class="vz-font-size-48 vz-font-weight-600">{{ employeeDetailsState?.rating?.average?.toFixed(1) }}</p>

          <vz-rate :value="employeeDetailsState?.rating?.average" :size="24" />

          <p class="vz-font-size-14 mt-2 employee-reviews-tab__count">
            ({{ employeeDetailsState?.rating?.total }} {{ $t('IDENTITY_CARD.REVIEWS') }})
          </p>

          <vz-button
            v-if="!isMe"
            class="mt-2"
            outlined
            color="mono-100"
            background-color="yellow-500"
            :icon-name="employeeDetailsState.rating?.review ? 'svg:edit' : 'svg:add'"
            :text="employeeDetailsState.rating?.review ? 'IDENTITY_CARD.REVIEW.EDIT' : 'IDENTITY_CARD.REVIEW.ADD'"
            :disabled="!!myReview"
            @click="onAddOrEditReview"
          />
        </div>

        <div class="employee-reviews-tab__sections mt-1 flex-grow-0">
          <div v-for="({ title, rate }, index) in averageBySection" :key="index">
            <div class="employee-reviews-tab__bar mt-2">
              <div class="fill-height" :style="{ width: (100 * rate) / 5 + '%' }" />
            </div>

            <div class="employee-reviews-tab__section flex justify-space-between align-center ps-2">
              <p class="mt-1">{{ $t(title) }}</p>

              <vz-rate :value="rate" :size="16" />
            </div>
          </div>
        </div>
      </div>

      <user-review
        v-if="myReview && !isMe"
        class="employee-reviews-tab__review-editor me-2"
        editable
        :value="myReview"
        :loading="addReviewRequest.loading.value"
        :errors="addReviewRequest.error.value"
        @cancel="myReview = null"
        @submit="onSubmit"
        @update:model-value="myReview = $event"
      />

      <user-review v-for="(review, index) in data" :key="index" class="me-2 my-4" :value="review" @select-user="$emit('select-user', $event)" />
    </template>
  </vz-infinity-scroll>
</template>

<script setup lang="ts">
import type { AddReviewReq } from '@/views/employee/models';
import { ADD_REVIEW, EMPLOYEE_DETAILS, EMPLOYEE_REVIEWS, GET_REVIEWS } from '@/views/employee/store/constants';
import { computed, nextTick, ref } from 'vue';
import UserReview from '@/views/employee/components/full-identity-card/components/employee-reviews/employee-review.vue';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { usePromise } from '@/shared/composables';
import { scrollToView } from '@/shared/helpers';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import { GetReviewRes, GetReviewsReq } from '@/views/employee/models';
import { BaseRecords } from '@shared/models';

defineEmits(['select-user']);

const { useState, useActions } = useEmployeeStore();
const { [EMPLOYEE_DETAILS]: employeeDetailsState, [EMPLOYEE_REVIEWS]: employeeReviewsState } = useState([EMPLOYEE_REVIEWS, EMPLOYEE_DETAILS]);
const { [ADD_REVIEW]: addReviewAction, [GET_REVIEWS]: getReviewsAction } = useActions([ADD_REVIEW, GET_REVIEWS]);

const addReviewRequest = usePromise(addReviewAction as (payload: AddReviewReq) => Promise<void>);
const getReviewsRequest = getReviewsAction as (payload: GetReviewsReq) => Promise<BaseRecords<GetReviewRes>>;

const { activeUser, isMe: isAuthMe } = useAuthUser();

const myReview = ref<AddReviewReq | null>(null);

const isMe = computed((): boolean => !!employeeDetailsState.value && isAuthMe(employeeDetailsState.value._id));

computed((): boolean => activeUser.value?._id === employeeDetailsState.value?._id);
const averageBySection = computed(() => {
  const { attitude, reliability, craftsmanship, communication } = employeeDetailsState.value?.rating || {};

  return [
    { title: 'IDENTITY_CARD.ATTITUDE', rate: attitude || 0 },
    { title: 'IDENTITY_CARD.RELIABILITY', rate: reliability || 0 },
    { title: 'IDENTITY_CARD.CRAFTSMANSHIP', rate: craftsmanship || 0 },
    { title: 'IDENTITY_CARD.COMMUNICATION', rate: communication || 0 },
  ];
});

const onAddOrEditReview = () => {
  if (!activeUser.value) {
    return;
  }

  if (myReview.value) {
    myReview.value = null;

    return;
  }

  myReview.value = employeeDetailsState.value?.rating?.review || {
    comment: '',
    attitude: 0,
    communication: 0,
    craftsmanship: 0,
    reliability: 0,
  };

  nextTick(() => scrollToView('.employee-reviews-tab__review-editor'));
};

const onSubmit = async (): Promise<void> => {
  await addReviewRequest.call(myReview.value);

  if (!addReviewRequest.error.value) {
    myReview.value = null;
  }
};
</script>

<style lang="scss">
.employee-reviews-tab {
  > * {
    padding-inline-end: 0.5rem;
  }

  &__header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    margin-bottom: 2rem;
  }

  &__sections {
    @include min-mobile-layout {
      font-size: var(--font-size-12);
    }

    @include mobile-layout {
      font-size: var(--font-size-10);
      padding-inline-end: 0.5rem;
    }
  }

  &__bar {
    border-radius: 2px;
    width: 100%;
    height: 8px;
    background-color: var(--color-mono-300);

    > div {
      border-radius: 2px;
      background-color: var(--color-yellow-700);
    }
  }

  &__count {
    color: var(--color-mono-400);
  }
}
</style>
