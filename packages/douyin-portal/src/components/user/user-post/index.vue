<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserTabbar2 from '../user-tabbar-2/index.vue'
import UserError from '../user-error/index.vue'
import UserSearchBar from '../user-search-bar/index.vue'
import DateFilterDropdown from './date-filter-dropdown.vue'
import DyButton from '@/components/ui/button/button.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import PostMix from './post-mix.vue'
import PostPlaylet from './post-playlet.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const props = defineProps<{
  user_id: string
  uid?: string
}>()

const route = useRoute()
const router = useRouter()

// 二级 Tab：作品、合集、短剧
const subTabs = ['video', 'mix', 'playlet']
const activeSubTab = ref((route.query.showSubTab as string) || 'video')

// 视频列表相关状态
const loading = ref(true)
const isLoadingMore = ref(false)
const isLoadingPrev = ref(false) // 向上加载状态
const hasMore = ref(true)
const hasPrev = ref(false) // 是否有更早的数据（向上）
const postList = ref<IAwemeInfo[]>([])
const videoListRef = ref<HTMLElement | null>(null)
const currentScrollId = ref<string | null>(null)

// 游标
const maxCursor = ref('0') // 向下加载游标
const minCursor = ref('') // 向上加载游标

// 原始列表数据（未筛选时的数据）
const originalPostList = ref<IAwemeInfo[]>([])
const originalMaxCursor = ref('0')
const originalHasMore = ref(true)

// 时间列表（用于日期筛选）
const timeList = ref<string[]>([])
// 当前选中的日期筛选
const selectedDate = ref('')
// 是否处于日期筛选模式
const isDateFiltering = ref(false)

// URL 中的 vid 参数（刚刚看过的视频）
const justWatchedVid = computed(() => {
  return route.query.vid as string || ''
})

// 搜索相关状态
const isSearching = ref(false)
const searchKeyword = ref('')
const searchList = ref<IAwemeInfo[]>([])
const searchLoading = ref(false)
const searchHasMore = ref(true)
const searchOffset = ref(0)
const searchResultText = ref('')

// 禁用提示
const showDisabledTip = ref(false)

// 显示禁用提示
const handleShowDisabledTip = () => {
  showDisabledTip.value = true
  setTimeout(() => {
    showDisabledTip.value = false
  }, 2000)
}

// 使用 useGridScrollToItem 实现滚动定位
const { scrollToItem } = useGridScrollToItem({
  containerRef: videoListRef,
  currentId: currentScrollId,
  items: postList,
  idKey: 'aweme_id',
  autoScroll: false,
  block: 'center',
  offsetTop: 60,
  dataAttr: 'aweme-id'
})

