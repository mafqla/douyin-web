<script setup lang="ts">
import {} from 'vue'

const props = defineProps<{
  icon?: 'no-show-like' | 'empty-list-user'
  title?: string
  desc?: string
}>()
</script>
<template>
  <div class="user-error">
    <svg-icon :icon="icon" class="icon" />
    <p class="error-text">{{ title }}</p>
    <p class="error-desc">{{ desc }}</p>
  </div>
</template>

<style lang="scss" scoped>
.user-error {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;

  .icon {
    // color: var(--color-bg-b3);
    font-size: 120px;
  }
  .error-text {
    color: var(--color-text-t1);
    margin-top: 16px;
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
  }
  .error-desc {
    color: var(--color-text-t3);
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
}
</style>
