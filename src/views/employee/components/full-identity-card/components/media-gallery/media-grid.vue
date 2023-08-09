<template>
  <div ref="gridRef" class="media-grid">
    <template v-for="({ title, data }, index) in sections" :key="index">
      <template v-if="sections.length > 1">
        <p class="mx-4 media-grid__title vz-title-h3">{{ $t(`IDENTITY_CARD.ALBUM.ASSETS_TYPE.${title}`) }}</p>

        <vz-divider class="ms-2 me-6 mb-1" />
      </template>

      <div class="media-grid__section" :class="{ 'media-grid__section--selection_mode': isSelectionMode, [`media-grid__section--${title}`]: true }">
        <asset-card
          v-for="asset in data"
          :key="asset._id"
          class="media-gallery__card"
          :class="{
            'media-gallery__card--selected': (assetSelection || []).includes(asset.key),
            'media-gallery__card--edit': asset.key === activeKey,
          }"
          :asset="asset"
          :editable="editable && !activeKey && !assetSelection"
          :grid-width="gridWidth"
          @edit="$emit('edit', activeKey === asset.key ? null : asset.key)"
          v-on="!activeKey ? { click: !isSelectionMode ? () => $emit('open', asset) : () => $emit('select', asset) } : {}"
        >
          <div v-if="isSelectionMode" class="media-gallery__actions">
            <vz-checkbox :value="!!assetSelection?.includes(asset.key)" @update:model-value="$emit('select', asset)" />
          </div>
        </asset-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AssetCard from '@/views/employee/components/full-identity-card/components/media-gallery/media-gallery-asset-card.vue';
import { computed, PropType, ref } from 'vue';
import { Asset } from '@/constants/asset.enum';
import { GET_SELECTED_ALBUM } from '@/views/employee/store/constants';
import { useResizeObserver } from '@/shared/composables';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';

defineProps({
  editable: { type: Boolean, default: false },
  activeKey: { type: String, default: '' },
  isSelectionMode: { type: Boolean, default: false },
  assetSelection: { type: Array as PropType<Array<string> | null>, default: () => null },
});

defineEmits(['select', 'open', 'edit']);

const { useGetters } = useEmployeeStore();
const { [GET_SELECTED_ALBUM]: getSelectedAlbumGetter } = useGetters([GET_SELECTED_ALBUM]);

const gridRef = ref<Element | undefined>(undefined);

const { width: gridWidth } = useResizeObserver(gridRef);

const sections = computed(() => {
  const categories: Array<Array<keyof typeof Asset>> = [['PHOTO'], ['VIDEO', 'VIMEO', 'YOUTUBE']];

  return categories
    .map((types) => ({
      title: types[0],
      data: (getSelectedAlbumGetter.value?.assets || []).filter(({ type }) => types.includes(type)),
    }))
    .filter(({ data }) => !!data.length);
});
</script>

<style lang="scss">
.media-grid {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &__title {
    margin-top: 16px;
  }

  &__section {
    display: grid;
    justify-content: space-between;

    &--PHOTO {
      grid-template-columns: repeat(auto-fit, 1px);
      grid-template-rows: repeat(auto-fit, 1px);
      grid-auto-flow: dense;
    }

    &--VIDEO {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

      > * {
        max-width: 320px;
      }
    }

    &--selection_mode {
      .media-gallery__card {
        position: relative;

        &:not(&--selected) {
          img,
          iframe {
            opacity: 0.5;
          }
        }
      }
    }
  }
}
</style>
