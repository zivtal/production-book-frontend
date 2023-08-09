<template>
  <div
    class="vz-progress-bar"
    :style="{
      background: `linear-gradient(90deg, ${color} 0%, ${color} ${percent}%, ${backgroundColor} ${percent}%)`,
      height: height + 'px',
    }"
  >
    <span>{{ percent }}%</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  height: { type: [Number, String], default: 24 },
  percent: { type: Number, required: true },
  color: { type: String, default: 'var(--color-primary-900)' },
  backgroundColor: { type: String, default: 'var(--color-mono-600)' },
});
</script>

<style lang="scss">
.vz-progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-radius-1);
  width: 100%;

  > span {
    color: var(--color-mono-300);
  }
}
</style>
