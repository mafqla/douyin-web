<script setup lang="ts">
import { watchEffect } from 'vue'

/**
 * 用户模块通用确认对话框组件
 * 用于用户相关的各类二次确认操作（删除、取消喜欢、取消关注等）
 */

interface Props {
  // 主要提示文本
  title?: string
  // 次要提示文本（如数量统计等）
  description?: string
  // 取消按钮文本
  cancelText?: string
  // 确认按钮文本
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  cancelText: '取消',
  confirmText: '确认'
})

const show = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// 监听弹框打开/关闭，控制 body 滚动
watchEffect(() => {
  if (show.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.removeProperty('overflow')
  }
})

// 关闭弹框
const close = () => {
  show.value = false
  emit('cancel')
}

// 确认操作
const handleConfirm = () => {
  emit('confirm')
  close()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="user-confirm-dialog">
      <div class="dialog-content">
        <!-- 主要提示文本 -->
        <div v-if="title || $slots.title" class="dialog-title">
          <slot name="title">{{ title }}</slot>
        </div>

        <!-- 次要提示文本 -->
        <div
          v-if="description || $slots.description"
          class="dialog-description"
        >
          <slot name="description">{{ description }}</slot>
        </div>

        <!-- 默认插槽（用于自定义内容）-->
        <div v-if="$slots.default" class="dialog-body">
          <slot></slot>
        </div>

        <!-- 底部按钮 -->
        <div class="dialog-actions">
          <button class="btn-cancel" @click="close">{{ cancelText }}</button>
          <button class="btn-confirm" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.user-confirm-dialog {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--color-mask-m1);
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog-content {
    width: 320px;
    background: var(--color-bg-b1);
    z-index: 10;
    border-radius: 16px;
    padding: 24px;
    animation: 0.4s cubic-bezier(0.34, 0.69, 0.1, 1) slideUp, 0.2s linear fadeIn;
    position: relative;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  }

  .dialog-title {
    color: var(--color-text-t1);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  .dialog-description {
    color: var(--color-text-t2);
    font-size: 14px;
    line-height: 20px;
    margin-top: 8px;
  }

  .dialog-body {
    margin-top: 12px;
  }

  .dialog-actions {
    justify-content: center;
    display: flex;
    margin-top: 24px;
    gap: 12px;

    button {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      height: 36px;
      line-height: 22px;
      min-width: 88px;
      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      outline: none;
      padding: 0 16px;
      position: relative;
      flex: 1;
      transition: all 0.2s ease;
    }

    .btn-confirm {
      background-color: var(--color-primary);
      color: var(--color-const-text-white);

      &:hover {
        background-color: var(--color-primary-hover);
      }

      &:active {
        transform: scale(0.98);
      }
    }

    .btn-cancel {
      background-color: var(--secondary-bg-color);
      color: var(--color-text-t1);

      &:hover {
        background-color: var(--color-fill-hover-alpha10);
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
