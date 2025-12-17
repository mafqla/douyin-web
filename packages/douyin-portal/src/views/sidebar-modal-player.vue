<script setup lang="ts">
import { Loading } from '@/components/common'
import { computed, onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import SwiperPlayer from '@/components/video-player/swiper-player.vue'
import { videosCtrolStore } from '@/stores/videos-control'
import { useSidebarStore } from '@/stores/sidebar'

const props = defineProps<{
  // 外部传入的视频列表（初始列表）
  videoList: IAwemeInfo[]
}>()

const emit = defineEmits<{
  // 关闭事件，返回当前播放的视频 ID
  close: [currentAwemeId: string]
  // 需要加载更多视频
  loadMore: []
}>()

const route = useRoute()
const router = useRouter()
const control = videosCtrolStore()
const sidebarStore = useSidebarStore()

// 从路由参数获取 modal_id
const modalId = computed(() => route.query.modal_id as string)

// 当前用于切换的列表类型（由 activeTab 决定，但排除 comment 和 collection）
const activeListType = computed<'folder' | 'works' | 'related' | 'props'>(() => {
  const tab = sidebarStore.activeTab
  if (tab === 'folder' || tab === 'works' || tab === 'related') {
    return tab
  }
  // comment 和 collection 不是视频列表，使用 props 列表
  return 'props'
})

// 根据列表类型获取对应的列表
const getListByType = (type: 'folder' | 'works' | 'related' | 'props') => {
  switch (type) {
    case 'folder':
      return sidebarStore.folderVideoList
    case 'works':
      return sidebarStore.worksVideoList
    case 'related':
      return sidebarStore.relatedVideoList
    default:
      return props.videoList
  }
}

// 当前用于上下切换的视频列表
const activeVideoList = computed(() => {
  return getListByType(activeListType.value)
})

// 当前视频在活动列表中的索引（可能为 -1，表示不在当前列表中）
const currentIndexInActiveList = computed(() => {
  return activeVideoList.value.findIndex((item) => item.aweme_id === modalId.value)
})

// 在所有列表中查找当前视频
const findVideoInAllLists = (awemeId: string): IAwemeInfo | undefined => {
  // 按优先级查找：当前活动列表 -> 收藏夹 -> 作品 -> 相关推荐 -> props
  const lists = [
    activeVideoList.value,
    sidebarStore.folderVideoList,
    sidebarStore.worksVideoList,
    sidebarStore.relatedVideoList,
    props.videoList
  ]
  for (const list of lists) {
    if (!list || !Array.isArray(list)) continue
    const found = list.find((item) => item.aweme_id === awemeId)
    if (found) return found
  }
  return undefined
}

// 当前播放的视频（从所有列表中查找）
const currentAweme = computed(() => {
  return findVideoInAllLists(modalId.value)
})

const loading = computed(() => !currentAweme.value)

// 切换到指定视频（通过 URL）
const switchToVideo = (awemeId: string) => {
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      modal_id: awemeId
    }
  })
}

// 初始化 store 状态
const initStoreState = () => {
  const idx = currentIndexInActiveList.value
  control.activeVideoIndex = idx >= 0 ? idx : 0
  control.videosNum = activeVideoList.value.length
  control.stopScroll = idx >= activeVideoList.value.length - 1
}

// 监听 activeTab 变化，更新 store 状态（不强制切换视频）
watch(
  () => sidebarStore.activeTab,
  () => {
    // 评论和合集 tab 不处理
    if (sidebarStore.activeTab === 'comment' || sidebarStore.activeTab === 'collection') return

    const newList = activeVideoList.value
    if (newList.length === 0) return

    // 更新 store 的列表长度
    control.videosNum = newList.length

    // 检查当前视频是否在新列表中
    const newIndex = newList.findIndex((item) => item.aweme_id === modalId.value)
    if (newIndex >= 0) {
      // 当前视频在新列表中，更新索引
      control.activeVideoIndex = newIndex
      control.stopScroll = newIndex >= newList.length - 1
    } else {
      // 当前视频不在新列表中，重置索引为 0（但不切换视频）
      // 下次上下切换时会从新列表的第一个开始
      control.activeVideoIndex = 0
      control.stopScroll = newList.length <= 1
    }
  }
)

