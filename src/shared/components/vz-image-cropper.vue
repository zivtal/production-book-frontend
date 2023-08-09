<template>
  <div ref="containerRef" class="vz-image-cropper flex flex-column justify-end" :style="containerSize">
    <cropper
      v-if="imgSrc"
      ref="cropperRef"
      class="vz-image-cropper__preview"
      debounce
      :style="previewSize"
      :auto-zoom="autoZoom"
      :src="imgSrc"
      :stencil-props="getStencilProps"
      :resize-image="{ adjustStencil: stencilResizable }"
      :stencil-size="getStencilSize"
      :transition-time="50"
      :default-size="defaultSize"
      @change="onChange"
    />

    <div v-else class="vz-image-cropper__preview vz-image-cropper__preview--default" :style="previewSize">
      <slot name="default" />
    </div>

    <div class="vz-image-cropper__actions" :class="{ 'vz-image-cropper__actions--auto-save': autoSave }">
      <vz-button v-if="imgSrc" class="me-1" height="32" icon-name="svg:trash" @click="imgSrc = null" />

      <vz-button v-else class="me-1" icon-name="svg:add" height="32" @click="onUpload" />

      <template v-if="!autoSave">
        <vz-button class="me-1" text="GENERAL.SAVE" height="32" @click="onSave" />

        <vz-button class="me-1" text="GENERAL.CANCEL" height="32" @click="$emit('cancel')" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageDimensions } from '@/shared/types';
import { CanvasQuality, IMAGE_TYPE } from '@/shared/services/image-service/models/image-resize';
import { computed, onMounted, PropType, ref, watch } from 'vue';
import 'vue-advanced-cropper/dist/style.css';
import ImageService from '@/shared/services/image-service/image.service';
import { Cropper, Coordinates } from 'vue-advanced-cropper';
import FileService from '@/shared/services/file.service';
import { debounce } from 'lodash';

const props = defineProps({
  src: { type: String as PropType<string | null | undefined>, default: undefined },
  defaultSrc: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  file: { type: File, default: null },
  fileName: { type: String, default: '' },
  size: { type: Number, default: 0 },
  thumbnailSize: { type: Number, default: 0 },
  quality: { type: Number as PropType<CanvasQuality>, default: 0.9 },
  ratio: { type: Number, default: 0 },
  autoZoom: { type: Boolean, default: false },
  autoSave: { type: Boolean, default: false },
  disableAutoUpload: { type: Boolean, default: false },
  previewWidth: { type: [String, Number], default: 0 },
  previewHeight: { type: [String, Number], default: 0 },
  stencilWidth: { type: Number, default: 0 },
  stencilHeight: { type: Number, default: 0 },
  stencilMovable: { type: Boolean, default: false },
  stencilResizable: { type: Boolean, default: false },
  exportType: { type: String as PropType<'file' | 'base64'>, default: 'base64' },
  width: { type: [String, Number], default: 0 },
  height: { type: [String, Number], default: 0 },
});

const emit = defineEmits(['save', 'cancel']);

const imgSrc = ref<string | null>(null);
const cropperRef = ref();
const containerRef = ref<HTMLDivElement>();
const cropperCanvas = ref<HTMLCanvasElement>();
const cropperCoordinates = ref<Coordinates>();
const isProcess = ref<boolean>(true);
const defaultSize = ref<ImageDimensions | null>(null);

const containerWidth = computed(() => containerRef.value?.clientWidth);

const containerSize = computed(() => ({
  ...(props.width ? { width: props.width + 'px' } : {}),
  ...(props.height ? { height: props.height + 'px' } : {}),
}));

