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
  /** 用于查找元素的 data 属性名（如 'aweme-id' 会查找 data-aweme-id） */
  dataAttr?: string
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
    offsetTop = 0,
    dataAttr
  } = options

  /**
   * 检查元素是否在滚动容器的可视区域内
   */
  const isElementInContainerView = (
    element: HTMLElement,
    scrollContainer: HTMLElement
  ): boolean => {
    const elementRect = element.getBoundingClientRect()
    const containerRect = scrollContainer.getBoundingClientRect()

    return (
      elementRect.top >= containerRect.top + offsetTop &&
      elementRect.bottom <= containerRect.bottom
    )
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

    // 检查容器本身是否是可滚动的
    const style = getComputedStyle(container)
    const isContainerScrollable =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      container.scrollHeight > container.clientHeight

    if (isContainerScrollable) {
      // 容器本身可滚动，检查元素是否在容器可视区域内
      const isInView = isElementInContainerView(targetElement, container)
      if (!isInView) {
        targetElement.scrollIntoView({ behavior, block })
      }
    } else {
      // 容器不可滚动，使用视口判断
      const rect = targetElement.getBoundingClientRect()
      const isInViewport =
        rect.top >= offsetTop && rect.bottom <= window.innerHeight
      if (!isInViewport) {
        targetElement.scrollIntoView({ behavior, block })
      }
    }
  }

  /**
   * 检查元素是否在视口可视区域内
   */
  const isElementInViewport = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    // 使用与直接实现一致的判断逻辑
    return rect.top >= 0 && rect.bottom <= window.innerHeight
  }

  /**
   * 滚动到指定 ID 的项
   */
  const scrollToItem = async (id: string): Promise<void> => {
    await nextTick()

    // 优先使用 data 属性查找元素（更可靠）
    if (dataAttr) {
      const element = document.querySelector(
        `[data-${dataAttr}="${id}"]`
      ) as HTMLElement
      if (element) {
        if (!isElementInViewport(element)) {
          element.scrollIntoView({ behavior, block })
        }
        return
      }
    }

    // 回退到索引查找
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
