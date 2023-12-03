<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
import type { IVideoList } from '@/service/videos/videosType'
import { watchEffect, type PropType, ref, onMounted, computed } from 'vue'
import { useElementSize, useThrottleFn } from '@vueuse/core'
import { useKeyboardNavigation } from '@/hooks'

defineProps({
  videoList: {
    type: Array as PropType<IVideoList[]>,
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

const debouncedNext = useThrottleFn(() => {
  if (!videosCtrolStore().stopScroll) {
    videosCtrolStore().handleNext()
  }
}, 3000)
const debouncedPrev = useThrottleFn(() => {
  videosCtrolStore().handlePrev()
}, 3000)

onMounted(() => {
  window.addEventListener('wheel', handleWheel)
})
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
        :key="item.id"
        :style="{
          height: `${height}px`,
          'margin-bottom': '12px'
        }"
        @mouseWheel="handleWheel"
      >
        <template v-if="isShowItem(index)">
          <swiper-player
            :id="item.id"
            :userId="item.userId"
            :username="item.userName"
            :uploadTime="item.uploadTime"
            :description="item.description"
            :url="item.videosAddress"
            :poster="item.videosCover"
            :img="item.userAvatar"
            :dianzan="item.likeCount"
            :comment="item.commentCount"
            :shoucang="item.collectCount"
            :isLike="item.isLike"
            :isCollect="item.isCollect"
            :isAttention="item.isAttention"
            :isPlay="isActiveIndex(index)"
          />
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
