<template>
  <vz-overlay
    :class="getSelectedAssetGetter ? 'media-view-modal' : 'album-modal'"
    manual-close
    blur="5"
    size="large"
    name="album-modal"
    close-button-color="primary-900"
    :open-event="openEvent"
    :close-event="closeEvent"
    :close-callback="onCloseCallback"
    :open-callback="onOpenCallback"
    @close="onClose"
  >
    <template v-if="getSelectedAlbumGetter" #default>
      <media-view v-if="selectedAssetState" />

      <media-gallery v-else class="album-modal__content" :editable="editable" :hidden="!!selectedAssetState" />
    </template>
  </vz-overlay>
</template>

<script setup lang="ts">
import type { AlbumAsset } from '@/views/employee/models';
import { GET_SELECTED_ALBUM, GET_SELECTED_ASSET, SELECTED_ASSET, SET_EMPLOYEE_ALBUM, SET_SELECTED_ASSET } from '@/views/employee/store/constants';
import { CLOSE_EMPLOYEE_ALBUM_MODAL, OPEN_EMPLOYEE_ALBUM_MODAL } from '@/views/employee/constants/employee-events';
import { computed, defineAsyncComponent, onUnmounted, watch } from 'vue';
import { emitter } from '@/main';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { OPEN_EMPLOYEE_VIEW_MODAL } from '@/views/lobby/constants/lobby-events';

const MediaView = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile-album" */ '@/views/employee/modals/album-modal/component/media-view.vue')
);

const MediaGallery = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile-album" */ '@/views/employee/components/full-identity-card/components/media-gallery/media-gallery.vue')
);

defineProps({ editable: { type: Boolean, default: false } });

const { useState, useGetters, useMutations } = useEmployeeStore();
const { [SELECTED_ASSET]: selectedAssetState } = useState([SELECTED_ASSET]);

const { [GET_SELECTED_ALBUM]: getSelectedAlbumGetter, [GET_SELECTED_ASSET]: getSelectedAssetGetter } = useGetters([
  GET_SELECTED_ALBUM,
  GET_SELECTED_ASSET,
]);

const { [SET_SELECTED_ASSET]: setSelectedAssetMutation, [SET_EMPLOYEE_ALBUM]: clearEmployeeAlbum } = useMutations([
  SET_SELECTED_ASSET,
  SET_EMPLOYEE_ALBUM,
]);

const openEvent = OPEN_EMPLOYEE_ALBUM_MODAL;
const closeEvent = CLOSE_EMPLOYEE_ALBUM_MODAL;

const onCloseCallback = (): void => {
  setSelectedAssetMutation();
  clearEmployeeAlbum();
};

const onOpenCallback = (): void => {
  emitter.emit(OPEN_EMPLOYEE_VIEW_MODAL);
};

const onClose = (): void => {
  if (getSelectedAssetGetter.value) {
    setSelectedAssetMutation();
  } else {
    emitter.emit(closeEvent);
  }
};

const goTo = (value: string): void => {
  if (!value) {
    return;
  }

  setSelectedAssetMutation(value);
};

const onAssetKeydown = (ev: KeyboardEvent) => {
  switch (ev.key) {
    case 'ArrowRight': {
      if (!previousAsset.value) {
        return;
      }

      goTo(previousAsset.value);
      break;
    }
    case 'ArrowLeft': {
      if (!nextAsset.value) {
        return;
      }

      goTo(nextAsset.value);
      break;
    }
  }
};

watch(
  () => selectedAssetState.value,
  () => {
    if (!selectedAssetState.value) {
      window.removeEventListener('keydown', onAssetKeydown);
    } else {
      window.addEventListener('keydown', onAssetKeydown);
    }
  }
);

onUnmounted(() => window.removeEventListener('keydown', onAssetKeydown));

const assetIndex = computed(() => getSelectedAlbumGetter.value?.assets.findIndex(({ url }: AlbumAsset) => url === selectedAssetState.value));
const nextAsset = computed(() => getSelectedAlbumGetter.value?.assets[(assetIndex.value || 0) + 1]?.url);
const previousAsset = computed(() => getSelectedAlbumGetter.value?.assets[(assetIndex.value || 0) - 1]?.url);
</script>

<style lang="scss">
.album-modal {
  &__content {
    background-color: var(--color-background-1);

    @include mobile-layout {
      height: 100vh;
      width: 100vw;
    }

    @include min-mobile-layout {
      height: 90vh;
      max-width: 90vw;
    }
  }
}

.media-view-modal {
  &__content {
    position: relative;
    height: 100vh;
    width: 100vw;
  }

  .vz-overlay {
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden;

    &-modal {
      background-color: var(--color-background-1);
      width: 100vw !important;
      height: 100vh !important;
      padding: 0 !important;
      overflow: hidden;

      &__content {
        width: 100%;
        min-height: 100%;
        overflow: hidden;

        > * {
          height: 100%;
        }
      }
    }
  }
}
</style>
