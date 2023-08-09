<template>
  <vz-card
    v-if="employee"
    class="identity-card"
    :class="{ clickable: clickable, active: active, skeleton: loading }"
    @click="$emit('select', employee)"
  >
    <div class="my-2 me-4 flex">
      <div class="me-2 flex flex-column align-center">
        <vz-avatar :src="avatarImg" :size="56" :verified="employee.verified" />

        <template v-if="totalReviews">
          <vz-rate size="12" :value="rate" />
        </template>
      </div>

      <div class="flex-grow-0 fill-width">
        <div class="flex justify-space-between">
          <div class="flex flex-column">
            <div class="identity-card__full-name">
              <p>{{ employee.firstName }}</p>
              <p>{{ employee.lastName }}</p>
            </div>

            <p v-if="employee.location?.address" class="identity-card__address">From {{ employee.location.address }}</p>
          </div>

          <div v-if="employee.conversation" class="flex">
            <vz-badge
              v-if="offerStatus && offerStatus !== ConversationStatusType.FREELANCER_INTERESTING"
              class="ms-1"
              font-size="10"
              :text="`JOB_MANAGER.STATUS.${offerStatus}`"
              :color="statusColor[offerStatus]"
            />

            <vz-badge v-if="employee?.conversation?.hasUpdated" class="ms-1" text="IDENTITY_CARD.UPDATED" font-size="10" />
          </div>
        </div>

        <vz-divider v-if="dailyWageBeforeTax || hourlyWageBeforeTax || offerAmount || offerStatus" class="fill-width mt-1" />

        <div v-if="dailyWageBeforeTax || hourlyWageBeforeTax" class="identity-card__wage flex mt-1">
          <span v-if="dailyWageBeforeTax" class="me-2">{{ $t('IDENTITY_CARD.DAILY_WAGE') }}: {{ dailyWageBeforeTax }}</span>
          <span v-if="hourlyWageBeforeTax">{{ $t('IDENTITY_CARD.HOURLY_WAGE') }}: {{ hourlyWageBeforeTax }}</span>
        </div>

        <div v-else-if="offerAmount || offerStatus" class="identity-card__conversation flex mt-1">
          <span v-if="offerAmount" class="me-4">{{ $t('JOB.PRICE_OFFER') }}: {{ offerAmount }} {{ offerCurrency }}</span>
          <span v-if="offerStatus" class="me-4">{{ $t('GENERAL.STATUS') }}: {{ $t(`JOB_MANAGER.STATUS.${offerStatus}`) }}</span>
        </div>
      </div>
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import type { ProfileExtendDetails } from '@/views/employee/models';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import { computed, type PropType } from 'vue';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import { statusColor } from '@/views/jobs/constants/status-color-map';
import { useRoot } from '@/store/helpers/use-root';
import { LOADING } from '@/store/constants';

const props = defineProps({
  clickable: { type: Boolean, default: false },
  employee: { type: Object as PropType<(ProfileExtendDetails & { conversation?: GetConversationRes }) | undefined>, default: undefined },
  active: { type: Boolean, default: false },
});

defineEmits(['select']);

const { [LOADING]: loader } = useRoot();

const offerStatus = computed(() => props.employee?.conversation?.status.type);
const offerCurrency = computed(() => props.employee?.conversation?.agreement?.currencyType);
const offerAmount = computed(() => props.employee?.conversation?.agreement?.amount);

const dailyWageBeforeTax = computed(() => props.employee?.wage?.daily);
const hourlyWageBeforeTax = computed(() => props.employee?.wage?.hourly);
const avatarImg = computed(() => props.employee?.avatar || '');
const rate = computed(() => props.employee?.rate);
const totalReviews = computed(() => props.employee?.reviews);

const loading = loader(props.employee?._id);
</script>

<style lang="scss">
.identity-card {
  font-size: var(--font-size-12);
  transition: color 0.3s, background-color 0.3s;

  .vz-card__content {
    display: flex;
    justify-content: flex-start;
  }

  &__full-name {
    display: flex;
    font-size: var(--font-size-16);
    font-weight: 700;

    > * {
      padding-inline-end: 0.25rem;
      text-transform: capitalize;
    }
  }

  &__full-name,
  &__address {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-inline-end: 16px;
    max-width: 200px;
  }

  &__wage,
  &__conversation {
    font-size: var(--font-size-10);
  }

  &__reviews-count {
    font-weight: 400;
    color: var(--color-mono-400);
  }

  &.active {
    color: var(--color-mono-200);
    background-color: var(--color-primary-900);
  }
}
</style>
