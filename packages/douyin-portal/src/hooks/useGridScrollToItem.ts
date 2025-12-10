import { watch, nextTick, type Ref, type MaybeRefOrGetter, toValue } from 'vue'

/**
 * useScrollToItem - 列表项滚动定位 Hook
 *
 * @description
 * 将指定项滚动到视口顶部。使用原生 scrollIntoView API 实现。
 * 常用于音乐播放列表、图片画廊等场景，当选中/播放某项时自动滚动到该项。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { useGridScrollToItem } from '@/hooks'
 *
 * const listRef = ref<HTMLElement | null>(null)
 * const currentId = ref<string | null>(null)
 * const items = ref([{ id: '1' }, { id: '2' }, { id: '3' }])
 *
 * const { scrollToItem } = useGridScrollToItem({
 *   containerRef: listRef,
 *   currentId,
 *   items,
 *   idKey: 'id',
 *   autoScroll: true // 可选，默认 true
 * })
 *
 * // 手动触发滚动
 * scrollToItem('2')
 * </script>
 *
 * <template>
 *   <div ref="listRef" class="list">
 *     <div v-for="item in items" :key="item.id">{{ item.id }}</div>
 *   </div>
 * </template>
 * ```
 *
 * @param options - 配置选项
 * @param options.containerRef - 列表容器的 ref 引用
 * @param options.currentId - 当前选中/播放项的 ID（响应式）
 * @param options.items - 列表数据（响应式）
 * @param options.idKey - 列表项中 ID 字段的键名，默认 'id'
 * @param options.autoScroll - 是否在 currentId 变化时自动滚动，默认 true
 * @param options.behavior - 滚动行为，'smooth' | 'instant' | 'auto'，默认 'smooth'
 * @param options.block - 垂直对齐方式，'start' | 'center' | 'end' | 'nearest'，默认 'start'
 *
 * @returns
 * - scrollToItem: 手动滚动到指定 ID 的项
 * - scrollToIndex: 手动滚动到指定索引的项
 */

export interface UseGridScrollToItemOptions<T> {
  /** 列表容器的 ref 引用 */
  containerRef: Ref<HTMLElement | null>
  /** 当前选中/播放项的 ID */
  currentId: Ref<string | null>
  /** 列表数据 */
  items: MaybeRefOrGetter<T[]>
  /** 列表项中 ID 字段的键名 */
  idKey?: keyof T
  /** 是否在 currentId 变化时自动滚动 */
  autoScroll?: boolean
  /** 滚动行为 */
  behavior?: ScrollBehavior
  /** 垂直对齐方式 */
  block?: ScrollLogicalPosition
  /** 顶部偏移量（用于处理固定导航栏等情况） */
  offsetTop?: number
}

export interface UseGridScrollToItemReturn {
  /** 滚动到指定 ID 的项 */
  scrollToItem: (id: string) => Promise<void>
  /** 滚动到指定索引的项 */
  scrollToIndex: (index: number) => Promise<void>
}

export function useGridScrollToItem<T extends Record<string, any>>(
  options: UseGridScrollToItemOptions<T>
): UseGridScrollToItemReturn {
  const {
    containerRef,
    currentId,
    items,
    idKey = 'id' as keyof T,
    autoScroll = true,
    behavior = 'smooth',
    block = 'start',
    offsetTop = 0
  } = options

  /**
   * 查找最近的可滚动父元素
   */
  const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
    let parent = element.parentElement
    while (parent) {
      const style = getComputedStyle(parent)
      const overflowY = style.overflowY
      const overflow = style.overflow
      // 检查是否可滚动
      if (
        (overflowY === 'auto' || overflowY === 'scroll' || overflow === 'auto' || overflow === 'scroll') &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent
      }
      parent = parent.parentElement
    }
    return null
  }

  /**
   * 滚动到指定索引的项
   */
  const scrollToIndex = async (index: number): Promise<void> => {
    await nextTick()
    const container = containerRef.value
    if (!container || index < 0) return

    // 获取目标元素
    const targetElement = container.children[index] as HTMLElement
    if (!targetElement) return

    // 查找可滚动的父容器
    const scrollParent = findScrollableParent(targetElement)

    // 获取目标元素的位置
    const targetRect = targetElement.getBoundingClientRect()

    if (scrollParent) {
      const parentRect = scrollParent.getBoundingClientRect()

      // 根据 block 参数计算目标滚动位置
      let targetScrollTop: number

      // 检查元素是否完全在视口内（考虑顶部偏移量）
      const visibleTop = parentRect.top + offsetTop
      const isFullyVisible = targetRect.top >= visibleTop && targetRect.bottom <= parentRect.bottom

      if (block === 'start') {
        // 如果元素完全可见，不滚动
        if (isFullyVisible) return
        // 滚动到顶部，考虑偏移量
        targetScrollTop = scrollParent.scrollTop + (targetRect.top - visibleTop)
      } else if (block === 'center') {
        targetScrollTop = scrollParent.scrollTop + (targetRect.top - parentRect.top) - (parentRect.height - targetRect.height) / 2
      } else if (block === 'end') {
        targetScrollTop = scrollParent.scrollTop + (targetRect.bottom - parentRect.bottom)
      } else {
        // nearest: 只在元素不完全可见时滚动
        const isAbove = targetRect.top < visibleTop
        const isBelow = targetRect.bottom > parentRect.bottom

        if (!isAbove && !isBelow) {
          // 元素已经完全可见，不需要滚动
          return
        }

        if (isAbove) {
          targetScrollTop = scrollParent.scrollTop + (targetRect.top - visibleTop)
        } else {
          targetScrollTop = scrollParent.scrollTop + (targetRect.bottom - parentRect.bottom)
        }
      }

      scrollParent.scrollTo({
        top: targetScrollTop,
        behavior
      })
    } else {
      // 没有找到可滚动父元素，使用 window 滚动
      let targetScrollTop: number

      // 检查元素是否完全在视口内（考虑顶部偏移量）
      const visibleTop = offsetTop
      const isFullyVisible = targetRect.top >= visibleTop && targetRect.bottom <= window.innerHeight

      if (block === 'start') {
        // 如果元素完全可见，不滚动
        if (isFullyVisible) return
        // 滚动到顶部，考虑偏移量
        targetScrollTop = window.scrollY + targetRect.top - offsetTop
      } else if (block === 'center') {
        targetScrollTop = window.scrollY + targetRect.top - (window.innerHeight - targetRect.height) / 2
      } else if (block === 'end') {
        targetScrollTop = window.scrollY + targetRect.bottom - window.innerHeight
      } else {
        // nearest
        const isAbove = targetRect.top < visibleTop
        const isBelow = targetRect.bottom > window.innerHeight

        if (!isAbove && !isBelow) {
          return
        }

        if (isAbove) {
          targetScrollTop = window.scrollY + targetRect.top - offsetTop
        } else {
          targetScrollTop = window.scrollY + targetRect.bottom - window.innerHeight
        }
      }

      window.scrollTo({
        top: targetScrollTop,
        behavior
      })
    }
  }

  /**
   * 滚动到指定 ID 的项
   */
  const scrollToItem = async (id: string): Promise<void> => {
    const itemList = toValue(items)
    const index = itemList.findIndex((item) => String(item[idKey]) === id)
    if (index !== -1) {
      await scrollToIndex(index)
    }
  }

  // 监听当前 ID 变化，自动滚动
  if (autoScroll) {
    watch(currentId, (newId) => {
      if (newId) {
        scrollToItem(newId)
      }
    })
  }

  return {
    scrollToItem,
    scrollToIndex
  }
}
