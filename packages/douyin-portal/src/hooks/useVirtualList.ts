import { ref, onMounted, onUnmounted, type Ref, watchEffect } from 'vue'

interface UseVirtualScrollResult<T> {
  scrollToItem: (index: number) => void
  visibleItems: Ref<T[]>
  currentVisibleIndex: Ref<number | null>
}

export function useVirtualList<T>(
  containerRef: Ref<HTMLElement | null>,
  items: Ref<T[]>,
  miniCount: number
): UseVirtualScrollResult<T> {
  const startIndex = ref(0)
  const endIndex = ref(miniCount)
  const intersectionObserver = ref<IntersectionObserver | null>(null)
  const currentVisibleIndex = ref<number | null>(null)
  const visibleItems = ref<T[]>([]) as Ref<T[]>
  const buffer = 5 // 设置缓冲区大小，避免滚动过快
  const itemsRef = ref<HTMLElement[]>([])

  const calculateVisibleRange = () => {
    const containerHeight =
      containerRef.value?.clientHeight || window.innerHeight
    const visibleHeight = window.innerHeight
    let totalHeight = 0
    let start = startIndex.value
    let end = start

    //todo: 优化计算逻辑和完善 -- 待完成

    startIndex.value = Math.max(0, start)
    endIndex.value = Math.min(end, items.value.length)
    visibleItems.value = items.value.slice(startIndex.value, endIndex.value)
  }

  const scrollToItem = (index: number): void => {
    if (index >= 0 && index < items.value.length) {
      startIndex.value = index
      calculateVisibleRange()

      const itemElement = containerRef.value?.querySelector(
        `[data-index="${index}"]`
      ) as HTMLElement
      itemElement?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }

  onUnmounted(() => {
    intersectionObserver.value?.disconnect()
  })
  onUnmounted(() => {
    intersectionObserver.value?.disconnect()
  })

  watchEffect(() => {
    calculateVisibleRange()
    console.log(
      'containerHeight',
      containerRef.value?.clientHeight,
      window.innerHeight
    )
  })

  return {
    scrollToItem,
    visibleItems,
    currentVisibleIndex
  }
}
