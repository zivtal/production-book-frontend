<template>
  <div v-if="errors" class="vz-error-alert">
    <template v-for="({ message, ...rest }, index) in errors.errorMessage">
      <div v-if="!maxShown || index < +maxShown" :key="index" class="vz-error-alert__message">
        <vz-icon class="pe-1" name="svg:warning" color="red-600" category="600" size="24" />

        <span>{{ t(message, { ...rest }) }}</span>

        <span v-if="maxShown && index === +maxShown - 1" class="ms-1">(+{{ errors.errorMessage.length - maxShown }})</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ErrorResponse } from '@/shared/services/api-service/models';
import { type PropType } from 'vue';
import { useTranslator } from '@/plugins/i18n/helpers';

const t = useTranslator();

defineProps({
  errors: { type: Object as PropType<ErrorResponse | null>, default: () => null },
  maxShown: { type: [Number, String], default: 0 },
});
</script>

<style lang="scss">
.vz-error-alert {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 16px;
  margin: 8px 2px;
  border-radius: var(--border-radius-1);
  outline: 1px solid var(--color-red-600);

  &__message {
    display: flex;
    align-content: center;
    color: var(--color-red-600);
    font-weight: 500;
  }
}
</style>
