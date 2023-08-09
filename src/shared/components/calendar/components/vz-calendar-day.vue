<template>
  <div class="vz-calendar-day" :class="{ 'vz-calendar-day--open': isShowMore }">
    <template v-if="day">
      <div class="vz-calendar-day__header">
        <span>{{ day }}</span>
      </div>

      <div ref="contentRef" class="vz-calendar-day__content" :style="dayStyle">
        <slot />
      </div>

      <div v-if="isExtendable" class="vz-calendar-day__control">
        <vz-button
          mode="flat"
          font-size="10"
          :text="`GENERAL.${isShowMore ? 'SHOW_LESS' : 'SHOW_MORE'}`"
          :icon-name="isShowMore ? 'svg:collapse' : 'svg:extend'"
          @click="onCollapse"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useResizeObserver } from '@/shared/composables';
import { convertPixelToRem } from '@/shared/helpers';

const props = defineProps({
  day: { type: Number, required: true },
  extendable: { type: Boolean, default: false },
});

const isShowMore = ref<boolean>(false);
const contentRef = ref<Element | undefined>(undefined);
const { height } = useResizeObserver(contentRef, true);

const minHeight = computed(() => 2.25);
const isExtendable = computed(() => props.extendable && convertPixelToRem(height.value || 0) > 2.25);

const dayStyle = computed(() => {
  if (!isExtendable.value || !height.value) {
    return;
  }

  return isShowMore.value ? { maxHeight: `${convertPixelToRem(height.value)}rem` } : { maxHeight: `${minHeight.value}rem` };
});

const onCollapse = () => {
  isShowMore.value = !isShowMore.value;
};
</script>

<style lang="scss">
.vz-calendar-day {
  &--open {
    grid-row: span 2;
  }

  &__content {
    flex-grow: 1;
    transition: max-height 0.3s;
    overflow: hidden;

    > * {
      margin: 1px 0;
    }
  }

  &__control {
    display: flex;

    > button {
      margin: 0;
      flex-grow: 1;
    }
  }

  &__header {
    display: flex;
    align-items: center;

    @include max-tablet-layout {
      justify-content: center;
    }
  }
}
</style>