// 获取作品列表（向下加载）
const getUserPostList = async () => {
  if (!hasMore.value || isLoadingMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserPost({
      sec_user_id: props.user_id,
      count: 18,
      locate_query: false,
      max_cursor: maxCursor.value,
      need_time_list: timeList.value.length === 0 ? 1 : 0,
      show_live_replay_strategy: 1
    })

    maxCursor.value = res.max_cursor
    if (res.min_cursor) {
      minCursor.value = res.min_cursor
    }
    postList.value.push(...res.aweme_list)
    hasMore.value = res.has_more

    // 同步到原始列表（非筛选模式）
    if (!isDateFiltering.value) {
      originalPostList.value = [...postList.value]
      originalMaxCursor.value = res.max_cursor
      originalHasMore.value = res.has_more
    }

    // 保存时间列表（仅首次加载时）
    if (timeList.value.length === 0 && res.time_list?.length > 0) {
      timeList.value = res.time_list
    }

    loading.value = false
  } catch (error) {
    hasMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

// 向上加载更多数据（加载更新的数据）
const loadPrevData = async () => {
  if (!hasPrev.value || isLoadingPrev.value || !minCursor.value) return
  isLoadingPrev.value = true

  // forward_end_cursor 使用当前时间
  const now = Date.now()
  const anchorCursor = parseInt(minCursor.value, 10)

  console.log('向上加载参数:', {
    forward_anchor_cursor: anchorCursor,
    forward_end_cursor: now
  })

  try {
    const res = await apis.getUserPost({
      sec_user_id: props.user_id,
      count: 30,
      locate_query: false,
      max_cursor: '0',
      need_time_list: 0,
      show_live_replay_strategy: 1,
      forward_anchor_cursor: anchorCursor,
      forward_end_cursor: now
    })

    console.log('向上加载返回:', res)

    const awemeList = res.aweme_list || []
    if (awemeList.length > 0) {
      // 记录当前滚动位置和第一个元素
      const scrollContainer = document.documentElement
      const oldScrollHeight = scrollContainer.scrollHeight
      
      // 插入到列表前面
      postList.value.unshift(...awemeList)
      
      // 更新 minCursor
      if (res.min_cursor) {
        minCursor.value = res.min_cursor
      }
      
      // 检查是否还有更多（向上）
      hasPrev.value = res.forward_has_more === 1
      
      // 保持滚动位置（插入后滚动高度会增加）
      await nextTick()
      const newScrollHeight = scrollContainer.scrollHeight
      const scrollDiff = newScrollHeight - oldScrollHeight
      scrollContainer.scrollTop += scrollDiff
    } else {
      hasPrev.value = false
    }
  } catch (error) {
    console.error('向上加载失败:', error)
    hasPrev.value = false
  } finally {
    isLoadingPrev.value = false
  }
}

// 根据视频创建时间获取月份标识（格式：2025·12）
const getVideoMonth = (createTime: number | string): string => {
  const timestamp = typeof createTime === 'string' ? parseInt(createTime, 10) : createTime
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}·${month}`
}

// 格式化月份显示（2025·12 -> 2025年12月）
const formatMonthDisplay = (monthKey: string): string => {
  const [year, month] = monthKey.split('·')
  return `${year}年${month}月`
}

// 是否启用分组显示（仅在日期筛选时）
const isGroupedMode = computed(() => {
  return selectedDate.value !== ''
})

// 按月份分组的视频列表（筛选后使用）
const groupedPostList = computed(() => {
  const list = isSearching.value ? searchList.value : postList.value
  const groups: { month: string; videos: IAwemeInfo[] }[] = []
  const monthMap = new Map<string, IAwemeInfo[]>()

  // 按月份分组
  list.forEach((video) => {
    const month = getVideoMonth(video.create_time)
    if (!monthMap.has(month)) {
      monthMap.set(month, [])
    }
    monthMap.get(month)!.push(video)
  })

  // 按时间降序排列（保持原有顺序）
  const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => b.localeCompare(a))

  sortedMonths.forEach((month) => {
    groups.push({ month, videos: monthMap.get(month)! })
  })

  return groups
})

// 检查当前列表中是否存在某个月份的视频
const hasMonthInList = (date: string): boolean => {
  return postList.value.some((video) => getVideoMonth(video.create_time) === date)
}

// 请求指定时间段的数据
const loadDateFilterData = async (date: string) => {
  const [year, month] = date.split('·')
  const yearNum = parseInt(year)
  const monthNum = parseInt(month) // 1-12
  
  // 获取该月份第一天的时间戳（毫秒）- 用于 max_cursor
  // monthNum - 1 因为 JS Date 月份从 0 开始
  const firstDay = new Date(yearNum, monthNum, 1, 0, 0, 0, 0)
  // 获取该月份最后一天的时间戳（毫秒）- 用于 forward_end_cursor
  // monthNum 作为下个月，日期 0 表示上个月最后一天
  const lastDay = new Date(yearNum, monthNum, 0, 23, 59, 58, 0)

  // 标记为日期筛选模式，阻止 useInfiniteScroll 触发
  isDateFiltering.value = true
  loading.value = true
  
  // 先滚动到顶部
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  try {
    const res = await apis.getUserPost({
      sec_user_id: props.user_id,
      count: 18,
      locate_query: false,
      max_cursor: String(firstDay.getTime()),
      need_time_list: 0,
      show_live_replay_strategy: 1,
      time_list_query: 1,
      forward_end_cursor: lastDay.getTime()
    })

    // 设置列表为请求到的数据
    postList.value = res.aweme_list
    maxCursor.value = res.max_cursor
    minCursor.value = res.min_cursor || ''
    hasMore.value = res.has_more
    // 如果有 minCursor，说明可以向上加载
    hasPrev.value = !!minCursor.value
    
    console.log('日期筛选结果:', {
      date,
      firstDay: firstDay.toISOString(),
      lastDay: lastDay.toISOString(),
      hasPrev: hasPrev.value,
      minCursor: minCursor.value,
      forward_has_more: res.forward_has_more
    })
  } catch (error) {
    console.error('加载日期筛选数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 滚动到指定月份
const scrollToMonth = (date: string): Promise<void> => {
  return new Promise((resolve) => {
    // 等待 DOM 更新（分组模式渲染）
    nextTick(() => {
      // 再等待一下确保 DOM 完全渲染
      setTimeout(() => {
        const targetGroup = document.querySelector(`[data-month="${date}"]`)
        if (targetGroup) {
          const headerHeight = 170
          const rect = targetGroup.getBoundingClientRect()
          const targetTop = rect.top + window.pageYOffset - headerHeight
          const scrollTop = Math.max(0, targetTop)
          document.documentElement.scrollTop = scrollTop
          document.body.scrollTop = scrollTop
          window.scrollTo({ top: scrollTop, behavior: 'instant' as ScrollBehavior })
        }
        resolve()
      }, 150)
    })
  })
}

// 处理日期筛选变化
const handleDateFilterChange = async (date: string) => {
  // 先设置选中状态，触发分组模式
  selectedDate.value = date

  if (!date) {
    // 清除筛选，恢复原始列表
    isDateFiltering.value = false
    hasPrev.value = false
    if (originalPostList.value.length > 0) {
      postList.value = [...originalPostList.value]
      maxCursor.value = originalMaxCursor.value
      hasMore.value = originalHasMore.value
    }
    await nextTick()
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    return
  }

  // 进入日期筛选模式
  isDateFiltering.value = true

  // 检查当前列表中是否有该月份的视频
  const inList = hasMonthInList(date)
  console.log('handleDateFilterChange:', date, 'inList:', inList)

  if (inList) {
    // 列表中存在该月份，等待分组模式渲染后滚动到对应位置
    await scrollToMonth(date)
  } else {
    // 列表中不存在该月份，请求该时间段的数据
    console.log('调用 loadDateFilterData')
    await loadDateFilterData(date)
  }
}

// 搜索用户作品
const handleSearch = async (keyword: string) => {
  if (!keyword.trim()) {
    isSearching.value = false
    searchKeyword.value = ''
    searchList.value = []
    searchOffset.value = 0
    searchHasMore.value = true
    return
  }

  // 搜索时清空日期筛选
  selectedDate.value = ''

  isSearching.value = true
  searchKeyword.value = keyword
  searchLoading.value = true
  searchOffset.value = 0
  searchList.value = []
  searchHasMore.value = true

  try {
    const res = await apis.getUserHomeSearch({
      search_channel: 'aweme_personal_home_video',
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
      from_user: props.uid || ''
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
      search_channel: 'aweme_user_web',
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
      from_user: props.uid || ''
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

// 当前显示的列表
const displayList = computed(() => {
  return isSearching.value ? searchList.value : postList.value
})

// 当前是否还有更多
const displayHasMore = computed(() => {
  return isSearching.value ? searchHasMore.value : hasMore.value
})

// 当前是否正在加载
const displayLoading = computed(() => {
  return isSearching.value ? searchLoading.value : isLoadingMore.value
})

// 是否为空
const isNull = computed(() => {
  if (loading.value) return false
  return displayList.value.length === 0
})

// 切换二级 Tab
const handleSubTabChange = (tab: string) => {
  activeSubTab.value = tab
  router.push({
    query: {
      ...route.query,
      showSubTab: tab
    }
  })
}

// 获取二级 Tab 标题
const getSubTabTitle = (tab: string) => {
  const titles: { [key: string]: string } = {
    video: '作品',
    mix: '合集',
    playlet: '短剧'
  }
  return titles[tab]
}

useInfiniteScroll(
  window,
  () => {
    // 加载中时不触发
    if (loading.value) return
    
    if (activeSubTab.value === 'video') {
      if (isSearching.value) {
        if (!searchLoading.value) {
          loadMoreSearch()
        }
      } else if (isDateFiltering.value) {
        // 日期筛选模式下，向下滚动加载更早的数据
        if (!isLoadingMore.value && hasMore.value) {
          getUserPostList()
        }
      } else {
        // 正常模式
        if (!isLoadingMore.value) {
          getUserPostList()
        }
      }
    }
  },
  { distance: 600 }
)

// 监听滚动，检测是否需要向上加载（下拉加载）
const handleScroll = () => {
  if (!isDateFiltering.value || !hasPrev.value || isLoadingPrev.value) return
  
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  
  // 在顶部时，scrollTop 为 0 或负数（下拉时可能为负）
  if (scrollTop <= 0) {
    loadPrevData()
  }
}

onMounted(() => {
  getUserPostList()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 点击视频打开 modal
const handleOpenModal = (item: IAwemeInfo) => {
  router.push({
    query: {
      ...route.query,
      modal_id: item.aweme_id
    }
  })
}

// modal 是否显示
const showModal = computed(() => {
  return route.query.modal_id !== undefined && activeSubTab.value === 'video'
})

// Modal 滚动到末尾时加载更多
const handleLoadMore = async () => {
  if (isSearching.value) {
    await loadMoreSearch()
  } else {
    await getUserPostList()
  }
}

// 关闭 modal 后滚动到当前视频位置
const handleModalClose = async (currentAwemeId: string) => {
  await nextTick()
  setTimeout(() => {
    scrollToItem(currentAwemeId)
  }, 50)
}

// 处理视频项点击事件
const handleVideoItemClick = (item: IAwemeInfo) => {
  handleOpenModal(item)
}
</script>

<template>
  <div class="user-post">
    <user-tabbar-2>
      <template #left>
        <!-- 搜索结果提示文案 -->
        <div
          v-if="isSearching && searchResultText && searchList.length > 0"
          class="search-result-text"
        >
          {{ searchResultText }}
        </div>
        <!-- 二级 Tab 栏 -->
        <div v-if="!isSearching" class="tabbar-2-content">
          <div
            v-for="tab in subTabs"
            :key="tab"
            class="tabbar-2-item"
            :class="{ active: activeSubTab === tab }"
            @click="handleSubTabChange(tab)"
          >
            <span class="tabbar-2-item-text">{{ getSubTabTitle(tab) }}</span>
          </div>
        </div>
      </template>

      <template #right>
        <div class="tabbar-2-end">
          <!-- 搜索栏（仅作品 tab 显示） -->
          <UserSearchBar
            v-if="activeSubTab === 'video'"
            placeholder="搜索 Ta 的作品"
            @search="handleSearch"
            @close="handleSearchClose"
          />
          <!-- 日期筛选（仅作品 tab 显示） -->
          <DateFilterDropdown
            v-if="activeSubTab === 'video' && timeList.length > 0"
            v-model="selectedDate"
            :time-list="timeList"
            :disabled="isSearching"
            @change="handleDateFilterChange"
            @showDisabledTip="handleShowDisabledTip"
          />
        </div>
      </template>
    </user-tabbar-2>

    <!-- 作品列表 -->
    <div v-if="activeSubTab === 'video'" class="user-post-list">
      <Loading :show="loading">
        <user-error
          icon="empty-list-user"
          title="暂无内容"
          desc="该账号还未发布过作品哦～"
          v-if="isNull && !isSearching"
        />
        <!-- 搜索无结果提示 -->
        <user-error
          v-if="isSearching && searchList.length === 0 && !searchLoading"
          icon="empty-list-user"
          title="暂无内容"
          desc="暂未找到相关视频"
          class="no-show"
        >
          <template #actions>
            <dy-button
              type="primary"
              theme="solid"
              block
              @click="handleSearchClose"
            >
              返回全部视频
            </dy-button>
            <dy-button
              type="tertiary"
              theme="solid"
              block
              @click="handleSearchMore"
            >
              搜索更多视频
            </dy-button>
          </template>
        </user-error>
        <template v-if="displayList.length !== 0">
          <!-- 顶部加载图标（向上加载时显示） -->
          <Loading v-if="isDateFiltering && isLoadingPrev" :show="true" />
          <!-- 分组显示模式（日期筛选后） -->
          <div v-if="isGroupedMode" class="video-list-grouped" ref="videoListRef">
            <div
              v-for="group in groupedPostList"
              :key="group.month"
              class="video-group"
              :data-month="group.month"
            >
              <h3 class="video-group-title">{{ formatMonthDisplay(group.month) }}</h3>
              <div class="video-list">
                <VideoItem
                  v-for="item in group.videos"
                  :key="item.aweme_id"
                  :aweme="item"
                  :data-aweme-id="item.aweme_id"
                  :disableClickToggle="true"
                  :isJustWatched="item.aweme_id === justWatchedVid"
                  @click="handleVideoItemClick(item)"
                />
              </div>
            </div>
          </div>
          <!-- 普通列表模式（未筛选） -->
          <div v-else class="video-list" ref="videoListRef">
            <VideoItem
              v-for="item in displayList"
              :key="item.aweme_id"
              :aweme="item"
              :data-aweme-id="item.aweme_id"
              :disableClickToggle="true"
              :isJustWatched="item.aweme_id === justWatchedVid"
              @click="handleVideoItemClick(item)"
            />
          </div>
          <Loading :show="displayLoading" />
          <list-footer v-if="!displayHasMore" />
        </template>
      </Loading>
    </div>

    <!-- 合集列表 -->
    <PostMix
      v-if="activeSubTab === 'mix'"
      :user_id="user_id"
    />

    <!-- 短剧列表 -->
    <PostPlaylet
      v-if="activeSubTab === 'playlet'"
      :user_id="user_id"
    />

    <!-- Modal Player 全屏播放器 -->
    <ModalPlayer
      v-if="showModal"
      :videoList="displayList"
      :hasMore="displayHasMore"
      @close="handleModalClose"
      @loadMore="handleLoadMore"
    />

    <!-- 禁用提示（居中显示） -->
    <Transition name="tip">
      <div v-if="showDisabledTip" class="disabled-tip">
        搜索后，暂不支持日期筛选
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.user-post {
  width: 100%;
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
    background-color: var(--color-fill-hover-alpha10);
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
}

.search-result-text {
  color: var(--color-text-t3);
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 21px;
}

.user-post-list {
  margin-top: 8px;
}

.video-list-grouped {
  width: 100%;
}

.video-group {
  margin-bottom: 16px;

  .video-group-title {
    color: var(--color-text-t1);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin: 0 0 12px 0;
    padding: 0;
  }
}

.video-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.no-show {
  margin: 120px 0;
}

// 禁用提示（居中显示）
.disabled-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: rgba(22, 24, 35, 0.9);
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 15px;
  line-height: 24px;
  color: #fff;
  white-space: nowrap;
}

// 提示动画
.tip-enter-active,
.tip-leave-active {
  transition: all 0.2s ease;
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}
</style>
