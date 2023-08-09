<template>
  <button
    class="vz-close-button"
    role="button"
    :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'GENERAL.CLOSE' })"
    :style="{ width: size + 'px', height: size + 'px', ...(color ? { color: COLORS_MAP[props.color] || props.color } : {}) }"
    @close.stop="$emit('close')"
  >
    <div class="vz-close-button__line-right" :style="lineStyle" />
    <div class="vz-close-button__line-left" :style="lineStyle" />
  </button>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { type ColorName, COLORS_MAP } from '@/shared/services/css-service/types/colors';
import { useTranslator } from '@/plugins/i18n/helpers';

const props = defineProps({
  size: { type: [Number, String], default: 16 },
  color: { type: String as PropType<ColorName | undefined>, default: undefined },
});

defineEmits(['close']);

const t = useTranslator();

const lineStyle = computed(() => ({
  width: (+props.size * 16) / 15 + 'px',
  height: (+props.size * 16) / 15 / 7 + 'px',
}));
</script>

<style lang="scss">
.vz-close-button {
  position: absolute;
  z-index: 100;
  width: 15px;
  height: 15px;
  cursor: pointer;
  padding: 1rem;

  &:hover .vz-close-button__line-right,
  &:hover .vz-close-button__line-left {
    transform: rotate(-45deg);
  }

  &:hover .vz-close-button__line-left {
    transform: rotate(45deg);
  }

  &__line-right,
  &__line-left {
    height: 2px;
    width: 16px;
    position: absolute;
    margin-top: 10px;
    border-radius: 5px;
    transform: rotate(45deg);
    transition: all 0.3s ease-in;
    background-color: currentColor;
  }

  &__line-left {
    transform: rotate(-45deg);
  }
}
</style>
