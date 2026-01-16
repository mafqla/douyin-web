<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  status: number
  directory: number
  category: number
}>()

const emit = defineEmits<{
  'update:status': [value: number]
  'update:directory': [value: number]
  'update:category': [value: number]
}>()

// 筛选面板状态
const showFilterPanel = ref(false)

// 筛选选项配置
const statusOptions = [
  { label: '不限', value: -1 },
  { label: '未看完', value: 0 },
  { label: '已看完', value: 1 }
]

const directoryOptions = [
  { label: '不限', value: 0 },
  { label: '小于1分钟', value: 1 },
  { label: '1-3分钟', value: 2 },
  { label: '3-10分钟', value: 3 },
  { label: '10分钟以上', value: 4 }
]

const categoryOptions = [
  { label: '不限', value: 0 },
  { label: '二次元', value: 1 },
  { label: '音乐', value: 2 },
  { label: '体育', value: 3 },
  { label: '电影', value: 4 },
  { label: '游戏', value: 5 }
]

// 是否有筛选条件
const hasFilter = computed(() => {
  return props.status !== -1 || props.directory !== 0 || props.category !== 0
})

// 显示筛选面板
const openFilterPanel = () => {
  showFilterPanel.value = true
}

// 关闭筛选面板
const closeFilterPanel = () => {
  showFilterPanel.value = false
}

// 选择筛选项
const selectStatus = (value: number) => {
  emit('update:status', value)
}

const selectDirectory = (value: number) => {
  emit('update:directory', value)
}

const selectCategory = (value: number) => {
  emit('update:category', value)
}
</script>

<template>
  <div
    class="filter-wrapper"
    @mouseenter="openFilterPanel"
    @mouseleave="closeFilterPanel"
  >
    <div class="filter-btn" :class="{ active: showFilterPanel || hasFilter }">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        focusable="false"
      >
        <path
          d="M9.57279 8.09939C9.49061 8.19117 9.44521 8.31006 9.44529 8.43325L9.4486 13.4187C9.44885 13.7904 9.05791 14.0324 8.72535 13.8664L6.7803 12.8958C6.61085 12.8113 6.50371 12.6383 6.50355 12.4489L6.50001 8.45976C6.4999 8.3388 6.45596 8.22199 6.37631 8.13096L3.12359 4.41334C3.04382 4.32217 2.99986 4.20513 2.99988 4.08399L3.00005 3.27208C3.00011 2.99598 3.22395 2.77218 3.50005 2.77218L12.5001 2.77218C12.7762 2.77218 13.0001 2.9961 13.0001 3.27229L12.9999 4.08083C12.9999 4.20388 12.9545 4.32259 12.8724 4.41426L9.57279 8.09939Z"
          stroke="currentColor"
          stroke-width="1.2"
        ></path>
      </svg>
      <span class="filter-text">筛选</span>
      <svg
        v-if="showFilterPanel"
        class="arrow-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
      >
        <path
          d="M6 15L12 9L18 15"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-else
        class="arrow-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <!-- 筛选面板 -->
    <div v-if="showFilterPanel" class="filter-panel">
      <div class="filter-section">
        <div class="filter-title">观看进度</div>
        <div class="filter-options">
          <span
            v-for="option in statusOptions"
            :key="option.value"
            class="filter-option"
            :class="{ active: status === option.value }"
            @click="selectStatus(option.value)"
          >
            {{ option.label }}
          </span>
        </div>
      </div>
      <div class="filter-section">
        <div class="filter-title">视频时长</div>
        <div class="filter-options">
          <span
            v-for="option in directoryOptions"
            :key="option.value"
            class="filter-option"
            :class="{ active: directory === option.value }"
            @click="selectDirectory(option.value)"
          >
            {{ option.label }}
          </span>
        </div>
      </div>
      <div class="filter-section">
        <div class="filter-title">视频分类</div>
        <div class="filter-options">
          <span
            v-for="option in categoryOptions"
            :key="option.value"
            class="filter-option"
            :class="{ active: category === option.value }"
            @click="selectCategory(option.value)"
          >
            {{ option.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-wrapper {
  position: relative;
  margin-left: 16px;
}

.filter-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--color-text-t3);
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover,
  &.active {
    color: var(--color-text-t1);
  }

  .filter-text {
    margin: 0 4px;
  }

  .arrow-icon {
    font-size: 12px;
  }
}

.filter-panel {
  position: absolute;
  top: 100%;
  right: -60px;
  z-index: 100;
  background: var(--color-bg-0);
  width: 468px;
  box-sizing: border-box;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 0 24px 0 var(--color-shadow1);

  .filter-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .filter-title {
    color: var(--color-text-t1);
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }

  .filter-options {
    flex-wrap: wrap;
    gap: 8px;
    display: flex;
  }

  .filter-option {
    color: var(--color-text-t3);
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;

    &:hover {
      background-color: var(--color-fill-hover);
      color: var(--color-text-t0);
    }

    &.active {
      color: var(--color-primary-default);
    }
  }
}
</style>
