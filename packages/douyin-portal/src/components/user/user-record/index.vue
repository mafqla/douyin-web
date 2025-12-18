<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecordVideo from './record-video.vue'
import RecordVs from './record-vs/index.vue'
import RecordLive from './record-live/index.vue'
import RecordVisited from './record-visited/index.vue'
import RecordFilter from './record-filter.vue'
import UserSearchBar from '../user-search-bar/index.vue'
import apis from '@/api/apis'
import { userStore } from '@/stores/user'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

const route = useRoute()
const router = useRouter()
const store = userStore()
const tabs = ['user', 'video', 'vs', 'live']
const activeTab = ref((route.query.showSubTab as string) || 'video')

// RecordVideo 组件引用
const recordVideoRef = ref<InstanceType<typeof RecordVideo> | null>(null)

// 当前筛选值
const currentStatus = ref(-1)
const currentDirectory = ref(0)
const currentCategory = ref(0)

// 筛选变更处理
const handleStatusChange = (value: number) => {
  currentStatus.value = value
  recordVideoRef.value?.handleFilterChange(value, undefined, undefined)
}

const handleDirectoryChange = (value: number) => {
  currentDirectory.value = value
  recordVideoRef.value?.handleFilterChange(undefined, value, undefined)
}

const handleCategoryChange = (value: number) => {
  currentCategory.value = value
  recordVideoRef.value?.handleFilterChange(undefined, undefined, value)
}

// 搜索相关状态
const isSearching = ref(false)
const searchKeyword = ref('')
const searchList = ref<IAwemeInfo[]>([])
const searchLoading = ref(false)
const searchHasMore = ref(true)
const searchOffset = ref(0)
const searchResultText = ref('')

