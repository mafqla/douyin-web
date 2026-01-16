<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useInfiniteScroll, useScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserError from '../user-error/index.vue'
import DyButton from '@/components/ui/button/button.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const props = defineProps<{
  isSearching: boolean
  searchList: IAwemeInfo[]
  searchLoading: boolean
  searchHasMore: boolean
  searchResultText: string
  searchKeyword: string
}>()

const emit = defineEmits<{
  loadMoreSearch: []
  searchClose: []
  searchMore: []
}>()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const recordVideoList = ref<IAwemeInfo[]>([])
// 日期映射 { aweme_id: timestamp }
const awemeDateMap = ref<Record<string, number>>({})
const videoListRef = ref<HTMLElement | null>(null)
const currentScrollId = ref<string | null>(null)

// 当前显示的日期文本
const currentDateText = ref('')

const { scrollToItem } = useGridScrollToItem({
  containerRef: videoListRef,
  currentId: currentScrollId,
  items: recordVideoList,
  idKey: 'aweme_id',
  autoScroll: false,
  block: 'center',
  offsetTop: 60,
  dataAttr: 'aweme-id'
})

const count = ref(20)
const max_cursor = ref(0)

// 筛选参数
const filterStatus = ref(-1) // 观看进度：不限-1 未看完0 已看完1
const filterDirectory = ref(0) // 视频时长：不限0 小于1分钟1 1-3分钟2 3-10分钟3 10分钟以上4
const filterCategory = ref(0) // 视频分类：不限0 二次元1 音乐2 体育3 电影4 游戏5

// 格式化日期显示
const formatDateText = (timestamp: number): string => {
  // 判断时间戳是秒级还是毫秒级
  const ts = timestamp > 9999999999 ? timestamp : timestamp * 1000
  const date = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )

  if (targetDate.getTime() === today.getTime()) {
    return '今天'
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return '昨天'
  } else {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  }
}

// 根据滚动位置更新当前日期
const updateCurrentDate = () => {
  if (props.isSearching || !videoListRef.value) return

  const items = videoListRef.value.querySelectorAll('[data-aweme-id]')
  const scrollTop = window.scrollY + 220 // 考虑顶部导航栏高度

  for (const item of items) {
    const rect = item.getBoundingClientRect()
    const itemTop = rect.top + window.scrollY

    if (itemTop >= scrollTop - 100) {
      const awemeId = item.getAttribute('data-aweme-id')
      if (awemeId && awemeDateMap.value[awemeId]) {
        currentDateText.value = formatDateText(awemeDateMap.value[awemeId])
        return
      }
    }
  }

  // 如果没找到，显示第一个视频的日期
  if (recordVideoList.value.length > 0) {
    const firstId = recordVideoList.value[0].aweme_id
    if (awemeDateMap.value[firstId]) {
      currentDateText.value = formatDateText(awemeDateMap.value[firstId])
    }
  }
}

// 监听滚动更新日期
const { y } = useScroll(window)
watch(y, () => {
  updateCurrentDate()
})

