import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const videosCtrolStore = defineStore('control', () => {
  //是否显示评论
  const isShowComment = ref(true)
  //是否打开相关内容
  const isShowRelated = ref(true)
  const isMuted = ref(true)
  const refresh_index = ref(1)
  const count = ref(10)
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
    // 检查是否已经是最后一个视频
    if (activeVideoIndex.value >= videosNum.value - 1) {
      // 已经是最后一个视频，触发加载更多
      if (activeVideoIndex.value >= videosNum.value - 3) {
        refresh_index.value = refresh_index.value + 1
      }
      return
    }

    //暂停当前视频
    activeVideoPlayState.value = false
    // translateY.value = computeTranslateY(activeVideoIndex.value + 1)
    //切换到下一个视频
    activeVideoIndex.value = activeVideoIndex.value + 1
    activeVideoPlayState.value = true

    //提前3个视频预加载下一页
    if (activeVideoIndex.value >= videosNum.value - 3) {
      refresh_index.value = refresh_index.value + 1
    }
  }

  watch([activeVideoIndex, initTranslateY], () => {
    translateY.value = computeTranslateY(activeVideoIndex.value)
  })

  //重置状态
  const reset = () => {
    refresh_index.value = 1
    count.value = 10
    translateY.value = 0
    activeVideoIndex.value = 0
    activeVideoPlayState.value = true
    videosNum.value = 0
    stopScroll.value = false
  }

  // 刷新推荐列表（触发重新加载）
  const refreshRecommend = () => {
    reset()
    // 触发 refresh_index 变化以重新获取数据
    refresh_index.value = 1
  }

  return {
    isShowComment,
    isShowRelated,
    isMuted,
    refresh_index,
    count,
    videosNum,
    translateY,
    initTranslateY,
    activeVideoIndex,
    activeVideoPlayState,
    stopScroll,
    handlePrev,
    handleNext,
    reset,
    refreshRecommend
  }
})
