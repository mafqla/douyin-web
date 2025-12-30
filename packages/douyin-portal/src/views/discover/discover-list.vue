<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apis from '@/api/apis'
import { ListFooter, Loading } from '@/components/common'
import WaterfallItem from '@/components/discover/discover-item/waterfall-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import { useVirtualGrid } from '@/composables/useVirtualGrid'
import type { IHomeFeedAweme } from '@/api/tyeps/request_response/homeFeedRes'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

const props = defineProps<{
  tagId?: string
}>()

const emit = defineEmits<{
  (e: 'loaded'): void
  (e: 'error'): void
}>()

const route = useRoute()
const router = useRouter()

// 视频列表
const videoList = ref<IHomeFeedAweme[]>([])

// 加载状态
const loading = ref(false)
const loadError = ref(false)
const hasMore = ref(true)
const refreshIndex = ref(0)

// 骨架屏数量
const skeletonCount = 12

// 容器引用
const gridRef = ref<HTMLElement | null>(null)

// 虚拟列表
const { shouldRenderContent, isNearBottom, updateScrollState } = useVirtualGrid(videoList, gridRef, {
  renderWindowSize: 40,
  bufferSize: 16,
  scrollContainer: '.discover-tab-content',
  loadMoreThreshold: 1500
})

// 监听接近底部，自动加载更多
watch(isNearBottom, (nearBottom) => {
  if (nearBottom && !loading.value && hasMore.value) {
    fetchVideoList()
  }
})

// 检查是否需要继续加载（数据加载后可能还在底部附近）
const checkAndLoadMore = async () => {
  await nextTick()
  // 先更新滚动状态，确保 isNearBottom 计算正确
  updateScrollState()
  await nextTick()
  if (isNearBottom.value && !loading.value && hasMore.value) {
    fetchVideoList()
  }
}

// 获取视频列表
const fetchVideoList = async (isRefresh = false) => {
  if (loading.value) return
  if (!hasMore.value && !isRefresh) return

  loading.value = true
  loadError.value = false

  if (isRefresh) {
    refreshIndex.value = 0
    videoList.value = []
    hasMore.value = true
  }

  try {
    const res = await apis.homeFeed(20, refreshIndex.value, props.tagId)
    if (res.status_code === 0) {
      const newList = res.aweme_list || []
      if (isRefresh) {
        videoList.value = newList
      } else {
        videoList.value = [...videoList.value, ...newList]
      }
      hasMore.value = res.has_more === 1
      refreshIndex.value++
      emit('loaded')
      // 数据加载后检查是否需要继续加载
      checkAndLoadMore()
    } else {
      loadError.value = true
      emit('error')
    }
  } catch (error) {
    console.error('获取视频列表失败:', error)
    loadError.value = true
    emit('error')
  } finally {
    loading.value = false
  }
}

// 加载更多（暴露给父组件调用）
const loadMore = () => {
  fetchVideoList()
}

// 重试加载
const retry = () => {
  fetchVideoList(true)
}

// 点击视频打开 modal
const handleVideoClick = (videoId: string) => {
  router.push({
    query: {
      ...route.query,
      modal_id: videoId
    }
  })
}

// modal 是否显示
const showModal = computed(() => {
  return route.query.modal_id !== undefined
})

// Modal 滚动到末尾时加载更多
const handleModalLoadMore = async () => {
  await fetchVideoList()
}

// 关闭 modal 后滚动到当前视频位置
const handleModalClose = async (currentAwemeId: string) => {
  await nextTick()
  // 滚动到当前视频位置
  setTimeout(() => {
    const element = document.querySelector(`[data-aweme-id="${currentAwemeId}"]`)
    const container = document.querySelector('.discover-tab-content')
    if (element && container) {
      // 计算元素相对于滚动容器的位置
      const elementRect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const offsetTop = elementRect.top - containerRect.top + container.scrollTop
      // 滚动到元素位置，使其居中
      container.scrollTo({
        top: offsetTop - container.clientHeight / 2 + elementRect.height / 2,
        behavior: 'smooth'
      })
    }
  }, 50)
}

