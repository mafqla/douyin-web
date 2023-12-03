import { videosCtrolStore } from '@/stores/videos-control'
import { ref, onMounted, onBeforeUnmount } from 'vue'

export const useKeyboardNavigation = () => {
  const handleKeyDown = (event: { key: string }) => {
    console.log(event.key)
    if (event.key === 'ArrowUp' || event.key === 'w') {
      // 向上切换
      videosCtrolStore().handlePrev()
    } else if (event.key === 'ArrowDown' || event.key === 's') {
      // 向下切换
      if (!videosCtrolStore().stopScroll) {
        videosCtrolStore().handleNext()
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
