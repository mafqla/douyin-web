<script setup lang="ts">
/**
 * HoverDropdown 悬停下拉菜单组件
 *
 * @description 鼠标悬停时显示下拉菜单，支持自动计算位置避免超出视口，也可手动指定位置
 *
 * @example 基础用法
 * ```vue
 * <HoverDropdown>
 *   <template #trigger>
 *     <button>悬停显示菜单</button>
 *   </template>
 *   <template #content>
 *     <div class="menu-item">选项1</div>
 *     <div class="menu-item">选项2</div>
 *   </template>
 * </HoverDropdown>
 * ```
 *
 * @example 指定位置
 * ```vue
 * <HoverDropdown placement="top-start">
 *   <template #trigger>
 *     <button>菜单在上方显示</button>
 *   </template>
 *   <template #content>
 *     <div>内容</div>
 *   </template>
 * </HoverDropdown>
 * ```
 *
 * @example 自定义样式
 * ```vue
 * <HoverDropdown
 *   :offset="8"
 *   :show-delay="100"
 *   :hide-delay="150"
 *   content-class="my-custom-menu"
 * >
 *   ...
 * </HoverDropdown>
 * ```
 *
 * @props
 * - placement: 菜单位置，支持 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end' | 'auto'
 * - offset: 菜单与触发元素的间距，默认 4px
 * - showDelay: 显示延迟时间(ms)，默认 0
 * - hideDelay: 隐藏延迟时间(ms)，默认 100
 * - disabled: 是否禁用，默认 false
 * - contentClass: 自定义内容区域的 class
 * - zIndex: 菜单层级，默认 100
 *
 * @slots
 * - trigger: 触发元素插槽
 * - content: 下拉菜单内容插槽
 *
 * @events
 * - show: 菜单显示时触发
 * - hide: 菜单隐藏时触发
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// 位置类型定义
type Placement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'auto'

const props = withDefaults(
  defineProps<{
    /** 菜单位置，'auto' 时自动计算最佳位置 */
    placement?: Placement
    /** 菜单与触发元素的间距(px) */
    offset?: number
    /** 显示延迟时间(ms) */
    showDelay?: number
    /** 隐藏延迟时间(ms)，建议设置一定延迟避免鼠标移动时闪烁 */
    hideDelay?: number
    /** 是否禁用悬停触发 */
    disabled?: boolean
    /** 自定义内容区域的 class */
    contentClass?: string
    /** 菜单层级 */
    zIndex?: number
  }>(),
  {
    placement: 'auto',
    offset: 4,
    showDelay: 0,
    hideDelay: 100,
    disabled: false,
    contentClass: '',
    zIndex: 100,
  }
)

const emit = defineEmits<{
  show: []
  hide: []
}>()

// 是否显示菜单
const visible = ref(false)
// 触发元素引用
const triggerRef = ref<HTMLElement | null>(null)
// 内容元素引用
const contentRef = ref<HTMLElement | null>(null)
// 计算后的实际位置
const actualPlacement = ref<Exclude<Placement, 'auto'>>('bottom-start')
// 定时器
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

// 内容样式
const contentStyle = computed(() => ({
  zIndex: props.zIndex,
}))

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

// 计算最佳位置
const calculatePlacement = (): Exclude<Placement, 'auto'> => {
  if (!triggerRef.value || !contentRef.value) return 'bottom-start'

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  // 计算各方向可用空间
  const spaceAbove = triggerRect.top
  const spaceBelow = viewportHeight - triggerRect.bottom
  const spaceLeft = triggerRect.left
  const spaceRight = viewportWidth - triggerRect.right

  // 判断是否适合水平方向（左/右）
  const canPlaceRight = spaceRight >= contentRect.width + props.offset
  const canPlaceLeft = spaceLeft >= contentRect.width + props.offset
  const canPlaceBottom = spaceBelow >= contentRect.height + props.offset
  const canPlaceTop = spaceAbove >= contentRect.height + props.offset

  // 优先级：下方 > 上方 > 右侧 > 左侧
  let primary: 'top' | 'bottom' | 'left' | 'right' = 'bottom'

  if (canPlaceBottom) {
    primary = 'bottom'
  } else if (canPlaceTop) {
    primary = 'top'
  } else if (canPlaceRight) {
    primary = 'right'
  } else if (canPlaceLeft) {
    primary = 'left'
  }

  // 确定对齐方式
  let alignment: 'start' | '' | 'end' = 'start'

  if (primary === 'top' || primary === 'bottom') {
    // 垂直方向：确定水平对齐
    const contentWidth = contentRect.width
    if (triggerRect.left + contentWidth > viewportWidth) {
      if (triggerRect.right - contentWidth >= 0) {
        alignment = 'end'
      } else {
        alignment = ''
      }
    }
  } else {
    // 水平方向：确定垂直对齐
    const contentHeight = contentRect.height
    if (triggerRect.top + contentHeight > viewportHeight) {
      if (triggerRect.bottom - contentHeight >= 0) {
        alignment = 'end'
      } else {
        alignment = ''
      }
    }
  }

  return `${primary}${alignment ? '-' + alignment : ''}` as Exclude<
    Placement,
    'auto'
  >
}

