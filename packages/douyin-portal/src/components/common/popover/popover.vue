<script setup lang="ts">
/**
 * Popover 气泡卡片组件
 * 使用纯 CSS 定位，支持自动调整位置
 */

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useAttrs } from 'vue'
import type { PopoverPosition, PopoverTrigger, PopoverTheme } from './types'

const props = withDefaults(
  defineProps<{
    /** 弹出层内容 */
    content?: string
    /** 弹出层位置 */
    position?: PopoverPosition
    /** 触发方式 */
    trigger?: PopoverTrigger
    /** 是否禁用 */
    disabled?: boolean
    /** 是否显示箭头 */
    showArrow?: boolean
    /** 弹出层与触发元素的间距(px) */
    spacing?: number
    /** 是否显示（受控模式） */
    visible?: boolean
    /** 默认是否显示 */
    defaultVisible?: boolean
    /** 鼠标移入延迟(ms) */
    mouseEnterDelay?: number
    /** 鼠标移出延迟(ms) */
    mouseLeaveDelay?: number
    /** 点击空白处是否关闭 */
    clickToHide?: boolean
    /** 弹出层 z-index */
    zIndex?: number
    /** 弹出层类名 */
    contentClassName?: string
    /** 关闭时销毁内容 */
    destroyOnClose?: boolean
    /** 主题 */
    theme?: PopoverTheme
    /** 是否自动调整位置防止溢出 */
    autoAdjustOverflow?: boolean
  }>(),
  {
    position: 'bottom',
    trigger: 'hover',
    disabled: false,
    showArrow: false,
    spacing: 8,
    defaultVisible: false,
    mouseEnterDelay: 50,
    mouseLeaveDelay: 100,
    clickToHide: true,
    zIndex: 1050,
    contentClassName: '',
    destroyOnClose: false,
    theme: 'dark',
    autoAdjustOverflow: true
  }
)

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  visibleChange: [visible: boolean]
}>()

// 内部可见状态
const internalVisible = ref(props.defaultVisible)

// 使用 attrs 检测是否传递了 visible prop
const attrs = useAttrs()

// 判断是否为受控模式
const isControlled = computed(() => {
  return 'visible' in attrs || 'onUpdate:visible' in attrs
})

// 计算实际可见状态
const isVisible = computed(() => {
  return isControlled.value ? props.visible : internalVisible.value
})

// 元素引用
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

// 实际显示位置（可能因自动调整而改变）
const actualPosition = ref<PopoverPosition>(props.position)

// 定时器
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

// 清除定时器
const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 自动调整位置
const adjustPosition = () => {
  if (!props.autoAdjustOverflow || !triggerRef.value || !popoverRef.value) {
    actualPosition.value = props.position
    return
  }

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const popoverRect = popoverRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const spacing = props.spacing

  let position = props.position

  // 获取基础方向
  const getBaseDirection = (pos: string) => {
    if (pos.startsWith('top')) return 'top'
    if (pos.startsWith('bottom')) return 'bottom'
    if (pos.startsWith('left')) return 'left'
    if (pos.startsWith('right')) return 'right'
    return pos
  }

  const baseDirection = getBaseDirection(position)

  // 检查各方向的可用空间
  const spaceAbove = triggerRect.top
  const spaceBelow = viewportHeight - triggerRect.bottom
  const spaceLeft = triggerRect.left
  const spaceRight = viewportWidth - triggerRect.right

  // 根据基础方向检查是否需要翻转
  if (baseDirection === 'bottom' && spaceBelow < popoverRect.height + spacing) {
    if (spaceAbove >= popoverRect.height + spacing) {
      position = position.replace('bottom', 'top') as PopoverPosition
    }
  } else if (baseDirection === 'top' && spaceAbove < popoverRect.height + spacing) {
    if (spaceBelow >= popoverRect.height + spacing) {
      position = position.replace('top', 'bottom') as PopoverPosition
    }
  } else if (baseDirection === 'left' && spaceLeft < popoverRect.width + spacing) {
    if (spaceRight >= popoverRect.width + spacing) {
      position = position.replace('left', 'right') as PopoverPosition
    }
  } else if (baseDirection === 'right' && spaceRight < popoverRect.width + spacing) {
    if (spaceLeft >= popoverRect.width + spacing) {
      position = position.replace('right', 'left') as PopoverPosition
    }
  }

  actualPosition.value = position
}

