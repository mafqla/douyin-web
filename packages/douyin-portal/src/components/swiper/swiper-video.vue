<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
import { watchEffect, type PropType, ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import swiperPlayer from '../video-player/swiper-player.vue'
import { useElementSize, useThrottleFn } from '@vueuse/core'
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

watch(
  () => store.activeVideoIndex,
  (currentIndex) => {
    cachedRange.value = {
      start: Math.max(0, currentIndex - 1),
      end: currentIndex + 1
    }
  },
  { immediate: true }
)

const shouldRender = (index: number) => {
  return index >= cachedRange.value.start && index <= cachedRange.value.end
}

const isActiveIndex = (index: number) => index === store.activeVideoIndex

const transitionDuration = ref(0)
const videoHeight = ref()
const { height } = useElementSize(videoHeight)

const dragOffset = ref(0)

watchEffect(() => {
  store.initTranslateY = height.value + 12
})

const isDragging = ref(false)
const startY = ref(0)

const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  startY.value = event.clientY
  dragOffset.value = 0
  transitionDuration.value = 0
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  event.preventDefault()
  dragOffset.value = event.clientY - startY.value
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  transitionDuration.value = 250
  const threshold = height.value / 4
  if (dragOffset.value < -threshold) {
    store.handleNext()
  } else if (dragOffset.value > threshold) {
    store.handlePrev()
  }
  dragOffset.value = 0
}

const debouncedNext = useThrottleFn(() => {
  if (!store.stopScroll) {
    store.handleNext()
  }
}, 3000)
const debouncedPrev = useThrottleFn(() => {
  store.handlePrev()
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

watch(() => store.activeVideoIndex, () => {
  transitionDuration.value = 250
  setTimeout(() => {
    transitionDuration.value = 0
  }, 300)
})

onMounted(() => {
  videoHeight.value?.addEventListener('wheel', handleWheel, { passive: false })
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onBeforeUnmount(() => {
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
        <KeepAlive>
          <swiper-player
            v-if="shouldRender(index) && item?.media_type === 4"
            :key="item.aweme_id"
            :aweme-info="item"
            :isPlay="isActiveIndex(index)"
          />
        </KeepAlive>
        <template v-if="shouldRender(index) && item?.aweme_type === 101">
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
