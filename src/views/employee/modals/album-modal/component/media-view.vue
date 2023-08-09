<template>
  <div class="media-view">
    <div v-if="activeAsset.type === Asset.PHOTO" class="media-view-photo">
      <img ref="swipeElementRef" class="media-view-photo__image" :src="activeAsset.url" :alt="activeAsset.title" />

      <div ref="scrollerDivRef" class="media-view-photo__scroller">
        <img
          v-for="({ thumb, key }, index) in getSelectedAlbumGetter.assets"
          :key="index"
          :class="{ 'media-view-photo__scroller-active': assetIndex === index }"
          :data-id="key"
          :src="thumb"
          alt
          role="presentation"
          @click="onSelect"
        />
      </div>
    </div>

    <iframe
      v-else-if="activeAsset.type === Asset.YOUTUBE"
      class="youtubePlayer"
      width="100%"
      allowfullscreen="allowfullscreen"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      :title="t('COMPONENT_LABELS.FRAME', { value: `IDENTITY_CARD.ALBUM.ASSETS_TYPE.${activeAsset.type}` })"
      :src="`https://www.youtube.com/embed/${activeAsset.url}?rel=0&modestbranding=0&autohide=1&showinfo=0&loop=1`"
    ></iframe>

    <iframe
      v-else-if="activeAsset.type === Asset.VIMEO"
      allowfullscreen
      allow="autoplay; fullscreen"
      :src="`https://player.vimeo.com/video/${activeAsset.url}`"
      :title="t('COMPONENT_LABELS.FRAME', { value: `IDENTITY_CARD.ALBUM.ASSETS_TYPE.${activeAsset.type}` })"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { GET_SELECTED_ALBUM, SELECTED_ASSET, SET_SELECTED_ASSET } from '@/views/employee/store/constants';
import { computed, ref } from 'vue';
import { Asset } from '@/constants/asset.enum';
import { isRtl, useTranslator } from '@/plugins/i18n/helpers';
import { useSlider } from '@/views/employee/modals/album-modal/composables/use-slider';
import { useSwipe } from '@/views/employee/modals/album-modal/composables/use-swipe';

const t = useTranslator();

const { useState, useGetters, useMutations } = useEmployeeStore();

const { [SELECTED_ASSET]: selectedAssetState } = useState([SELECTED_ASSET]);
const { [GET_SELECTED_ALBUM]: getSelectedAlbumGetter } = useGetters([GET_SELECTED_ALBUM]);
const { [SET_SELECTED_ASSET]: setSelectedAssetMutation } = useMutations([SET_SELECTED_ASSET]);

const activeAsset = computed(() => getSelectedAlbumGetter.value?.assets?.find(({ url }: { url: string }) => url === selectedAssetState.value));

const {
  divRef: scrollerDivRef,
  index: assetIndex,
  select: onSelect,
  back: onBack,
  next: onNext,
} = useSlider({
  onSlideCallback: (key) => {
    const assetUrl = getSelectedAlbumGetter.value?.assets?.find((asset) => asset.key === key)?.url;

    if (!assetUrl) {
      return;
    }

    setSelectedAssetMutation(assetUrl);
  },
  activeIndex: computed(
    (): number => getSelectedAlbumGetter.value?.assets?.findIndex(({ url }: { url: string }) => url === selectedAssetState.value) || 0
  ),
});

const { elementRef: swipeElementRef } = useSwipe({ isRtl: ref(isRtl()), onBack, onNext });
</script>

<style lang="scss">
.media-view {
  position: relative;

  &-photo {
    $thumb-size: 64px;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    &__image {
      height: calc(100% - 6rem);
      width: 100%;
      object-fit: contain;
    }

    &__scroller {
      user-select: none;
      display: flex;
      overflow-y: auto;
      padding: 0 calc(50% - 64px / 2);
      width: 100%;
      scroll-behavior: smooth;

      > img {
        border-radius: var(--border-radius-2);
        padding: 0.25rem;
        margin: 0 0.125rem;
        height: 64px;
        width: 64px;
        aspect-ratio: 1;
        object-fit: cover;
        transition: 0.3s;
        object-position: 50% 10%;
      }

      &-active {
        transform: scale(1.25);
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  iframe {
    height: calc(100vh - var(--safe-area-top) + var(--safe-area-bottom));
    width: calc(100vw - var(--safe-area-x));
  }
}
</style>
