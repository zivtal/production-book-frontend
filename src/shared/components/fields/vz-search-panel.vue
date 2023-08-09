<template>
  <vz-card class="vz-search-panel">
    <form ref="formRef" class="vz-search-panel__fields" role="form" autocomplete="off" @submit.prevent>
      <div ref="containerRef" :style="containerStyle">
        <slot />
      </div>
    </form>

    <div class="vz-search-panel__controls">
      <vz-button tabindex="2" text="GENERAL.CLEAR" role="button" @click="$emit('clear')" />

      <vz-button tabindex="1" text="GENERAL.SEARCH" role="button" @click="onSearch" />

      <vz-button
        v-if="isExtendable"
        class="vz-search-panel__fields--extend"
        mode="flat"
        role="button"
        :text="`GENERAL.${isShowMore ? 'SHOW_LESS' : 'SHOW_MORE'}`"
        :icon-name="isShowMore ? 'svg:collapse' : 'svg:extend'"
        @click.stop="isShowMore = !isShowMore"
      />
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useResizeObserver } from '@/shared/composables';
import { useFormValidator } from '@/shared/components/fields/helpers';

const MAX_HEIGHT = 78;

const formRef = ref<Element | undefined>(undefined);
const emit = defineEmits(['search', 'clear']);

const containerRef = ref<Element | undefined>(undefined);
const { maxHeight: containerHeight } = useResizeObserver(containerRef);

const isShowMore = ref<boolean>(false);

const isExtendable = computed((): boolean => containerHeight.value > MAX_HEIGHT * 1.5);
const containerStyle = computed(() => {
  if (!isExtendable.value) {
    return;
  }

  return isExtendable.value && isShowMore.value ? { maxHeight: `${containerHeight.value}px` } : { maxHeight: `${MAX_HEIGHT}px` };
});

const onSearch = async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  emit('search');
};
</script>

<style lang="scss">
.vz-search-panel {
  position: relative;
  margin: 0.5rem 0;

  &__fields {
    > :first-child {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 25%));
      margin-bottom: 0.25rem;
      overflow: hidden;
      transition: max-height 0.3s;

      > * {
        padding: 0.25rem 0.5rem;
        height: fit-content;
      }
    }

    &--extend {
      position: absolute;
      display: flex;

      @include mobile-layout {
        @include rtl(left, 100%, 0);
        @include rtl(transform, translateX(-100%));
      }

      @include min-mobile-layout {
        left: 50%;
        transform: translateX(-50%);
      }

      bottom: 0;
    }
  }

  &__controls {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-inline-end: 0.25rem;
    z-index: 1;

    > * {
      min-width: 6rem;
      margin-inline-start: 0.5rem;
    }
  }
}
</style>
