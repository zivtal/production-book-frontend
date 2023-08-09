<template>
  <div class="vz-collapse">
    <div
      ref="containerRef"
      class="vz-collapse__container"
      :class="{ 'vz-collapse__container--shorten': isShorten && isExtendable }"
      :style="{ ...containerStyle, transition: `max-height ${transition}s` }"
    >
      <slot />
    </div>

    <div v-if="isExtendable" class="vz-collapse__control" :class="{ 'vz-collapse__control--full': isShowMore }">
      <vz-button
        mode="flat"
        font-size="10"
        :text="`GENERAL.${isShowMore ? 'SHOW_LESS' : 'SHOW_MORE'}`"
        :icon-name="isShowMore ? 'svg:collapse' : 'svg:extend'"
        @click="onCollapse"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType, ref, watch } from 'vue';
import { useResizeObserver } from '@/shared/composables';
import { convertPixelToRem } from '@/shared/helpers';

const props = defineProps({
  minHeight: { type: [Number, String], required: true },
  unitType: { type: String as PropType<'px' | 'rem'>, default: 'px' },
  transition: { type: Number, default: 0.3 },
});

const isShorten = ref<boolean>(false);
const isShowMore = ref<boolean>(false);
const containerRef = ref<Element | undefined>(undefined);
const { height: containerHeight } = useResizeObserver(containerRef, true);

const maxHeight = computed(() => {
  switch (props.unitType) {
    case 'rem':
      return convertPixelToRem(containerHeight.value);
    default:
      return containerHeight.value;
  }
});

const minHeight = computed(() => {
  switch (props.unitType) {
    case 'rem':
      return convertPixelToRem(+props.minHeight);
    default:
      return +props.minHeight;
  }
});

const isExtendable = computed((): boolean => maxHeight.value > minHeight.value);

const containerStyle = computed(() => {
  if (!isExtendable.value) {
    return;
  }

  return isExtendable.value && isShowMore.value ? { maxHeight: `${maxHeight.value}px` } : { maxHeight: `${minHeight.value - 24}px` };
});

const onCollapse = () => {
  isShowMore.value = !isShowMore.value;

  if (!isShowMore.value) {
    setTimeout(() => (isShorten.value = true), props.transition * 1000);
  } else {
    isShorten.value = false;
  }
};

watch(
  () => containerHeight.value,
  () => (isShorten.value = true)
);
</script>

<style lang="scss">
.vz-collapse {
  position: relative;

  &__container {
    overflow: hidden;

    &--shorten {
      * {
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      padding-bottom: 2rem;
    }
  }

  &__control {
    &:not(&--full) {
      position: absolute;
    }

    height: 1.75rem;
    top: calc(100% - 1rem - 1px);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--color-opacity-mono-500) 30%);
  }
}
</style>