// 搜索观看历史视频
const handleSearch = async (keyword: string) => {
  if (!keyword.trim()) {
    isSearching.value = false
    searchKeyword.value = ''
    searchList.value = []
    searchOffset.value = 0
    searchHasMore.value = true
    searchResultText.value = ''
    return
  }

  isSearching.value = true
  searchKeyword.value = keyword
  searchLoading.value = true
  searchOffset.value = 0
  searchList.value = []
  searchHasMore.value = true

  try {
    const res = await apis.getUserHomeSearch({
      search_channel: 'aweme_viewed_video',
      search_source: 'normal_search',
      search_scene: 'douyin_search',
      sort_type: 0,
      publish_time: 0,
      is_filter_search: 0,
      query_correct_type: 1,
      keyword,
      enable_history: 1,
      offset: 0,
      count: 10,
      from_user: store.userInfo?.user?.uid || ''
    })
    searchList.value = res.aweme_list.map((item) => item.item)
    searchOffset.value = res.cursor
    searchHasMore.value = !!res.has_more
    searchResultText.value = res.global_doodle_config?.home_text || ''

    if (searchList.value.length < 18 && searchHasMore.value) {
      searchLoading.value = false
      await loadMoreSearch()
      return
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    searchLoading.value = false
  }
}

// 加载更多搜索结果
const loadMoreSearch = async () => {
  if (!searchHasMore.value || searchLoading.value || !isSearching.value) return

  searchLoading.value = true
  try {
    const res = await apis.getUserHomeSearch({
      search_channel: 'aweme_viewed_video',
      search_source: 'normal_search',
      search_scene: 'douyin_search',
      sort_type: 0,
      publish_time: 0,
      is_filter_search: 0,
      query_correct_type: 1,
      keyword: searchKeyword.value,
      enable_history: 1,
      offset: searchOffset.value,
      count: 10,
      from_user: store.userInfo?.user?.uid || ''
    })
    searchList.value = searchList.value.concat(
      res.aweme_list.map((item) => item.item)
    )
    searchOffset.value = res.cursor
    searchHasMore.value = !!res.has_more
  } catch (error) {
    console.error('加载更多搜索结果失败:', error)
  } finally {
    searchLoading.value = false
  }
}

// 关闭搜索
const handleSearchClose = () => {
  isSearching.value = false
  searchKeyword.value = ''
  searchList.value = []
  searchOffset.value = 0
  searchHasMore.value = true
  searchResultText.value = ''
}

// 搜索更多视频（跳转到全局搜索页）
const handleSearchMore = () => {
  router.push({
    path: `/search/${encodeURIComponent(searchKeyword.value)}`,
    query: {
      type: 'general'
    }
  })
}

const getTabTitle = (tab: string) => {
  const titles: { [key: string]: string } = {
    user: '用户',
    video: '视频',
    vs: '影视综',
    live: '直播'
  }
  return titles[tab]
}

const handleTabChange = (tab: string) => {
  // 切换 tab 时关闭搜索
  if (isSearching.value) {
    handleSearchClose()
  }
  activeTab.value = tab
  router.push({
    query: {
      ...route.query,
      showSubTab: tab
    }
  })
}
</script>
<template>
  <div class="user-record">
    <user-tabbar-2 style="height: 44px">
      <template #left>
        <div class="tabbar-2-content">
          <div
            v-for="tab in tabs"
            :key="tab"
            class="tabbar-2-item"
            :class="{ active: activeTab === tab }"
            @click="handleTabChange(tab)"
          >
            <span class="tabbar-2-item-text">{{ getTabTitle(tab) }}</span>
          </div>
        </div>
        <!-- 搜索结果提示文案（仅在有结果时显示） -->
        <div
          v-if="
            activeTab === 'video' &&
            isSearching &&
            searchResultText &&
            searchList.length > 0
          "
          class="search-result-text"
        >
          {{ searchResultText }}
        </div>
      </template>

      <template #right>
        <!-- 搜索栏（仅视频 tab 显示） -->
        <UserSearchBar
          v-if="activeTab === 'video'"
          placeholder="搜索你观看的作品"
          @search="handleSearch"
          @close="handleSearchClose"
        />
        <!-- 筛选组件（仅视频 tab 显示） -->
        <RecordFilter
          v-if="activeTab === 'video'"
          :status="currentStatus"
          :directory="currentDirectory"
          :category="currentCategory"
          @update:status="handleStatusChange"
          @update:directory="handleDirectoryChange"
          @update:category="handleCategoryChange"
        />
        <div class="divider-vertical"></div>
        <div class="clear-content">
          <svg-icon icon="clear" class="clear-icon" />
        </div>
      </template>
    </user-tabbar-2>

    <div class="user-record-content">
      <record-video
        v-if="activeTab === 'video'"
        ref="recordVideoRef"
        :is-searching="isSearching"
        :search-list="searchList"
        :search-loading="searchLoading"
        :search-has-more="searchHasMore"
        :search-result-text="searchResultText"
        :search-keyword="searchKeyword"
        @load-more-search="loadMoreSearch"
        @search-close="handleSearchClose"
        @search-more="handleSearchMore"
      />
      <record-vs v-if="activeTab === 'vs'" />
      <record-live v-if="activeTab === 'live'" />
      <record-visited v-if="activeTab === 'user'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}
.user-record {
  position: relative;
}

.tabbar-2-content {
  position: relative;
  white-space: nowrap;
  outline: none;

  .tabbar-2-item {
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
    color: var(--color-text-2);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    display: inline-block;
    position: relative;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 6px;
    padding: 3px 12px;

    &.active {
      color: var(--color-primary);
      background-color: rgba(254, 44, 85, 0.12);
      border-width: initial;
      border-style: none;
      border-color: initial;
      border-image: initial;

      &:hover {
        cursor: default;
        color: var(--color-primary);
        font-weight: 600;
      }
    }
    &:hover {
      cursor: default;
      color: var(--color-text-0);
      font-weight: 600;
    }

    .tabbar-2-item-text {
      font-size: 13px;
      line-height: 21px;
    }
  }
}

.tabbar-2-end {
  height: 44px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0;
  display: flex;
  position: relative;

  .clear-content {
    cursor: pointer;
    align-items: center;
    margin-right: 20px;
    display: flex;
    position: relative;
  }
  .clear-icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
  .help-icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
    opacity: 0.5;
  }
}

.search-result-text {
  color: var(--color-text-t3);
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 21px;
}

.divider-vertical {
  width: 1px;
  height: 16px;
  background-color: var(--color-line-l2);
  margin: 0 12px;
}
</style>
