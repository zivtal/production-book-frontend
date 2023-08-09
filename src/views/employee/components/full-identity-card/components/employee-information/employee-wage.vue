<template>
  <vz-card class="wage-card fill-width my-2" :callback="updateEmployeeProfileRequest" :payload="payloadContent" @edit="toggleEditMode">
    <template #static>
      <div class="wage-card__title vz-font-size-12 text-center">
        <p v-if="memberSince">
          {{ $t('IDENTITY_CARD.MEMBER_SINCE') }}
        </p>

        <p>
          {{ $t('IDENTITY_CARD.DAILY_WAGE') }}
        </p>

        <p>
          {{ $t('IDENTITY_CARD.HOURLY_WAGE') }}
        </p>
      </div>
    </template>

    <template #view>
      <div class="wage-card__value vz-font-size-12 text-center">
        <p v-if="memberSince">{{ memberSince }}</p>

        <p v-if="dailyWageBeforeTax" class="ltr">{{ dailyWageBeforeTax }}</p>

        <p v-if="hourlyWageBeforeTax" class="ltr">{{ hourlyWageBeforeTax }}</p>
      </div>

      <div class="wage-card__exchange vz-font-size-12 text-center">
        <div></div>

        <div v-if="dailyWageBeforeTaxApproximately" class="ltr vz-font-size-10">
          <p>({{ dailyWageBeforeTaxApproximately }})</p>
        </div>

        <div v-if="hourlyWageBeforeTaxApproximately" class="ltr vz-font-size-10">
          <p>({{ hourlyWageBeforeTaxApproximately }})</p>
        </div>
      </div>

      <div v-if="dailyWageBeforeTaxApproximately || hourlyWageBeforeTaxApproximately" class="mt-2 vz-font-size-12 text-center c-red-900">
        {{ t('IDENTITY_CARD.EXCHANGE_UPDATED_AT', { value: exchangeUpdate }) }}
      </div>
    </template>

    <template #edit="{ errors }">
      <div class="wage-card__value vz-font-size-12 text-center">
        <p v-if="memberSince">{{ memberSince }}</p>

        <vz-input v-model="editContent.daily" type="number" :error-message="errors?.daily" />

        <vz-input v-model="editContent.hourly" type="number" :error-message="errors?.hourly" />
      </div>

      <vz-select
        v-model="editContent.currencyType"
        type="select"
        label="PROFILE.CURRENCY"
        :items="currencies"
        :error-message="errors?.currencyType"
      />
    </template>
  </vz-card>
</template>

<script setup lang="ts">
import type { ProfileFullDetails, Wage } from '@/views/employee/models';
import type { UpdateProfileReq } from '@/views/employee/models';
import { computed, type PropType, ref } from 'vue';
import dayjs from 'dayjs';
import { UPDATE_EMPLOYEE_PROFILE } from '@/views/employee/store/constants';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import currencies from '@/json/currency.json';
import { useCurrencyConverter } from '@/shared/composables/use-currency-converter';
import { numberWithCommas } from '@/shared/helpers';
import { useTranslator } from '@/plugins/i18n/helpers';

const t = useTranslator();

const props = defineProps({
  user: {
    type: Object as PropType<ProfileFullDetails | undefined>,
    default: undefined,
  },
});

const { [UPDATE_EMPLOYEE_PROFILE]: updateEmployeeProfileAction } = useEmployeeStore().useActions([UPDATE_EMPLOYEE_PROFILE]);

const updateEmployeeProfileRequest = updateEmployeeProfileAction as (payload: UpdateProfileReq) => Promise<void>;

const currency = computed(() => props.user?.wage?.currencyType);
const dailyWageBeforeTax = computed(() => (props.user?.wage?.daily ? `${numberWithCommas(props.user.wage.daily)} ${currency.value}` : '-'));
const hourlyWageBeforeTax = computed(() => (props.user?.wage?.hourly ? `${numberWithCommas(props.user.wage.hourly)} ${currency.value}` : '-'));

const exchangeUpdate = useCurrencyConverter();

const dailyWageBeforeTaxApproximately = useCurrencyConverter(
  computed(() => props.user?.wage?.daily),
  computed(() => props.user?.wage?.currencyType)
);

const hourlyWageBeforeTaxApproximately = useCurrencyConverter(
  computed(() => props.user?.wage?.hourly),
  computed(() => props.user?.wage?.currencyType)
);

const memberSince = computed(() => dayjs(props.user?.createdAt).format('DD MMM YYYY'));

const editContent = ref<Wage>({} as Wage);
const payloadContent = computed(() => ({
  wage: { ...editContent.value, hourly: +(editContent.value.hourly || 0), daily: +(editContent.value.daily || 0) },
}));

const toggleEditMode = async (): Promise<void> => {
  editContent.value = props.user?.wage || ({} as Wage);
};
</script>

<style lang="scss">
.wage-card {
  &__title {
    display: grid;
    grid-template-columns: repeat(3, calc(100% / 3));
  }

  &__exchange {
    display: grid;
    grid-template-columns: repeat(3, calc(100% / 3));
    color: var(--color-mono-600);
  }

  &__value {
    display: grid;
    grid-template-columns: repeat(3, calc(100% / 3));
    color: var(--color-mono-500);

    > * {
      padding: 0 0.5rem;
    }

    input {
      padding: 0 !important;
      text-align: center;
    }
  }
}
</style>
