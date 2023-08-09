<template>
  <div
    class="media-gallery"
    :class="{
      'media-gallery--loading': isLoading,
      'media-gallery--hidden': hidden,
      'media-gallery--warning': showRemoveWarning,
      'media-gallery--add-assets': isAddAssetsMode,
      'media-gallery--uploading': uploadLoading,
    }"
  >
    <vz-spinner v-if="isLoading" />

    <template v-else>
      <media-gallery-header
        v-if="!showRemoveWarning && !isAddAssetsMode"
        always-shown
        :editable="isEditable"
        @selection="onSelectionMode"
        @add="isAddAssetsMode = !isAddAssetsMode"
        @remove="showRemoveWarning = true"
        @upload="onUploadAssets"
      />

      <div v-else-if="showRemoveWarning" class="flex flex-column justify-space-between align-center fill-height">
        <div class="flex justify-center align-center">
          <vz-icon class="me-2" name="svg:warning" color="error" category="600" size="24" />
          <p class="vz-font-size-18">{{ $t('IDENTITY_CARD.ALBUM.DELETE_ALBUM_CONFIRM') }}</p>
        </div>

        <div class="mt-10">
          <vz-button
            :disabled="removeAlbumRequest.loading.value"
            icon-name="svg:close"
            text="GENERAL.CANCEL"
            class="ms-2 height-30"
            @click="showRemoveWarning = false"
          />

          <vz-button
            :disabled="removeAlbumRequest.loading.value"
            :loading="removeAlbumRequest.loading.value"
            icon-name="svg:trash"
            text="GENERAL.REMOVE"
            background-color="red-700"
            class="ms-2 height-30"
            @click="onRemoveAlbum"
          />
        </div>
      </div>

      <div v-if="!!assetSelection" class="flex justify-end my-2">
        <vz-button
          :disabled="removeAlbumAssetsRequest.loading.value"
          icon-name="svg:close"
          text="GENERAL.CANCEL"
          class="ms-2 height-30"
          @click="assetSelection = null"
        />

        <vz-button
          :disabled="removeAlbumAssetsRequest.loading.value"
          :loading="removeAlbumAssetsRequest.loading.value"
          icon-name="svg:trash"
          text="GENERAL.REMOVE"
          background-color="red-700"
          class="ms-2 height-30"
          @click="onRemoveAssets"
        />
      </div>

      <div v-if="uploadLoading" class="flex flex-column flex-grow-1 mt-10">
        <div v-if="uploadEstimateTimeLeft" class="flex justify-space-between">
          <p>{{ uploadFile }}</p>
          <p>({{ uploadRemaining }} / {{ uploadTotal }})</p>
          <p>{{ uploadEstimateTimeLeft }}</p>
        </div>

        <progress-bar class="mt-6" :percent="uploadPercent" />

        <div class="flex justify-end align-end flex-grow-1">
          <vz-button icon-name="svg:close" text="GENERAL.CANCEL" class="ms-2 mt-4 height-30" @click="onCancelUploading" />
        </div>
      </div>

      <template v-if="!uploadLoading && !showRemoveWarning">
        <add-custom-assets v-if="isAddAssetsMode" class="media-gallery__assets" @close="isAddAssetsMode = false" />

        <media-grid
          v-else
          :editable="editable"
          :active-key="activeKey"
          :is-selection-mode="isSelectionMode"
          :asset-selection="assetSelection"
          @edit="activeKey === $event"
          @select="onSelection"
          @open="onOpenAsset"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BaseId } from '@/shared/models';
import type { AlbumAsset, EmployeeRemoveAssets } from '@/views/employee/models';
import { GET_ALBUM, GET_SELECTED_ALBUM, REMOVE_ALBUM, REMOVE_ALBUM_ASSETS, SET_SELECTED_ASSET } from '@/views/employee/store/constants';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { Asset } from '@/constants/asset.enum';
import { photoAlbumUploadHandler } from '@/views/employee/helpers/photo-album-upload.handler';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { usePromise } from '@/shared/composables';
import { useI18n } from 'vue-i18n';
import FileService from '@/shared/services/file.service';

const MediaGalleryHeader = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "media-gallery" */ '@/views/employee/components/full-identity-card/components/media-gallery/media-gallery-header.vue')
);

const AddCustomAssets = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "media-gallery" */
      '@/views/employee/components/full-identity-card/components/media-gallery/media-gallery-add-custom-assets.vue'
    )
);

const ProgressBar = defineAsyncComponent(() => import(/* webpackChunkName: "media-gallery" */ '@/shared/components/vz-progress-bar.vue'));

const MediaGrid = defineAsyncComponent(
  () => import(/* webpackChunkName: "media-gallery" */ '@/views/employee/components/full-identity-card/components/media-gallery/media-grid.vue')
);

const props = defineProps({ editable: { type: Boolean, default: false }, hidden: { type: Boolean, default: false } });

