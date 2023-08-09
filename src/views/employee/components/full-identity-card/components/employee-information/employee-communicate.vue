<template>
  <vz-card
    class="communicate-card fill-width mt-2"
    :editable="editable"
    :callback="updateEmployeeProfileRequest"
    :payload="editContent"
    @edit="toggleEditMode"
  >
    <template #view>
      <div class="vz-font-weight-700 text-center">
        <p class="vz-font-size-18 mt-2">{{ user.firstName }} {{ user.lastName }}</p>
        <p v-if="user?.nickName" class="vz-font-size-14">({{ user.nickName }})</p>
        <p v-if="user?.company" class="vz-font-size-14 vz-font-weight-600">{{ user.company }}</p>
        <p v-if="user?.location?.address" class="vz-font-size-10 vz-font-weight-400">{{ user.location.address }}</p>

        <div v-if="user?.rating" class="flex justify-center">
          <div class="vz-font-size-36">{{ user.rating?.average?.toFixed(1) }}</div>
          <div class="ps-1 pe-2 flex flex-column justify-center">
            <vz-rate v-if="user.rating?.average" size="12" :value="user.rating?.average" />

            <p v-if="user.rating?.total" class="vz-font-size-10 mt-1 communicate-card__reviews-count">
              ({{ user.rating?.total }} {{ $t('IDENTITY_CARD.REVIEWS') }})
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #edit="{ errors }">
      <vz-input
        v-model="editContent.firstName"
        capitalized
        label="GENERAL.FIRST_NAME"
        :rules="{ required: [true], maxLength: [Length.NAME] }"
        :error-message="errors?.firstName"
      />

      <vz-input
        v-model="editContent.lastName"
        capitalized
        label="GENERAL.LAST_NAME"
        :rules="{ required: [true], maxLength: [Length.NAME] }"
        :error-message="errors?.lastName"
      />

      <vz-input v-model="editContent.company" label="GENERAL.COMPANY" :error-message="errors?.company" />

      <!--      TODO: Add dropdown company suggest -->
      <!--      <vz-select-->
      <!--        v-model="editContent.company"-->
      <!--        label="GENERAL.COMPANY"-->
      <!--        debounce="500"-->
      <!--        type="suggest"-->
      <!--        :loading="listCompaniesRequest.loading.value"-->
      <!--        :items="listCompaniesRequest.results.value || []"-->
      <!--        :error-message="errors?.company"-->
      <!--        @search="listCompaniesRequest.call"-->
      <!--      />-->

      <vz-input
        v-model="editContent.nickName"
        capitalized
        label="GENERAL.NICK_NAME"
        :rules="{ maxLength: [Length.NAME] }"
        :error-message="errors?.nickName"
      />

      <vz-select
        v-model="editContent.location"
        clearable
        type="select"
        label="GENERAL.ADDRESS"
        debounce="500"
        :items="listPlacesRequest.results.value || []"
        :loading="listPlacesRequest.loading.value"
        :error-message="listPlacesRequest.error.value || errors?.location"
        :rules="{ required: [true] }"
        @search="listPlacesRequest.call"
      />
    </template>
  </vz-card>
</template>

<script setup lang="ts">
import type { UpdateProfileReq, ProfileFullDetails } from '@/views/employee/models';
import type { BaseOptions } from '@/shared/models';
import type { UserLocation } from '@/models';
import { type PropType, ref } from 'vue';
import { UPDATE_EMPLOYEE_PROFILE } from '@/views/employee/store/constants';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { usePromise } from '@/shared/composables';
import useGeneralStore from '@/store/client/composables/use-general-store';
import { LIST_ADDRESSES, LIST_COMPANIES } from '@/store/client/constants';
import { Length } from '@shared/constants/length';

const props = defineProps({
  editable: { type: Boolean, default: false },
  user: { type: Object as PropType<ProfileFullDetails>, default: () => ({}) },
});

const { useActions } = useGeneralStore();
const { [LIST_COMPANIES]: listCompaniesAction, [LIST_ADDRESSES]: listPlacesAction } = useActions([LIST_COMPANIES, LIST_ADDRESSES]);
const { [UPDATE_EMPLOYEE_PROFILE]: updateEmployeeProfileAction } = useEmployeeStore().useActions([UPDATE_EMPLOYEE_PROFILE]);

const listCompaniesRequest = usePromise(listCompaniesAction as (query: string) => Promise<Array<string>>);
const listPlacesRequest = usePromise<BaseOptions<UserLocation>>(listPlacesAction as (query: string) => Promise<BaseOptions<UserLocation>>);
const updateEmployeeProfileRequest = updateEmployeeProfileAction as (payload: UpdateProfileReq) => Promise<void>;

const editContent = ref<Partial<UpdateProfileReq>>({} as Partial<UpdateProfileReq>);

const toggleEditMode = (): void => {
  const { firstName, lastName, nickName, company, location } = props.user;

  editContent.value = { firstName, lastName, nickName, company, location } as Partial<UpdateProfileReq>;

  listCompaniesRequest.call();
  listPlacesRequest.call(location?.address);
};
</script>

<style lang="scss">
.communicate-card {
  &__reviews-count {
    font-weight: 400;
    color: var(--color-mono-400);
  }

  p,
  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
