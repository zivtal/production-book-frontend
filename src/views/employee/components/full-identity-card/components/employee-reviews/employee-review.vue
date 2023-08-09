<template>
  <vz-card class="user-review" :class="{ 'user-review--editable': editable }">
    <vz-error-alert :errors="errors" />

    <form ref="formRef" role="form" autocomplete="off" @submit.prevent>
      <div class="user-review__sections">
        <div class="flex">
          <vz-avatar :src="(editable ? activeUser?.avatar : value?.user?.avatar) || ''" />

          <div class="ms-2">
            <p class="vz-font-size-14 vz-font-weight-700" @click="emit('select-user', value?.user?._id)">
              {{ editable ? activeUser?.firstName : value?.user?.firstName }} {{ editable ? activeUser?.lastName : value?.user?.lastName }}
            </p>

            <vz-rate show-label :value="averageRating" size="12" />
          </div>
        </div>

        <div>
          <div class="mx-4">
            <vz-rate
              class="flex justify-center"
              :editable="editable"
              :value="vModel.attitude"
              :size="editable ? 16 : 10"
              @input="updateReview({ attitude: $event })"
            />

            <p class="user-review__section_title" :class="{ 'user-review__section_title--error': hasError.attitude }">
              {{ $t('IDENTITY_CARD.ATTITUDE') }}
            </p>
          </div>

          <div class="mx-4">
            <vz-rate
              class="flex justify-center"
              :editable="editable"
              :value="vModel.reliability"
              :size="editable ? 16 : 10"
              @input="updateReview({ reliability: $event })"
            />

            <p class="user-review__section_title" :class="{ 'user-review__section_title--error': hasError.craftsmanship }">
              {{ $t('IDENTITY_CARD.RELIABILITY') }}
            </p>
          </div>

          <div class="mx-4">
            <vz-rate
              class="flex justify-center"
              :editable="editable"
              :value="vModel.craftsmanship"
              :size="editable ? 16 : 10"
              @input="updateReview({ craftsmanship: $event })"
            />

            <p class="user-review__section_title" :class="{ 'user-review__section_title--error': hasError.craftsmanship }">
              {{ $t('IDENTITY_CARD.CRAFTSMANSHIP') }}
            </p>
          </div>

          <div class="mx-4">
            <vz-rate
              class="flex justify-center"
              :editable="editable"
              :value="vModel.communication"
              :size="editable ? 16 : 10"
              @input="updateReview({ communication: $event })"
            />

            <p class="user-review__section_title" :class="{ 'user-review__section_title--error': hasError.communication }">
              {{ $t('IDENTITY_CARD.COMMUNICATION') }}
            </p>
          </div>
        </div>
      </div>

      <vz-textarea
        v-if="editable"
        v-model="vModel.comment"
        class="user-review__content mt-10"
        :rules="{ maxLength: [Length.COMMENT] }"
        @input="updateReview({ comment: $event.target.value })"
      />

      <div v-else class="user-review__content vz-font-size-14">
        {{ vModel.comment }}
      </div>
    </form>

    <div v-if="editable" class="flex justify-end fill-width">
      <vz-button text="GENERAL.CANCEL" color="yellow-500" background-color="mono-100" @click="$emit('cancel')" />

      <vz-button class="ms-2" text="GENERAL.SUBMIT" color="yellow-500" background-color="mono-100" :loading="loading" @click="onSubmit" />
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import type { GetReviewRes, AddReviewReq } from '@/views/employee/models';
import type { ErrorResponse } from '@/shared/services/api-service/models';
import { computed, PropType, ref } from 'vue';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import { useFormValidator } from '@/shared/components/fields/helpers';
import { Length } from '@/shared/constants/length';

const props = defineProps({
  editable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  errors: { type: Object as PropType<ErrorResponse | null>, default: () => null },
  value: { type: Object as PropType<Partial<GetReviewRes & AddReviewReq>>, default: () => ({} as AddReviewReq) },
});
const emit = defineEmits(['cancel', 'submit', 'select-user', 'update:model-value']);

const { activeUser } = useAuthUser();
const formRef = ref<Element | undefined>(undefined);

const vModel = computed({
  get: (): Partial<GetReviewRes & AddReviewReq> => props.value,
  set: (value) => emit('update:model-value', value),
});

const averageRating = computed(() => {
  const { craftsmanship = 0, communication = 0, attitude = 0, reliability = 0 } = vModel.value;

  return (craftsmanship + communication + attitude + reliability) / 4;
});

const hasError = computed(
  () =>
    props.errors?.errorMessage?.reduce(
      (result: Record<string, boolean>, { property }) => ({ ...result, ...(property ? { [property]: true } : {}) }),
      {}
    ) || {}
);

const updateReview = (payload: Partial<GetReviewRes>): void => {
  vModel.value = { ...vModel.value, ...payload };
};

const onSubmit = async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  emit('submit');
};
</script>
<style lang="scss">
.user-review {
  &:not(&--editable) {
    box-shadow: initial;
    background-color: initial;
  }

  &--editable {
    margin-top: 24px;

    .card__content {
      > form {
        display: flex;

        .vz-textarea {
          margin-top: initial !important;
        }
      }
    }
  }

  &__sections {
    flex-wrap: wrap;

    > div:first-child {
      user-select: none;
      margin-bottom: 12px;
    }
  }

  &:not(&--editable) &__sections {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-10);
    padding-top: 16px;

    > div:first-child > div > p {
      cursor: pointer;
    }

    > div:last-child {
      display: flex;
      flex-wrap: wrap;

      @include mobile-layout {
        display: none;
      }

      > div {
        margin-inline-start: 16px;
        flex-grow: 1;

        > p {
          text-align: center;
        }
      }
    }
  }

  &--editable &__sections {
    flex-direction: column;
    align-items: start;
    justify-content: initial;
    font-size: var(--font-size-14);

    > div {
      padding-top: 8px;

      &:last-child {
        padding-top: 8px;
        display: flex;
        flex-direction: column;
        padding-inline-end: 16px;
        flex-wrap: wrap;

        > div {
          display: flex;
          align-items: center;
          padding: 4px 0;
          min-width: 100%;
          flex-direction: row-reverse;
          justify-content: space-between;
          margin: 0;
        }
      }
    }
  }

  &__section_title {
    margin: 1px 0;

    &--error {
      color: var(--color-red-600);
    }
  }

  &__content {
    padding-inline-start: 8px;
    margin-top: 4px;
    width: 100%;
  }

  .v-field {
    &__overlay {
      background-color: transparent !important;
    }

    &__field {
      border: 1px solid var(--color-mono-600);
      border-radius: var(--border-radius-1);
    }
  }
}
</style>
