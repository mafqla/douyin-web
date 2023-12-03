import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const videosCtrolStore = defineStore('control', () => {
  //是否显示评论
  const isShowComment = ref(true)
  const isMuted = ref(true)
  const page = ref(1)
  const size = ref(10)
  const translateY = ref(0)
  const initTranslateY = ref(876)
  //记录当前活动的视频索引
  const activeVideoIndex = ref(0)
  //记录当前视频的播放状态
  const activeVideoPlayState = ref(true)
  const videosNum = ref(0)
  //是否停止滚动
  const stopScroll = ref(false)
  //计算translateY的值,根据传入的索引和initTranslateY的值
  const computeTranslateY = (index: number) => {
    return -index * initTranslateY.value
  }
  const handlePrev = () => {
    if (activeVideoIndex.value > 0) {
      // translateY.value = computeTranslateY(activeVideoIndex.value + 1)
      //切换到上一个视频
      activeVideoIndex.value = activeVideoIndex.value - 1
    }
    stopScroll.value = false
  }
  const handleNext = () => {
    //暂停当前视频
    activeVideoPlayState.value = false
    // translateY.value = computeTranslateY(activeVideoIndex.value + 1)
    //切换到下一个视频
    activeVideoIndex.value = activeVideoIndex.value + 1
    activeVideoPlayState.value = true

    //判断是否到达最后一个视频
    if (activeVideoIndex.value === videosNum.value - 1) {
      page.value = page.value + 1
    }
  }

  watch([activeVideoIndex, initTranslateY], () => {
    translateY.value = computeTranslateY(activeVideoIndex.value)
  })

  //重置状态
  const reset = () => {
    page.value = 1
    size.value = 10
    translateY.value = 0
    activeVideoIndex.value = 0
    activeVideoPlayState.value = true
    videosNum.value = 0
    stopScroll.value = false
  }

  return {
    isShowComment,
    isMuted,
    page,
    size,
    videosNum,
    translateY,
    initTranslateY,
    activeVideoIndex,
    activeVideoPlayState,
    stopScroll,
    handlePrev,
    handleNext,
    reset
  }
})
