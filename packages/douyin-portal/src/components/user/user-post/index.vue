<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserTabbar2 from '../user-tabbar-2/index.vue'
import UserError from '../user-error/index.vue'
import UserSearchBar from '../user-search-bar/index.vue'
import DateFilterDropdown from './date-filter-dropdown.vue'
import BatchActionBar from '../batch-action-bar/index.vue'
import UserConfirmDialog from '../user-confirm-dialog/index.vue'
import PermissionDialog from './permission-dialog.vue'
import DyButton from '@/components/ui/button/button.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import PostMix from './post-mix.vue'
import PostPlaylet from './post-playlet.vue'
import PostPrivate from './post-private.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const props = defineProps<{
  user_id: string
  uid?: string
  // 是否是自己的页面
  isSelf?: boolean
}>()

const route = useRoute()
const router = useRouter()

// 二级 Tab：作品、私密、合集、短剧（私密仅自己可见）
const subTabs = computed(() => {
  const tabs = ['video']
  if (props.isSelf) {
    tabs.push('private_post')
  }
  tabs.push('mix', 'playlet')
  return tabs
})
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
  return (route.query.vid as string) || ''
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
  const timestamp =
    typeof createTime === 'string' ? parseInt(createTime, 10) : createTime
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
  const sortedMonths = Array.from(monthMap.keys()).sort((a, b) =>
    b.localeCompare(a)
  )

  sortedMonths.forEach((month) => {
    groups.push({ month, videos: monthMap.get(month)! })
  })

  return groups
})

