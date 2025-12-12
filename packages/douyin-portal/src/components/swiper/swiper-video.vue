<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
import {
  watchEffect,
  type PropType,
  ref,
  onMounted,
  computed,
  watch,
  onBeforeUnmount
} from 'vue'
import swiperPlayer from '../video-player/swiper-player.vue'
import livePreviewPlayer from '../video-player/live-preview-player.vue'
import { useElementSize } from '@vueuse/core'
import { useKeyboardNavigation } from '@/hooks'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

const props = defineProps({
  videoList: {
    type: Array as PropType<IAwemeInfo[]>,
    default: []
  }
})

const store = videosCtrolStore()

const cachedRange = ref({ start: 0, end: 2 })
let shrinkTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => store.activeVideoIndex,
  (currentIndex, oldIndex) => {
    if (shrinkTimer) {
      clearTimeout(shrinkTimer)
      shrinkTimer = null
    }
    cachedRange.value = {
      start: Math.max(0, Math.min(currentIndex, oldIndex ?? currentIndex) - 1),
      end: Math.max(currentIndex, oldIndex ?? currentIndex) + 2
    }
    shrinkTimer = setTimeout(() => {
      cachedRange.value = {
        start: Math.max(0, currentIndex - 1),
        end: currentIndex + 2
      }
    }, 350)
  },
  { immediate: true }
)

const shouldRender = (index: number) => {
  return index >= cachedRange.value.start && index <= cachedRange.value.end
}

const isActiveIndex = (index: number) => index === store.activeVideoIndex

// 解析直播间 rawdata 字符串
const parseLiveRoomData = (rawdata: string | undefined) => {
  if (!rawdata) return null
  try {
    return JSON.parse(rawdata)
  } catch {
    return null
  }
}

// 从直播间数据中提取所有可用的直播流 URL（返回数组，支持备用流）
const getLiveStreamUrls = (roomData: any): string[] => {
  if (!roomData) return []
  const urls: string[] = []
  const streamUrl = roomData?.stream_url
  const hlsMap = roomData?.hls_pull_url_map

  // 优先添加 HLS 流（兼容性更好）
  if (streamUrl?.hls_pull_url) urls.push(streamUrl.hls_pull_url)
  if (hlsMap?.FULL_HD1) urls.push(hlsMap.FULL_HD1)
  if (hlsMap?.HD1) urls.push(hlsMap.HD1)
  if (hlsMap?.SD1) urls.push(hlsMap.SD1)
  if (hlsMap?.SD2) urls.push(hlsMap.SD2)

  // 添加 FLV 流作为备用
  if (streamUrl?.flv_pull_url?.HD1) urls.push(streamUrl.flv_pull_url.HD1)
  if (streamUrl?.flv_pull_url?.SD1) urls.push(streamUrl.flv_pull_url.SD1)
  if (streamUrl?.flv_pull_url?.SD2) urls.push(streamUrl.flv_pull_url.SD2)

  // 去重
  return [...new Set(urls)]
}

const transitionDuration = ref(0)
const videoHeight = ref()
const { height } = useElementSize(videoHeight)

const dragOffset = ref(0)
const accumulatedDelta = ref(0)
const wheelThreshold = 150
let lastWheelTime = 0
const wheelCooldown = 500

watchEffect(() => {
  store.initTranslateY = height.value + 12
})

const isDragging = ref(false)
const isActualDragging = ref(false)
const startY = ref(0)
const isSwitching = ref(false)
const dragThreshold = 10
let shouldPreventClick = false

