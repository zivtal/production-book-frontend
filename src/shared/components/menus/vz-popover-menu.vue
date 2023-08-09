<template>
  <div class="vz-popover-menu">
    <div
      ref="popoverRef"
      class="vz-popover-menu__activator"
      :class="{ 'vz-popover-menu__activator--disabled': disabled }"
      role="button"
      @keydown.enter="onClick"
      @click.stop="onClick"
    >
      <slot name="activator" />
    </div>

    <div v-if="isActive && !disabled" ref="popoverContent" class="vz-popover-menu__content" :style="popoverStyle">
      <slot name="top" />

      <slot name="default" />

      <div v-for="(item, index) in items || []" :key="index">
        <vz-divider v-if="item.divider === 'before'" class="mt-1" />

        <vz-button
          mode="flat"
          :uppercase="uppercase"
          :loading="loadingIndex === index"
          :icon-name="item.icon"
          :text="item.text"
          @click="onSelect(item.click, index)"
        />

        <vz-divider v-if="item.divider === 'after'" />
      </div>

      <slot name="bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { MenuItem } from '@/shared/components/menus/models/menu-item';
import { isRtl } from '@/plugins/i18n/helpers';

const props = defineProps({
  disabled: { type: Boolean, default: false },
  items: { type: Array as PropType<Array<MenuItem>>, default: () => [] },
  size: { type: [String, Number], default: 42 },
  offsetX: { type: [String, Number], default: 4 },
  offsetY: { type: [String, Number], default: 0 },
  uppercase: { type: Boolean, default: true },
});

const isActive = ref<boolean>(false);
const popoverRef = ref<HTMLDivElement>();
const popoverContent = ref<HTMLDivElement>();
const loadingIndex = ref<number | null>(null);

const popoverStyle = computed(() => {
  if (!popoverRef.value || !popoverContent.value) {
    return {};
  }

  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
  const { offsetLeft: mainLeft, offsetTop: mainTop, clientHeight: mainHeight, clientWidth: mainWidth } = popoverRef.value;
  const { clientWidth: contentWidth } = popoverContent.value;

  const isLtr = !isRtl();
  const positionX = isLtr ? mainLeft + +props.offsetX : mainLeft + (mainWidth - contentWidth) - +props.offsetX;

  const targetTop = mainTop + mainHeight + 4 + +props.offsetY;
  const targetLeft = contentWidth + positionX < windowWidth ? Math.max(positionX, 4) + 'px' : 'initial';
  const targetRight = contentWidth + positionX > windowWidth ? Math.min(windowWidth - positionX - mainWidth, windowWidth) + 'px' : 'initial';

  return {
    top: targetTop + 'px',
    left: targetLeft,
    right: targetRight,
    maxHeight: windowHeight - targetTop - 16 + 'px',
  };
});

const closeEvent = () => {
  isActive.value = false;
  window.removeEventListener('click', closeEvent);
};

const onClick = (): void => {
  isActive.value = !isActive.value;
  loadingIndex.value = null;

  if (isActive.value) {
    window.addEventListener('click', closeEvent);
  }
};

const onSelect = async (callback: () => void | Promise<void>, index: number): Promise<void> => {
  try {
    loadingIndex.value = index;
    await callback();
    isActive.value = false;
  } finally {
    loadingIndex.value = null;
  }
};
</script>

<style lang="scss">
.vz-popover-menu {
  &__activator {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;

    &:not(&--disabled) {
      cursor: pointer;
    }
  }

  &__content {
    border-radius: var(--border-radius-1);
    padding: 4px 8px;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 11;
    background-color: var(--color-background-2);
    box-shadow: var(--shadow-level-1);
    overflow-y: auto;
    overflow-x: hidden;

    .vz-button__content {
      justify-content: flex-start !important;
      width: 100%;
    }
  }
}
</style>
