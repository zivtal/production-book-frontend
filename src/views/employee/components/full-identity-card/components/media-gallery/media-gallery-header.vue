<template>
  <div class="media-grid-header">
    <create-edit-album v-if="editAlbumPayload" class="mb-4" :album="editAlbumPayload" @close="editAlbumPayload = null" />

    <div v-else class="flex flex-column">
      <div class="flex justify-space-between">
        <p class="media-grid-header__title">
          <span>{{ album.name }}</span>

          <span>({{ albumAssets.length }})</span>
        </p>
      </div>

      <div
        class="media-grid-header__description"
        :class="{ 'media-grid-header__description--full': fullDescription }"
        @click.stop="fullDescription = !fullDescription"
      >
        {{ album.description }}
      </div>
    </div>

    <div v-if="isActionVisible" class="media-grid-header__toolbar" :class="{ 'media-grid-header__toolbar--always-shown': alwaysShown }">
      <vz-button minimizable :disabled="disabled" icon-name="svg:edit" class="ms-2" text="GENERAL.EDIT" @click="onAlbumEdit" />

      <!--      TODO: Temporary removed popover -->
      <!--      <vz-popover-menu :items="addMenuItems">-->
      <!--        <template #activator>-->
      <!--          <vz-button  icon-name="svg:create" class="ms-2" text="GENERAL.ADD" />-->
      <!--        </template>-->
      <!--      </vz-popover-menu>-->

      <vz-button minimizable :disabled="disabled" icon-name="svg:photo" class="ms-2" text="IDENTITY_CARD.ALBUM.ADD_PHOTO" @click="$emit('upload')" />

      <vz-button minimizable :disabled="disabled" icon-name="svg:video" class="ms-2" text="IDENTITY_CARD.ALBUM.ADD_VIDEO" @click="$emit('add')" />

      <vz-button minimizable :disabled="disabled" icon-name="svg:select" class="ms-2" text="GENERAL.SELECT" @click="$emit('selection')" />

      <vz-button
        minimizable
        :disabled="disabled"
        :loading="loading"
        icon-name="svg:trash"
        class="ms-2"
        text="IDENTITY_CARD.ALBUM.REMOVE"
        @click="$emit('remove')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateAlbumReq } from '@/views/employee/models';
import { computed, ref } from 'vue';
import { GET_SELECTED_ALBUM } from '@/views/employee/store/constants';
import CreateEditAlbum from '@/views/employee/components/full-identity-card/components/media-gallery/media-gallery-create-edit-album.vue';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';

const props = defineProps({
  disabled: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  alwaysShown: { type: Boolean, default: false },
  isSelectionMode: { type: Boolean, default: false },
});

defineEmits(['selection', 'remove', 'add', 'upload']);

const { useGetters } = useEmployeeStore();
const { [GET_SELECTED_ALBUM]: getSelectedAlbumGetter } = useGetters([GET_SELECTED_ALBUM]);

const editAlbumPayload = ref<UpdateAlbumReq | null>(null);

const album = computed(() => getSelectedAlbumGetter.value);
const albumAssets = computed(() => getSelectedAlbumGetter.value?.assets || []);
const isActionVisible = computed((): boolean => props.editable && !editAlbumPayload.value && !props.loading);
const fullDescription = ref<boolean>(false);

// TODO: Temporary removed popover
// const addMenuItems = computed(
//   (): Array<MenuItem> => [
//     { icon: 'photo', text: 'IDENTITY_CARD.ALBUM.PHOTO', click: () => emit('upload') },
//     { icon: 'video', text: 'IDENTITY_CARD.ALBUM.VIDEO', click: () => emit('add', []) },
//   ]
// );

const onAlbumEdit = () => {
  editAlbumPayload.value = album.value
    ? { name: album.value.name, description: album.value.description, albumId: album.value._id, cover: album.value.cover || '' }
    : null;
};
</script>

<style lang="scss" scoped>
.media-grid-header {
  &__title {
    display: flex;
    align-items: flex-end;

    > * {
      padding-inline-end: 4px;
    }

    > :first-child {
      @include mobile-layout {
        font-size: var(--font-size-16);
      }

      @include min-mobile-layout {
        font-size: var(--font-size-22);
      }

      font-weight: 700;
      color: var(--color-primary-900);
    }

    > :last-child {
      font-size: var(--font-size-12);
      font-weight: var(--font-weight-medium);
      margin-bottom: 4px;
    }
  }

  &__description {
    margin-inline-end: 24px;

    @include mobile-layout {
      font-size: var(--font-size-12);

      &:not(&--full) {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    @include min-mobile-layout {
      font-size: var(--font-size-16);
    }
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin: 8px 24px 8px 0;
    transition: opacity 0.3s, height 0.3s;

    &:not(&--selection):not(&--always-shown) {
      opacity: 0;
      height: 0;
    }

    > * {
      flex: 1 0 0;
      max-width: 8rem;
    }
  }

  &__edit-button {
    margin-inline-end: 24px;
    opacity: 0;
    transition: 0.3s;
  }

  &:hover {
    .media-grid-header__toolbar {
      &:not(&--selection) {
        opacity: 1;
        height: 28px;
      }
    }

    .media-grid-header__edit-button {
      opacity: 1;
    }
  }
}
</style>
