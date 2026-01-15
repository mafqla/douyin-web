<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apis from '@/api/apis'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { IMixDetailInfo } from '@/api/tyeps/request_response/mixDetailRes'
import { formatMillisecondsToTime } from '@/utils/date-format'
import { Loading } from '@/components/common'
import { DyButton } from '@/components/ui'
import RelatedVideoItem from '@/views/video/components/related-video-item.vue'
import { useCount } from '@/hooks/useCount'
import { useSidebarStore } from '@/stores/sidebar'
import { videosCtrolStore } from '@/stores/videos-control'
import { getAwemeLink } from '@/utils/aweme-link'

const route = useRoute()
const router = useRouter()
const sidebarStore = useSidebarStore()
const controlStore = videosCtrolStore()

interface Props {
  mix: IMixDetailInfo
  aweme_id: string
}

const props = defineProps<Props>()

const loading = ref(true)
const isLoadingPrev = ref(false)
const isLoadingMore = ref(false)
const hasPrev = ref(true)
const hasMore = ref(true)
const prevCursor = ref(0)
const nextCursor = ref(0)
const awemeList = ref<IAwemeInfo[]>([])
const scrollContainerRef = ref<HTMLElement | null>(null)

// 合并列表，标记当前播放的视频
const combinedList = computed(() => {
  return awemeList.value.map((item, index) => ({
    item,
    index,
    // 从视频的 mix_info.statis.current_episode 获取集数
    episodeNumber: item.mix_info?.statis?.current_episode || 0,
    isPlaying: item.aweme_id === props.aweme_id
  }))
})

// 点击视频项切换播放
const handleItemClick = (item: IAwemeInfo) => {
  if (item.aweme_id === props.aweme_id) return

  // 更新 URL 的 modal_id
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      modal_id: item.aweme_id
    }
  })
}

// 滚动到当前播放的视频
const scrollToCurrentVideo = () => {
  if (!scrollContainerRef.value) return
  const currentIndex = awemeList.value.findIndex(
    (item) => item.aweme_id === props.aweme_id
  )
  if (currentIndex >= 0) {
    const listItems = scrollContainerRef.value.querySelectorAll('.mix-list .list-item')
    const targetItem = listItems[currentIndex] as HTMLElement
    if (targetItem) {
      const container = scrollContainerRef.value
      const containerHeight = container.clientHeight
      const itemOffsetTop = targetItem.offsetTop
      const itemHeight = targetItem.offsetHeight
      // 滚动到目标位置（居中显示）
      container.scrollTop = itemOffsetTop - containerHeight / 2 + itemHeight / 2
    }
  }
}

// 初始化（使用 store 中的数据，不请求接口）
const initLoad = () => {
  // 使用 store 中已有的列表
  const existingList = sidebarStore.collectionVideoList
  if (existingList.length > 0) {
    awemeList.value = existingList
    
    // 设置 cursor（基于列表中的集数）
    const firstEpisode = awemeList.value[0]?.mix_info?.statis?.current_episode || 0
    prevCursor.value = firstEpisode - 1
    hasPrev.value = firstEpisode > 1
    
    const lastEpisode = awemeList.value[awemeList.value.length - 1]?.mix_info?.statis?.current_episode || 0
    const totalEpisode = props.mix.statis?.updated_to_episode || 0
    nextCursor.value = lastEpisode
    hasMore.value = lastEpisode < totalEpisode
    
    // 滚动到当前播放的视频
    nextTick(async () => {
      scrollToCurrentVideo()
      // 如果列表较短且有更早的视频，预加载
      if (awemeList.value.length < 10 && hasPrev.value) {
        await loadPrevVideos(false)
        // 预加载完成后重新滚动到当前视频
        await nextTick()
        scrollToCurrentVideo()
      }
    })
  }
  loading.value = false
}

// 向上加载更早的视频
const loadPrevVideos = async (keepScrollPosition = true) => {
  if (!hasPrev.value || isLoadingPrev.value || prevCursor.value <= 0) return

  isLoadingPrev.value = true
  try {
    // 计算新的 cursor
    const newCursor = Math.max(0, prevCursor.value - 20)
    const count = prevCursor.value - newCursor
    
    if (count <= 0) {
      hasPrev.value = false
      isLoadingPrev.value = false
      return
    }
    
    const res = await apis.getUserMixDetail({
      mix_id: props.mix.mix_id,
      cursor: newCursor,
      count: count
    })
    
    const newList = res.aweme_list || []
    if (newList.length > 0) {
      // 记录当前滚动位置
      const scrollContainer = scrollContainerRef.value
      const prevScrollHeight = scrollContainer?.scrollHeight || 0
      
      // 将新数据插入到列表前面
      awemeList.value = [...newList, ...awemeList.value]
      
      // 同步到 store
      sidebarStore.setCollectionVideoList(awemeList.value)
      
      // 更新 cursor
      prevCursor.value = newCursor
      hasPrev.value = newCursor > 0
      
      // 保持滚动位置（仅在用户滚动触发时）
      if (keepScrollPosition) {
        await nextTick()
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight
          scrollContainer.scrollTop = newScrollHeight - prevScrollHeight
        }
      }
    } else {
      hasPrev.value = false
    }
  } catch (error) {
    console.error('加载更早的合集视频失败:', error)
    hasPrev.value = false
  } finally {
    isLoadingPrev.value = false
  }
}

