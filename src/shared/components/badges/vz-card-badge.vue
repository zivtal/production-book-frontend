<template>
  <div class="card-badge">
    <slot name="default" />
  </div>
</template>

<style lang="scss" scoped>
.card-badge {
  position: absolute;
  @include inline-end(-0.5rem);
  width: fit-content;
  min-width: 2rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  background-color: #fc8b06;
  @include rtl(border-radius, 0 0.25rem 0.25rem 0.25rem, 0.25rem 0 0.25rem 0.25rem);
  box-shadow: var(--shadow-level-1);
  top: calc(1.5rem + 1px);
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    position: absolute;
    top: calc(-0.5rem + 0.5px);
    right: 0;
    @include inline-end(1px);
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0.5rem 0 0 0.5rem;
    border-color: transparent transparent transparent #b6670b;
    @include rtl(transform, rotate(270deg), rotate(0deg));
  }
}
</style>
