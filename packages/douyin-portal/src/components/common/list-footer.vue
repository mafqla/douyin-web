<script setup lang="ts">
import {} from 'vue'

defineProps({
  text: {
    type: String,
    default: '暂时没有更多了',
    required: false
  }
})
</script>

<template>
  <div class="list-footer" style="width: 100%">
    <div class="list-footer-title">{{ text }}</div>
  </div>
</template>

<style lang="scss" scoped>
.list-footer {
  margin-top: 40px;
  padding-bottom: 40px;
  text-align: center;

  .list-footer-title {
    color: var(--color-text-t4);
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
}
</style>
