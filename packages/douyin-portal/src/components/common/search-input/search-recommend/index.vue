<script setup lang="ts">
import { ref } from 'vue'
</script>
<template>
  <div class="search-recommend">
    <div class="search-recommend-content">
      <div
        class="search-recommend-container search-recommend-box"
        style="height: 538px"
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
  top: 36px;
  width: calc(100% + 2px);
  z-index: 50;

  .search-recommend-box {
    overflow-x: hidden;
    overflow-y: scroll;
    padding-right: 6px;
    width: calc(100% - 6px);
  }

  .search-recommend-container {
    background-color: var(--color-bg-b1);
    border: 1px solid var(--color-secondary-default);

    border-radius: 12px;
    // border-radius: 4px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
    box-sizing: content-box;
    margin-top: 5px;
    padding: 10px 0;
    width: 100%;
  }
}
</style>
