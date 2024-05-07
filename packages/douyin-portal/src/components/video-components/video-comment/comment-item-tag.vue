<script setup lang="ts">
import {} from 'vue'
defineProps({
  tag: String
})
</script>
<template>
  <span class="comment-item-tag">
    <span>{{ tag }}</span>
  </span>
</template>

<style lang="scss" scoped>
.comment-item-tag {
  height: 16px;
  flex-shrink: 0;
  font-size: 10px;
  line-height: 16px;

  // height: 20px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  padding: 0 4px;
  // font-size: 12px;
  font-weight: 500;
  // line-height: 20px;
  display: inline-flex;

  span {
    color: var(--color-const-text-white);
  }
}
</style>