// 设置可见状态
const setVisible = (visible: boolean) => {
  if (props.disabled) return
  internalVisible.value = visible
  emit('update:visible', visible)
  emit('visibleChange', visible)

  if (visible) {
    // 显示后调整位置
    nextTick(() => {
      adjustPosition()
    })
  }
}

// 显示弹出层
const show = () => {
  clearTimers()
  if (props.mouseEnterDelay > 0) {
    showTimer = setTimeout(() => setVisible(true), props.mouseEnterDelay)
  } else {
    setVisible(true)
  }
}

// 隐藏弹出层
const hide = () => {
  clearTimers()
  if (props.mouseLeaveDelay > 0) {
    hideTimer = setTimeout(() => setVisible(false), props.mouseLeaveDelay)
  } else {
    setVisible(false)
  }
}

// 切换显示状态
const toggle = () => {
  if (isVisible.value) {
    hide()
  } else {
    show()
  }
}

// 事件处理
const handleTriggerMouseEnter = () => {
  if (props.trigger === 'hover') show()
}

const handleTriggerMouseLeave = () => {
  if (props.trigger === 'hover') hide()
}

const handleTriggerClick = (e: MouseEvent) => {
  if (props.trigger === 'click') {
    e.stopPropagation()
    toggle()
  }
}

const handleTriggerFocus = () => {
  if (props.trigger === 'focus') show()
}

const handleTriggerBlur = () => {
  if (props.trigger === 'focus') hide()
}

const handlePopoverMouseEnter = () => {
  if (props.trigger === 'hover') clearHideTimer()
}

const handlePopoverMouseLeave = () => {
  if (props.trigger === 'hover') hide()
}

// 点击外部关闭
const handleClickOutside = (e: MouseEvent) => {
  if (!props.clickToHide || props.trigger !== 'click') return
  if (!isVisible.value) return

  const target = e.target as Node
  const isClickInside =
    triggerRef.value?.contains(target) || popoverRef.value?.contains(target)

  if (!isClickInside) {
    setVisible(false)
  }
}

// 弹出层类名
const popoverClass = computed(() => [
  'dy-popover',
  `dy-popover--${actualPosition.value}`,
  `dy-popover--${props.theme}`,
  props.contentClassName,
  {
    'dy-popover--with-arrow': props.showArrow
  }
])

// 弹出层样式
const popoverStyle = computed(() => ({
  '--popover-spacing': `${props.spacing}px`,
  '--popover-z-index': props.zIndex
}))

// 是否渲染内容
const shouldRender = computed(() => {
  return props.destroyOnClose ? isVisible.value : true
})

// 监听 position 变化
watch(
  () => props.position,
  () => {
    if (isVisible.value) {
      nextTick(() => adjustPosition())
    }
  }
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  clearTimers()
  document.removeEventListener('click', handleClickOutside)
})

// 暴露方法
defineExpose({
  show,
  hide,
  toggle
})
</script>

<template>
  <div class="dy-popover-wrapper">
    <!-- 触发器 -->
    <div
      ref="triggerRef"
      class="dy-popover-trigger"
      @mouseenter="handleTriggerMouseEnter"
      @mouseleave="handleTriggerMouseLeave"
      @click="handleTriggerClick"
      @focusin="handleTriggerFocus"
      @focusout="handleTriggerBlur"
    >
      <slot />
    </div>

    <!-- 弹出层 -->
    <div
      v-if="shouldRender"
      v-show="isVisible"
      ref="popoverRef"
      :class="popoverClass"
      :style="popoverStyle"
      @mouseenter="handlePopoverMouseEnter"
      @mouseleave="handlePopoverMouseLeave"
    >
      <div v-if="showArrow" class="dy-popover__arrow" />
      <div class="dy-popover__content">
        <slot name="content">{{ content }}</slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dy-popover-wrapper {
  position: relative;
  display: inline-block;
}

.dy-popover-trigger {
  display: inline-flex;
}