const { useGetters, useMutations, useActions } = useEmployeeStore();
const { [GET_SELECTED_ALBUM]: getSelectedAlbumGetter } = useGetters([GET_SELECTED_ALBUM]);
const { [SET_SELECTED_ASSET]: setSelectedAssetMutation } = useMutations([SET_SELECTED_ASSET]);
const {
  [REMOVE_ALBUM_ASSETS]: removeAlbumAssetsAction,
  [REMOVE_ALBUM]: removeAlbumAction,
  [GET_ALBUM]: getAlbumAction,
} = useActions([REMOVE_ALBUM_ASSETS, REMOVE_ALBUM, GET_ALBUM]);

const removeAlbumAssetsRequest = usePromise(removeAlbumAssetsAction as (payload: EmployeeRemoveAssets) => Promise<void>);
const removeAlbumRequest = usePromise(removeAlbumAction as (albumId?: BaseId) => Promise<void>);

const { t } = useI18n();

const {
  total: uploadTotal,
  remaining: uploadRemaining,
  filename: uploadFile,
  estimate: uploadEstimate,
  percent: uploadPercent,
  loading: uploadLoading,
  reset: onCancelUploading,
  upload: onPhotoUpload,
} = photoAlbumUploadHandler(3, 3, { successCallback: getAlbumAction });

const showRemoveWarning = ref<boolean>(false);
const assetLoadingId = ref<string | null>(null);
const assetSelection = ref<Array<string> | null>(null);
const isAddAssetsMode = ref<boolean>(false);
const activeKey = ref<string>('');

const isSelectionMode = computed((): boolean => !!assetSelection.value);
const isLoading = computed((): boolean => removeAlbumAssetsRequest.loading.value || uploadLoading.value || removeAlbumRequest.loading.value);
const isEditable = computed((): boolean => props.editable && !assetSelection.value && !isAddAssetsMode.value && !isLoading.value);
const assets = computed(() => getSelectedAlbumGetter.value?.assets || []);
const uploadEstimateTimeLeft = computed(() => {
  const unit = ['GENERAL.SECONDS', 'GENERAL.MINUTES', 'GENERAL.HOURS'];

  return uploadEstimate.value?.filter((value) => !!value).length
    ? t('GENERAL.ESTIMATED_TIME') +
        ' ' +
        uploadEstimate.value
          ?.map((value, index) => (value ? `${value} ${t(unit[index])}` : null))
          .filter((value) => !!value)
          .reverse()
          .join(' ')
          .toLowerCase()
    : null;
});

const onOpenAsset = (asset: AlbumAsset): void => {
  if (asset.type !== Asset.PHOTO) {
    return;
  }

  assetLoadingId.value = asset.url;
  setSelectedAssetMutation(asset.url);
};

const onSelection = ({ key }: AlbumAsset): void => {
  if (!assetSelection.value) {
    return;
  }

  if (assetSelection.value.includes(key)) {
    assetSelection.value.filter((value) => value !== key);
  } else {
    assetSelection.value.push(key);
  }
};

const onRemoveAlbum = async (): Promise<void> => {
  await removeAlbumRequest.call();
};

const onUploadAssets = async (): Promise<void> => {
  const files = await FileService.uploadFile({ multiple: true, accept: ['image/*'] });

  await onPhotoUpload(
    [...(files || [])].filter(({ name, size }) => !assets.value.find(({ fileName, fileSize }) => fileName === name && fileSize === size))
  );
};

const onRemoveAssets = async (): Promise<void> => {
  const assetsPayload = assetSelection.value?.map((selected) => ({
    key: selected,
    type: assets.value.find(({ key }) => key === selected)?.type,
  })) as EmployeeRemoveAssets['assets'];

  if (!assetsPayload) {
    return;
  }

  await removeAlbumAssetsRequest.call({ assets: assetsPayload });
  assetSelection.value = null;
};

const onSelectionMode = (): void => {
  assetSelection.value = assetSelection.value ? null : [];

  if (assetSelection.value) {
    activeKey.value = '';
  }
};

watch(
  () => [getSelectedAlbumGetter.value, props.hidden],
  () => (assetLoadingId.value = null)
);
</script>

<style lang="scss">
.media-gallery {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-2);

  @include min-tablet-layout {
    padding: 2rem;
    max-width: calc(100vw - var(--safe-area-x));
    max-height: calc(100vh - var(--safe-area-top) + var(--safe-area-bottom));
  }

  @include max-tablet-layout {
    padding: 4rem 0.5rem 1rem 1rem;
    height: 100vh;
    width: 100vw;
  }

  &:not(&--warning):not(&--uploading) {
    max-width: var(--large-modal-width);
  }

  &--add-assets,
  &--uploading,
  &--warning {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 200px;
    background-color: var(--color-background-1) !important;

    @include min-tablet-layout {
      padding: 32px;
    }
  }

  &--uploading {
    width: 100%;
  }

  &--hidden {
    display: none !important;
  }

  &__assets {
    overflow-y: auto;
    overflow-x: hidden;
    flex-grow: 1;
  }

  &__card {
    &--edit {
      grid-row: span 2;
    }
  }

  &__actions {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: flex-end;
    z-index: 1;
    width: 100%;
    padding: 16px;
  }
}
</style>
