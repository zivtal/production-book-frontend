<template>
  <vz-card
    class="asset-card"
    :class="{
      'asset-card--editable': editable || isEditMode,
      'asset-card--edit': isEditMode,
      'asset-card--full': showMore,
      'asset-card--dynamic': !!assetStyle,
    }"
    :editable="editable"
    :callback="updateAssetRequest"
    :payload="payloadAsset"
    :style="assetStyle"
    @mouseleave="showMore = false"
    @edit="onEdit"
    @load="onLoad"
  >
    <template #static>
      <vz-image v-if="asset.type === Asset.PHOTO" role="presentation" :src="asset.thumb || asset.url" :alt="asset.title" />

      <iframe
        v-else-if="asset.type === Asset.YOUTUBE"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        :title="t('COMPONENT_LABELS.FRAME', { value: `IDENTITY_CARD.ALBUM.ASSETS_TYPE.${asset.type}` })"
        :src="`https://www.youtube.com/embed/${asset.url}?rel=0&modestbranding=0&autohide=1&showinfo=0`"
      />

      <iframe
        v-else-if="asset.type === Asset.VIMEO"
        allowfullscreen
        allow="autoplay; fullscreen"
        :title="t('COMPONENT_LABELS.FRAME', { value: `IDENTITY_CARD.ALBUM.ASSETS_TYPE.${asset.type}` })"
        :src="`https://player.vimeo.com/video/${asset.url}`"
      />
    </template>

    <template #view>
      <div @click.stop="showMore = !showMore">
        <p class="asset-card__title vz-font-size-14 vz-font-weight-600">{{ asset.title }}</p>

        <p
          ref="descriptionRef"
          class="asset-card__description vz-font-size-12"
          :class="{ 'asset-card__description--full': showMore || !descriptionHeight }"
          :style="descriptionHeight ? { height: showMore ? `${descriptionHeightRem}rem` : '2.4rem' } : {}"
        >
          {{ asset.description }}
        </p>
      </div>
    </template>

    <template #edit="{ errors }">
      <div class="mt-2">
        <vz-input
          v-model="payloadAsset.title"
          capitalized
          placeholder="IDENTITY_CARD.ALBUM.ASSET.TITLE"
          :rules="{ maxLength: [Length.TITLE] }"
          :error-message="errors?.title"
        />

        <vz-textarea
          v-model="payloadAsset.description"
          placeholder="IDENTITY_CARD.ALBUM.ASSET.DESCRIPTION"
          rows="4"
          :rules="{ maxLength: [Length.DESCRIPTION] }"
          :error-message="errors?.description"
        />
      </div>
    </template>
  </vz-card>
</template>

<script setup lang="ts">
import type { AlbumAsset, UpdateAssetReq } from '@/views/employee/models';
import { computed, nextTick, type PropType, ref } from 'vue';
import { Asset } from '@/constants/asset.enum';
import { Length } from '@/shared/constants/length';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { UPDATE_ASSET } from '@/views/employee/store/constants';
import { useResizeObserver } from '@/shared/composables';
import { convertPixelToRem, scrollToView } from '@/shared/helpers';
import { useTranslator } from '@/plugins/i18n/helpers';

const ASSET_WIDTH = 200;
const MAX_IN_LINE = 3;

const t = useTranslator();

const props = defineProps({
  gridWidth: { type: Number, default: 0 },
  asset: { type: Object as PropType<AlbumAsset>, required: true },
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(['edit']);

const cardWidth = computed((): number => Math.floor(props.gridWidth / Math.min(Math.round(window.innerWidth / ASSET_WIDTH), MAX_IN_LINE) - 8));

const { useActions: useEmployeeActions } = useEmployeeStore();
const { [UPDATE_ASSET]: updateAssetAction } = useEmployeeActions([UPDATE_ASSET]);

const updateAssetRequest = updateAssetAction as (payload: UpdateAssetReq) => Promise<void>;

const assetRatio = ref<number>(1);
const descriptionRef = ref<Element | undefined>(undefined);
const payloadAsset = ref<Omit<UpdateAssetReq, 'albumId'>>({ key: props.asset?.key });
const showMore = ref<boolean>(false);
const isEditMode = ref<boolean>(false);

const { height: descriptionHeight } = useResizeObserver(descriptionRef, true);
const descriptionHeightRem = computed(() => convertPixelToRem(descriptionHeight.value));

const onEdit = (isEdit: boolean): void => {
  payloadAsset.value = { ...payloadAsset.value, title: props.asset?.title, description: props.asset?.description };
  isEditMode.value = isEdit;
  emit('edit', isEditMode.value);

  nextTick(() => scrollToView('.asset-card--edit'));
};

const onLoad = ({ ratio }: { ratio: number }): void => {
  assetRatio.value = ratio;
};

const assetStyle = computed(() => {
  if (props.asset?.type !== Asset.PHOTO) {
    return;
  }

  return {
    gridColumn: `span ${cardWidth.value}`,
    gridRow: `span ${Math.floor(cardWidth.value / assetRatio.value)}`,
  };
});
</script>

<style lang="scss">
.asset-card {
  user-select: none;
  position: relative;
  cursor: pointer;
  margin: 4px;

  &--dynamic {
    grid-column: span 400;
    grid-row: span 300;
  }

  &:not(&--editable) {
    padding: 0 !important;
    box-shadow: initial !important;
    background-color: transparent !important;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 50% 10%;
  }

  img,
  iframe {
    width: 100%;
    border: 0;
    border-radius: var(--border-radius-1);
    transition: opacity 0.3s;
    background-color: var(--color-mono-900);
  }

  &__title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &__description {
    word-break: break-word;
    transition: height 0.5s;

    &:not(&--full) {
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &--full {
      white-space: pre-wrap;
    }
  }
}
</style>
