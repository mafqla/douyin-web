<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { ButtonProps } from './types'
import './index.scss'

// 定义组件名称（用于自动注册）
defineOptions({
  name: 'DyButton'
})

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  theme: 'light',
  size: 'default',
  disabled: false,
  loading: false,
  block: false,
  htmlType: 'button',
  iconPosition: 'left',
  noHorizontalPadding: false
})

// Emits 定义
const emit = defineEmits<{
  click: [event: MouseEvent]
  mousedown: [event: MouseEvent]
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
}>()

const slots = useSlots()

// 计算是否有图标
const hasIcon = computed(() => !!slots.icon || !!props.icon)

// 计算是否仅图标
const isIconOnly = computed(() => hasIcon.value && !slots.default)

// 计算水平内边距类名
const paddingClass = computed(() => {
  const { noHorizontalPadding } = props
  if (!noHorizontalPadding || !hasIcon.value) return []

  if (noHorizontalPadding === true) {
    return ['dy-btn--no-padding-left', 'dy-btn--no-padding-right']
  }
  if (noHorizontalPadding === 'left') {
    return ['dy-btn--no-padding-left']
  }
  if (noHorizontalPadding === 'right') {
    return ['dy-btn--no-padding-right']
  }
  if (Array.isArray(noHorizontalPadding)) {
    return noHorizontalPadding.map((dir) => `dy-btn--no-padding-${dir}`)
  }
  return []
})

// 计算按钮类名
const buttonClass = computed(() => {
  return [
    'dy-btn',
    `dy-btn--type-${props.type}`,
    `dy-btn--theme-${props.theme}`,
    `dy-btn--size-${props.size}`,
    {
      'dy-btn--disabled': props.disabled,
      'dy-btn--loading': props.loading,
      'dy-btn--block': props.block,
      'dy-btn--icon-only': isIconOnly.value,
      'dy-btn--icon-right': props.iconPosition === 'right'
    },
    ...paddingClass.value,
    props.className
  ]
})

// 是否实际禁用（禁用或加载中）
const isDisabled = computed(() => props.disabled || props.loading)

// 事件处理
const handleClick = (event: MouseEvent) => {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

const handleMouseDown = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit('mousedown', event)
  }
}

const handleMouseEnter = (event: MouseEvent) => {
  emit('mouseenter', event)
}

const handleMouseLeave = (event: MouseEvent) => {
  emit('mouseleave', event)
}
</script>

<template>
  <button
    :class="buttonClass"
    :type="htmlType"
    :disabled="isDisabled"
    :style="style"
    :aria-label="ariaLabel"
    :aria-disabled="isDisabled"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 加载图标 -->
    <span v-if="loading" class="dy-btn__loading">
      <svg class="dy-btn__loading-icon" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="31.4 31.4"
        />
      </svg>
    </span>

    <!-- 左侧图标 -->
    <span
      v-if="hasIcon && iconPosition === 'left' && !loading"
      class="dy-btn__icon"
    >
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>

    <!-- 按钮内容 -->
    <span v-if="$slots.default" :class="['dy-btn__content', contentClassName]">
      <slot />
    </span>

    <!-- 右侧图标 -->
    <span
      v-if="hasIcon && iconPosition === 'right' && !loading"
      class="dy-btn__icon"
    >
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>
  </button>
</template>