// 向下加载更多视频
const loadMoreVideos = async () => {
  if (!hasMore.value || isLoadingMore.value) return

  isLoadingMore.value = true
  try {
    const res = await apis.getUserMixDetail({
      mix_id: props.mix.mix_id,
      cursor: nextCursor.value,
      count: 20
    })
    
    const newList = res.aweme_list || []
    if (newList.length > 0) {
      awemeList.value = [...awemeList.value, ...newList]
      // 同步到 store
      sidebarStore.setCollectionVideoList(awemeList.value)
      nextCursor.value = res.cursor
      hasMore.value = res.has_more
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载更多合集视频失败:', error)
    hasMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

// 监听滚动
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  // 滚动到顶部附近时加载更早的视频
  if (target.scrollTop < 100 && hasPrev.value && !isLoadingPrev.value) {
    loadPrevVideos()
  }
  // 滚动到底部附近时加载更多视频
  if (target.scrollHeight - target.scrollTop - target.clientHeight < 200 && hasMore.value && !isLoadingMore.value) {
    loadMoreVideos()
  }
}

// 监听 store 中的 collectionVideoList 变化
watch(
  () => sidebarStore.collectionVideoList,
  (newList) => {
    if (newList.length > 0) {
      initLoad()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="sidebar-mix-playlist">
    <!-- 合集头部信息（固定） -->
    <div class="mix-header">
      <div class="mix-header-left">
        <div class="mix-title">合集 · {{ mix.mix_name }}</div>
        <div class="mix-stats">
          <span>{{ useCount(mix.statis?.play_vv || 0) }}次播放</span>
          <span class="dot">·</span>
          <span>更新至第{{ mix.statis?.updated_to_episode || 0 }}集</span>
        </div>
      </div>
      <div class="mix-header-right">
        <DyButton type="secondary" theme="solid" class="collect-btn">
          {{ mix.status?.is_collected ? '已收藏' : '收藏' }}
        </DyButton>
      </div>
    </div>

    <!-- 视频列表（可滚动） -->
    <div
      ref="scrollContainerRef"
      class="mix-list-wrapper"
      data-scrollable
      @scroll="handleScroll"
    >
      <Loading :show="loading">
        <!-- 顶部加载提示 -->
        <Loading :show="isLoadingPrev" />
        <ul class="mix-list">
          <RelatedVideoItem
            v-for="{ item, episodeNumber, isPlaying } in combinedList"
            :key="item.aweme_id"
            :videoTitle="episodeNumber ? `第${episodeNumber}集：${item.desc}` : item.desc"
            :videoLink="getAwemeLink(item)"
            :thumbnailSrc="item.video?.cover?.url_list?.[0]"
            :videoDuration="formatMillisecondsToTime(item.video?.duration || 0)"
            :likeCount="useCount(item.statistics?.digg_count || 0)"
            :userName="item.author?.nickname"
            :sec_uid="item.author?.sec_uid"
            :isPlaying="isPlaying"
            :disableLink="true"
            @click="handleItemClick(item)"
          />
        </ul>
        <!-- 底部加载提示 -->
        <Loading :show="isLoadingMore" />
        <list-footer v-if="!hasMore && awemeList.length > 0" />
      </Loading>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-mix-playlist {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.mix-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .mix-header-left {
    flex: 1;
    overflow: hidden;
    padding-right: 12px;

    .mix-title {
      max-width: 300px;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-t0);
      margin-bottom: 4px;
      margin-right: 12px;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      overflow: hidden;
    }

    .mix-stats {
      max-width: 300px;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-t0);
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      overflow: hidden;

      .dot {
        margin: 0 4px;
      }
    }
  }

  .mix-header-right {
    align-items: center;
    display: flex;

    .collect-btn {
      min-width: 88px;
      color: var(--color-text-t1, rgba(255, 255, 255, 0.9));
      background: rgba(242, 242, 244, 0.08);
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      border-radius: 8px;
    }
  }
}

.mix-list-wrapper {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.mix-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .mix-header {
    padding: calc(0.714286vw + 5.71429px) 0;
    .mix-header-left {
      .mix-title {
        font-size: calc(0.892857vw + 1.14286px);
      }

      .mix-stats {
        font-size: calc(0.535714vw + 4.28571px);
      }
    }
    .mix-header-right {
      .collect-btn {
        width: calc(1.78571vw + 44.2857px);
        height: calc(0.714286vw + 17.7143px);
        font-size: calc(0.357143vw + 6.85714px);
        font-weight: 500;
      }
    }
  }
}

@media screen and (min-width: 2560px) {
  .mix-header {
    padding-top: 24px;
    .mix-header-left {
      .mix-title {
        font-size: 24px;
      }

      .mix-stats {
        font-size: 18px;
      }

      .mix-header-right {
        .collect-btn {
          width: 90px;
          height: 36px;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
