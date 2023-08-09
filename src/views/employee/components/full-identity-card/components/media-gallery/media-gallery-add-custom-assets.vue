<template>
  <div class="add-custom-assets">
    <form ref="formRef" role="form" autocomplete="off" @submit.prevent>
      <div v-for="(asset, index) in assets" :key="index">
        <vz-input
          v-model="asset.url"
          label="IDENTITY_CARD.ALBUM.ASSET.URL"
          :rules="{
            required: [true],
            regex: [[RegexPattern.URL.YOUTUBE, RegexPattern.URL.VIMEO], ValidationMessage.INVALID_URL],
            maxLength: [Length.URL],
          }"
          @input="onUrlChange($event, index)"
        />

        <vz-input v-model="asset.title" label="IDENTITY_CARD.ALBUM.ASSET.TITLE" :rules="{ required: [true], maxLength: [Length.TITLE] }" />

        <vz-textarea
          v-model="asset.description"
          label="IDENTITY_CARD.ALBUM.ASSET.DESCRIPTION"
          rows="5"
          :rules="{ maxLength: [Length.DESCRIPTION] }"
        />
      </div>
    </form>

    <div class="add-custom-assets__buttons">
      <vz-button text="GENERAL.CANCEL" :disabled="addAlbumAssetsRequest.loading.value" @click="$emit('close')" />

      <vz-button text="GENERAL.ADD" :loading="addAlbumAssetsRequest.loading.value" @click="onSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlbumAsset, AddAssetReq } from '@/views/employee/models';
import { type PropType, ref } from 'vue';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { ADD_ALBUM_ASSETS } from '@/views/employee/store/constants';
import { usePromise } from '@/shared/composables';
import RegexPattern from '@/shared/constants/regex-pattern';
import { Length } from '@/shared/constants/length';
import { debounce } from 'lodash';
import useGeneralStore from '@/store/client/composables/use-general-store';
import { GET_VIDEO_DETAILS } from '@/store/client/constants';
import { useFormValidator } from '@/shared/components/fields/helpers';
import { ValidationMessage } from '@/shared/services/validator/service/record-validator/constants/validation.message.enum';

const props = defineProps({ value: { type: Array as PropType<Array<Omit<AlbumAsset, 'key'>>>, default: () => [] } });
const emit = defineEmits(['close']);

const { useActions: useGeneralActions } = useGeneralStore();
const { [GET_VIDEO_DETAILS]: getVideoDetailsAction } = useGeneralActions([GET_VIDEO_DETAILS]);

const { useActions: useEmployeeActions } = useEmployeeStore();
const { [ADD_ALBUM_ASSETS]: addAlbumAssetsAction } = useEmployeeActions([ADD_ALBUM_ASSETS]);

const addAlbumAssetsRequest = usePromise(addAlbumAssetsAction as ({ assets }: { assets: AddAssetReq['assets'] }) => Promise<void>);

const formRef = ref<Element | undefined>(undefined);
const assets = ref<Array<Omit<AlbumAsset, 'key'>>>(props.value?.length ? props.value : [{ title: '', description: '', url: '', type: 'VIDEO' }]);

const onSubmit = async (): Promise<void> => {
  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  await addAlbumAssetsRequest.call({ assets: assets.value });
  emit('close');
};

const onUrlChange = debounce(async ({ target }: { target: { value: string } }, index: number): Promise<void> => {
  if (![RegexPattern.URL.YOUTUBE].some((re) => re.test('' + target.value))) {
    return;
  }

  const { title, description, thumb } = await getVideoDetailsAction(target.value);
  assets.value[index].title = title;
  assets.value[index].description = description;
  assets.value[index].thumb = thumb;
}, 500);
</script>

<style lang="scss">
.add-custom-assets {
  padding: 0 0.5rem;

  &__buttons {
    display: flex;
    justify-content: flex-end;

    > * {
      min-width: 4rem;
      margin-inline-start: 0.5rem;
    }
  }
}
</style>
