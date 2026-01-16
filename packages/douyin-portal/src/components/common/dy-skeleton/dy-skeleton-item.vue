<script setup lang="ts">
type SkeletonVariant =
  | 'text'
  | 'h1'
  | 'h3'
  | 'p'
  | 'image'
  | 'circle'
  | 'rect'
  | 'button'

defineProps({
  variant: {
    type: String as () => SkeletonVariant,
    default: 'text'
  }
})
</script>

<template>
  <div class="dy-skeleton-item" :class="[`is-${variant}`]"></div>
</template>

<style lang="scss" scoped>
.dy-skeleton-item {
  background: var(--color-bg-b2);
  border-radius: 4px;

  &.is-text {
    height: 14px;
    width: 100%;
  }

  &.is-h1 {
    height: 24px;
    width: 50%;
  }

  &.is-h3 {
    height: 16px;
    width: 100%;
    margin-bottom: 8px;
  }

  &.is-p {
    height: 14px;
    width: 100%;
    margin-bottom: 6px;
  }

  &.is-image {
    width: 100%;
    height: 200px;
  }

  &.is-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  &.is-rect {
    width: 100%;
    height: 100px;
  }

  &.is-button {
    width: 64px;
    height: 32px;
    border-radius: 4px;
  }
}
</style>
