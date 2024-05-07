<script setup lang="ts">
import type { Word } from '@/api/tyeps/request_response/searchResponse'
import { ref } from 'vue'

const props = defineProps({
  searchData: {
    type: Array as () => Word[],
    required: true
  },
  query: {
    type: String,
    required: true
  }
})

const word = ref(props.searchData)
const highlightText = (text: string, query: string): string => {
  const regexQuery = new RegExp(`[${query}]+`, 'gi')
  const matches: string[] = []

  // 将每个连续匹配的字符串存储到数组中
  text.replace(regexQuery, (match) => {
    matches.push(match)
    return match
  })

  // 处理过滤后的文本
  const filteredText: string[] = []
  let currentIndex = 0

  matches.forEach((match) => {
    const index = text.indexOf(match, currentIndex)
    if (index > currentIndex) {
      filteredText.push(
        `<span class="default-margin">${text.substring(
          currentIndex,
          index
        )}</span>`
      )
    }
    filteredText.push(`<span class="highlight-text">${match}</span>`)
    currentIndex = index + match.length
  })

  if (currentIndex < text.length) {
    filteredText.push(
      `<span class="default-margin">${text.substring(currentIndex)}</span>`
    )
  }

  return filteredText.join('')
}
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-title">相关搜索</div>
    <ul class="sidebar-list">
      <li class="sidebar-item" v-for="item in word" :key="item.id">
        <svg-icon icon="sider-search" class="sidebar-item-icon" />
        <span v-html="highlightText(item.word, query)"></span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-content {
  position: fixed;
  top: 68px;
  margin-top: 90px;
  .sidebar-title {
    font-size: 18px;
    margin-bottom: 16px;
    margin-left: 4px;

    color: var(--color-text-t1);
    font-weight: 500;
    line-height: 26px;
  }
  .sidebar-list {
    align-items: flex-start;
    display: flex;
    flex-direction: column;

    .sidebar-item {
      border-radius: 6px;
      color: var(--color-text-t1);
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      height: 36px;
      line-height: 24px;
      max-width: 100%;
      overflow: hidden;
      padding: 6px 12px 6px 2px;
      text-overflow: ellipsis;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      white-space: nowrap;
      width: 100%;

      &:hover {
        background-color: var(--color-fill-hover);
      }

      .sidebar-item-icon {
        width: 24px;
        height: 24px;
        color: var(--color-text-t4);
        margin-top: -3px;
      }
      :deep(.highlight-text) {
        color: var(--color-text-t3);
      }
    }
    :deep(.default-margin) {
      margin-right: 1px;
    }
  }
}
</style>
