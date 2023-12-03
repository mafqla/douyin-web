<script setup lang="ts">
import {} from 'vue'
const collectionsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
</script>

<template>
  <div class="collections-list">
    <collections-item v-for="item in collectionsList" />
  </div>
</template>

<style lang="scss" scoped></style>
