<template>
  <img
    ref="imgRef"
    :class="{ skeleton: isLoading }"
    :alt="alt"
    :src="src || defaultSrc"
    :style="{ aspectRatio }"
    v-bind="$attrs"
    @error="onError"
    @load="onLoaded"
    @loadstart="isLoading = true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  alt: { type: String, default: '' },
  src: { type: String, default: '' },
  defaultSrc: { type: String, default: () => require('@/assets/images/loader/image.svg') },
  aspectRatio: { type: Number, default: 0 },
});
const emit = defineEmits(['error', 'load']);

const isLoading = ref<boolean>(true);
const isFailed = ref<boolean>(false);
const imgSrc = ref<string | undefined>(props.src || props.defaultSrc);
const imgRef = ref<Element | undefined>(undefined);

const onError = (event: Event) => {
  if (!isLoading.value) {
    return;
  }

  (event.target as HTMLImageElement).onerror = null;
  isFailed.value = true;
  isLoading.value = false;
  imgSrc.value = props.defaultSrc;
  emit('error');
};

const onLoaded = async (): Promise<void> => {
  isLoading.value = false;
  emit('load');
};
</script>
