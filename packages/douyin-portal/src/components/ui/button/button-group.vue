<script setup lang="ts">
import { computed, provide } from 'vue'
import type { ButtonGroupProps } from './types'
import './index.scss'

defineOptions({
  name: 'DyButtonGroup'
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  type: 'primary',
  theme: 'light',
  size: 'default',
  disabled: false
})

// 计算按钮组类名
const groupClass = computed(() => {
  return ['dy-btn-group', `dy-btn-group--size-${props.size}`, props.className]
})

// 向子组件提供上下文
provide('buttonGroupContext', {
  type: computed(() => props.type),
  theme: computed(() => props.theme),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled)
})
</script>

<template>
  <div :class="groupClass" :style="style" :aria-label="ariaLabel" role="group">
    <slot />
  </div>
</template>
