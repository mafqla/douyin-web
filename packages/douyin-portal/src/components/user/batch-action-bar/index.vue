<script setup lang="ts">
import { computed } from 'vue'

/**
 * 批量操作工具栏组件
 * 用于列表的批量选择和操作（全选、删除等）
 */

interface Props {
  // 当前选中的数量
  selectedCount?: number
  // 是否禁用操作按钮
  disabled?: boolean
  // 是否全选状态
  allSelected?: boolean
  // 操作按钮文本
  actionText?: string
  // 选中项提示文本模板（使用 {count} 作为占位符）
  selectedTextTemplate?: string
  // 是否显示加入收藏按钮
  showAddToCollection?: boolean
  // 加入收藏按钮文本
  addToCollectionText?: string
  // 是否显示移动到按钮
  showMoveTo?: boolean
  // 移动到按钮文本
  moveToText?: string
}

interface Emits {
  // 全选/取消全选事件
  (e: 'select-all'): void
  // 点击操作按钮事件
  (e: 'action'): void
  // 点击加入收藏按钮事件
  (e: 'add-to-collection'): void
  // 点击移动到按钮事件
  (e: 'move-to'): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedCount: 0,
  disabled: false,
  allSelected: false,
  actionText: '取消喜欢',
  selectedTextTemplate: '已选 {count} 个喜欢的作品',
  showAddToCollection: false,
  addToCollectionText: '加入收藏',
  showMoveTo: false,
  moveToText: '移动到'
})

const emit = defineEmits<Emits>()

// 复选框状态类名
const checkboxClass = computed(() => {
  if (props.allSelected) {
    return 'checkbox checked'
  }
  if (props.selectedCount > 0) {
    return 'checkbox indeterminate'
  }
  return 'checkbox'
})

// 操作按钮是否禁用
const isActionDisabled = computed(() => {
  return props.disabled || props.selectedCount === 0
})

// 选中项提示文本
const selectedText = computed(() => {
  return props.selectedTextTemplate.replace(
    '{count}',
    String(props.selectedCount)
  )
})

// 处理全选切换
const handleSelectAll = () => {
  emit('select-all')
}

// 处理操作按钮点击
const handleAction = () => {
  if (!isActionDisabled.value) {
    emit('action')
  }
}

// 处理加入收藏按钮点击
const handleAddToCollection = () => {
  if (!isActionDisabled.value) {
    emit('add-to-collection')
  }
}

// 处理移动到按钮点击
const handleMoveTo = () => {
  if (!isActionDisabled.value) {
    emit('move-to')
  }
}
</script>

