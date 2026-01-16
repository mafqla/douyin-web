<script setup lang="ts">
import { computed } from 'vue'
import type { SplitButtonGroupProps } from './types'
import './index.scss'

defineOptions({
  name: 'DySplitButtonGroup'
})

const props = defineProps<SplitButtonGroupProps>()

// 计算分裂按钮组类名
const groupClass = computed(() => {
  return ['dy-split-btn-group', props.className]
})
</script>

<template>
  <div :class="groupClass" :style="style" :aria-label="ariaLabel" role="group">
    <slot />
  </div>
</template>
