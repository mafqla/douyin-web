<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect, computed } from 'vue'
import { useRouter } from 'vue-router'
import apis from '@/api/apis'
import type { ISugItem } from '@/api/tyeps/request_response/searchSugRes'
import { useCurrentVideoStore } from '@/stores/current-video'

const currentVideoStore = useCurrentVideoStore()

const isInputClicked = ref(false)
const isResult = ref(false)
const searchQuery = ref('')
// 搜索建议列表
const sugList = ref<ISugItem[]>([])

/**
 * 是否显示视频相关的搜索推荐词placeholder
 * 根据当前视频的suggest_words中是否存在scene="detail_inbox_rex"来决定
 */
const showVideoSuggestPlaceholder = computed(() => {
  return !!currentVideoStore.searchSuggestWord
})

/**
 * 搜索框placeholder文本
 */
const placeholderText = computed(() => {
  if (showVideoSuggestPlaceholder.value && currentVideoStore.searchSuggestWord) {
    return currentVideoStore.searchSuggestWord.word
  }
  return '搜索你感兴趣的内容'
})

// 清空搜索框
const clearSearch = () => {
  searchQuery.value = ''
}
/**
 * @description 获取搜索建议
 * @param keyword 搜索关键词
 */
const fetchSearchSug = async (keyword: string) => {
  if (!keyword.trim()) {
    sugList.value = []
    return
  }
  try {
    const res = await apis.getSearchSug(keyword)
    if (res.status_code === 0) {
      sugList.value = res.sug_list || []
    }
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    sugList.value = []
  }
}

// 监听输入事件，如果用户开始输入，则隐藏
const handleInput = () => {
  if (searchQuery.value.length > 100) {
    searchQuery.value = searchQuery.value.slice(0, 100) // 截断输入的字符
  }
  if (searchQuery.value !== '') {
    isResult.value = true
    isInputClicked.value = false
    // 获取搜索建议
    fetchSearchSug(searchQuery.value)
  } else if (searchQuery.value === '') {
    isInputClicked.value = true
    isResult.value = false
    sugList.value = []
  }
}
// search-recommend 组件引用
const searchRecommendRef = ref()

const handleFocus = () => {
  if (searchQuery.value !== '') {
    isResult.value = true
  } else {
    isInputClicked.value = true
    // 刷新猜你想搜列表（调用searchSuggest接口）
    searchRecommendRef.value?.refreshGuessList()
  }
}

const handleBlur = () => {
  isInputClicked.value = false
  isResult.value = false
}

watchEffect(() => {
  // console.log(searchQuery.value)
  if (searchQuery.value !== '') {
    isResult.value = true
  } else {
    isResult.value = false
  }
})

