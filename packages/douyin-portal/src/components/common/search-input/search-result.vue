<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { ISugItem } from '@/api/tyeps/request_response/searchSugRes'

const props = defineProps<{
  /** 搜索关键词 */
  searchText: string
  /** 搜索建议列表 */
  sugList: ISugItem[]
}>()

const { searchText, sugList } = toRefs(props)

/** 格式化后的搜索结果列表 */
const resultList = computed(() => {
  return sugList.value.map((item, index) => ({
    id: String(index),
    /** 搜索建议内容 */
    searchResultText: item.content,
    /** 热门标签图标 */
    tagIcon: item.extra_info?.tag_icon?.uri || '',
    /** 图标描述（如"热"） */
    iconDesc: item.extra_info?.icon_desc || '',
    /** 高亮位置 */
    highlightPos: item.pos || [],
    /** 词条记录 */
    wordRecord: item.word_record
  }))
})

/**
 * @description 高亮搜索关键词
 * @param text 原始文本
 * @returns 带高亮标签的HTML字符串
 */
const highlightedText = (text: string) => {
  if (!searchText.value) {
    return text
  }

  // 使用正则表达式进行全局搜索和替换，将匹配的关键字用 <span> 包裹以实现高亮
  const regex = new RegExp(searchText.value, 'gi')
  return text.replace(regex, (match: string) => {
    return `<span class="selected">${match}</span>`
  })
}
</script>
<template>
  <div class="search-result">
    <div class="search-result-content">
      <template v-for="item in resultList" :key="item.id">
        <div class="search-result-box">
          <!-- 搜索建议文本 -->
          <span
            class="search-result-text"
            v-html="highlightedText(item.searchResultText)"
          ></span>
          <!-- 热门标签 -->
          <img
            v-if="item.tagIcon"
            class="tag-icon"
            :src="item.tagIcon"
            :alt="item.iconDesc"
          />
          <!-- 右侧箭头图标 -->
          <div class="icon">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="U0Pto7FV"
            >
              <rect
                x="6"
                y="5"
                width="10"
                height="1.5"
                rx="0.75"
                fill="#4F5168"
              ></rect>
              <rect
                x="7.061"
                y="5"
                width="16"
                height="1.5"
                rx="0.75"
                transform="rotate(45 7.06 5)"
                fill="#4F5168"
              ></rect>
              <rect
                x="7.5"
                y="5"
                width="10"
                height="1.5"
                rx="0.75"
                transform="rotate(90 7.5 5)"
                fill="#4F5168"
              ></rect>
            </svg>
          </div>
        </div>
      </template>
      <!-- 无结果提示 -->
      <div v-if="resultList.length === 0" class="no-result">
        暂无搜索建议
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-result {
  left: -2px;
  position: absolute;
  top: 36px;
  width: calc(100% + 2px);
  z-index: 50;

  .search-result-content {
    //  background-color: var(--color-bg-b0);
    background-color: var(--color-bg-b1);
    // background-color: rgba(249, 249, 249, 1);
    // border: 1px solid #f2f2f4;
    border: 1px solid var(--color-secondary-default);
    // border: 1px solid rgba(242, 242, 243, 1);
    border-radius: 4px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
    box-sizing: content-box;
    margin-top: 5px;
    padding: 10px 0;
    width: 100%;

    .search-result-box {
      align-items: center;
      // color: #161823;
      color: var(--color-text-t1);
      // color: rgba(22, 24, 35, 1);
      cursor: pointer;
      display: flex;
      font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
      font-weight: 400;
      height: 32px;
      justify-content: space-between;
      padding: 0 20px;
      width: 100%;

      .search-result-text {
        flex-shrink: 1;
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
        margin-right: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .selected {
          // color: #fe2c55;
          color: var(--color-primary);
        }
      }

      .user-logo {
        align-items: center;
        display: flex;
        flex-shrink: 1;
        overflow: hidden;

        .user-logo-box {
          flex-shrink: 0;
          position: relative;

          &,
          & .user-logo-img {
            border-radius: 18px;
            height: 36px;
            width: 36px;
          }

          .user-logo-tag {
            border-radius: 6px;
            height: 12px;
            left: 24px;
            position: absolute;
            top: 24px;
            width: 12px;
          }
        }
        .user-info {
          flex-shrink: 1;
          margin-left: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .user-info-author {
            align-items: center;
            display: flex;

            .search-result-text {
              flex-shrink: 1;
              font-size: 14px;
              font-weight: 600;
              line-height: 22px;
              margin-right: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .user-info-num {
            // color: rgba(22, 24, 35, 0.75);
            color: var(--color-text-t2);
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .selected {
              // color: #fe2c55;
              color: var(--color-primary);
            }
          }
          .selected,
          .search-result-text {
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        }
      }
      &:hover {
        // background-color: #e4e4e6;
        background-color: var(--color-bg-b3);
        // background-color: rgba(228, 228, 230, 1);
        .icon {
          align-items: center;
          // color: #161823;
          color: var(--color-text-t1);
          // color: rgba(22, 24, 35, 1);
          display: flex;
          flex-shrink: 0;
          flex-wrap: nowrap;
          padding-left: 4px;
        }
      }
      &.search-result-user {
        height: 52px;
      }
    }
    .icon {
      display: none;
    }
    .user-text {
      // color: #161823;
      color: var(--color-text-t1);
      // color: rgba(22, 24, 35, 1);
      font-size: 12px;
      line-height: 20px;
    }
    .tag-icon {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      flex-shrink: 0;
    }
    .no-result {
      padding: 20px;
      text-align: center;
      color: var(--color-text-t2);
      font-size: 14px;
    }
  }
}

:deep(.selected) {
  // color: #fe2c55;
  color: var(--color-primary);
}
</style>
