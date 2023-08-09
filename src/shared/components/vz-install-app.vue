<template>
  <div v-if="!isPWA && openModal" class="install-app">
    <div v-if="isIos" class="install-app__content py-4 px-4">
      <div>
        <p class="vz-font-size-18">{{ $t('INSTALL_APP_MODAL.INFO_TITLE_IOS') }}</p>
        <p class="vz-font-size-18">{{ $t('INSTALL_APP_MODAL.INFO_TITLE_IOS_STEP_1') }}</p>
        <p class="vz-font-size-18">{{ $t('INSTALL_APP_MODAL.INFO_TITLE_IOS_STEP_2') }}</p>
      </div>
      <vz-icon clickable name="svg:close" size="20" color="mono-100" @click="openModal = false" />
    </div>

    <div v-else-if="isDesktop && isInstalled" class="install-app__content py-4 px-4">
      <p class="vz-font-size-18">{{ $t('INSTALL_APP_MODAL.INSTALL_TITLE') }}</p>

      <vz-button v-if="isInstalled" text="INSTALL_APP_MODAL.BUTTON_INSTALL" @click="installPWA" />
    </div>

    <div v-else-if="isMobile" class="install-app__content py-4 px-4">
      <p v-if="isInstalled" class="vz-font-size-18">{{ $t('INSTALL_APP_MODAL.INSTALL_TITLE') }}</p>

      <p v-else class="vz-font-size-18">{{ $t('INSTALL_APP_MODAL.OPEN_TITLE') }}</p>

      <vz-button v-if="isInstalled" text="INSTALL_APP_MODAL.BUTTON_INSTALL" @click="installPWA" />

      <vz-button v-else text="INSTALL_APP_MODAL.BUTTON_OPEN" @click="openPWA" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isPWA } from '@/shared/helpers';
import { pwaInstallHandler } from 'pwa-install-handler';
import { ref } from 'vue';
import { client } from '../helpers/platform';
const isInstalled = ref<boolean>(false);
const openModal = ref<boolean>(true);
const isIos = ref<boolean>(false);
const isDesktop = ref<boolean>(false);
const isMobile = ref<boolean>(false);
const iso = ['ipad', 'ipod', 'iphone'];

if (iso.includes(client.platform)) {
  isIos.value = true;
} else {
  pwaInstallHandler.addListener((canInstall) => {
    isInstalled.value = canInstall;
  });
  if (client.desktop) {
    isDesktop.value = true;
  } else {
    isMobile.value = true;
  }
}
const installPWA = async (): Promise<void> => {
  await pwaInstallHandler.install();
  openModal.value = false;
};

const openPWA = async (): Promise<void> => {
  if (!isInstalled.value) {
    window.open(window.location.href, '_blank');
  }
};
</script>

<style lang="scss">
.install-app {
  padding: 0.25rem;

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-mono-300);
    background-color: var(--color-primary-900);
    border-radius: var(--border-radius-1);
  }
}
</style>