const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  isActualDragging.value = false
  startY.value = event.clientY
  dragOffset.value = 0
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  const deltaY = event.clientY - startY.value
  if (!isActualDragging.value && Math.abs(deltaY) > dragThreshold) {
    isActualDragging.value = true
    transitionDuration.value = 0
  }
  if (isActualDragging.value) {
    event.preventDefault()
    dragOffset.value = deltaY
  }
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  if (!isActualDragging.value) {
    shouldPreventClick = false
    return
  }
  shouldPreventClick = true
  isActualDragging.value = false
  transitionDuration.value = 250
  const threshold = height.value / 4
  if (isSwitching.value) {
    dragOffset.value = 0
    return
  }
  if (dragOffset.value < -threshold) {
    isSwitching.value = true
    store.handleNext()
    setTimeout(() => {
      isSwitching.value = false
    }, 300)
  } else if (dragOffset.value > threshold) {
    isSwitching.value = true
    store.handlePrev()
    setTimeout(() => {
      isSwitching.value = false
    }, 300)
  }
  dragOffset.value = 0
}

const handleClick = (event: MouseEvent) => {
  if (shouldPreventClick) {
    event.stopPropagation()
    event.preventDefault()
    shouldPreventClick = false
  }
}

const handleWheel = (event: WheelEvent) => {
  const target = event.target as HTMLElement
  const scrollableParent = target.closest('[data-scrollable]')
  if (scrollableParent) {
    return
  }
  event.preventDefault()
  const now = Date.now()
  if (isSwitching.value || now - lastWheelTime < wheelCooldown) return
  accumulatedDelta.value += event.deltaY
  if (accumulatedDelta.value > wheelThreshold) {
    accumulatedDelta.value = 0
    lastWheelTime = now
    isSwitching.value = true
    store.handleNext()
    setTimeout(() => {
      isSwitching.value = false
    }, wheelCooldown)
  } else if (accumulatedDelta.value < -wheelThreshold) {
    accumulatedDelta.value = 0
    lastWheelTime = now
    isSwitching.value = true
    store.handlePrev()
    setTimeout(() => {
      isSwitching.value = false
    }, wheelCooldown)
  }
}

watch(
  () => store.activeVideoIndex,
  () => {
    transitionDuration.value = 250
    setTimeout(() => {
      transitionDuration.value = 0
    }, 300)
  }
)

onMounted(() => {
  videoHeight.value?.addEventListener('wheel', handleWheel, { passive: false })
  videoHeight.value?.addEventListener('click', handleClick, true)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onBeforeUnmount(() => {
  videoHeight.value?.removeEventListener('click', handleClick, true)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

useKeyboardNavigation()
</script>
<template>
  <div class="carousel" ref="videoHeight" @mousedown="handleMouseDown">
    <div
      class="carousel-inner"
      :style="{
        transform: `translate3d(0px, ${store.translateY + dragOffset}px, 0px)`,
        'transition-duration': `${transitionDuration}ms`
      }"
    >
      <div
        class="carousel-item"
        v-for="(item, index) in videoList"
        :key="item.aweme_id"
        :id="item.aweme_id"
        :style="{
          height: `${height}px`,
          'margin-bottom': '12px'
        }"
      >
        <swiper-player
          v-if="
            (shouldRender(index) && item?.media_type === 4) ||
            (shouldRender(index) && item?.aweme_type === 68)
          "
          :key="item.aweme_id"
          :aweme-info="item"
          :isPlay="isActiveIndex(index)"
        />
        <live-preview-player
          v-if="shouldRender(index) && item?.aweme_type === 101"
          :key="item.aweme_id"
          :url="getLiveStreamUrls(parseLiveRoomData(item.cell_room?.rawdata))"
          :room-data="parseLiveRoomData(item.cell_room?.rawdata)"
          :is-play="isActiveIndex(index)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  position: absolute;
  left: 0;
  top: calc(0% + 0px);
  width: 100%;
  height: calc(100% - 12px);
  overflow: hidden;
  overscroll-behavior: contain;
  padding-left: 0px;
  padding-right: 68px;
  .carousel-inner {
    width: 100%;
    height: 100%;
    .carousel-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      position: relative;
      flex-shrink: 0;
    }
    @media screen and (max-width: 1240px) {
      .carousel-item {
        min-width: 440px;
      }
    }
  }
}
</style>
