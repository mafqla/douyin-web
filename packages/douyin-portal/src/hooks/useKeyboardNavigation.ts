import { videosCtrolStore } from '@/stores/videos-control'
import { onMounted, onBeforeUnmount } from 'vue'

// 快进/快退步长（秒）
const SEEK_STEP = 5

export const useKeyboardNavigation = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // 如果焦点在输入框等元素上，不处理快捷键
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return
    }

    if (event.key === 'ArrowUp' || event.key === 'w') {
      // 向上切换
      event.preventDefault()
      event.stopPropagation()
      videosCtrolStore().handlePrev()
    } else if (event.key === 'ArrowDown' || event.key === 's') {
      // 向下切换
      event.preventDefault()
      event.stopPropagation()
      if (!videosCtrolStore().stopScroll) {
        videosCtrolStore().handleNext()
      }
    } else if (event.key === 'ArrowRight') {
      // 快进
      event.preventDefault()
      seekVideo(SEEK_STEP)
    } else if (event.key === 'ArrowLeft') {
      // 快退
      event.preventDefault()
      seekVideo(-SEEK_STEP)
    }
  }

  // 快进/快退视频
  const seekVideo = (seconds: number) => {
    // 查找当前活动的视频播放器
    const video = document.querySelector(
      '.xgplayer video'
    ) as HTMLVideoElement | null
    if (video && !isNaN(video.duration)) {
      const newTime = Math.max(
        0,
        Math.min(video.currentTime + seconds, video.duration)
      )
      video.currentTime = newTime
    }
  }

  onMounted(() => {
    // 使用捕获阶段监听，确保在播放器处理之前捕获到事件
    window.addEventListener('keydown', handleKeyDown, true)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown, true)
  })
}