// 监听 tagId 变化，重新加载数据
watch(
  () => props.tagId,
  () => {
    fetchVideoList(true)
  }
)

// 初始化
onMounted(() => {
  fetchVideoList()
})

// 暴露方法给父组件
defineExpose({
  loadMore,
  retry
})
</script>

<template>
  <div class="discover-list">
    <div class="discover-content">
      <div class="video-grid" ref="gridRef">
        <!-- 骨架屏（初始加载时） -->
        <template v-if="loading && videoList.length === 0">
          <waterfall-item
            v-for="i in skeletonCount"
            :key="'skeleton-' + i"
            videoId=""
            videoImg=""
            :videoUrl="[]"
            :isLoading="true"
          />
        </template>

        <!-- 视频卡片（虚拟列表） -->
        <template v-else>
          <div
            v-for="(video, index) in videoList"
            :key="video.aweme_id"
            :data-aweme-id="video.aweme_id"
            class="virtual-item"
          >
            <waterfall-item
              v-if="shouldRenderContent(index)"
              :videoId="video.aweme_id"
              :videoImg="video.video?.cover?.url_list?.[0] || ''"
              :videoUrl="video.video?.play_addr?.url_list || []"
              :videoTime="video.video?.duration || 0"
              :videoUploadtime="Number(video.create_time) || 0"
              :videoLike="video.statistics?.digg_count || 0"
              :videoCollect="video.collect_stat || 0"
              :videoTitle="video.desc || ''"
              :videoAuthor="video.author?.nickname || ''"
              :videoIsFellow="video.author?.follow_status || 0"
              :awemeType="video.aweme_type || 0"
              :isLivePhoto="video.is_live_photo || 0"
              :isLoading="false"
              :cellRoom="video.cell_room"
              :authorAvatar="video.author?.avatar_thumb?.url_list?.[0] || ''"
              :authorId="video.author?.uid || ''"
              @click="handleVideoClick(video.aweme_id)"
            />
          </div>
        </template>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="loading && videoList.length > 0">
        <Loading :show="true" :isShowText="false" />
      </div>

      <!-- 没有更多 -->
      <list-footer v-if="!hasMore && videoList.length > 0" />
    </div>

    <!-- Modal Player 全屏播放器 -->
    <ModalPlayer
      v-if="showModal"
      :videoList="videoList as IAwemeInfo[]"
      :hasMore="hasMore"
      @close="handleModalClose"
      @loadMore="handleModalLoadMore"
    />
  </div>
</template>

<style lang="scss" scoped>
.discover-list {
  width: calc(100% - 2 * var(--jx-margin-gap) + var(--jx-card-gap));
  margin-left: calc(var(--jx-margin-gap) - var(--jx-card-gap) / 2);
  margin-right: calc(var(--jx-margin-gap) - var(--jx-card-gap) / 2);
  min-height: calc(100% - 52px);
}
// 内容区域
.discover-content {
  width: 100%;
  min-height: 100%;
  flex-grow: 1;
  position: relative;
}

// 视频网格布局
.video-grid {
  width: 100%;
  gap: var(--jx-card-gap);
  min-width: calc(620px + var(--jx-card-gap) * 2);
  padding: 0 calc(var(--jx-card-gap) / 2);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  // 中等屏幕 3 列
  @media (min-width: 1102px) {
    grid-template-columns: repeat(3, minmax(310px, 1fr));
  }
  // 中等屏幕 4 列
  @media (min-width: 1520px) {
    grid-template-columns: repeat(4, minmax(310px, 1fr));
  }

  // 大屏幕 5 列
  @media (min-width: 1850px) {
    grid-template-columns: repeat(5, minmax(310px, 1fr));
    & > .virtual-item:first-of-type,
    & > div:first-of-type {
      grid-area: span 2 / span 3;
    }
  }
}

// 加载更多
.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

</style>