// 更新位置
const updatePlacement = async () => {
  if (props.placement !== 'auto') {
    actualPlacement.value = props.placement
    return
  }

  // 等待 DOM 更新后计算位置
  await nextTick()
  actualPlacement.value = calculatePlacement()
}

// 显示菜单
const show = () => {
  if (props.disabled) return

  clearTimers()

  if (props.showDelay > 0) {
    showTimer = setTimeout(() => {
      visible.value = true
      updatePlacement()
      emit('show')
    }, props.showDelay)
  } else {
    visible.value = true
    updatePlacement()
    emit('show')
  }
}

// 隐藏菜单
const hide = () => {
  clearTimers()

  if (props.hideDelay > 0) {
    hideTimer = setTimeout(() => {
      visible.value = false
      emit('hide')
    }, props.hideDelay)
  } else {
    visible.value = false
    emit('hide')
  }
}

// 鼠标进入
const handleMouseEnter = () => {
  show()
}

// 鼠标离开
const handleMouseLeave = () => {
  hide()
}

// 窗口大小变化时重新计算位置
const handleResize = () => {
  if (visible.value) {
    updatePlacement()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  clearTimers()
  window.removeEventListener('resize', handleResize)
})

// 暴露方法供外部调用
defineExpose({
  show,
  hide,
  visible,
})
</script>

<template>
  <div
    class="hover-dropdown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 触发元素 -->
    <div ref="triggerRef" class="hover-dropdown__trigger">
      <slot name="trigger" />
    </div>

    <!-- 下拉内容 -->
    <Transition name="hover-dropdown-fade">
      <div
        v-if="visible"
        ref="contentRef"
        class="hover-dropdown__content"
        :class="[`hover-dropdown__content--${actualPlacement}`, contentClass]"
        :style="contentStyle"
      >
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.hover-dropdown {
  position: relative;
  display: inline-block;

  &__trigger {
    display: inline-flex;
  }

  &__content {
    position: absolute;
    background-color: var(--color-bg-b1);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.4);

    // 底部位置
    &--bottom-start {
      top: calc(100% + v-bind('`${offset}px`'));
      left: 0;
    }

    &--bottom {
      top: calc(100% + v-bind('`${offset}px`'));
      left: 50%;
      transform: translateX(-50%);
    }

    &--bottom-end {
      top: calc(100% + v-bind('`${offset}px`'));
      right: 0;
    }

    // 顶部位置
    &--top-start {
      bottom: calc(100% + v-bind('`${offset}px`'));
      left: 0;
    }

    &--top {
      bottom: calc(100% + v-bind('`${offset}px`'));
      left: 50%;
      transform: translateX(-50%);
    }

    &--top-end {
      bottom: calc(100% + v-bind('`${offset}px`'));
      right: 0;
    }

    // 左侧位置
    &--left-start {
      right: calc(100% + v-bind('`${offset}px`'));
      top: 0;
    }

    &--left {
      right: calc(100% + v-bind('`${offset}px`'));
      top: 50%;
      transform: translateY(-50%);
    }

    &--left-end {
      right: calc(100% + v-bind('`${offset}px`'));
      bottom: 0;
    }

    // 右侧位置
    &--right-start {
      left: calc(100% + v-bind('`${offset}px`'));
      top: 0;
    }

    &--right {
      left: calc(100% + v-bind('`${offset}px`'));
      top: 50%;
      transform: translateY(-50%);
    }

    &--right-end {
      left: calc(100% + v-bind('`${offset}px`'));
      bottom: 0;
    }
  }
}

// 过渡动画
.hover-dropdown-fade-enter-active,
.hover-dropdown-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.hover-dropdown-fade-enter-from,
.hover-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