const getRecordVideoList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserRecordVideo(
      count.value,
      max_cursor.value,
      filterStatus.value,
      filterDirectory.value,
      filterCategory.value
    )
    recordVideoList.value = recordVideoList.value.concat(res.aweme_list)
    // 合并日期映射
    awemeDateMap.value = { ...awemeDateMap.value, ...res.aweme_date }
    max_cursor.value = res.max_cursor
    loading.value = false
    isLoadingMore.value = false

    // 初始化日期显示
    if (recordVideoList.value.length > 0 && !currentDateText.value) {
      const firstId = recordVideoList.value[0].aweme_id
      if (awemeDateMap.value[firstId]) {
        currentDateText.value = formatDateText(awemeDateMap.value[firstId])
      }
    }

    if (!res.has_more) {
      hasMore.value = false
      isLoadingMore.value = false
    }
  } catch (error) {
    hasMore.value = false
    isLoadingMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

// 筛选变更时重新加载
const handleFilterChange = (
  status?: number,
  directory?: number,
  category?: number
) => {
  if (status !== undefined) filterStatus.value = status
  if (directory !== undefined) filterDirectory.value = directory
  if (category !== undefined) filterCategory.value = category

  // 重置列表
  recordVideoList.value = []
  awemeDateMap.value = {}
  max_cursor.value = 0
  hasMore.value = true
  currentDateText.value = ''
  loading.value = true

  getRecordVideoList()
}

// 当前显示的列表
const displayList = computed(() => {
  return props.isSearching ? props.searchList : recordVideoList.value
})

// 当前是否还有更多
const displayHasMore = computed(() => {
  return props.isSearching ? props.searchHasMore : hasMore.value
})

// 当前是否正在加载
const displayLoading = computed(() => {
  return props.isSearching ? props.searchLoading : isLoadingMore.value
})

onMounted(() => {
  getRecordVideoList()
})

useInfiniteScroll(
  window,
  () => {
    if (props.isSearching) {
      if (!props.searchLoading) {
        emit('loadMoreSearch')
      }
    } else {
      if (!isLoadingMore.value) {
        getRecordVideoList()
      }
    }
  },
  { distance: 600 }
)

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
  return route.query.modal_id !== undefined
})

// Modal 滚动到末尾时加载更多
const handleLoadMore = async () => {
  if (props.isSearching) {
    emit('loadMoreSearch')
  } else {
    await getRecordVideoList()
  }
}

// 关闭 modal 后滚动到当前视频位置
const handleModalClose = async (currentAwemeId: string) => {
  await nextTick()
  setTimeout(() => {
    scrollToItem(currentAwemeId)
  }, 50)
}

// 暴露给父组件
defineExpose({
  filterStatus,
  filterDirectory,
  filterCategory,
  handleFilterChange
})
</script>

<template>
  <Loading :show="loading">
    <div class="user-record-video">
      <user-tabbar-2 style="top: 170px">
        <template #left>
          <!-- 日期显示（非搜索模式） -->
          <div v-if="!isSearching" class="date-text">{{ currentDateText }}</div>
        </template>
      </user-tabbar-2>

      <div class="user-record-list">
        <user-error
          icon="no-show-like"
          title="暂无观看记录"
          desc="快去看看感兴趣的视频吧"
          v-if="!loading && displayList.length === 0 && !isSearching"
          class="no-show"
        />
        <template v-if="displayList.length !== 0">
          <div class="video-list" ref="videoListRef">
            <VideoItem
              v-for="item in displayList"
              :key="item.aweme_id"
              :aweme="item"
              :data-aweme-id="item.aweme_id"
              :disableClickToggle="true"
              @click="handleOpenModal(item)"
            />
          </div>
          <Loading :show="displayLoading" />
          <list-footer v-if="!displayHasMore" />
        </template>
        <!-- 搜索无结果提示 -->
        <user-error
          v-if="isSearching && searchList.length === 0 && !searchLoading"
          icon="empty-list-user"
          title="暂无内容"
          desc="暂未找到看过的相关视频"
          class="no-show"
        >
          <template #actions>
            <dy-button
              type="primary"
              theme="solid"
              block
              @click="emit('searchClose')"
            >
              返回全部视频
            </dy-button>
            <dy-button
              type="tertiary"
              theme="solid"
              block
              @click="emit('searchMore')"
            >
              搜索更多视频
            </dy-button>
          </template>
        </user-error>
      </div>

      <!-- Modal Player 全屏播放器 -->
      <ModalPlayer
        v-if="showModal"
        :videoList="displayList"
        :hasMore="displayHasMore"
        @close="handleModalClose"
        @loadMore="handleLoadMore"
      />
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}
.user-record-video {
  position: relative;
}
.date-text {
  color: var(--color-text-t4);
  font-size: 13px;
  line-height: 21px;
}
.video-list {
  width: 100%;
}
</style>
