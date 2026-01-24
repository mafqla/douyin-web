<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { ToastInstance } from './types'

defineOptions({
  name: 'DyToastItem'
})

const props = defineProps<{
  toast: ToastInstance
}>()

const emit = defineEmits<{
  close: [id: number]
}>()

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

// 图标映射
const iconMap = {
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  success:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  error:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
}

// 颜色映射
const colorMap = {
  info: { normal: '#1890ff', light: '#e6f7ff' },
  success: { normal: '#52c41a', light: '#f6ffed' },
  warning: { normal: '#faad14', light: '#fffbe6' },
  error: { normal: '#ff4d4f', light: '#fff2f0' }
}

const iconPath = computed(() => iconMap[props.toast.type])
const iconColor = computed(() => colorMap[props.toast.type].normal)

const contentStyle = computed(() => ({
  maxWidth:
    typeof props.toast.textMaxWidth === 'number'
      ? `${props.toast.textMaxWidth}px`
      : props.toast.textMaxWidth
}))

const toastClass = computed(() => [
  'dy-toast',
  `dy-toast--${props.toast.type}`,
  `dy-toast--${props.toast.theme}`,
  { 'dy-toast--visible': visible.value }
])

const startTimer = () => {
  if (props.toast.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.toast.duration)
  }
}

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close', props.toast.id)
    props.toast.onClose?.()
  }, 300)
}

onMounted(() => {
  // 延迟显示以触发动画
  requestAnimationFrame(() => {
    visible.value = true
  })
  startTimer()
})

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<template>
  <div
    :class="toastClass"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
    role="alert"
  >
    <!-- 图标 -->
    <span v-if="toast.icon !== null" class="dy-toast__icon">
      <component v-if="toast.icon" :is="toast.icon" />
      <svg v-else viewBox="0 0 24 24" width="20" height="20" :fill="iconColor">
        <path :d="iconPath" />
      </svg>
    </span>

    <!-- 内容 -->
    <span class="dy-toast__content" :style="contentStyle">
      <component v-if="typeof toast.content !== 'string'" :is="toast.content" />
      <template v-else>{{ toast.content }}</template>
    </span>

    <!-- 关闭按钮 -->
    <button v-if="toast.showClose" class="dy-toast__close" @click="close">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.dy-toast {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  margin-bottom: 12px;
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  min-width: 200px;
  max-width: 400px;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }

  // 普通主题（默认白底）
  &--normal {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    color: rgba(0, 0, 0, 0.85);
    
    // info 类型使用深色背景（匹配截图 - 深灰色半透明）
    &.dy-toast--info {
      background: rgba(60, 63, 75, 0.95);
      backdrop-filter: blur(10px);
      color: rgba(255, 255, 255, 0.95);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
    }
  }

  // 浅色填充主题
  &--light {
    &.dy-toast--info {
      background: #e6f7ff;
      border: 1px solid #91d5ff;
    }
    &.dy-toast--success {
      background: #f6ffed;
      border: 1px solid #b7eb8f;
    }
    &.dy-toast--warning {
      background: #fffbe6;
      border: 1px solid #ffe58f;
    }
    &.dy-toast--error {
      background: #fff2f0;
      border: 1px solid #ffccc7;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    margin-right: 10px;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
    text-align: center;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
    padding: 0;
    border: none;
    background: transparent;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.2s;
    flex-shrink: 0;

    &:hover {
      color: rgba(0, 0, 0, 0.75);
    }
  }
  
  // 深色背景下的关闭按钮颜色
  &--normal.dy-toast--info &__close {
    color: rgba(255, 255, 255, 0.65);
    
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>
