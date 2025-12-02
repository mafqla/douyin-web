<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
import { watchEffect, type PropType, ref, onMounted, computed } from 'vue'
import swiperPlayer from '../video-player/swiper-player.vue'
import { useElementSize, useThrottleFn } from '@vueuse/core'
import { useKeyboardNavigation } from '@/hooks'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

defineProps({
  videoList: {
    type: Array as PropType<IAwemeInfo[]>,
    default: []
  }
})

const isShowItem = computed(() => {
  const currentIndex = videosCtrolStore().activeVideoIndex
  if (currentIndex === 0) {
    return (index: number) => index >= 0 && index <= 2
  } else {
    return (index: number) =>
      index >= currentIndex - 1 && index <= currentIndex + 1
  }
})

const isActiveIndex = (index: number) =>
  index === videosCtrolStore().activeVideoIndex

// 监听活动视频索引的变化，当变化时更新过渡时间   transition: 'transform 0.5s ease'
const transitionDuration = ref(0)

const videoHeight = ref()
const { height } = useElementSize(videoHeight)

watchEffect(() => {
  if (isActiveIndex(videosCtrolStore().activeVideoIndex)) {
    transitionDuration.value = 250 // 将过渡时间设置为250ms
  } else {
    transitionDuration.value = 0 // 将过渡时间重新设置为0ms
  }
  videosCtrolStore().initTranslateY = height.value + 12
})

const swiperPlayerRef = ref()

const isDragging = ref(false)
const startY = ref(0)
const dragOffset = ref(0)
const baseTranslateY = ref(0)

const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  startY.value = event.clientY
  baseTranslateY.value = videosCtrolStore().translateY
  transitionDuration.value = 0
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  event.preventDefault()
  dragOffset.value = event.clientY - startY.value
  videosCtrolStore().translateY = baseTranslateY.value + dragOffset.value
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  transitionDuration.value = 250
  const threshold = height.value / 4
  if (dragOffset.value < -threshold) {
    videosCtrolStore().handleNext()
  } else if (dragOffset.value > threshold) {
    videosCtrolStore().handlePrev()
  } else {
    videosCtrolStore().translateY = baseTranslateY.value
  }
  dragOffset.value = 0
}

const debouncedNext = useThrottleFn(() => {
  if (!videosCtrolStore().stopScroll) {
    videosCtrolStore().handleNext()
  }
}, 3000)
const debouncedPrev = useThrottleFn(() => {
  videosCtrolStore().handlePrev()
}, 3000)

const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  const delta = event.deltaY
  if (delta > 0) {
    debouncedNext()
  } else if (delta < 0) {
    debouncedPrev()
  }
}

onMounted(() => {
  videoHeight.value?.addEventListener('wheel', handleWheel, { passive: false })
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

useKeyboardNavigation()
</script>
<template>
  <div class="carousel" ref="videoHeight" @mousedown="handleMouseDown">
    <div
      class="carousel-inner"
      :style="{
        transform:
          'translate3d(0px,' + videosCtrolStore().translateY + 'px, 0px)',
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
        <template v-if="isShowItem(index) && item?.media_type === 4">
          <swiper-player
            ref="swiperPlayerRef"
            :aweme-info="item"
            :isPlay="isActiveIndex(index)"
          />
        </template>
        <template v-if="isShowItem(index) && item?.aweme_type === 101">
          {{item.cell_room.rawdata}}
        </template>
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
