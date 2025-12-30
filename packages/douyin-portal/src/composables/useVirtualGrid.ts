import { ref, computed, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'

/**
 * 虚拟网格列表 - 固定渲染窗口策略
 *
 * 策略说明：
 * - 所有数据都有对应的 DOM 节点（用于保持滚动位置）
 * - 但只有可视区域附近的节点才渲染实际内容
 * - 其他节点渲染为占位骨架屏
 *
 * 类似 swiper-video 的实现方式
 */

// 列数断点配置
interface ColumnBreakpoint {
  minWidth: number
  columns: number
}

interface VirtualGridOptions {
  // 渲染窗口大小（可视区域内渲染的最大数量）
  renderWindowSize?: number
  // 缓冲区大小（可视区域外额外渲染的数量）
  bufferSize?: number
  // 滚动容器（可以是 Ref<HTMLElement> 或选择器字符串）
  scrollContainer?: Ref<HTMLElement | null> | string
  // 触发加载更多的距离阈值
  loadMoreThreshold?: number
  // 预估单个卡片高度
  estimatedItemHeight?: number
  // 列数断点配置（从大到小排列）
  columnBreakpoints?: ColumnBreakpoint[]
  // 默认列数
  defaultColumns?: number
}

// 默认列数断点（discover-list 的配置）
const DEFAULT_COLUMN_BREAKPOINTS: ColumnBreakpoint[] = [
  { minWidth: 1850, columns: 5 },
  { minWidth: 1520, columns: 4 },
  { minWidth: 1102, columns: 3 },
  { minWidth: 0, columns: 2 }
]

export function useVirtualGrid<T>(
  dataList: Ref<T[]>,
  containerRef: Ref<HTMLElement | null>,
  options: VirtualGridOptions = {}
) {
  const {
    renderWindowSize = 40,
    bufferSize = 8,
    scrollContainer: scrollContainerOption,
    loadMoreThreshold = 500,
    estimatedItemHeight = 400,
    columnBreakpoints = DEFAULT_COLUMN_BREAKPOINTS,
    defaultColumns = 3
  } = options

  // 滚动状态
  const scrollTop = ref(0)
  const scrollHeight = ref(0)
  const viewportHeight = ref(0)
  const containerWidth = ref(0)

  // 列数（根据响应式断点计算）
  const columnCount = ref(defaultColumns)

  // 渲染范围
  const renderRange = ref({ start: 0, end: renderWindowSize })

  // 滚动容器引用
  let scrollContainerEl: HTMLElement | null = null

  // 收缩定时器（类似 swiper-video 的 shrinkTimer）
  let shrinkTimer: ReturnType<typeof setTimeout> | null = null

  // 计算列数
  const calculateColumnCount = () => {
    const width = containerWidth.value
    // 根据断点配置计算列数
    for (const bp of columnBreakpoints) {
      if (width >= bp.minWidth) {
        columnCount.value = bp.columns
        return
      }
    }
    columnCount.value = defaultColumns
  }

  // 计算每行高度（预估）
  const rowHeight = computed(() => estimatedItemHeight)

  // 根据滚动位置计算可见的数据索引范围
  const calculateVisibleRange = () => {
    if (!scrollContainerEl || !containerRef.value) {
      return { start: 0, end: renderWindowSize }
    }

    const containerRect = scrollContainerEl.getBoundingClientRect()
    const items = containerRef.value.querySelectorAll('.virtual-item')

    if (items.length === 0) {
      return { start: 0, end: renderWindowSize }
    }

    let firstVisible = -1
    let lastVisible = -1

    // 遍历所有项目，找到可见范围
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement
      const rect = item.getBoundingClientRect()

      // 检查元素是否在可视区域内（含缓冲区）
      const isVisible = rect.bottom > containerRect.top - loadMoreThreshold &&
                        rect.top < containerRect.bottom + loadMoreThreshold

      if (isVisible) {
        if (firstVisible === -1) firstVisible = i
        lastVisible = i
      } else if (firstVisible !== -1) {
        // 已经找到可见区域，且当前元素不可见，可以提前退出
        break
      }
    }

    // 如果没找到可见元素，返回基于滚动位置的估算
    if (firstVisible === -1) {
      const estimatedStart = Math.floor(scrollTop.value / estimatedItemHeight) * columnCount.value
      return {
        start: Math.max(0, estimatedStart - bufferSize),
        end: Math.min(dataList.value.length, estimatedStart + renderWindowSize + bufferSize)
      }
    }

    // 添加缓冲区
    const start = Math.max(0, firstVisible - bufferSize)
    const end = Math.min(dataList.value.length, lastVisible + bufferSize + 1)

    return { start, end }
  }

  // 更新渲染范围（带收缩延迟，避免快速滚动时频繁切换）
  const updateRenderRange = () => {
    const newRange = calculateVisibleRange()

    // 清除之前的收缩定时器
    if (shrinkTimer) {
      clearTimeout(shrinkTimer)
      shrinkTimer = null
    }

    // 立即扩展范围（确保新进入可视区域的内容立即渲染）
    renderRange.value = {
      start: Math.min(renderRange.value.start, newRange.start),
      end: Math.max(renderRange.value.end, newRange.end)
    }

    // 延迟收缩范围（避免快速滚动时频繁销毁/创建）
    shrinkTimer = setTimeout(() => {
      renderRange.value = newRange
    }, 300)
  }

  // 判断某个索引是否应该渲染内容
  const shouldRenderContent = (index: number): boolean => {
    return index >= renderRange.value.start && index < renderRange.value.end
  }

  // 处理滚动事件
  const handleScroll = useThrottleFn(() => {
    if (!scrollContainerEl) return
    scrollTop.value = scrollContainerEl.scrollTop
    scrollHeight.value = scrollContainerEl.scrollHeight
    viewportHeight.value = scrollContainerEl.clientHeight
    updateRenderRange()
  }, 16) // 约 60fps

  // 是否接近底部（用于触发加载更多）
  const isNearBottom = computed(() => {
    if (!scrollHeight.value || !viewportHeight.value) return false
    return scrollHeight.value - (scrollTop.value + viewportHeight.value) < loadMoreThreshold
  })

  // 获取滚动容器元素
  const getScrollContainer = (): HTMLElement | null => {
    if (!scrollContainerOption) {
      // 默认使用 containerRef 的父元素作为滚动容器
      return containerRef.value?.parentElement || null
    }

    if (typeof scrollContainerOption === 'string') {
      // 选择器字符串
      return document.querySelector(scrollContainerOption)
    }

    // Ref<HTMLElement>
    return scrollContainerOption.value
  }

  // 初始化
  const init = async () => {
    await nextTick()

    // 获取滚动容器
    scrollContainerEl = getScrollContainer()
    if (!scrollContainerEl) {
      console.warn('[useVirtualGrid] 未找到滚动容器')
      return
    }

    // 获取容器尺寸
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      containerWidth.value = rect.width
    }

    viewportHeight.value = scrollContainerEl.clientHeight
    scrollHeight.value = scrollContainerEl.scrollHeight

    // 计算列数
    calculateColumnCount()

    // 初始化渲染范围
    updateRenderRange()

    // 监听滚动
    scrollContainerEl.addEventListener('scroll', handleScroll, { passive: true })
  }

  // 监听容器尺寸变化
  const handleResize = () => {
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      if (Math.abs(rect.width - containerWidth.value) > 10) {
        containerWidth.value = rect.width
        calculateColumnCount()
        updateRenderRange()
      }
    }
    if (scrollContainerEl) {
      viewportHeight.value = scrollContainerEl.clientHeight
      scrollHeight.value = scrollContainerEl.scrollHeight
    }
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    init()

    // 监听容器尺寸变化
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    // 清理定时器
    if (shrinkTimer) {
      clearTimeout(shrinkTimer)
      shrinkTimer = null
    }

    // 清理滚动监听
    if (scrollContainerEl) {
      scrollContainerEl.removeEventListener('scroll', handleScroll)
    }

    // 清理 ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  // 监听数据变化，更新渲染范围
  watch(
    () => dataList.value.length,
    async () => {
      // 等待 DOM 更新后再计算
      await nextTick()
      if (scrollContainerEl) {
        scrollHeight.value = scrollContainerEl.scrollHeight
        viewportHeight.value = scrollContainerEl.clientHeight
      }
      updateRenderRange()
    }
  )

  // 滚动到指定索引
  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!scrollContainerEl) return
    const row = Math.floor(index / columnCount.value)
    const targetScrollTop = row * rowHeight.value
    scrollContainerEl.scrollTo({
      top: targetScrollTop,
      behavior
    })
  }

  // 更新滚动状态（供外部调用，确保 isNearBottom 计算正确）
  const updateScrollState = () => {
    if (scrollContainerEl) {
      scrollTop.value = scrollContainerEl.scrollTop
      scrollHeight.value = scrollContainerEl.scrollHeight
      viewportHeight.value = scrollContainerEl.clientHeight
    }
  }

  return {
    // 核心方法
    shouldRenderContent,

    // 状态
    renderRange,
    columnCount,
    isNearBottom,

    // 方法
    scrollToIndex,
    updateRenderRange,
    updateScrollState,

    // 重新初始化
    reinit: init
  }
}
