<template>
  <div ref="elementRef" class="infinity-scroll">
    <vz-spinner v-if="refreshing" class="infinity-scroll__refreshing" />

    <div v-if="$slots['header']" :class="['infinity-scroll__header', { 'infinity-scroll__header-sticky': !refreshing }]">
      <slot name="header" />
    </div>

    <slot name="content" :data="data" :errors="serverErrors" :loading="loading" />

    <vz-spinner
      v-if="loading && !refreshing"
      :class="['infinity-scroll__loading', { 'infinity-scroll__loading-full': !data.length, 'infinity-scroll__loading-hidden': hideFirstLoad }]"
      :size="data.length ? 48 : 96"
    />
  </div>
</template>

<script setup lang="ts">
import type { BasePagination } from '@/shared/models';
import { computed, type PropType } from 'vue';
import { useInfinityScroll, useServerErrorsMapper } from '@/shared/composables';

const props = defineProps({
  hideFirstLoad: { type: Boolean, default: false },
  payload: { type: Object as PropType<Record<any, any>>, default: () => ({}) },
  callback: { type: Function as PropType<(...arg: any) => Promise<any>>, required: true },
  page: { type: Object as PropType<BasePagination>, default: () => ({ size: 8 }) },
  data: { type: Array as PropType<Array<any>>, default: () => [] },
  percentTrigger: { type: [Number, String], default: 50 },
  disablePayloadWatcher: { type: Boolean, default: false },
});

const serverErrors = computed(() => useServerErrorsMapper(error));

const { elementRef, data, loading, refreshing, error, init } = useInfinityScroll<any, any>(props.callback, {
  percentTrigger: +props.percentTrigger,
  page: props.page,
  data: props.data,
  payload: computed(() => props.payload),
  disablePayloadWatcher: props.disablePayloadWatcher,
});

defineExpose({ init, data });
</script>

<style scoped lang="scss">
@keyframes show-refreshing {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(10%);
  }
}

.infinity-scroll {
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
  padding-top: 0;
  transition: padding-top 0.3s;

  &:has(&__refreshing) {
    padding-top: 48px;
  }

  &__header {
    background-color: var(--color-background-1);

    &-sticky {
      position: sticky;
      top: 0;
      z-index: 10;
    }
  }

  &__refreshing {
    position: absolute;
    top: 8px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    animation: show-refreshing 0.3s ease-in-out;
  }

  &__loading {
    &-full {
      height: 100%;
    }

    &-hidden {
      display: none;
    }
  }
}
</style>
