<script setup lang="ts">
import {
  ref,
  shallowRef,
  computed,
  onMounted,
  onBeforeUnmount,
  watch
} from 'vue'
import { useInfiniteScroll, useScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import apis from '@/api/apis'
import type { IVisitedUser } from '@/api/tyeps/request_response/userVisitedListRes'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import RecordVisitedItem from './record-visited-item.vue'
import UserError from '../../user-error/index.vue'
import SidebarModalPlayer from '@/views/sidebar-modal-player.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { videosCtrolStore } from '@/stores/videos-control'

const route = useRoute()
const router = useRouter()
const sidebarStore = useSidebarStore()
const controlStore = videosCtrolStore()

const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const cursor = ref('')

// 常访问用户列表
const freqVisitUserList = ref<IVisitedUser[]>([])
// 访客列表
const visitUserList = ref<IVisitedUser[]>([])
// 访客列表容器引用
const visitedListRef = ref<HTMLElement | null>(null)
// 当前显示的日期文本
const currentDateText = ref('')

const getUserVisitedList = async () => {
  if (!hasMore.value || isLoadingMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserVisitedList(20, cursor.value)
    if (res.freq_visit_user_list?.length) {
      freqVisitUserList.value = freqVisitUserList.value.concat(
        res.freq_visit_user_list
      )
    }
    if (res.visit_user_list?.length) {
      visitUserList.value = visitUserList.value.concat(res.visit_user_list)
    }
    cursor.value = res.next_cursor || ''
    hasMore.value = res.has_more

    // 初始化日期显示
    updateCurrentDate()
  } catch (error) {
    hasMore.value = false
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }
}

onMounted(() => {
  getUserVisitedList()
})

useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value && hasMore.value) {
      getUserVisitedList()
    }
  },
  { distance: 600 }
)

// 按日期分组访客列表
interface IVisitedGroup {
  title: string
  list: IVisitedUser[]
}

const formatVisitTime = (timestamp: number): string => {
  const now = new Date()
  const visitDate = new Date(timestamp * 1000)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

  if (visitDate >= today) {
    return '今天'
  } else if (visitDate >= yesterday) {
    return '昨天'
  } else {
    return `${visitDate.getMonth() + 1}月${visitDate.getDate()}日`
  }
}

const groupedVisitList = computed<IVisitedGroup[]>(() => {
  const groups: Map<string, IVisitedUser[]> = new Map()

  visitUserList.value.forEach((user) => {
    const dateKey = formatVisitTime(user.visit_time)
    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(user)
  })

  return Array.from(groups.entries()).map(([title, list]) => ({ title, list }))
})

// 根据滚动位置更新当前日期
const updateCurrentDate = () => {
  if (!visitedListRef.value) {
    // 初始化时设置第一个日期
    if (freqVisitUserList.value.length > 0) {
      currentDateText.value = '常访问'
    } else if (groupedVisitList.value.length > 0) {
      currentDateText.value = groupedVisitList.value[0].title
    }
    return
  }

  const sections = visitedListRef.value.querySelectorAll('[data-section-title]')
  const scrollTop = window.scrollY + 220 // 考虑顶部导航栏高度

  for (const section of sections) {
    const rect = section.getBoundingClientRect()
    const sectionTop = rect.top + window.scrollY

    if (sectionTop >= scrollTop - 100) {
      const title = section.getAttribute('data-section-title')
      if (title) {
        currentDateText.value = title
        return
      }
    }
  }

  // 如果滚动到底部，显示最后一个分组的日期
  if (sections.length > 0) {
    const lastSection = sections[sections.length - 1]
    const title = lastSection.getAttribute('data-section-title')
    if (title) {
      currentDateText.value = title
    }
  }
}

// 监听滚动更新日期
const { y } = useScroll(window)
watch(y, () => {
  updateCurrentDate()
})

// modal-player 相关
const showModalPlayer = ref(false)
const currentVideoList = shallowRef<IAwemeInfo[]>([])

