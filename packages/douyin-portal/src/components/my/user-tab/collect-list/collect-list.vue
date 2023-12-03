<script setup lang="ts">
import {} from 'vue'

const collectList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
</script>
<template>
  <div class="collect-list">
    <collect-item v-for="item in collectList" />
  </div>
</template>

<style lang="scss" scoped>
.collect-list {
  width: 100%;
  display: inline-block;
}
</style>
