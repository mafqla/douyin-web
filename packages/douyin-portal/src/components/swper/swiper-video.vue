<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
import { watchEffect, type PropType, ref, onMounted, computed } from 'vue'
import swiperPlayer from '../video-player/swiper-player.vue'
import { useElementSize, useThrottleFn } from '@vueuse/core'
import { useKeyboardNavigation } from '@/hooks'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { json } from 'stream/consumers'

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

const debouncedNext = useThrottleFn(() => {
  if (!videosCtrolStore().stopScroll) {
    videosCtrolStore().handleNext()
  }
}, 3000)
const debouncedPrev = useThrottleFn(() => {
  videosCtrolStore().handlePrev()
}, 3000)

// onMounted(() => {
//   window.addEventListener('wheel', handleWheel)
// })

const handleWheel = (event: WheelEvent) => {
  const delta = event.deltaY
  // console.log(delta)
  setTimeout(() => {}, 200)
  if (delta > 0) {
    // 向下滚动
    debouncedNext() // 触发向下切换的防抖函数
  } else if (delta < 0) {
    // 向上滚动

    debouncedPrev() // 触发向上切换的防抖函数
  }
}

useKeyboardNavigation()
</script>
<template>
  <div class="carousel" ref="videoHeight">
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
  overflow: visible;
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
