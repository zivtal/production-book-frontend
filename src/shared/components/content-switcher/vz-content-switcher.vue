<template>
  <div class="content-switcher">
    <vz-tab-switcher :tabs="totalTabs" @update:index="$emit('update:index', $event)" />

    <div v-if="$slots['header']" class="content-switcher-header">
      <slot name="header" />
    </div>

    <template v-if="activeContent?.component || $slots['content']">
      <div class="content-switcher-component">
        <component :is="activeContent?.component" v-if="activeContent?.component" />

        <slot v-if="$slots['content']" name="content" :index="index" />
      </div>
    </template>

    <div v-if="(activeContent?.actions || []).length || $slots['actions']" class="content-switcher-actions">
      <slot name="actions" />

      <vz-button
        v-for="({ color, label, onClick }, actionIndex) in activeContent?.actions || []"
        :key="actionIndex"
        :color="color"
        :text="label"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { SwitcherTab, SwitcherTabs } from '@/shared/components/content-switcher/content-switcher.type';

const props = defineProps({
  index: { type: [Number, String], default: 0 },
  tabs: { type: Array as PropType<SwitcherTabs>, required: true },
  numOfShown: { type: [Number, String], default: 3 },
});

defineEmits(['update:index', 'more']);

const totalTabs = computed((): number => props.tabs.length);
const activeContent = computed((): SwitcherTab | undefined => props.tabs[+props.index]);
</script>

<style lang="scss">
.content-switcher {
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  width: 100%;

  &:has(&-component) {
    height: calc(100vh - var(--header-height) - var(--footer-height));
  }

  &-header {
    padding: 0.25rem;
  }

  &-panel {
    display: flex;

    &__navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.5rem;
      color: var(--color-mono-800);

      &--disabled {
        color: var(--color-mono-400);
      }
    }

    &__tabs {
      display: flex;
      width: 100%;
      border-radius: 8rem;
      padding: 0.25rem;
      background-color: var(--color-mono-300);
      border: 1px solid var(--color-mono-400);

      > * {
        flex: 1 1 0;
      }

      &-item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 0;
        border-radius: 8rem;
        color: var(--color-mono-800);
        background-color: var(--color-background-1);

        &--outline:not(:last-child) {
          position: relative;

          &::before {
            content: '';
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            position: absolute;
            border-inline-end: 1px solid var(--color-mono-300);
            width: 100%;
            height: 60%;
          }
        }
      }
    }
  }

  &-component {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 1rem 0;
    flex-grow: 1;
    overflow-y: auto;

    > * {
      margin: 0 0.5rem;
    }
  }

  &-actions {
    display: flex;
    margin: 0.5rem 0;

    > * {
      flex: 1 1 0;
    }

    > *:not(:last-child) {
      margin-inline-end: 0.25rem;
    }
  }
}
</style>
