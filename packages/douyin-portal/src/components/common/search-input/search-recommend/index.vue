<script setup lang="ts">
import { ref } from 'vue'
</script>
<template>
  <div class="search-recommend">
    <div class="search-recommend-content">
      <div
        class="search-recommend-container search-recommend-box"
        style="height: unset"
      >
        <search-history />
        <search-guess />
        <search-hot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-recommend-content {
  left: -2px;
  position: absolute;
  top: 40px;
  width: calc(100% + 2px);
  z-index: 50;

  .search-recommend-box {
    width: 100%;
    background-color: var(--color-bg-b1);
    box-sizing: content-box;
    border: 1px solid var(--color-secondary-default);
    border-radius: 12px;
    margin-top: 5px;
    padding-top: 10px;
    padding-right: 2px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  }

  .search-recommend-container {
    padding-left: 10px;
    padding-right: 2px;
    overflow-y: scroll;
  }
}
</style>
