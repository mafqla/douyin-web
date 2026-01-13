<script setup lang="ts">
import { computed } from 'vue'
import TitleBox from './title-box.vue'
import DiscoverVideo from './discover-video.vue'

interface WaterfallItemProps {
  videoId: string
  videoImg: string
  videoUrl: string | string[]
  videoTime?: number
  videoUploadtime?: number
  videoLike?: number
  // 是否收藏（0: 未收藏, 1: 已收藏）
  videoCollect?: number
  videoTitle?: string
  videoAuthor?: string
  // 是否关注作者（0: 未关注, 1: 已关注）
  videoIsFellow?: number
  // 视频类型，68为图集，101为直播
  awemeType?: number
  // 是否为实况照片
  isLivePhoto?: number
  isLoading?: boolean
  // 直播间信息
  cellRoom?: Record<string, any> | null
  // 作者头像
  authorAvatar?: string
  // 作者 ID
  authorId?: string
}

const props = withDefaults(defineProps<WaterfallItemProps>(), {
  videoId: '',
  videoImg: '',
  videoUrl: '',
  videoTime: 0,
  videoUploadtime: 0,
  videoLike: 0,
  videoCollect: 0,
  videoTitle: '',
  videoAuthor: '',
  videoIsFellow: 0,
  awemeType: 0,
  isLivePhoto: 0,
  isLoading: false,
  cellRoom: null,
  authorAvatar: '',
  authorId: ''
})

const emit = defineEmits<{
  (e: 'click', videoId: string): void
}>()

// 是否为直播
const isLive = computed(() => props.awemeType === 101 && !!props.cellRoom)

// 直播间信息（从 cellRoom.rawdata 解析）
const liveRoomInfo = computed(() => {
  if (!props.cellRoom?.rawdata) return null
  try {
    return JSON.parse(props.cellRoom.rawdata)
  } catch {
    return null
  }
})

// 直播封面
const liveCover = computed(() => {
  return liveRoomInfo.value?.cover?.url_list?.[0] || props.videoImg
})

// 直播流地址（优先使用 HLS，兼容性更好）
const liveStreamUrls = computed(() => {
  const streamUrl = liveRoomInfo.value?.stream_url
  if (!streamUrl) return []
  
  const urls: string[] = []
  const hlsMap = streamUrl.hls_pull_url_map
  
  // 优先添加 HLS 流（兼容性更好）
  if (streamUrl.hls_pull_url) urls.push(streamUrl.hls_pull_url)
  if (hlsMap?.FULL_HD1) urls.push(hlsMap.FULL_HD1)
  if (hlsMap?.HD1) urls.push(hlsMap.HD1)
  if (hlsMap?.SD1) urls.push(hlsMap.SD1)
  if (hlsMap?.SD2) urls.push(hlsMap.SD2)
  
  // 添加 FLV 流作为备用
  const flvMap = streamUrl.flv_pull_url
  if (flvMap?.FULL_HD1) urls.push(flvMap.FULL_HD1)
  if (flvMap?.HD1) urls.push(flvMap.HD1)
  if (flvMap?.SD1) urls.push(flvMap.SD1)
  if (flvMap?.SD2) urls.push(flvMap.SD2)
  
  return [...new Set(urls)]
})

// 直播观看人数
const liveViewCount = computed(() => {
  const stats = liveRoomInfo.value?.room_view_stats
  return stats?.display_short || stats?.display_value || ''
})

// 直播标题
const liveTitle = computed(() => {
  return liveRoomInfo.value?.title || props.videoTitle
})

// 主播头像
const anchorAvatar = computed(() => {
  return liveRoomInfo.value?.owner?.avatar_thumb?.url_list?.[0] || props.authorAvatar
})

// 主播昵称
const anchorNickname = computed(() => {
  return liveRoomInfo.value?.owner?.nickname || props.videoAuthor
})

// 根据类型生成链接
const videoLink = computed(() => {
  if (isLive.value) {
    return `/live/${props.videoId}`
  }
  const isImageGallery = props.awemeType === 68 && props.isLivePhoto !== 1
  return isImageGallery ? `/note/${props.videoId}` : `/video/${props.videoId}`
})

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  event.preventDefault()
  // 直播时跳转到直播页面，不打开 modal
  if (isLive.value) {
    window.location.href = videoLink.value
    return
  }
  emit('click', props.videoId)
}
</script>
<template>
  <div class="waterfall-item">
    <dy-skeleton
      animated
      :loading="isLoading"
      :class="{ 'discover-item-skeleton': isLoading }"
    >
      <template #template>
        <div class="skeleton-content">
          <div class="skeleton-logo">
            <svg-icon class="icon" icon="loading-logo" />
          </div>

          <div class="skeleton-bottom">
            <dy-skeleton-item variant="h3" style="width: 40%" />
            <dy-skeleton-item variant="h3" style="width: 100%" />
          </div>
        </div>
      </template>
      <template #default>
        <a :href="videoLink" class="waterfall-videoCardContainer" @click="handleClick">
          <div class="item-content">
            <discover-video
              :img="isLive ? liveCover : props.videoImg"
              :videoTime="props.videoTime"
              :like="props.videoLike"
              :videoUrl="props.videoUrl"
              :isLive="isLive"
              :liveStreamUrls="liveStreamUrls"
              :liveViewCount="liveViewCount"
              :anchorAvatar="anchorAvatar"
            />
            <title-box
              :author="isLive ? anchorNickname : props.videoAuthor"
              :authorId="props.authorId"
              :title="isLive ? liveTitle : props.videoTitle"
              :time="props.videoUploadtime"
              :fellow="props.videoIsFellow"
              :collect="props.videoCollect"
              :isLive="isLive"
            />
          </div>
        </a>
      </template>
    </dy-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.waterfall-item {
  min-width: 310px;
  .waterfall-videoCardContainer {
    // border: 0.5px solid var(--color-line-l3);
    // box-shadow: 0 0 0.5px 0 var(--color-secondary-default);
    // border-radius: 12px;
    flex-direction: column;
    transition-property: transform, box-shadow;
    transition-duration: 0.35s;
    display: flex;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    .item-content {
      display: flex;
      flex-direction: column;

      &:hover {
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.discover-item-skeleton {
  background: var(--color-bg-b1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;

  .skeleton-content {
    padding: 16px;

    .skeleton-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      // padding-bottom: 16px;
      padding-top: 60px;
    }

    .skeleton-bottom {
      padding-top: 20px;
      padding-top: 96px;
    }
  }
}

.icon {
  width: 105px;
  height: 120px;
  // color: var(--color-bg-b2);
}
</style>
