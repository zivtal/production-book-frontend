<template>
  <div :class="['tab-switcher', { 'tab-switcher--with-content': $slots['content'] }]">
    <slot name="header" />

    <div v-if="isTabsShown && !isTabsHideOnSplash" class="tab-switcher-navigation">
      <div
        v-if="isOverSize && !mode.includes('stepper')"
        :class="['tab-switcher-navigation__back', { 'tab-switcher-navigation__back--disabled': !isPrevPageEnabled }]"
        @click="onPrevPage"
      >
        <vz-icon
          v-show="!hideBackButton"
          name="svg:previous"
          size="18"
          :aria-label="$t('GENERAL.BACK')"
          :color="isPrevPageEnabled ? 'primary-900' : 'mono-300'"
        />
      </div>

      <div class="tab-switcher-navigation__panel">
        <div v-if="$slots['prepend']" class="tab-switcher-navigation__panel-actions">
          <slot name="prepend" :index="activeIndex" />
        </div>

        <div
          v-for="(label, tabIndex) in tabsChunk"
          :key="tabIndex"
          :class="[
            'tab-switcher-navigation__panel-tab',
            {
              'tab-switcher-navigation__panel-tab--stepper': mode.includes('stepper') && tabsBulk.length > 1,
              'tab-switcher-navigation__panel-tab--divider': isActiveTab(tabIndex),
              'tab-switcher-navigation__panel-tab--active': activeShownIndex === tabIndex,
              'tab-switcher-navigation__panel-tab--outline': mode.includes('outline'),
            },
          ]"
          :style="activeShownIndex === tabIndex ? { ...activeStyle, textTransform } : { ...inActiveStyle, textTransform }"
          @click="onSelect(startAt + tabIndex)"
        >
          <slot name="button" :label="$t(label)">
            <span>{{ $t(label) }}</span>
          </slot>
        </div>

        <div v-if="$slots['append']" class="tab-switcher-navigation__panel-actions">
          <slot name="append" :index="activeIndex" />
        </div>

        <template v-if="!isLastChunk">
          <div
            class="tab-switcher-navigation__panel-tab tab-switcher-navigation__panel-tab--outline"
            @click="$emit('more', { index, tabs: tabsBulk })"
          >
            <span>...</span>
          </div>

          <div class="tab-switcher-navigation__panel-tab" @click="onSelect(totalTabs - 1)">
            {{ $t(tabsBulk[totalTabs - 1]) }}
          </div>
        </template>
      </div>

      <div
        v-if="isOverSize && !mode.includes('stepper')"
        :class="['tab-switcher-navigation__next', { 'tab-switcher-navigation__next--disabled': !isNextPageEnabled }]"
        @click="onNextPage"
      >
        <vz-icon
          v-show="!hideNextButton"
          name="svg:next"
          size="18"
          :aria-label="$t('GENERAL.NEXT')"
          :color="isNextPageEnabled ? 'primary-900' : 'mono-300'"
        />
      </div>
    </div>

    <div
      v-if="$slots['content']"
      :class="['tab-switcher-content', `tab-switcher-content-${activeIndex}`, { 'tab-switcher-content--splash': $slots['splash'] }]"
      :style="tabStyle"
    >
      <slot name="splash" />

      <slot name="content" :index="activeIndex" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType, ref, useSlots, watch } from 'vue';
import { type ColorName, COLORS_MAP } from '@/shared/services/css-service/types';
import type { BaseTab } from '@/shared/components/content-switcher/content-switcher.type';

type ActiveStyle = { color: ColorName; backgroundColor: ColorName };

const props = defineProps({
  mode: { type: Array as PropType<Array<'outline' | 'stepper'>>, default: () => [] },
  hideNextButton: { type: Boolean, default: false },
  hideBackButton: { type: Boolean, default: false },
  hideTabsOnSplash: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: true },
  index: { type: [Number, String], default: 0 },
  tabs: { type: [Number, Array] as PropType<Array<string | number | BaseTab> | number>, required: true },
  numOfShown: { type: [Number, String], default: 4 },
  active: {
    type: Object as PropType<ActiveStyle>,
    default: () => ({ color: 'primary-900', backgroundColor: 'mono-opacity-100' }),
  },
  inActive: {
    type: Object as PropType<ActiveStyle>,
    default: () => ({ color: 'mono-800', backgroundColor: 'mono-opacity-500' }),
  },
  textTransform: { type: String as PropType<'uppercase' | 'capitalize'>, default: 'uppercase' },
  hiddenIndexList: { type: Array as PropType<Array<number>>, default: () => [] },
});

const emit = defineEmits(['update:index', 'more']);
const slots = useSlots();

const startAt = ref<number>(0);
const activeIndex = ref<number>(+props.index);

const shownLimit = computed((): number => +props.numOfShown);
const isTabsShown = computed((): boolean => !!(tabsBulk.value || []).length && !props.hiddenIndexList.includes(activeIndex.value));
const isTabsHideOnSplash = computed((): boolean => !!slots['splash'] && props.hideTabsOnSplash);

const tabStyle = computed(() => {
  if (!Array.isArray(props.tabs) || typeof props.tabs[activeIndex.value] !== 'object') {
    return;
  }

  return (props.tabs as Array<BaseTab>)[activeIndex.value].style;
});

