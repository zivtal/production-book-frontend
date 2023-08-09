<template>
  <div class="vz-spinner" :aria-label="t('COMPONENT_LABELS.LOADING', { value: ariaLabel })">
    <div :style="{ width: size + 'px', height: size + 'px' }">
      <span v-if="loading" :style="spinnerStyle" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslator } from '@/plugins/i18n/helpers';

const props = defineProps({
  loading: { type: Boolean, default: true },
  ariaLabel: { type: String, default: 'GENERAL.LOADING' },
  color: { type: String, default: 'var(--color-primary-900)' },
  size: { type: [Number, String], default: 32 },
});

const t = useTranslator();

const spinnerStyle = computed(() => ({
  height: props.size + 'px',
  width: props.size + 'px',
  borderBottomColor: props.color,
  borderWidth: Math.ceil(+props.size / 24) + 'px',
}));
</script>

<style lang="scss">
.vz-spinner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  > div > span {
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s linear infinite;
    color: transparent;
    border-style: solid;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