// 检查当前列表中是否存在某个月份的视频
const hasMonthInList = (date: string): boolean => {
  return postList.value.some(
    (video) => getVideoMonth(video.create_time) === date
  )
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
          window.scrollTo({
            top: scrollTop,
            behavior: 'instant' as ScrollBehavior
          })
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
    private_post: '私密作品',
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

  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop

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

// 创建合集
const handleCreateMix = () => {
  console.log('创建合集')
  // TODO: 打开创建合集弹窗
}

// ========== 批量管理相关 ==========
const isBatchMode = ref(false) // 是否进入批量管理模式
const selectedIds = ref<Set<string>>(new Set())
const showDeleteDialog = ref(false) // 显示删除确认弹框
const showPermissionDialog = ref(false) // 显示权限设置弹框

// 是否全选
const isAllSelected = computed(() => {
  return (
    displayList.value.length > 0 &&
    selectedIds.value.size === displayList.value.length
  )
})

// 切换批量管理模式
const toggleBatchMode = () => {
  isBatchMode.value = !isBatchMode.value
  // 退出批量管理时清空选中状态
  if (!isBatchMode.value) {
    selectedIds.value.clear()
  }
}

// 切换全选状态
const handleToggleSelectAll = () => {
  if (isAllSelected.value) {
    // 取消全选
    selectedIds.value.clear()
  } else {
    // 全选
    selectedIds.value = new Set(displayList.value.map((item) => item.aweme_id))
  }
}

// 处理删除按钮点击
const handleDelete = () => {
  if (selectedIds.value.size === 0) return
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = async () => {
  showDeleteDialog.value = false
  try {
    // TODO: 调用 API 删除作品
    console.log('删除的作品 ID:', Array.from(selectedIds.value))
    // 从列表中移除已删除的项
    postList.value = postList.value.filter(
      (item) => !selectedIds.value.has(item.aweme_id)
    )
    selectedIds.value.clear()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 取消删除弹框
const cancelDeleteDialog = () => {
  showDeleteDialog.value = false
}

// 处理权限设置按钮点击
const handlePermission = () => {
  if (selectedIds.value.size === 0) return
  showPermissionDialog.value = true
}

// 确认权限设置
const confirmPermission = (permission: string) => {
  console.log(
    '设置权限:',
    permission,
    '作品 ID:',
    Array.from(selectedIds.value)
  )
  // TODO: 调用 API 设置权限
  showPermissionDialog.value = false
}

// 切换单个视频的选中状态
const toggleVideoSelection = (awemeId: string) => {
  if (selectedIds.value.has(awemeId)) {
    selectedIds.value.delete(awemeId)
  } else {
    selectedIds.value.add(awemeId)
  }
}

// 处理视频项点击事件
const handleVideoItemClick = (item: IAwemeInfo) => {
  if (isBatchMode.value) {
    // 批量管理模式：切换选中状态
    toggleVideoSelection(item.aweme_id)
  } else {
    // 普通模式：打开 modal 播放器
    handleOpenModal(item)
  }
}

// 批量管理模式下执行搜索（会关闭批量管理模式）
const handleSearchInBatchMode = async (keyword: string) => {
  isBatchMode.value = false
  selectedIds.value.clear()
  await handleSearch(keyword)
}

// ========== 统一批量管理（作品、合集、私密复用） ==========
// 当前是否处于批量管理模式（作品、合集或私密）
const isInBatchMode = computed(() => {
  if (activeSubTab.value === 'video') {
    return isBatchMode.value
  } else if (activeSubTab.value === 'mix') {
    return postMixRef.value?.isBatchMode || false
  } else if (activeSubTab.value === 'private_post') {
    return postPrivateRef.value?.isBatchMode || false
  }
  return false
})

// 批量管理 - 选中数量
const batchSelectedCount = computed(() => {
  if (activeSubTab.value === 'video') {
    return selectedIds.value.size
  } else if (activeSubTab.value === 'mix') {
    return postMixRef.value?.selectedIds?.size || 0
  } else if (activeSubTab.value === 'private_post') {
    return postPrivateRef.value?.selectedIds?.size || 0
  }
  return 0
})

// 批量管理 - 是否全选
const batchIsAllSelected = computed(() => {
  if (activeSubTab.value === 'video') {
    return isAllSelected.value
  } else if (activeSubTab.value === 'mix') {
    return postMixRef.value?.isAllSelected || false
  } else if (activeSubTab.value === 'private_post') {
    return postPrivateRef.value?.isAllSelected || false
  }
  return false
})

// 批量管理 - 是否禁用
const batchIsDisabled = computed(() => {
  if (activeSubTab.value === 'video') {
    return displayList.value.length === 0
  } else if (activeSubTab.value === 'mix') {
    return (postMixRef.value?.mixList?.length || 0) === 0
  } else if (activeSubTab.value === 'private_post') {
    return (postPrivateRef.value?.privateList?.length || 0) === 0
  }
  return true
})

// 批量管理 - 选中文本模板
const batchSelectedTextTemplate = computed(() => {
  if (activeSubTab.value === 'video') {
    return '已选 {count} 个作品'
  } else if (activeSubTab.value === 'mix') {
    return '已选 {count} 个合集'
  } else if (activeSubTab.value === 'private_post') {
    return '已选 {count} 个作品'
  }
  return '已选 {count} 个'
})

// 批量管理 - 权限类型
const batchPermissionType = computed(() => {
  return activeSubTab.value === 'mix' ? 'mix' : 'video'
})

// 批量管理 - 切换全选
const handleBatchSelectAll = () => {
  if (activeSubTab.value === 'video') {
    handleToggleSelectAll()
  } else if (activeSubTab.value === 'mix') {
    postMixRef.value?.handleToggleSelectAll()
  } else if (activeSubTab.value === 'private_post') {
    postPrivateRef.value?.handleToggleSelectAll()
  }
}

// 批量管理 - 删除
const handleBatchDelete = () => {
  if (activeSubTab.value === 'video') {
    handleDelete()
  } else if (activeSubTab.value === 'mix') {
    postMixRef.value?.handleDelete()
  } else if (activeSubTab.value === 'private_post') {
    postPrivateRef.value?.handleDelete()
  }
}

// 批量管理 - 权限设置
const handleBatchPermission = () => {
  if (activeSubTab.value === 'video') {
    handlePermission()
  } else if (activeSubTab.value === 'mix') {
    postMixRef.value?.handlePermission()
  } else if (activeSubTab.value === 'private_post') {
    postPrivateRef.value?.handlePermission()
  }
}

// PostMix 组件引用
const postMixRef = ref<InstanceType<typeof PostMix> | null>(null)

// PostPrivate 组件引用
const postPrivateRef = ref<InstanceType<typeof PostPrivate> | null>(null)

// 暴露给父组件使用
defineExpose({
  isBatchMode,
  toggleBatchMode,
  activeSubTab,
  postMixRef,
  postPrivateRef
})
</script>

<template>
  <div class="user-post">
    <!-- 批量操作工具栏（作品/合集复用） -->
    <div v-if="isInBatchMode" class="batch-toolbar">
      <BatchActionBar
        :selected-count="batchSelectedCount"
        :all-selected="batchIsAllSelected"
        :disabled="batchIsDisabled"
        action-text="删除"
        :selected-text-template="batchSelectedTextTemplate"
        @select-all="handleBatchSelectAll"
        @action="handleBatchDelete"
      >
        <template #actions>
          <!-- 权限设置按钮（放在删除按钮旁边） -->
          <div
            class="action-btn"
            :class="{ disabled: batchSelectedCount === 0 }"
            @click="handleBatchPermission"
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
                  d="M8.00586 2.19775C9.68251 2.19775 11.0393 3.56122 11.0312 5.23779L11.0293 5.65674C12.2112 5.90113 13.0993 6.94837 13.0996 8.20264V11.2026C13.0996 12.6386 11.9359 13.8022 10.5 13.8022H5.5C4.06424 13.802 2.90039 12.6384 2.90039 11.2026V8.20264C2.90075 6.94578 3.79292 5.89734 4.97852 5.65576L4.98047 5.20752C4.98909 3.54288 6.34117 2.19792 8.00586 2.19775ZM5.5 6.80225C4.72723 6.80246 4.10002 7.42992 4.09961 8.20264V11.2026C4.09961 11.9757 4.72698 12.6028 5.5 12.603H10.5C11.2732 12.603 11.9004 11.9758 11.9004 11.2026V8.20264L11.8926 8.05908C11.8203 7.35371 11.2245 6.80225 10.5 6.80225H5.5ZM8.01855 8.31201C8.3498 8.31116 8.62004 8.57847 8.62109 8.90967L8.625 10.4214L8.6123 10.5425C8.55697 10.8159 8.31525 11.0222 8.02539 11.0229C7.69426 11.0235 7.42568 10.7555 7.4248 10.4243L7.4209 8.9126C7.4203 8.58155 7.68749 8.31304 8.01855 8.31201ZM8.00586 3.39697C7.00162 3.39714 6.18606 4.2092 6.18066 5.21338L6.17871 5.60303H9.83008L9.83203 5.23193C9.83688 4.22038 9.01747 3.39697 8.00586 3.39697Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            <span class="action-text">权限设置</span>
          </div>
        </template>
        <template #right v-if="activeSubTab === 'video'">
          <!-- 搜索栏 -->
          <UserSearchBar
            placeholder="搜索你发布的作品"
            @search="handleSearch"
            @close="handleSearchClose"
          />
          <!-- 日期筛选 -->
          <DateFilterDropdown
            v-model="selectedDate"
            :time-list="timeList"
            :disabled="isSearching"
            @change="handleDateFilterChange"
            @showDisabledTip="handleShowDisabledTip"
          />
        </template>
      </BatchActionBar>
    </div>

    <!-- 正常模式下的二级 Tab 栏 -->
    <user-tabbar-2 v-if="!isInBatchMode">
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
            <!-- 私密标签显示锁图标 -->
            <div v-if="tab === 'private_post'" class="private-lock">
              <svg-icon icon="lock" class="icon" />
            </div>
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
            v-if="activeSubTab === 'video'"
            v-model="selectedDate"
            :time-list="timeList"
            :disabled="isSearching"
            @change="handleDateFilterChange"
            @showDisabledTip="handleShowDisabledTip"
          />
          <!-- 创建合集按钮（仅合集 tab 且自己的页面显示） -->
          <div
            v-if="activeSubTab === 'mix' && isSelf"
            class="create-mix-btn"
            @click="handleCreateMix"
          >
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
            <span>创建合集</span>
          </div>
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
          <div
            v-if="isGroupedMode"
            class="video-list-grouped"
            ref="videoListRef"
          >
            <div
              v-for="group in groupedPostList"
              :key="group.month"
              class="video-group"
              :data-month="group.month"
            >
              <h3 class="video-group-title">
                {{ formatMonthDisplay(group.month) }}
              </h3>
              <div class="video-list">
                <VideoItem
                  v-for="item in group.videos"
                  :key="item.aweme_id"
                  :aweme="item"
                  :data-aweme-id="item.aweme_id"
                  :disableClickToggle="true"
                  :isJustWatched="item.aweme_id === justWatchedVid"
                  :selectable="isBatchMode"
                  :selected="selectedIds.has(item.aweme_id)"
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
              :selectable="isBatchMode"
              :selected="selectedIds.has(item.aweme_id)"
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
      ref="postMixRef"
      :user_id="user_id"
      :isSelf="isSelf"
    />

    <!-- 短剧列表 -->
    <PostPlaylet v-if="activeSubTab === 'playlet'" :user_id="user_id" />

    <!-- 私密作品列表 -->
    <PostPrivate
      v-if="activeSubTab === 'private_post'"
      ref="postPrivateRef"
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

    <!-- 删除确认弹框 -->
    <UserConfirmDialog
      v-model="showDeleteDialog"
      :title="`确认删除 ${selectedIds.size} 个作品，删除后不可恢复`"
      cancel-text="取消"
      confirm-text="确认删除"
      @confirm="confirmDelete"
      @cancel="cancelDeleteDialog"
    />

    <!-- 权限设置弹框 -->
    <PermissionDialog
      v-model="showPermissionDialog"
      :type="batchPermissionType"
      @confirm="confirmPermission"
    />
  </div>
</template>

<style lang="scss" scoped>
.user-post {
  width: 100%;
  position: relative;
}

.batch-toolbar {
  width: 100%;
  margin-bottom: 8px;
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
    display: inline-flex;
    align-items: center;
    gap: 4px;
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

      .private-lock :deep(svg) {
        color: var(--color-primary);
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

    .private-lock {
      display: flex;
      align-items: center;
      margin-left: 2px;
      color: inherit;

      .icon {
        width: 12px;
        height: 14px;
      }
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

.create-mix-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--color-text-t3);
  font-size: 14px;
  line-height: 22px;
  transition: color 0.2s;

  svg {
    font-size: 16px;
  }

  &:hover {
    color: var(--color-text-t1);
  }
}

.batch-manage-btn {
  cursor: pointer;
  color: var(--color-text-t3);
  font-size: 14px;
  line-height: 22px;
  transition: color 0.2s;
  margin-left: 16px;

  &:hover {
    color: var(--color-text-t1);
  }
}

.exit-batch-btn {
  cursor: pointer;
  color: var(--color-primary);
  font-size: 14px;
  line-height: 22px;
  margin-left: 20px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s;
  margin-right: 20px;

  .action-icon {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--color-text-t2);
  }

  .action-text {
    margin-left: 4px;
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
