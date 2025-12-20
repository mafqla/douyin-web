<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
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
const isLoadingMore = ref(false)
const hasMore = ref(true)
const cursor = ref(0)
const awemeList = ref<IAwemeInfo[]>([])

// 合并列表，标记当前播放的视频
const combinedList = computed(() => {
  return awemeList.value.map((item, index) => ({
    item,
    index,
    isPlaying: item.aweme_id === props.aweme_id
  }))
})

// 点击视频项切换播放
const handleItemClick = (item: IAwemeInfo, index: number) => {
  if (item.aweme_id === props.aweme_id) return

  // 更新 store 的索引
  controlStore.activeVideoIndex = index

  // 更新 URL 的 modal_id
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      modal_id: item.aweme_id
    }
  })
}

// 同步视频列表到 store
watch(
  awemeList,
  (newList) => {
    sidebarStore.setCollectionVideoList(newList)
  },
  { immediate: true }
)

// 获取合集视频列表
const getMixVideos = async (isLoadMore = false) => {
  if (!isLoadMore) {
    loading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const res = await apis.getUserMixDetail({
      mix_id: props.mix.mix_id,
      cursor: cursor.value,
      count: 20
    })
    const newList = res.aweme_list || []
    if (isLoadMore) {
      awemeList.value = [...awemeList.value, ...newList]
    } else {
      awemeList.value = newList
    }
    cursor.value = res.cursor
    hasMore.value = res.has_more
  } catch (error) {
    console.error('获取合集视频列表失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (!isLoadingMore.value && hasMore.value) {
    getMixVideos(true)
  }
}

// 监听滚动加载更多
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  if (target.scrollHeight - target.scrollTop - target.clientHeight < 200) {
    loadMore()
  }
}

// 监听 mix 变化重新加载
watch(
  () => props.mix.mix_id,
  () => {
    cursor.value = 0
    hasMore.value = true
    getMixVideos()
  }
)

onMounted(() => {
  getMixVideos()
})
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
    <div class="mix-list-wrapper" data-scrollable @scroll="handleScroll">
      <Loading :show="loading">
        <ul class="mix-list">
          <RelatedVideoItem
            v-for="{ item, index, isPlaying } in combinedList"
            :key="item.aweme_id"
            :videoTitle="item.desc"
            :videoLink="getAwemeLink(item)"
            :thumbnailSrc="item.video?.cover?.url_list?.[0]"
            :videoDuration="formatMillisecondsToTime(item.video?.duration || 0)"
            :likeCount="useCount(item.statistics?.digg_count || 0)"
            :userName="item.author?.nickname"
            :sec_uid="item.author?.sec_uid"
            :isPlaying="isPlaying"
            :disableLink="true"
            @click="handleItemClick(item, index)"
          />
        </ul>
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
