<template>
  <vz-infinity-scroll
    disable-payload-watcher
    :callback="getAlbumsRequest"
    :payload="{ userId: employeeDetailsState._id }"
    :page="employeeAlbumsState?.page"
    :data="employeeAlbumsState?.data"
  >
    <template #content="{ data }">
      <div v-if="editable && !isCreateAlbum" class="flex ms-3 mt-2">
        <vz-button icon-name="svg:create" text="IDENTITY_CARD.ALBUM.ADD" @click="onAddAlbum" />
      </div>

      <div class="gallery-card__grid">
        <vz-card
          v-for="album in data"
          :key="album._id"
          class="gallery-card__card"
          :class="{
            'gallery-card__card--editable': editable,
            'gallery-card__card--edit': albumPayload?.albumId === album._id,
            clickable: !albumPayload,
          }"
          :loading="loadingAlbumId === album._id"
          :editable="editable && !albumPayload"
          :callback="updateAlbumRequest"
          :payload="albumPayload"
          @edit="onEditAlbum(album, $event)"
          v-on="!albumPayload ? { click: () => onSelectAlbum(album._id) } : {}"
        >
          <template #view>
            <vz-image :src="album.cover" :alt="album.name" :aspect-ratio="ALBUM_COVER_RATIO" />

            <div class="flex">
              <span class="gallery-card__album-name vz-font-size-14 vz-font-weight-700">{{ album.name }}</span>
            </div>

            <p v-if="album.description" class="gallery-card__description">{{ album.description }}</p>

            <p class="vz-font-size-12 gallery-card__items-count">{{ album.total }} {{ $t('GENERAL.ITEMS') }}</p>
          </template>

          <template v-if="albumPayload" #edit="{ errors }">
            <image-cropper
              class="mb-2"
              auto-save
              auto-zoom
              disable-auto-upload
              export-type="base64"
              quality="0.6"
              :size="ALBUM_COVER_SIZE"
              :ratio="ALBUM_COVER_RATIO"
              :src="albumPayload.cover"
              @save="albumPayload.cover = $event.data"
            >
              <img alt="GENERAL.IMAGE" :src="imageCover" height="200" />
            </image-cropper>

            <vz-input
              v-model="albumPayload.name"
              placeholder="IDENTITY_CARD.ALBUM.NAME"
              :rules="{ required: [true], maxLength: [Length.TITLE] }"
              :error-message="errors?.name"
            />

            <vz-textarea
              v-model="albumPayload.description"
              placeholder="IDENTITY_CARD.ALBUM.DESCRIPTION"
              rows="8"
              :rules="{ maxLength: [Length.DESCRIPTION] }"
              :error-messages="errors?.description"
            />
          </template>
        </vz-card>
      </div>
    </template>
  </vz-infinity-scroll>

  <create-edit-album v-if="editable && isCreateAlbum" class="gallery-card__add-album" @close="isCreateAlbum = false" />

  <album-modal v-if="!isCreateAlbum" :editable="editable" />
</template>

<script setup lang="ts">
import type { BaseId } from '@/shared/models';
import type { Album, GetAlbumsReq, GetAlbumsRes, UpdateAlbumReq } from '@/views/employee/models';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { EMPLOYEE_ALBUMS, EMPLOYEE_DETAILS, GET_ALBUM, GET_ALBUMS, UPDATE_ALBUM } from '@/views/employee/store/constants';
import { computed, defineAsyncComponent, nextTick, ref } from 'vue';
import { usePromise } from '@/shared/composables';
import { scrollToView } from '@/shared/helpers';
import { emitter } from '@/main';
import { OPEN_EMPLOYEE_ALBUM_MODAL } from '@/views/employee/constants/employee-events';
import { ALBUM_COVER_RATIO, ALBUM_COVER_SIZE } from '@/views/employee/constants/albums.constants';
import { Length } from '@shared/constants/length';

const CreateEditAlbum = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "profile-album" */
      '@/views/employee/components/full-identity-card/components/media-gallery/media-gallery-create-edit-album.vue'
    )
);
const ImageCropper = defineAsyncComponent(() => import(/* webpackChunkName: "profile-album" */ '@/shared/components/vz-image-cropper.vue'));
const AlbumModal = defineAsyncComponent(() => import(/* webpackChunkName: "profile-album" */ '@/views/employee/modals/album-modal.vue'));

defineProps({ editable: { type: Boolean, default: false } });

const { useState, useActions } = useEmployeeStore();
const { [EMPLOYEE_DETAILS]: employeeDetailsState, [EMPLOYEE_ALBUMS]: employeeAlbumsState } = useState([EMPLOYEE_DETAILS, EMPLOYEE_ALBUMS]);
const {
  [GET_ALBUMS]: getAlbumsAction,
  [GET_ALBUM]: getAlbumAction,
  [UPDATE_ALBUM]: updateAlbumAction,
} = useActions([GET_ALBUM, UPDATE_ALBUM, GET_ALBUMS]);

const getAlbumRequest = usePromise(getAlbumAction as (albumId: BaseId) => Promise<void>);
const getAlbumsRequest = getAlbumsAction as (payload: GetAlbumsReq) => Promise<GetAlbumsRes>;
const updateAlbumRequest = updateAlbumAction as (payload: UpdateAlbumReq) => Promise<void>;

const loadingAlbumId = ref<string | null>(null);
const isCreateAlbum = ref<boolean>(false);
const albumPayload = ref<UpdateAlbumReq | null>(null);

const imageCover = computed((): string => require('@/assets/images/default-cover.svg'));

const onSelectAlbum = async (albumId: BaseId): Promise<void> => {
  albumPayload.value = null;
  loadingAlbumId.value = albumId;

  try {
    await getAlbumRequest.call(albumId);
    emitter.emit(OPEN_EMPLOYEE_ALBUM_MODAL);
  } catch (e) {
    console.log(e);
  } finally {
    loadingAlbumId.value = null;
  }
};

const onAddAlbum = (): void => {
  isCreateAlbum.value = true;

  nextTick(() => scrollToView('.gallery-card__add-album'));
};

const onEditAlbum = ({ _id, name, description, cover }: Album, isEditMode: boolean): void => {
  albumPayload.value = isEditMode ? { albumId: _id, name, description, cover } : null;

  nextTick(() => scrollToView('.gallery-card__card--edit'));
};
</script>

<style lang="scss">
.gallery-card {
  &__grid {
    color: var(--color-primary-900);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  &__card {
    user-select: none;
    margin: 8px;

    &:not(&--editable) {
      padding: 0 !important;
      box-shadow: initial !important;
      background-color: transparent !important;
    }

    img {
      width: 100%;
      border-radius: var(--border-radius-1);
      object-fit: cover;
      object-position: 50% 10%;
    }

    &--edit {
      grid-row: 1/3;
      grid-column: 1/3;
    }
  }

  &__album-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &__description {
    color: var(--color-mono-600);
    font-size: var(--font-size-10);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-word;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 32px;
  }

  &__items-count {
    color: var(--color-mono-400);
  }

  .skeleton-loader__image {
    width: initial;
    height: initial;
  }
}
</style>