// 打开 modal-player
const openModalPlayer = async (user: IVisitedUser) => {
  // 优先使用未看作品 id，否则获取用户第一个作品
  let awemeId = user.not_seen_item_id_list_v2?.[0]

  if (!awemeId) {
    // 没有未看作品，获取用户第一个作品
    try {
      const res = await apis.getUserPost({
        sec_user_id: user.sec_uid,
        count: 1,
        max_cursor: '0',
        locate_query: false,
        show_live_replay_strategy: 1,
        need_time_list: 0,
        time_list_query: 0
      })
      if (res.aweme_list?.length) {
        awemeId = res.aweme_list[0].aweme_id
        currentVideoList.value = res.aweme_list
      }
    } catch (error) {
      console.error('获取用户作品失败:', error)
      return
    }
  } else {
    // 有未看作品，获取视频详情
    try {
      const res = await apis.getVideoDetail(awemeId)
      if (res.aweme_detail) {
        currentVideoList.value = [res.aweme_detail]
      }
    } catch (error) {
      console.error('获取视频详情失败:', error)
      return
    }
  }

  if (!awemeId) return

  // 设置未看视频 id 列表
  if (user.not_seen_item_id_list_v2?.length) {
    sidebarStore.setNotSeenItemIds(user.not_seen_item_id_list_v2)
  }

  // 设置 store，切换到 ta 的作品 tab
  sidebarStore.setActiveTab('works')

  // 打开侧边栏
  controlStore.isShowSidebar = true

  // 显示 modal player
  showModalPlayer.value = true
  router.push({
    path: route.path,
    query: {
      ...route.query,
      modal_id: awemeId
    }
  })
}

// 关闭 modal-player
const handleModalClose = async () => {
  showModalPlayer.value = false
  currentVideoList.value = []
  sidebarStore.clearVideoLists()
  sidebarStore.clearNotSeenItemIds()
}

// 组件卸载时清除
onBeforeUnmount(() => {
  sidebarStore.clearVideoLists()
  sidebarStore.clearNotSeenItemIds()
})
</script>
<template>
  <Loading :show="loading">
    <div class="user-record-visited">
      <user-tabbar-2 style="top: 170px">
        <template #left>
          <div class="date-text">{{ currentDateText }}</div>
        </template>
      </user-tabbar-2>

      <user-error
        icon="no-show-like"
        title="暂无访客记录"
        desc="还没有人访问过你的主页"
        v-if="
          !loading &&
          freqVisitUserList.length === 0 &&
          visitUserList.length === 0
        "
        class="no-show"
      />
      <template v-else>
        <div ref="visitedListRef">
          <!-- 常访问用户 -->
          <div
            class="visited-section"
            v-if="freqVisitUserList.length > 0"
            data-section-title="常访问"
          >
            <div class="visited-list">
              <RecordVisitedItem
                v-for="item in freqVisitUserList"
                :key="item.uid"
                :item="item"
                @open-works="openModalPlayer"
              />
            </div>
          </div>

          <!-- 访客列表按日期分组 -->
          <div
            class="visited-section"
            v-for="(group, index) in groupedVisitList"
            :key="group.title"
            :data-section-title="group.title"
          >
            <div
              v-if="!(index === 0 && freqVisitUserList.length === 0)"
              class="section-title"
            >
              {{ group.title }}
            </div>
            <div class="visited-list">
              <RecordVisitedItem
                v-for="item in group.list"
                :key="item.uid"
                :item="item"
                @open-works="openModalPlayer"
              />
            </div>
          </div>
        </div>

        <Loading :show="isLoadingMore" />
        <list-footer
          v-if="
            !hasMore &&
            (freqVisitUserList.length > 0 || visitUserList.length > 0)
          "
        />
      </template>
    </div>

    <!-- Sidebar Modal Player -->
    <SidebarModalPlayer
      v-if="showModalPlayer"
      :videoList="currentVideoList"
      @close="handleModalClose"
    />
  </Loading>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}

.user-record-visited {
  position: relative;
  padding-top: 16px;
}

.date-text {
  color: var(--color-text-t4);
  font-size: 13px;
  line-height: 21px;
}

.visited-section {
  margin-bottom: 16px;
}

.section-title {
  color: var(--color-text-t3);
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  padding: 10px 0;
}

.visited-list {
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  gap: 16px;
}
</style>