<template>
  <div class="batch-action-bar">
    <div class="bar-container">
      <!-- 全选复选框 -->
      <div :class="checkboxClass">
        <span class="checkbox-icon" @click="handleSelectAll">
          <!-- 全选图标 -->
          <svg
            v-show="allSelected"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            focusable="false"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.4111 7.30848C18.0692 7.81171 18.1947 8.75312 17.6915 9.41119L11.1915 17.9112C10.909 18.2806 10.4711 18.4981 10.0061 18.5C9.54105 18.5019 9.10143 18.288 8.81592 17.9209L5.31592 13.4209C4.80731 12.767 4.92512 11.8246 5.57904 11.316C6.23296 10.8074 7.17537 10.9252 7.68398 11.5791L9.98988 14.5438L15.3084 7.58884C15.8116 6.93077 16.7531 6.80525 17.4111 7.30848Z"
              fill="currentColor"
            ></path>
          </svg>
          <!-- 半选图标 -->
          <svg
            v-show="selectedCount > 0 && !allSelected"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            focusable="false"
            aria-hidden="true"
          >
            <path
              d="M5 12.5C5 11.6716 5.67157 11 6.5 11H17.5C18.3284 11 19 11.6716 19 12.5C19 13.3284 18.3284 14 17.5 14H6.5C5.67157 14 5 13.3284 5 12.5Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
        <span class="checkbox-label" @click="handleSelectAll">
          {{ allSelected ? '取消全选' : '全选' }}
        </span>
      </div>

      <!-- 已选数量提示 -->
      <span class="selected-text">{{ selectedText }}</span>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 操作按钮 -->
      <div
        class="action-btn"
        :class="{ disabled: isActionDisabled }"
        :disabled="isActionDisabled"
        @click="handleAction"
      >
        <span class="action-icon">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
          >
            <path
              d="M13.0996 4.13379L13.2207 4.14551C13.4941 4.20152 13.6992 4.44352 13.6992 4.7334C13.6989 5.02305 13.4938 5.26533 13.2207 5.32129L13.0996 5.33301L12.5996 5.33203V11.1826C12.5994 12.6183 11.4356 13.782 10 13.7822H6C4.56427 13.7821 3.40059 12.6183 3.40039 11.1826V5.3291H2.90039L2.7793 5.31738C2.50621 5.26128 2.30096 5.01909 2.30078 4.72949C2.30091 4.39833 2.56931 4.13009 2.90039 4.12988L13.0996 4.13379ZM4.59961 11.1826C4.59981 11.9556 5.22701 12.5829 6 12.583H10C10.7729 12.5828 11.4002 11.9555 11.4004 11.1826V5.33203L4.59961 5.3291V11.1826ZM6.93066 6.9541C7.262 6.9541 7.5312 7.22238 7.53125 7.55371V10.3027L7.51855 10.4238C7.46231 10.6969 7.22034 10.9023 6.93066 10.9023C6.64135 10.9019 6.39888 10.6966 6.34277 10.4238L6.33105 10.3027V7.55371C6.33111 7.22271 6.59978 6.95463 6.93066 6.9541ZM9.06738 6.9541C9.39872 6.9541 9.66694 7.22238 9.66699 7.55371V10.3027L9.65527 10.4238C9.59906 10.6969 9.35708 10.9023 9.06738 10.9023C8.77795 10.902 8.53564 10.6967 8.47949 10.4238L8.46777 10.3027V7.55371C8.46782 7.2226 8.73635 6.95446 9.06738 6.9541ZM9.02246 2.21777C9.3537 2.21777 9.62186 2.48619 9.62207 2.81738L9.62109 2.82031L9.62207 2.82324C9.62207 3.15461 9.35383 3.42285 9.02246 3.42285H7.02246C6.6913 3.42261 6.42285 3.15446 6.42285 2.82324L6.42383 2.82031L6.42285 2.81738C6.42306 2.48634 6.69143 2.21801 7.02246 2.21777H9.02246Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
        <span class="action-text">{{ actionText }}</span>
      </div>
      <!-- 加入收藏按钮 -->
      <div
        v-if="showAddToCollection"
        class="action-btn"
        :class="{ disabled: isActionDisabled }"
        @click="handleAddToCollection"
      >
        <span class="action-icon">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            focusable="false"
          >
            <path
              d="M6.63672 2.40039C6.99696 2.40042 7.34735 2.52164 7.62988 2.74512L9.12207 3.92676C9.19261 3.98256 9.28018 4.01358 9.37012 4.01367H11.5137C12.864 4.01367 13.9734 5.04293 14.1016 6.3584L14.1143 6.625L14.0947 11.0117C14.0883 12.4431 12.9255 13.5996 11.4941 13.5996H4.48535C3.04959 13.5994 1.88574 12.4358 1.88574 11V5C1.88595 3.56437 3.04972 2.4006 4.48535 2.40039H6.63672ZM4.48535 3.59961C3.71246 3.59982 3.08517 4.22711 3.08496 5V11C3.08496 11.7731 3.71233 12.4002 4.48535 12.4004H11.4941C12.2649 12.4004 12.8911 11.7766 12.8945 11.0059L12.9141 6.61914L12.9072 6.47559C12.8379 5.76757 12.2406 5.21289 11.5137 5.21289H9.37012C9.00983 5.2128 8.65947 5.09174 8.37695 4.86816L6.88477 3.68652C6.81421 3.63082 6.72662 3.59964 6.63672 3.59961H4.48535ZM8.04004 6.58203C8.3711 6.58224 8.63944 6.85058 8.63965 7.18164V7.97852H9.4043C9.7355 7.97852 10.0046 8.24699 10.0049 8.57812C10.0049 8.9095 9.73567 9.17871 9.4043 9.17871H8.63965V9.98145C8.63965 10.3127 8.37123 10.5818 8.04004 10.582C7.70867 10.582 7.43945 10.3128 7.43945 9.98145V9.17871H6.60449C6.27331 9.17849 6.00488 8.90936 6.00488 8.57812C6.00516 8.24713 6.27348 7.97874 6.60449 7.97852H7.43945V7.18164C7.43966 6.85045 7.7088 6.58203 8.04004 6.58203Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
        <span class="action-text">{{ addToCollectionText }}</span>
      </div>
      <!-- 移动到按钮 -->
      <div
        v-if="showMoveTo"
        class="action-btn"
        :class="{ disabled: isActionDisabled }"
        @click="handleMoveTo"
      >
        <span class="action-icon">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            focusable="false"
          >
            <path
              d="M6.63672 2.40039C6.99696 2.40042 7.34735 2.52164 7.62988 2.74512L9.12207 3.92676C9.19261 3.98256 9.28018 4.01358 9.37012 4.01367H11.5137C12.864 4.01367 13.9734 5.04293 14.1016 6.3584L14.1143 6.625L14.0947 11.0117C14.0883 12.4431 12.9255 13.5996 11.4941 13.5996H4.48535C3.04959 13.5994 1.88574 12.4358 1.88574 11V5C1.88595 3.56437 3.04972 2.4006 4.48535 2.40039H6.63672ZM4.48535 3.59961C3.71246 3.59982 3.08517 4.22711 3.08496 5V11C3.08496 11.7731 3.71233 12.4002 4.48535 12.4004H11.4941C12.2649 12.4004 12.8911 11.7766 12.8945 11.0059L12.9141 6.61914L12.9072 6.47559C12.8379 5.76757 12.2406 5.21289 11.5137 5.21289H9.37012C9.00983 5.2128 8.65947 5.09174 8.37695 4.86816L6.88477 3.68652C6.81421 3.63082 6.72662 3.59964 6.63672 3.59961H4.48535ZM8.04004 6.58203C8.3711 6.58224 8.63944 6.85058 8.63965 7.18164V7.97852H9.4043C9.7355 7.97852 10.0046 8.24699 10.0049 8.57812C10.0049 8.9095 9.73567 9.17871 9.4043 9.17871H8.63965V9.98145C8.63965 10.3127 8.37123 10.5818 8.04004 10.582C7.70867 10.582 7.43945 10.3128 7.43945 9.98145V9.17871H6.60449C6.27331 9.17849 6.00488 8.90936 6.00488 8.57812C6.00516 8.24713 6.27348 7.97874 6.60449 7.97852H7.43945V7.18164C7.43966 6.85045 7.7088 6.58203 8.04004 6.58203Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
        <span class="action-text">{{ moveToText }}</span>
      </div>

      <!-- 额外操作按钮插槽（放在删除按钮旁边） -->
      <slot name="actions"></slot>

      <!-- 右侧插槽（用于放置搜索栏等） -->
      <div v-if="$slots.right" class="bar-right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.batch-action-bar {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  height: 72px;
  padding: 0;
}

