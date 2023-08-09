<template>
  <div class="text-center">
    <template v-if="priceOffer">
      <p class="vz-font-size-16">
        <span class="me-1">{{ $t('JOB.PRICE_OFFER') }}:</span>
        <span class="vz-font-weight-600">{{ priceOffer }}</span>
      </p>

      <p v-if="priceOfferExchange" class="vz-font-size-10 c-mono-700">
        <span class="me-1">{{ $t('GENERAL.APPROXIMATELY') }}</span>
        <span>{{ priceOfferExchange }}</span>
      </p>
    </template>

    <span v-else>{{ $t('JOB.PRICE_OFFER_MISSING') }}</span>
  </div>
</template>

<script setup lang="ts">
import type { ConversationAgreement } from '@/views/jobs/model/conversation';
import { computed, type PropType } from 'vue';
import { numberWithCommas } from '@/shared/helpers';
import { useCurrencyConverter } from '@/shared/composables/use-currency-converter';

const props = defineProps({
  agreement: { type: Object as PropType<ConversationAgreement | undefined>, required: true },
});

const priceOffer = computed((): string | undefined =>
  props.agreement ? `${numberWithCommas(props.agreement.amount)} ${props.agreement.currencyType}` : undefined
);

const priceOfferExchange = useCurrencyConverter(
  computed(() => props.agreement?.amount),
  computed(() => props.agreement?.currencyType)
);
</script>