//触发搜索框的focus事件
const input = ref()
//点击触发搜索框的focus事件
const handleClick = () => {
  input.value.focus()
  handleFocus()
}
const search = ref()
const handleClickOutside = (event: Event) => {
  if (!search.value || !input.value) return
  if (!search.value.contains(event.target)) {
    input.value.blur()
    handleBlur()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const router = useRouter()
/**
 * @description: 点击搜索按钮，跳转路由进行搜索
 * @return {*}
 */
const handleSearch = () => {
  console.log('搜索关键词：', searchQuery.value)
  if (searchQuery.value.trim() !== '') {
    window.open(`/search/${searchQuery.value}?type=general`, '_blank')
  }
}
</script>
<template>
  <div class="search-input" @click="handleClick" ref="search">
    <div class="header-search-form">
      <div class="clear-search" v-if="searchQuery !== ''" @click="clearSearch">
        <svg
          width="12"
          height="13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="gMkV3yx8"
        >
          <rect
            y="11.907"
            width="15.428"
            height="1.543"
            rx="0.771"
            transform="rotate(-45 0 11.907)"
            fill="#2F3035"
          ></rect>
          <rect
            x="1.09"
            y="0.998"
            width="15.428"
            height="1.543"
            rx="0.771"
            transform="rotate(45 1.09 .998)"
            fill="#2F3035"
          ></rect>
        </svg>
      </div>
      <!-- 视频相关推荐词placeholder -->
      <div class="input-placeholder" v-if="showVideoSuggestPlaceholder && searchQuery === ''">
        <div class="input-placeholder-text">{{ placeholderText }}</div>
      </div>
      <input
        type="text"
        :placeholder="showVideoSuggestPlaceholder ? '' : '搜索你感兴趣的内容'"
        class="header-search-input"
        v-model="searchQuery"
        @input="handleInput"
        @keyup.enter="handleSearch"
        :maxlength="100"
        ref="input"
      />
    </div>
    <!--|-->
    <div class="center-border"></div>
    <button @click="handleSearch">
      <svg-icon class="icon-search" icon="search" />
      <span class="btn-title">搜索</span>
    </button>
    <search-recommend ref="searchRecommendRef" v-show="isInputClicked" @click="handleClick" />
    <search-result v-show="isResult" :searchText="searchQuery" :sugList="sugList" />
  </div>
</template>

<style lang="scss" scoped>
.search-input {
  border: 1px solid;
  border-radius: 12px;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 1;
  height: 40px;
  width: 100%;
  z-index: 100;
  position: relative;
  background: var(--input-bg-color);
  border: 1px solid var(--input-border-color);
  max-width: 600px;

  .header-search-form {
    align-items: center;
    display: flex;
    flex: 1 1;
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 50;
  }

  .center-border {
    width: 1px;
    height: 16px;
    border-left: 1px solid var(--input-border-color-2);
    position: relative;
    right: -4px;
  }
  .clear-search {
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 100%;
    position: absolute;
    right: 16px;
    top: 0;
    z-index: 110;
  }
  button {
    align-items: center;
    background: 0 0;
    border: none;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    cursor: pointer;
    display: flex;
    height: 100%;
    justify-content: center;
    // width: 69px;
    // width: 64px;
    z-index: 50;
    right: -2px;
    width: 73px;
    position: relative;

    .icon-search {
      width: 18px;
      height: 18px;
      color: var(--btn-title-color);
    }

    .btn-title {
      color: var(--btn-title-color);
      // color: var(--color-text-t1);
      margin-left: 3px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      user-select: none;
    }
  }
  .input-placeholder {
    height: 100%;
    z-index: 50;
    max-width: calc(100% - 32px);
    align-items: center;
    display: flex;
    position: absolute;
    top: 0;
    left: 12px;
    overflow: hidden;

    .input-placeholder-text {
      color: var(--input-text-color);
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      // font-size: 14px;
      // font-weight: 400;
      line-height: 22px;
      overflow: hidden;

      font-size: 16px;
      font-weight: 500;
    }
  }
  .header-search-input {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-shrink: 1;
    align-items: center;
    border-bottom-left-radius: 12px !important;
    border-top-left-radius: 12px !important;
    height: 40px;
    padding: 0 12px;
    // background-color: transparent;
    background: 0 0;
    margin: 0;
    border: none;
    outline: none;
    caret-color: #fe2c55;
    user-select: none;
    opacity: 1;
    font-size: 16px;
    font-weight: 500;
    color: var(--input-text-color);

    &::placeholder {
      // color: rgba(47, 48, 53, 0.4);
      // color: var(--color-text-t4);

      color: var(--input-text-color);
    }
  }

  &:hover {
    border: 2px solid var(--color-text-t1);
    button {
      background-color: var(--color-text-t0);
      border-bottom-right-radius: 12px;
      border-top-right-radius: 12px;
      right: -2px;
      width: 73px;
      position: relative;

      .icon-search {
        color: var(--btn-title-color-hover);
      }
      .btn-title {
        color: var(--btn-title-color-hover);
      }
    }
  }
}

.main.user {
  // .search {
  //   border: 2px solid hsla(0, 0%, 100%, 0.3) !important;
  //   background-color: transparent !important;
  //   .header-search-input {
  //     &::placeholder {
  //       color: rgba(255, 255, 255, 1) !important ;
  //     }
  //   }

  //   button {
  //     // background-color: hsla(0, 0%, 100%, 0.3) !important;
  //     .icon-search {
  //       color: #fff;
  //     }
  //     .btn-title {
  //       color: #fff !important;
  //     }
  //   }

  //   &:hover {
  //     button {
  //       background-color: hsla(0, 0%, 100%, 0.3) !important;
  //       .icon-search {
  //         color: #fff;
  //       }
  //       .btn-title {
  //         color: #fff;
  //       }
  //     }
  //   }
  // }

  // .header.scrolled {
  //   .search-input {
  //     background-color: var(--color-bg-b0) !important;
  //     border: 2px solid var(--input-border) !important;
  //     .header-search-input {
  //       &::placeholder {
  //         color: var(--color-text-t4) !important ;
  //       }
  //     }

  //     button {
  //       background-color: transparent;
  //       .icon-search {
  //         color: var(--color-text-t1) !important;
  //       }
  //       .btn-title {
  //         color: var(--color-text-t1) !important;
  //       }
  //     }

  //     &:hover {
  //       button {
  //         background-color: var(--color-text-t0) !important;

  //         .icon-search {
  //           color: var(--color-const-text-white) !important;
  //         }
  //         .btn-title {
  //           color: var(--color-const-text-white) !important;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>