// 监听 store 的 activeVideoIndex 变化，同步切换视频
let isInternalUpdate = false
watch(
  () => control.activeVideoIndex,
  (newIndex) => {
    if (isInternalUpdate) return

    const targetVideo = activeVideoList.value[newIndex]
    if (targetVideo && targetVideo.aweme_id !== modalId.value) {
      switchToVideo(targetVideo.aweme_id)
    }

    // 提前加载更多
    if (newIndex >= activeVideoList.value.length - 3) {
      emit('loadMore')
    }

    // 更新是否到达底部
    control.stopScroll = newIndex >= activeVideoList.value.length - 1
  }
)

// 监听 URL 的 modal_id 变化，同步更新 store
watch(
  () => modalId.value,
  () => {
    const idx = currentIndexInActiveList.value
    if (idx >= 0 && idx !== control.activeVideoIndex) {
      isInternalUpdate = true
      control.activeVideoIndex = idx
      control.stopScroll = idx >= activeVideoList.value.length - 1
      isInternalUpdate = false
    }
  }
)

// 监听 activeVideoList 变化，更新 store
watch(
  () => activeVideoList.value.length,
  (newLen) => {
    control.videosNum = newLen
    const idx = currentIndexInActiveList.value
    control.stopScroll = idx >= newLen - 1
  }
)

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    control.handlePrev()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    control.handleNext()
  } else if (event.key === 'Escape') {
    handleClose()
  }
}

// 滚轮事件处理
let lastWheelTime = 0
const wheelCooldown = 500
const handleWheel = (event: WheelEvent) => {
  const target = event.target as HTMLElement
  // 如果在可滚动区域内，不处理
  const scrollableParent = target.closest('[data-scrollable]')
  if (scrollableParent) return

  event.preventDefault()
  const now = Date.now()
  if (now - lastWheelTime < wheelCooldown) return

  if (event.deltaY > 50) {
    lastWheelTime = now
    control.handleNext()
  } else if (event.deltaY < -50) {
    lastWheelTime = now
    control.handlePrev()
  }
}

// 组件挂载时
onMounted(() => {
  // 设置 body 为 position:fixed 防止背景滚动
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'

  // 初始化 store 状态
  initStoreState()

  // 添加键盘和滚轮事件监听
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('wheel', handleWheel, { passive: false })
})

// 组件销毁时
onBeforeUnmount(() => {
  document.body.style.position = ''
  document.body.style.width = ''

  // 移除事件监听
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('wheel', handleWheel)
})

// 关闭弹框，移除 URL 的 modal_id 参数
const handleClose = () => {
  // 获取当前播放的视频 ID
  const currentAwemeId = modalId.value

  // 创建新的 query 对象，移除 modal_id
  const newQuery = { ...route.query }
  delete newQuery.modal_id

  router.replace({
    path: route.path,
    query: newQuery
  })

  emit('close', currentAwemeId)
}
</script>

<template>
  <div class="sidebar-modal-player">
    <Loading
      :show="loading"
      :isShowText="true"
      :center="true"
      text="视频加载中..."
    >
      <!-- 关闭按钮 -->
      <div class="close-btn" @click="handleClose">
        <svg-icon class="icon" icon="back-big" />
      </div>

      <!-- 单个视频播放器 -->
      <div class="player-container" v-if="currentAweme">
        <SwiperPlayer
          :awemeInfo="currentAweme"
          :isPlay="true"
          :showSwiperControl="true"
          class="single-player"
        />
      </div>
    </Loading>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-modal-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  z-index: 2000;
  background-color: #000;

  .close-btn {
    position: fixed;
    top: 35px;
    left: 35px;
    width: 64px;
    height: 64px;
    background-color: rgba(0, 0, 0, 0.18);
    border: 0.5px solid hsla(0, 0%, 100%, 0.15);
    border-radius: 32px;
    z-index: 100;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.35);

      .icon {
        color: #fff;
      }
    }

    .icon {
      height: 24px;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      color: hsla(0, 0%, 100%, 0.25);
    }
  }

  .player-container {
    display: flex;
    flex: 1 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .single-player {
      border-radius: 16px;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
