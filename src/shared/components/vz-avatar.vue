<template>
  <div class="vz-avatar">
    <div class="vz-avatar__image-container" :style="{ width: size + 'px', height: size + 'px' }">
      <image-cropper
        v-if="isEditMode"
        auto-zoom
        class="fill-width"
        export-type="base64"
        ratio="1"
        size="256"
        quality="0.7"
        :src="src"
        :default-src="defaultSrc"
        :preview-height="size"
        :preview-width="size"
        :stencil-height="+size"
        :stencil-width="+size"
        v-bind="$attrs"
        @save="onSave"
        @cancel="isEditMode = false"
      ></image-cropper>

      <div v-else-if="isLoading" class="vz-avatar__loading">
        <img class="vz-avatar__image" role="presentation" :src="imgSrc" :style="avatarStyle" alt="" />

        <span :style="spinnerStyle" />
      </div>

      <template v-else>
        <img
          class="vz-avatar__image"
          role="presentation"
          :src="imgSrc"
          :style="{ ...avatarStyle, display: isLoading ? 'none' : 'initial' }"
          :alt="title || $t('GENERAL.AVATAR')"
          :title="title"
          v-bind="{ ...(clickable ? { role: 'button' } : {}) }"
          @error="errorLoading = true"
          @load="localLoading = false"
        />

        <vz-icon
          v-if="editable"
          clickable
          class="vz-avatar__editable"
          name="svg:edit"
          color="mono"
          category="200"
          role="button"
          :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'GENERAL.EDIT' })"
          :style="{ width: size / 4 + 'px', height: size / 4 + 'px', bottom: size / 8 + 'px' }"
          v-on="{ click: externalEditor ? $emit('edit') : () => (isEditMode = true) }"
        />

        <vz-icon v-else-if="verified && !isLoading" name="svg:verified" class="vz-avatar__verified" :size="size / 4" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import ImageCropper from '@/shared/components/vz-image-cropper.vue';
import { useTranslator } from '@/plugins/i18n/helpers';

const t = useTranslator();

const props = defineProps({
  externalEditor: { type: Boolean, default: false },
  src: { type: String as PropType<string | undefined | null>, default: undefined },
  size: { type: [String, Number], default: 32 },
  verified: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  title: { type: String, default: '' },
});

const emit = defineEmits(['update', 'edit']);

const errorLoading = ref<boolean>(false);
const localLoading = ref<boolean>(false);
const isEditMode = ref<boolean>(false);

const imgSrc = computed(() => (!errorLoading.value && props.src) || defaultSrc.value);
const defaultSrc = computed(() => require('@/assets/images/avatar.svg'));

const avatarStyle = computed(() => ({
  width: +props.size - 1 + 'px',
  height: +props.size - 1 + 'px',
  borderWidth: Math.ceil((+props.size / 32) * 1.1) + 'px',
}));
const spinnerStyle = computed(() => ({ height: props.size + 'px', width: props.size + 'px', borderWidth: Math.ceil(+props.size / 24) + 'px' }));
const isLoading = computed(() => props.loading || localLoading.value);

const onSave = ({ data }: { data: string | null }) => {
  emit('update', data || null);
  isEditMode.value = false;
};
</script>

<style lang="scss">
.vz-avatar {
  position: relative;
  border-radius: 50%;

  &__image {
    position: relative;
    object-fit: cover;
    border-radius: 50%;
    border-style: solid;
    border-color: var(--color-background-2);
    background-color: var(--color-primary-900);
  }

  &__loading {
    position: relative;

    span {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      animation: rotation 1s linear infinite;
      border-style: solid;
      border-bottom-color: var(--color-primary-700);
      z-index: 10;
      height: 100%;
      width: 100%;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  &__editable,
  &__verified {
    position: absolute;
    bottom: 4px;
    right: 0;
    z-index: 1;
  }

  &__editable {
    padding: 8px;
    border-radius: 36%;
    background-color: var(--color-primary-900);
    opacity: 0 !important;
    transition: opacity 0.3s;
  }

  &__image-container {
    position: relative;

    &:hover {
      .vz-avatar__editable {
        opacity: initial !important;
      }
    }
  }

  .vz-image-cropper__preview {
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
