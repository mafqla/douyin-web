<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  animated: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="dy-skeleton" :class="{ 'is-animated': animated }">
    <template v-if="loading">
      <slot name="template">
        <dy-skeleton-item />
      </slot>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.dy-skeleton {
  width: 100%;

  &.is-animated {
    :deep(.dy-skeleton-item) {
      background: linear-gradient(
        90deg,
        var(--color-bg-b2) 25%,
        var(--color-bg-b3) 37%,
        var(--color-bg-b2) 63%
      );
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
