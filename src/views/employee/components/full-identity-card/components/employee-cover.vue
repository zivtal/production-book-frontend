<template>
  <div
    v-if="employeeDetailsState._id"
    ref="employeeHeaderRef"
    :class="['employee-cover', { 'employee-cover--edit': !!editSrc, 'employee-cover--integrated': integrated, 'employee-cover--empty': !coverSrc }]"
    :style="{ height: `${imageHeight}px` }"
  >
    <div class="employee-cover__cover" :class="{ 'employee-cover__cover--edit': !!editSrc }">
      <image-cropper
        v-if="editSrc"
        auto-zoom
        export-type="base64"
        size="1280"
        thumbnail-size="360"
        quality="0.8"
        :ratio="imageWidth / imageHeight"
        :src="editSrc"
        :default-src="imageCover"
        @save="onSave"
        @cancel="editSrc = null"
      ></image-cropper>

      <template v-else>
        <div class="employee-cover__cover-actions">
          <vz-button
            v-if="impersonateEnabled || isImpersonated"
            class="me-1"
            height="32"
            background-color="primary-900"
            :icon-name="isImpersonated ? 'svg:close' : 'svg:impersonate'"
            :text="`IDENTITY_CARD.${isImpersonated ? 'STOP_IMPERSONATE' : 'IMPERSONATE'}`"
            :loading="impersonateToRequest.loading.value"
            @click="onImpersonate"
          />

          <template v-if="isEditable">
            <vz-button class="me-1" background-color="primary-900" height="32" width="32" icon-name="svg:edit" @click="openEdit" />
          </template>
        </div>

        <vz-image :src="imageCover" :alt="$t('IDENTITY_CARD.COVER')" />
      </template>
    </div>

    <vz-avatar
      :editable="isEditable"
      :loading="updateEmployeeProfileRequest.loading.value"
      :src="avatarImg"
      :size="avatarSize"
      :verified="employeeDetailsState.verified"
      @update="onUpdate({ avatar: $event })"
    />
  </div>
</template>

<script setup lang="ts">
import type { UpdateProfileReq } from '@/views/employee/models';
import { computed, ref, watch } from 'vue';
import { EMPLOYEE_DETAILS, UPDATE_EMPLOYEE_PROFILE } from '@/views/employee/store/constants';
import { IMPERSONATE_TO } from '@/store/auth/constants';
import { IMAGE_TYPE } from '@/shared/services/image-service/models/image-resize';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';
import { usePromise } from '@/shared/composables';
import ImageCropper from '@/shared/components/vz-image-cropper.vue';
import FileService from '@/shared/services/file.service';
import ImageService from '@/shared/services/image-service/image.service';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';

const COVER_RATIO = 1024 / 210;

defineProps({
  integrated: { type: Boolean, default: false },
});

const { useActions: useAuthActions } = useAuthStore();
const { [IMPERSONATE_TO]: impersonateToAction } = useAuthActions([IMPERSONATE_TO]);

const { activeUser, isAdmin, isMe } = useAuthUser();

const { useState: useEmployeeState, useActions: useEmployeeActions } = useEmployeeStore();
const { [EMPLOYEE_DETAILS]: employeeDetailsState } = useEmployeeState([EMPLOYEE_DETAILS]);
const { [UPDATE_EMPLOYEE_PROFILE]: updateEmployeeProfileAction } = useEmployeeActions([UPDATE_EMPLOYEE_PROFILE]);

const impersonateToRequest = usePromise(impersonateToAction as (userId?: string) => Promise<void>);
const updateEmployeeProfileRequest = usePromise(updateEmployeeProfileAction as (payload: UpdateProfileReq) => Promise<void>);

const isEditable = computed((): boolean => activeUser.value?._id === employeeDetailsState.value._id);

const employeeHeaderRef = ref<HTMLDivElement>();
const editSrc = ref<string | null>(null);

const coverSrc = computed(() => employeeDetailsState.value?.cover || null);
const impersonateEnabled = computed((): boolean => isAdmin.value && !isMe(employeeDetailsState.value._id, true));
const isImpersonated = computed((): boolean => activeUser.value?._id === employeeDetailsState.value._id && !!activeUser.value?.impersonate);
const imageCover = computed((): string => coverSrc.value || require('@/assets/images/default-cover.svg'));
const avatarImg = computed((): string => employeeDetailsState.value?.avatar || '');
const avatarSize = ref<number>(128);
const imageHeight = ref<number | undefined>();
const imageWidth = ref<number | undefined>();

const onImpersonate = async (): Promise<void> => await impersonateToRequest.call(employeeDetailsState.value._id);
const onUpdate = (update: UpdateProfileReq) => updateEmployeeProfileRequest.call(update);

const openEdit = async (): Promise<void> => {
  if (!coverSrc.value) {
    const files = await FileService.uploadFile({ accept: IMAGE_TYPE });
    editSrc.value = files?.length ? (await ImageService.loadImageFile(files[0])).src || null : null;

    return;
  }

  editSrc.value = coverSrc.value;
};

const onSave = ({ data, name, thumb }: { data: string; name: string; thumb: string }) => {
  editSrc.value = null;

  onUpdate({ cover: { fileData: data, fileName: name, thumbData: thumb } });
};

watch(
  () => employeeHeaderRef.value?.offsetWidth,
  async (offsetWidth) => {
    if (!offsetWidth) {
      return;
    }

    imageHeight.value = offsetWidth / COVER_RATIO;
    imageWidth.value = offsetWidth;
    avatarSize.value = Math.min(offsetWidth / 5, 128);
  },
  { immediate: true }
);
</script>

<style lang="scss">
.employee-cover {
  $cover-size: 210px;
  position: relative;

  &--edit {
    height: calc($cover-size + 32px);
    max-height: calc(25vh + 32px);

    .vz-avatar {
      display: none;
    }
  }

  &--integrated {
    border-radius: var(--border-radius-2);
  }

  > div:nth-child(1) > img {
    width: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-1);
  }

  .vz-avatar {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, 20%);
  }

  &__impersonate {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 4px 8px;
  }

  &__cover {
    position: relative;
    max-height: 25vh;
    z-index: 1;

    &--empty:not(&--edit) {
      background: radial-gradient(circle, var(--color-primary-700) 0%, var(--color-primary-900) 110%);
    }

    .employee-cover--edit & {
      padding-top: 8px;
      height: calc($cover-size + 64px);
      max-width: 1032px;
    }

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      .employee-cover__cover-actions {
        opacity: 1;
      }
    }
  }

  &__cover-actions {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    padding: 0 8px;
    width: 100%;
    height: 0;
    bottom: 48px;
    left: 0;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s;
    padding-inline-end: 16px;

    > div {
      margin: 0;
      padding: 0;
      width: fit-content;
      height: fit-content;
      border-radius: var(--border-radius-1);
      background-color: var(--color-background-2);
    }
  }
}
</style>
