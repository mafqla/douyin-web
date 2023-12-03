<script setup lang="ts">
import {} from 'vue'
</script>

<template>
  <div class="user-favorites">
    <slot />
    <list-footer />
  </div>
</template>

<style lang="scss" scoped>
.user-favorites {
  width: 100%;
  height: 100%;
}
</style>
