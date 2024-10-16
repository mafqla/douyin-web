<script setup lang="ts">
import {} from 'vue'
defineProps<{
  active: boolean
}>()
</script>
<template>
  <div class="tabs-item" :class="{ 'tabs-active': active }">
    <div class="tabs-item-content"><slot /></div>
  </div>
</template>

<style lang="scss" scoped>
.tabs-item {
  border-bottom: 3px solid transparent;
  padding: 12px 0;
  font-size: 16px;
  cursor: pointer;
  box-sizing: border-box;
  color: var(--color-tab-text);
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif;
  font-weight: 400;
  line-height: 20px;
  display: inline-block;
  position: relative;
  margin-right: 24px;
  padding-left: 0;
  &:hover {
    border-bottom: 3px solid var(--color-tab-border-hover);
    color: var(--color-tab-text-active);
  }
  &.tabs-active {
    border-bottom: 3px solid var(--color-primary);
    color: var(--color-tab-text-active);
    font-weight: 600;
    &:hover {
      border-bottom: 3px solid var(--color-primary);
    }
  }

  .tabs-item-content {
    cursor: pointer;
    align-items: center;
    margin-right: 40px;
    display: flex;
    &:last-child {
      margin-right: 0;
    }
    .tabs-title {
      align-items: center;
      font-weight: 400;
      display: flex;
    }
    .tabs-text,
    .user-tabs-count {
      margin-right: 6px;
      font-size: 18px;
      line-height: 26px;
    }
    .user-lock {
      margin-top: -2px;

      .icon {
        width: 14px;
        height: 16px;
      }
    }
  }
}
</style>
