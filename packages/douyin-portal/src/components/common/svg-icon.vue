<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps({
  // 显示的 svg 图标名称（剔除 icon-）
  icon: {
    type: String,
    required: true
  }
})
// 真实显示的 svg 图标名（拼接 #icon-）
const symbolId = computed(() => `#icon-${props.icon}`)
</script>
<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId"/>
  </svg>
</template>

<style scoped>
svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
