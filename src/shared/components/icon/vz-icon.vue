<template>
  <div class="icon">
    <svg
      v-if="getSvgContent"
      class="icon-svg"
      :class="{ 'icon-svg--clickable': clickable, 'icon-svg--loading': loading }"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      :viewBox="getViewBox"
      v-bind="{ ...bind, ...$attrs }"
      v-html="getSvgContent"
    />

    <div v-if="counter" class="icon__count">{{ counter }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { type IconName, type IconType, ICONS, type SvgIcon, IconPrefix } from '@/shared/components/icon/icon.type';
import { getColorLuma } from '@/shared/helpers';
import { COLORS_MAP, type ColorsMap, type ColorCategory } from '@/shared/services/css-service/types/colors';

const props = defineProps({
  loading: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  counter: { type: Number, default: 0 },
  name: { type: String as PropType<IconName>, required: true },
  type: { type: String as PropType<IconType>, default: 'solid' },
  color: { type: String as PropType<ColorCategory | ColorsMap>, default: 'primary' },
  category: { type: [Number, String], default: 900 },
  size: { type: [String, Number], default: 32 },
});

const iconType = computed((): IconPrefix => props.name.substring(0, props.name.indexOf(':')) as IconPrefix);
const iconName = computed((): SvgIcon => props.name.slice(props.name.indexOf(':') + 1) as SvgIcon);

const getViewBox = computed(() => {
  if (iconType.value !== 'svg') {
    return;
  }

  return ICONS[iconName.value]?.viewBox || '0 0 64 64';
});

const getSvgContent = computed((): string | undefined => {
  const icon = ICONS[iconName.value][props.type];

  if (!icon) {
    return;
  }

  if (COLORS_MAP[props.color as keyof typeof COLORS_MAP]) {
    return icon.replaceAll(/fill='(.*?)'/g, `fill='${COLORS_MAP[props.color as keyof typeof COLORS_MAP]}'`);
  }

  return [...new Set(icon.match(/(fill='(.*?)')/g) || [])]
    .sort((a, b) => getColorLuma(b.slice(6, -1)) - getColorLuma(a.slice(6, -1)))
    .reduce((color: string, value: string, currentIndex: number, bulk) => {
      const step = bulk.length < 9 ? Math.ceil(9 / (9 - (bulk.length % 9))) : 1;
      const key = Math.max(+props.category - 100 * currentIndex * step, 100);

      return color.replaceAll(value.slice(6, -1), COLORS_MAP[`${props.color}-${key}`]);
    }, icon);
});

const bind = computed(() => ({
  ...(props.size ? { height: props.size, width: props.size } : {}),
}));
</script>

<style lang="scss" scoped>
.icon {
  position: relative;

  &-svg {
    &--loading {
    }

    &--clickable {
      cursor: pointer;
      opacity: 0.9;
      transition: opacity 0.5s;

      &:hover {
        opacity: 1;
      }
    }
  }

  &__count {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -0.25rem;
    @include inline-start(calc(-1rem / 2));
    background-color: var(--color-red-500);
    min-width: 1rem;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0.125rem;
    font-size: var(--font-size-10);
    color: var(--color-mono-100);
  }
}
</style>