.bar-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background-color: var(--color-fill-hover-alpha10);
  border-radius: 12px;
}

// 复选框样式
.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  .checkbox-icon {
    user-select: none;
    cursor: pointer;
    position: relative;
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: var(--color-text-3);
    transition: all 0.2s ease;
    box-shadow: inset 0 0 0 1px var(--color-text-3);
    border-radius: 4px;
    background: transparent;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .checkbox-label {
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    user-select: none;
    transition: color 0.2s ease;
  }

  // 选中状态文字高亮
  &.checked .checkbox-label,
  &.indeterminate .checkbox-label {
    color: var(--color-text-t0);
  }

  // 选中状态
  &.checked .checkbox-icon {
    background: linear-gradient(135deg, #ff2c55 0%, #ff0050 100%);
    box-shadow: none;
    color: #fff;
  }

  // 半选状态
  &.indeterminate .checkbox-icon {
    background: linear-gradient(135deg, #ff2c55 0%, #ff0050 100%);
    box-shadow: none;
    color: #fff;
  }

  &:hover .checkbox-icon {
    box-shadow: inset 0 0 0 1px rgba(254, 81, 110, 1);
  }

  // 选中和半选状态悬停时不显示边框
  &.checked:hover .checkbox-icon,
  &.indeterminate:hover .checkbox-icon {
    box-shadow: none;
  }
}

// 已选数量文本
.selected-text {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--color-text-t2);
  transition: color 0.2s ease;
}

// 选中状态时高亮已选数量文本
.checkbox.checked ~ .selected-text,
.checkbox.indeterminate ~ .selected-text {
  font-weight: 500;
  color: var(--color-text-t0);
}

// 分割线
.divider {
  width: 1px;
  height: 16px;
  margin: 0 20px;
  background-color: var(--color-line-l2);
}

// 操作按钮
.action-btn {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s;
  &:not(:last-child) {
    margin-right: 20px;
  }

  .action-icon {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--color-text-t2);
  }

  .action-text {
    margin-left: 4px;
    font-family: PingFang SC, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: var(--color-text-t2);
  }

  &:hover:not(.disabled) {
    opacity: 0.8;
  }

  &.disabled {
    cursor: not-allowed;

    .action-icon,
    .action-text {
      color: var(--color-text-t4);
    }
  }
}

// 右侧插槽容器
.bar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>
