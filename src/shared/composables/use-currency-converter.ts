import type { ExchangeRate } from '@/store/client/models';
import { computed, type ComputedRef, type Ref } from 'vue';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import { numberWithCommas } from '@/shared/helpers';
import { EXCHANGE_RATES, GET_EXCHANGE_RATES } from '@/store/client/constants';
import useGeneralStore from '@/store/client/composables/use-general-store';
import dayjs from 'dayjs';
import { GlobalVariables } from '@/shared/constants/global-variables';

export const useCurrencyConverter = (amount?: Ref<number | undefined>, fromCurrency?: Ref<string | undefined>): ComputedRef<string | null> => {
  const { useActions: useGeneralActions, useState: useGeneralState } = useGeneralStore();

  const { [GET_EXCHANGE_RATES]: getExchangeRatesAction } = useGeneralActions([GET_EXCHANGE_RATES]);
  const { [EXCHANGE_RATES]: exchangeRatesState } = useGeneralState([EXCHANGE_RATES]);

  const myCurrency = computed((): string | undefined => useAuthUser().activeUser.value?.wage?.currencyType);

  return computed((): string | null => {
    if (!amount && !fromCurrency && exchangeRatesState.value.createdAt) {
      return dayjs(exchangeRatesState.value.createdAt).format(GlobalVariables.DAY_MONTH_YEAR_TIME_FORMAT);
    }

    if (!amount?.value || !fromCurrency?.value || !myCurrency.value || myCurrency.value === fromCurrency.value) {
      return null;
    }

    getExchangeRatesAction();

    const exchanges = computed(() => exchangeRatesState.value.exchangeRates || []);
    const exchange = exchanges.value.find((ex: ExchangeRate) => ex.from === fromCurrency.value && ex.to === myCurrency.value);

    if (!exchange) {
      return null;
    }

    const number = (amount.value * (exchange?.rate || 1)).toFixed(2);

    return `${numberWithCommas(+number)} ${exchange?.to || fromCurrency.value}`;
  });
};
