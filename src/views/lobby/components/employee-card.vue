<template>
  <vz-card class="employee-card" :class="{ clickable: clickable, skeleton: loading }">
    <div class="employee-card__header">
      <vz-image height="100" role="presentation" :src="coverImg" :alt="$t('IDENTITY_CARD.COVER')" />

      <vz-avatar :src="avatarImg" :size="80" :verified="user.verified" />
    </div>

    <div class="height-30 mb-1 mt-2 me-4">
      <div class="employee-card__name vz-font-size-16 vz-font-weight-700">
        <p>{{ user.firstName }}</p>
        <p>{{ user.lastName }}</p>
      </div>

      <p class="employee-card__company vz-font-size-12 vz-font-weight-600">{{ user.company }}</p>
    </div>

    <div class="flex align-start mb-2 me-6">
      <vz-rate class="ps-5 d-inline-block" :value="user.rating?.average || 0" size="12" />

      <span v-if="user.location?.address" class="employee-card__address vz-font-size-12">{{ user.location?.address }}</span>
    </div>

    <div class="px-5 height-50">
      <vz-divider class="my-1" />

      <span class="employee-card__skills vz-font-size-12">
        {{ (user.skills || []).map(({ title }) => title).join(' | ') }}
      </span>
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import type { ProfileExtendDetails } from '@/views/employee/models';
import { computed, type PropType } from 'vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  clickable: { type: Boolean, default: true },
  user: { type: Object as PropType<ProfileExtendDetails>, required: true },
});

const coverImg = computed(() => props.user?.cover || require('@/assets/images/default-cover.svg'));

const avatarImg = computed(() => props.user?.avatar || '');
</script>

<style lang="scss">
.employee-card {
  position: relative;
  overflow: hidden;
  min-height: 200px;
  margin: 0.5rem;

  &__header {
    position: relative;
    margin-top: -0.5rem;
    margin-inline-start: -0.5rem;
    height: 70px;
    background: radial-gradient(circle, var(--color-primary-700) 0%, var(--color-primary-900) 110%);
    width: 105%;

    > img {
      object-fit: cover;
      height: 70px;
      width: 100%;
    }

    .vz-avatar {
      position: absolute !important;
      bottom: -42px;
      padding-inline-start: 12px;
      z-index: 2;
    }
  }

  &__name {
    display: flex;
  }

  &__name,
  &__company {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-inline-start: 96px;
    line-height: var(--line-height-20);

    > * {
      padding-inline-end: 0.25rem;
      text-transform: capitalize;
    }
  }

  &__specialization,
  &__skills {
    @include max-lines(2);
    height: 36px;
  }

  &__address {
    color: var(--color-mono-700);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .vz-star-rating {
    width: 96px;
  }
}
</style>
