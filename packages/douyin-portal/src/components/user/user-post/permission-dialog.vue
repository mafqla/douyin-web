<script setup lang="ts">
import { ref, watch } from 'vue'

type PermissionType = 'video' | 'mix'

interface Props {
  modelValue: boolean
  // 类型：video-作品，mix-合集
  type?: PermissionType
  // 当前权限值
  currentPermission?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'video',
  currentPermission: 'public'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [permission: string]
  cancel: []
}>()

// 选中的权限
const selectedPermission = ref(props.currentPermission)

// 监听 currentPermission 变化
watch(() => props.currentPermission, (val) => {
  selectedPermission.value = val
})

// 权限选项
const videoPermissions = [
  { value: 'public', label: '公开', desc: '所有人可见' },
  { value: 'friends', label: '互相关注的人可见', desc: '' },
  { value: 'private', label: '私密', desc: '仅自己可见' }
]

const mixPermissions = [
  { value: 'public', label: '公开', desc: '所有人可见' },
  { value: 'private', label: '私密', desc: '仅自己可见' }
]

// 根据类型获取权限选项
const permissions = props.type === 'video' ? videoPermissions : mixPermissions

// 标题
const title = props.type === 'video' ? '修改作品权限' : '修改合集权限'

// 关闭弹框
const handleClose = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

// 确认
const handleConfirm = () => {
  emit('confirm', selectedPermission.value)
  emit('update:modelValue', false)
}

// 点击遮罩关闭
const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="permission-dialog-overlay" @click="handleOverlayClick">
        <Transition name="scale">
          <div v-if="modelValue" class="permission-dialog">
            <div class="dialog-header">
              <h3 class="dialog-title">{{ title }}</h3>
            </div>
            <div class="dialog-body">
              <div class="permission-list">
                <label
                  v-for="item in permissions"
                  :key="item.value"
                  class="permission-item"
                  :class="{ active: selectedPermission === item.value }"
                >
                  <input
                    type="radio"
                    :value="item.value"
                    v-model="selectedPermission"
                    class="permission-radio"
                  />
                  <span class="radio-icon">
                    <span class="radio-inner"></span>
                  </span>
                  <span class="permission-label">
                    {{ item.label }}
                    <span v-if="item.desc" class="permission-desc">· {{ item.desc }}</span>
                  </span>
                </label>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="btn btn-cancel" @click="handleClose">取消</button>
              <button class="btn btn-confirm" @click="handleConfirm">确认</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.permission-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.permission-dialog {
  width: 320px;
  background-color: var(--color-bg-b1);
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  padding: 20px 20px 0;
}

.dialog-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-t1);
  line-height: 24px;
}

.dialog-body {
  padding: 16px 20px;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;

  .permission-radio {
    display: none;
  }

  .radio-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--color-text-t3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    .radio-inner {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: transparent;
      transition: all 0.2s;
    }
  }

  &.active .radio-icon {
    border-color: var(--color-primary);

    .radio-inner {
      background-color: var(--color-primary);
    }
  }

  .permission-label {
    margin-left: 12px;
    font-size: 14px;
    color: var(--color-text-t1);
    line-height: 22px;

    .permission-desc {
      color: var(--color-text-t3);
    }
  }

  &:hover .radio-icon {
    border-color: var(--color-primary);
  }
}

.dialog-footer {
  display: flex;
  padding: 0 20px 20px;
  gap: 12px;
}

.btn {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &.btn-cancel {
    background-color: var(--color-bg-b3);
    color: var(--color-text-t1);

    &:hover {
      background-color: var(--color-bg-b4);
    }
  }

  &.btn-confirm {
    background: linear-gradient(135deg, #ff2c55 0%, #ff0050 100%);
    color: #fff;

    &:hover {
      opacity: 0.9;
    }
  }
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