const previewSize = computed(() => {
  if (props.previewWidth || props.previewHeight) {
    return {
      ...(props.previewWidth ? { width: props.previewWidth || +props.previewHeight * (props.ratio || 1) + 'px' } : {}),
      ...(props.previewHeight ? { height: (props.previewHeight || +props.previewWidth / (props.ratio || 1)) + 'px' } : {}),
    };
  }

  if (!containerWidth.value) {
    return props.ratio ? { width: '100%', height: 100 / (props.ratio || 1) + '%' } : {};
  }

  return props.ratio ? { width: containerWidth.value + 'px', height: containerWidth.value / (props.ratio || 1) + 'px' } : {};
});

const onUpload = async (): Promise<void> => {
  const files = await FileService.uploadFile({ accept: IMAGE_TYPE });

  imgSrc.value = files?.length ? (await ImageService.loadImageFile(files[0])).src || null : null;
};

const onChange = ({ canvas, coordinates }: { canvas: HTMLCanvasElement; coordinates: Coordinates }): void => {
  cropperCoordinates.value = coordinates;
  cropperCanvas.value = canvas;

  if (props.autoSave) {
    debounce(onSave, 500)();
  }
};

const onSave = async (): Promise<void> => {
  if (!cropperCanvas.value || !imgSrc.value) {
    emit('save', { data: null, thumb: null, name: null });

    return;
  }

  isProcess.value = true;

  const canvas = ImageService.canvasResize(cropperCanvas.value, { size: props.size });
  const name = props.fileName || props.file?.name || 'image.jpg';
  const type = props.file?.type || 'image/jpeg';
  const lastModified = props.file?.lastModified || 0;
  const quality = props.quality;

  const data =
    props.exportType === 'file'
      ? await ImageService.canvasToFile(canvas, { name, type, lastModified, quality })
      : ImageService.canvasToBase64(canvas, { quality, type });

  const res = {
    thumb: await (async (): Promise<File | string | undefined> => {
      if (!props.thumbnailSize) {
        return undefined;
      }

      const thumbCanvas = ImageService.canvasResize(canvas, { size: props.thumbnailSize });

      return props.exportType === 'file'
        ? await ImageService.canvasToFile(thumbCanvas, { name, type, lastModified, quality })
        : ImageService.canvasToBase64(thumbCanvas, { quality, type });
    })(),
  };

  emit('save', { data, name, ...res });

  isProcess.value = false;
};

const getStencilProps = computed(() => ({
  handlers: props.stencilResizable ? undefined : {},
  aspectRatio: props.ratio,
  resizable: props.stencilResizable,
  movable: props.stencilMovable,
}));

const getStencilSize = computed((): { width?: number; height?: number } | null => {
  if (!props.stencilWidth && !props.stencilHeight) {
    return null;
  }

  return {
    width: props.stencilWidth,
    height: props.stencilHeight,
  };
});

watch(
  () => props.src,
  async () => {
    if (!props.autoSave) {
      imgSrc.value = props.src || null;
    }
  },
  { immediate: true }
);

watch(
  () => [cropperRef.value, imgSrc.value],
  async (): Promise<void> => {
    if (!imgSrc.value || props.stencilWidth || props.stencilHeight) {
      return;
    }

    defaultSize.value = await ImageService.imageDimensions(imgSrc.value);
  }
);

onMounted(async () => {
  imgSrc.value = props.src || null;

  if (!props.src && !props.disableAutoUpload) {
    await onUpload();
  }
});
</script>

<style lang="scss">
.vz-image-cropper {
  position: relative;

  &__preview {
    background-color: var(--color-background-2);

    .vue-advanced-cropper__background,
    .vue-advanced-cropper__foreground {
      background-color: var(--color-background-2) !important;
    }

    &--default {
      background-color: var(--color-mono-400);
      overflow: hidden;
    }
  }

  &__actions {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    background-color: var(--color-background-1);
    border: 1px solid var(--color-mono-500);
    border-radius: var(--border-radius-1);
    width: fit-content;
    transform: translate(-50%, calc(100% + 0.5rem));

    > * {
      padding-inline-end: 0.25rem;
    }

    &--auto-save {
      position: absolute;
      margin: 6px;
    }
  }
}
</style>