const tabsBulk = computed((): Array<string> => {
  if (Array.isArray(props.tabs)) {
    return props.tabs.map((value) => {
      switch (typeof value) {
        case 'object':
          return value.label.toString();
        default:
          return value.toString();
      }
    });
  }

  return Array.from(Array(+props.tabs).keys()).map((num) => (num + 1).toString());
});

const totalTabs = computed((): number => tabsBulk.value.length);
const chunkSize = computed((): number => shownLimit.value - (isLastChunk.value ? 0 : 2));
const isLastChunk = computed(
  (): boolean => props.index === totalTabs.value - 1 || totalTabs.value - shownLimit.value === startAt.value || !isOverSize.value
);
const tabsChunk = computed((): Array<string> => tabsBulk.value.slice(startAt.value, startAt.value + chunkSize.value));
const activeShownIndex = computed(() => activeIndex.value - startAt.value);
const isOverSize = computed((): boolean => totalTabs.value > shownLimit.value);

const activeStyle = computed(
  (): Record<string, string> => Object.entries(props.active).reduce((style, [key, value]) => ({ ...style, [key]: COLORS_MAP[value] }), {})
);

const inActiveStyle = computed(
  (): Record<string, string> => Object.entries(props.inActive).reduce((style, [key, value]) => ({ ...style, [key]: COLORS_MAP[value] }), {})
);

const isActiveTab = (tabIndex: number): boolean => tabIndex !== activeShownIndex.value && tabIndex !== activeShownIndex.value - 1;

const isActiveIsFocused = computed((): boolean => {
  return activeIndex.value < startAt.value || activeIndex.value < startAt.value + chunkSize.value;
});

const setCenterView = (): void => {
  if (isActiveIsFocused.value) {
    return;
  }

  startAt.value = Math.min(totalTabs.value - shownLimit.value, activeIndex.value + Math.floor(shownLimit.value / 2) + chunkSize.value);
};

const isPrevPageEnabled = computed((): boolean => activeIndex.value > 0 || (!props.autofocus && startAt.value > 0));

const onPrevPage = (): void => {
  if (props.autofocus) {
    onSelect(Math.max(0, activeIndex.value - 1));
  }

  if (!props.autofocus || activeIndex.value <= startAt.value) {
    startAt.value = Math.max(0, startAt.value + (activeIndex.value - startAt.value - 1));
  }
};

const isNextPageEnabled = computed((): boolean => (totalTabs.value - 1 > activeIndex.value && props.autofocus) || !isLastChunk.value);

const onNextPage = (): void => {
  if (props.autofocus) {
    onSelect(Math.min(totalTabs.value - 1, activeIndex.value + 1));
  }

  if (!props.autofocus || activeIndex.value >= startAt.value + chunkSize.value - 1) {
    startAt.value = Math.min(totalTabs.value - shownLimit.value, startAt.value + chunkSize.value);
  }
};

const onSelect = (index: number): void => {
  if (Array.isArray(props.tabs)) {
    const item = props.tabs[index];

    if (item && typeof item === 'object') {
      item.onClick?.(index);
    }
  }

  activeIndex.value = index;
  emit('update:index', index);
};

watch(
  () => props.index,
  (index) => {
    activeIndex.value = +index;
    setCenterView();
  },
  { immediate: true }
);
</script>

<style lang="scss">
$tab-navigation-bar: 2.5rem;

.tab-switcher {
  display: flex;
  flex-direction: column;

  &--with-content {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  &-navigation {
    margin: 1rem 0;
    display: flex;
    font-size: var(--font-size-14);
    height: $tab-navigation-bar;

    &__back,
    &__next {
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.5rem;

      @include rtl(transform, scale(-1));

      &:not(&--disabled) {
        cursor: pointer;
      }
    }

    &__panel {
      display: flex;
      flex-grow: 1;

      &-tab {
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.25rem 0.5rem;
        margin: 0 0.125rem;
        border-radius: 0.25rem;
        flex: 1 1 0;

        &--stepper {
          @include rtl(
            clip-path,
            polygon(100% 0%, calc(100% - 0.5rem) 50%, 100% 100%, 0.5rem 100%, 0% 50%, 0.5rem 0%),
            polygon(calc(100% - 0.5rem) 0%, 100% 50%, calc(100% - 0.5rem) 100%, 0% 100%, 0.5rem 50%, 0% 0%)
          );

          padding: 0.25rem 1rem;
        }

        * {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: pre;
          max-width: 100%;
        }

        &--divider:not(&-step):not(:last-child) {
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

        &--active {
          cursor: initial;
          font-weight: var(--font-weight-medium);
        }

        &:not(&--outline) &--active {
          text-decoration: underline;
        }

        &:not(&--active) {
          border: 1px solid var(--color-background-2);
        }

        &--outline {
          border: 1px solid currentColor;
        }
      }

      &-actions {
        display: flex;
        align-items: center;

        > * {
          margin: 0 0.125rem;
        }
      }
    }
  }

  &-content {
    position: relative;
    flex-grow: 1;
    height: 0;

    @include mobile-layout {
      max-height: calc(100% - var(--footer-height));
    }

    &--overflow-hidden {
      overflow-y: hidden !important;
    }

    &--splash {
      > *:not(:first-child) {
        display: none;
      }
    }
  }
}
</style>
