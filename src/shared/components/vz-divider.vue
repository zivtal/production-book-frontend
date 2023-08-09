<template>
  <hr aria-orientation="horizontal" role="separator" />
</template>

<style scoped lang="scss">
hr[role='separator'] {
  display: block;
  flex: 1 1 100%;
  height: 0;
  max-height: 0;
  opacity: 0.1;
  transition: inherit;
  border-style: solid;
  border-width: thin 0 0 0;
}
</style>