.dy-popover {
  position: absolute;
  z-index: var(--popover-z-index, 1050);
  border-radius: 8px;
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  animation: popover-fade-in 0.15s ease-out;

  @keyframes popover-fade-in {
    from {
      opacity: 0;
      transform: translateX(var(--popover-translate-x, -50%)) translateY(var(--popover-translate-y, 0)) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateX(var(--popover-translate-x, -50%)) translateY(var(--popover-translate-y, 0)) scale(1);
    }
  }

  // 主题
  &--dark {
    background-color: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(8px);
    color: rgba(255, 255, 255, 0.9);
  }

  &--light {
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(8px);
    color: rgba(0, 0, 0, 0.85);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  &__content {
    padding: 8px 12px;
    font-size: 14px;
    line-height: 1.5;
  }

  // 位置 - 底部
  &--bottom {
    --popover-translate-x: -50%;
    --popover-translate-y: 0;
    top: calc(100% + var(--popover-spacing, 8px));
    left: 50%;
    transform: translateX(-50%);
  }

  &--bottomLeft {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    top: calc(100% + var(--popover-spacing, 8px));
    left: 0;
  }

  &--bottomRight {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    top: calc(100% + var(--popover-spacing, 8px));
    right: 0;
  }

  // 位置 - 顶部
  &--top {
    --popover-translate-x: -50%;
    --popover-translate-y: 0;
    bottom: calc(100% + var(--popover-spacing, 8px));
    left: 50%;
    transform: translateX(-50%);
  }

  &--topLeft {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    bottom: calc(100% + var(--popover-spacing, 8px));
    left: 0;
  }

  &--topRight {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    bottom: calc(100% + var(--popover-spacing, 8px));
    right: 0;
  }

  // 位置 - 左侧
  &--left {
    --popover-translate-x: 0;
    --popover-translate-y: -50%;
    right: calc(100% + var(--popover-spacing, 8px));
    top: 50%;
    transform: translateY(-50%);
  }

  &--leftTop {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    right: calc(100% + var(--popover-spacing, 8px));
    top: 0;
  }

  &--leftBottom {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    right: calc(100% + var(--popover-spacing, 8px));
    bottom: 0;
  }

  // 位置 - 右侧
  &--right {
    --popover-translate-x: 0;
    --popover-translate-y: -50%;
    left: calc(100% + var(--popover-spacing, 8px));
    top: 50%;
    transform: translateY(-50%);
  }

  &--rightTop {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    left: calc(100% + var(--popover-spacing, 8px));
    top: 0;
  }

  &--rightBottom {
    --popover-translate-x: 0;
    --popover-translate-y: 0;
    left: calc(100% + var(--popover-spacing, 8px));
    bottom: 0;
  }

  // 箭头
  &--with-arrow {
    .dy-popover__arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background: inherit;
      transform: rotate(45deg);
      border: inherit;
    }
  }

  // 箭头位置 - 底部弹出时箭头在顶部
  &--bottom,
  &--bottomLeft,
  &--bottomRight {
    .dy-popover__arrow {
      top: -4px;
      left: 50%;
      margin-left: -4px;
      border-right: none;
      border-bottom: none;
    }
  }

  &--bottomLeft .dy-popover__arrow {
    left: 16px;
  }

  &--bottomRight .dy-popover__arrow {
    left: auto;
    right: 16px;
  }

  // 箭头位置 - 顶部弹出时箭头在底部
  &--top,
  &--topLeft,
  &--topRight {
    .dy-popover__arrow {
      bottom: -4px;
      left: 50%;
      margin-left: -4px;
      border-left: none;
      border-top: none;
    }
  }

  &--topLeft .dy-popover__arrow {
    left: 16px;
  }

  &--topRight .dy-popover__arrow {
    left: auto;
    right: 16px;
  }

  // 箭头位置 - 左侧弹出时箭头在右侧
  &--left,
  &--leftTop,
  &--leftBottom {
    .dy-popover__arrow {
      right: -4px;
      top: 50%;
      margin-top: -4px;
      border-left: none;
      border-bottom: none;
    }
  }

  &--leftTop .dy-popover__arrow {
    top: 16px;
  }

  &--leftBottom .dy-popover__arrow {
    top: auto;
    bottom: 16px;
  }

  // 箭头位置 - 右侧弹出时箭头在左侧
  &--right,
  &--rightTop,
  &--rightBottom {
    .dy-popover__arrow {
      left: -4px;
      top: 50%;
      margin-top: -4px;
      border-right: none;
      border-top: none;
    }
  }

  &--rightTop .dy-popover__arrow {
    top: 16px;
  }

  &--rightBottom .dy-popover__arrow {
    top: auto;
    bottom: 16px;
  }
}
</style>
