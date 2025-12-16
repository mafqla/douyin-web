<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserError from '../../user-error/index.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

// 接收 props
const props = defineProps<{
  batchMode?: boolean
}>()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const collectionVideoList = ref<IAwemeInfo[]>([])
// 视频列表容器 ref
const videoListRef = ref<HTMLElement | null>(null)
// 当前需要滚动到的视频 ID
const currentScrollId = ref<string | null>(null)

// 使用 useGridScrollToItem 实现滚动定位
const { scrollToItem } = useGridScrollToItem({
  containerRef: videoListRef,
  currentId: currentScrollId,
  items: collectionVideoList,
  idKey: 'aweme_id',
  autoScroll: false,
  block: 'center',
  offsetTop: 60
})

const count = ref(20)
const cursor = ref('')
const getUserCollectVideoList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserCollectVideo(count.value, cursor.value)
    collectionVideoList.value = collectionVideoList.value.concat(res.aweme_list)
    cursor.value = res.cursor
    loading.value = false
    isLoadingMore.value = false
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

onMounted(() => {
  getUserCollectVideoList()
})

useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getUserCollectVideoList()
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

// 关闭 modal 后滚动到当前视频位置
const handleModalClose = async (currentAwemeId: string) => {
  await nextTick()
  requestAnimationFrame(() => {
    scrollToItem(currentAwemeId)
  })
}

// 批量选择相关状态
const selectedIds = ref<Set<string>>(new Set())

// 列表长度
const listLength = computed(() => collectionVideoList.value.length)

// 清空选中状态
const clearSelection = () => {
  selectedIds.value.clear()
}

// 切换全选状态
const toggleSelectAll = () => {
  if (selectedIds.value.size === collectionVideoList.value.length) {
    // 取消全选
    selectedIds.value.clear()
  } else {
    // 全选
    selectedIds.value = new Set(
      collectionVideoList.value.map((item) => item.aweme_id)
    )
  }
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
  if (props.batchMode) {
    // 批量管理模式：切换选中状态
    toggleVideoSelection(item.aweme_id)
  } else {
    // 普通模式：打开 modal 播放器
    handleOpenModal(item)
  }
}

// 取消收藏选中的视频
const deleteSelected = async () => {
  try {
    // TODO: 调用 API 批量取消收藏
    console.log('取消收藏的视频 ID:', Array.from(selectedIds.value))

    // 从列表中移除已取消的项
    collectionVideoList.value = collectionVideoList.value.filter(
      (item) => !selectedIds.value.has(item.aweme_id)
    )

    // 清空选中状态
    selectedIds.value.clear()
  } catch (error) {
    console.error('取消收藏失败:', error)
  }
}

// 暴露给父组件使用
defineExpose({
  selectedIds,
  listLength,
  clearSelection,
  toggleSelectAll,
  deleteSelected
})
</script>
<template>
  <Loading :show="loading">
    <div class="user-collection-video">
      <div class="user-collection-list">
        <user-error
          icon="no-show-like"
          title="暂无收藏视频"
          desc="收藏的视频会显示在这里"
          v-if="!loading && collectionVideoList.length === 0"
          class="no-show"
        />
        <template v-if="collectionVideoList.length !== 0">
          <div class="video-list" ref="videoListRef">
            <VideoItem
              v-for="item in collectionVideoList"
              :key="item.aweme_id"
              :aweme="item"
              :data-aweme-id="item.aweme_id"
              :disableClickToggle="true"
              :selectable="batchMode"
              :selected="selectedIds.has(item.aweme_id)"
              @click="handleVideoItemClick(item)"
            />
          </div>
          <Loading :show="isLoadingMore" />
          <list-footer v-if="!hasMore" />
        </template>
      </div>

      <!-- Modal Player 全屏播放器 -->
      <ModalPlayer
        v-if="showModal"
        :videoList="collectionVideoList"
        @close="handleModalClose"
        @loadMore="getUserCollectVideoList"
      />
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}
.user-collection-video {
  position: relative;
}
.video-list {
  width: 100%;
}
</style>
