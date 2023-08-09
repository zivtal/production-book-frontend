<template>
  <vz-card class="create-edit-album">
    <div class="create-edit-album__content">
      <form ref="formRef" class="flex-grow-1" role="form" autocomplete="off" @submit.prevent>
        <vz-input v-model="albumPayload.name" label="IDENTITY_CARD.ALBUM.NAME" :rules="{ required: [true], maxLength: [Length.TITLE] }" />

        <vz-textarea
          v-model="albumPayload.description"
          label="IDENTITY_CARD.ALBUM.DESCRIPTION"
          rows="8"
          :rules="{ maxLength: [Length.DESCRIPTION] }"
        />
      </form>

      <div class="ms-4">
        <p class="vz-title-h3">{{ $t('IDENTITY_CARD.ALBUM.COVER') }}</p>

        <image-cropper
          auto-save
          auto-zoom
          disable-auto-upload
          export-type="base64"
          quality="0.6"
          :style="{ maxWidth: '320px', maxHeight: '240px' }"
          :size="ALBUM_COVER_SIZE"
          :ratio="ALBUM_COVER_RATIO"
          :src="albumPayload.cover"
          @save="albumPayload.cover = $event.data"
        >
          <img alt="GENERAL.IMAGE" :src="imageCover" height="200" />
        </image-cropper>
      </div>
    </div>

    <div class="create-edit-album__buttons">
      <vz-button text="GENERAL.CANCEL" @click="$emit('close')" />

      <vz-button :text="albumPayload.albumId ? 'GENERAL.UPDATE' : 'GENERAL.CREATE'" :loading="albumRequest.loading.value" @click="onSubmit" />
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import type { AddAlbumReq, UpdateAlbumReq } from '@/views/employee/models';
import { computed, PropType, ref } from 'vue';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { ADD_ALBUM, UPDATE_ALBUM } from '@/views/employee/store/constants';
import { usePromise } from '@/shared/composables';
import { Length } from '@/shared/constants/length';
import ImageCropper from '@/shared/components/vz-image-cropper.vue';
import { ALBUM_COVER_RATIO, ALBUM_COVER_SIZE } from '@/views/employee/constants/albums.constants';
import { useFormValidator } from '@/shared/components/fields/helpers';

const emit = defineEmits(['close']);
const props = defineProps({
  album: { type: Object as PropType<AddAlbumReq | UpdateAlbumReq>, default: () => ({ name: '', description: '' }) },
});

const formRef = ref<Element | undefined>(undefined);
const albumPayload = ref<AddAlbumReq & UpdateAlbumReq>(props.album as AddAlbumReq & UpdateAlbumReq);

const { useActions } = useEmployeeStore();
const { [ADD_ALBUM]: addAlbumAction, [UPDATE_ALBUM]: updateAlbumAction } = useActions([ADD_ALBUM, UPDATE_ALBUM]);

const albumRequest = usePromise(
  albumPayload.value.albumId
    ? (updateAlbumAction as (payload: UpdateAlbumReq) => Promise<void>)
    : (addAlbumAction as (payload: AddAlbumReq) => Promise<void>)
);

const imageCover = computed((): string => require('@/assets/images/default-cover.svg'));

const onSubmit = async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  await albumRequest.call(albumPayload.value);

  emit('close');
};
</script>

<style lang="scss">
.create-edit-album {
  margin: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  @include mobile-layout {
    overflow-y: auto;
  }

  &__content {
    display: flex;

    @include mobile-layout {
      flex-direction: column;
    }
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;

    > * {
      min-width: 4rem;
      margin-inline-start: 0.5rem;
    }
  }
}
</style>
