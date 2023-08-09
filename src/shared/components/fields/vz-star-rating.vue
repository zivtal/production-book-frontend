<template>
  <div class="vz-star-rating" :style="fullWidthStyle">
    <div class="vz-star-rating__stars">
      <img v-for="index in total" :key="index" alt="" role="presentation" :src="emptyStar" :style="starWidthStyle" />
    </div>

    <div class="vz-star-rating__stars" :style="rateStyle">
      <img v-for="index in total" :key="index" alt="" role="presentation" :src="fullStar" :style="starWidthStyle" />
    </div>

    <div
      v-if="editable"
      class="vz-star-rating__stars clickable"
      role="button"
      :style="fullWidthStyle"
      @mousemove.stop="onMouseMove"
      @mouseleave.stop="tempRate = null"
      @click="$emit('input', tempRate)"
    />

    <p
      v-if="showLabel"
      class="vz-star-rating__label vz-font-size-10 vz-font-weight-600 ms-1"
      :style="{ paddingInlineStart: fullWidthStyle.minWidth }"
    >
      {{ currentRate.toFixed(1) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  editable: { type: Boolean, default: false },
  showLabel: { type: Boolean, default: false },
  value: { type: [String, Number], default: 0 },
  size: { type: [String, Number], default: 32 },
  step: { type: [String, Number], default: 0.5 },
  total: { type: [String, Number], default: 5 },
});

defineEmits(['input']);

const tempRate = ref<number | null>(null);
const currentRate = computed(() => tempRate.value || +props.value);

const fullStar = computed(() => require('@/assets/images/full-star.svg'));
const emptyStar = computed(() => require('@/assets/images/empty-star.svg'));

const rateStyle = computed(() => {
  const width = +props.total * +props.size;

  return { clipPath: `inset(0 ${width * ((+props.total - currentRate.value) / +props.total)}px 0 0)` };
});

const onMouseMove = (ev: MouseEvent): void => {
  const x = Math.min(Math.max(1, ev.offsetX), +props.size * +props.total);
  const width = +props.total * +props.size;

  tempRate.value = Math.round((+props.total / +props.step) * (x / width)) * +props.step;
};

const fullWidthStyle = computed(() => ({
  minWidth: +props.size * +props.total + 'px',
  height: props.size + 'px',
  lineHeight: props.size + 'px',
}));

const starWidthStyle = computed(() => ({ width: props.size + 'px', height: props.size + 'px' }));
</script>

<style lang="scss">
.vz-star-rating {
  user-select: none;
  position: relative;

  &__stars {
    top: 0;
    position: absolute;
  }

  &__label {
    padding-top: 1px;
  }
}
</style>
