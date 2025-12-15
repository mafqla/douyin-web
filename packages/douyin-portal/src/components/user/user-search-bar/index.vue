<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    placeholder?: string
  }>(),
  {
    placeholder: '搜索你赞过的作品'
  }
)

const emit = defineEmits<{
  search: [value: string]
  close: []
}>()

// 是否展开搜索框
const isExpanded = ref(false)
// 搜索关键词
const searchValue = ref('')
// 输入框 ref
const inputRef = ref<HTMLInputElement | null>(null)
// 搜索栏容器 ref
const searchBarRef = ref<HTMLElement | null>(null)

// 点击展开搜索框
const handleExpand = async (e: MouseEvent) => {
  e.stopPropagation()
  isExpanded.value = true
  await nextTick()
  inputRef.value?.focus()
}

// 完全关闭搜索（清空搜索结果）
const handleClose = () => {
  isExpanded.value = false
  searchValue.value = ''
  emit('close')
}

// 清空搜索内容并关闭搜索
const handleClear = () => {
  searchValue.value = ''
  emit('close')
  inputRef.value?.focus()
}

// 搜索
const handleSearch = () => {
  if (searchValue.value) {
    emit('search', searchValue.value)
  }
}

// 按下回车搜索
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  } else if (e.key === 'Escape') {
    handleClose()
  }
}

// 点击外部关闭搜索框（只有搜索框为空时才关闭）
const handleClickOutside = (e: MouseEvent) => {
  if (
    isExpanded.value &&
    !searchValue.value &&
    searchBarRef.value &&
    !searchBarRef.value.contains(e.target as Node)
  ) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="searchBarRef" class="user-search-bar">
    <!-- 默认状态：搜索图标+文字 -->
    <div class="search-default">
      <svg
        width="18"
        height="18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="search-icon"
        viewBox="0 0 16 16"
        @click="handleSearch"
      >
        <path
          d="M10.604 11.547a5.333 5.333 0 1 1 .943-.943l2.258 2.258a.667.667 0 1 1-.943.943l-2.258-2.258zm.73-4.214a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"
          fill="#fff"
        />
      </svg>
      <span v-if="!isExpanded" @click="handleExpand">{{ placeholder }}</span>
    </div>

    <!-- 展开状态：显示输入框 -->
    <div v-if="isExpanded" class="search-expanded">
      <input
        ref="inputRef"
        v-model="searchValue"
        type="text"
        class="search-input"
        :placeholder
        @keydown="handleKeydown"
      />
    </div>

    <!-- 清空按钮：只在有输入内容时显示 -->
    <svg
      v-if="isExpanded && searchValue"
      class="close-icon"
      @click="handleClear"
      width="18"
      height="18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm2.776-3.48a.746.746 0 0 0 .527-1.272L9.02 7.965l2.283-2.283a.746.746 0 0 0-1.054-1.054L7.966 6.91 5.682 4.628a.746.746 0 1 0-1.054 1.054l2.283 2.284-2.283 2.283a.747.747 0 0 0 .526 1.278.746.746 0 0 0 .528-.224L7.966 9.02l2.283 2.283c.14.14.33.218.527.218z"
        fill="#fff"
      ></path>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.user-search-bar {
  width: 138px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  .close-icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
    margin-left: 6px;
    fill: var(--color-text-t0);

    &:hover {
      fill: var(--color-text-t3);
    }
  }
}

// 默认状态 - 图标+文字
.search-default {
  color: var(--color-text-t3);
  height: 36px;
  align-items: center;
  font-size: 13px;
  line-height: 21px;
  display: flex;
  cursor: pointer;

  .search-icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
    flex-shrink: 0;
    margin-right: 4px;
  }

  span {
    cursor: text;
  }
}

// 展开状态
.search-expanded {
  color: var(--color-text-t0);
  border: none;
  border-bottom: 1px solid var(--color-text-t0);
  background: 0 0;
  border-top: 1px solid transparent;
  border-radius: 0;
  flex: 1;
  font-size: 13px;
  line-height: 21px;
  background-color: unset !important;
  height: 32px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif;

  vertical-align: middle;
  width: 100%;
  cursor: text;
  box-sizing: border-box;
  outline: none;
  display: inline-block;

  .search-input {
    width: 100%;
    color: inherit;
    box-sizing: border-box;
    background-color: transparent;
    border: none;
    outline: none;
    padding-left: 0;
    padding-right: 0;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
      Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
      sans-serif;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
