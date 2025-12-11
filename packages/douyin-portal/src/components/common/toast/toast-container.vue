<script setup lang="ts">
import { computed } from 'vue'
import ToastItem from './toast-item.vue'
import type { ToastInstance, ToastConfig } from './types'

const props = defineProps<{
  toasts: ToastInstance[]
  config: ToastConfig
}>()

const emit = defineEmits<{
  close: [id: number]
}>()

const containerStyle = computed(() => {
  const { top, bottom, left, right, zIndex } = props.config

  const style: Record<string, string | number> = {
    position: 'fixed',
    zIndex: zIndex || 1010,
    pointerEvents: 'none'
  }

  // 位置处理
  if (top !== undefined) {
    style.top = typeof top === 'number' ? `${top}px` : top
  } else if (bottom !== undefined) {
    style.bottom = typeof bottom === 'number' ? `${bottom}px` : bottom
  } else {
    style.top = '24px'
  }

  if (left !== undefined) {
    style.left = typeof left === 'number' ? `${left}px` : left
  } else if (right !== undefined) {
    style.right = typeof right === 'number' ? `${right}px` : right
  } else {
    // 默认水平居中
    style.left = '50%'
    style.transform = 'translateX(-50%)'
  }

  return style
})
</script>

<template>
  <Teleport :to="config.getPopupContainer?.() || 'body'">
    <div class="dy-toast-container" :style="containerStyle">
      <TransitionGroup name="toast">
        <ToastItem
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @close="emit('close', $event)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.dy-toast-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// 动画
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
