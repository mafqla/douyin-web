import { render, type Ref } from 'vue'

import { useDebounceFn, useThrottleFn } from '@vueuse/core'

/**
 * @description: 分列布局计算
 * @param {HTMLDivElement} wrapperID 父元素绑定的id
 * @param {number} list 待处理的列表
 * @param {number} wrapperWidth 元素宽度
 * @param {SlotsType} slots slots句柄
 * @return {Layout} { wrapperHeight, layout }
 */
type LayoutItem = {
  translateX: string
  translateY: string
  width: number
  height: number
}

type Layout<T> = {
  transforms: LayoutItem[]
  totalHeight: number
}

type SlotsType = ReturnType<typeof useSlots>

// 使用 WeakMap 缓存高度
const heightCache = new WeakMap()
const widthCache = new WeakMap()

export function useVirtualWaterfall<T extends object>(
  wrapperEl: Ref<HTMLDivElement | null>,
  list: Ref<T[]>,
  slots: SlotsType,
  options: {
    distanceToScroll?: number
    bufferSize?: number
    minRenderItems?: number
  } = {}
) {
  const {
    distanceToScroll = 200,
    bufferSize = 2,
    minRenderItems = 20
  } = options

  // 容器相关的响应式变量
  const wrapperWidth = ref(0)
  const wrapperHeight = ref(0)
  const scrollTop = ref(0)

  // 布局状态
  const isLayoutReady = ref(false)
  const transformsRef = ref<LayoutItem[]>([])
  const isResizing = ref(false)

  // 可视区域相关
  const viewportHeight = ref(0)
  const visibleRange = ref({ start: 0, end: 0 })

  // 计算可见元素列表
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return list.value.slice(start, end)
  })

  // 更新可视范围
  function updateVisibleRange() {
    if (!transformsRef.value.length || !viewportHeight.value) {
      // 初始状态下至少显示 minRenderItems 个项目
      if (list.value.length > 0) {
        visibleRange.value = {
          start: 0,
          end: Math.min(minRenderItems, list.value.length)
        }
      } else {
        visibleRange.value = { start: 0, end: 0 }
      }
      return
    }
    const bufferHeight = viewportHeight.value * bufferSize
    const startPos = scrollTop.value - bufferHeight
    const endPos = scrollTop.value + viewportHeight.value + bufferHeight

    // 使用二分查找优化查找过程
    const findIndex = (position: number, findStart: boolean) => {
      let left = 0
      let right = transformsRef.value.length - 1
      let result = findStart ? 0 : transformsRef.value.length - 1

      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const item = transformsRef.value[mid]
        const itemTop = parseFloat(item.translateY)
        const itemBottom = itemTop + item.height

        if (findStart) {
          if (itemBottom >= position) {
            result = mid
            right = mid - 1
          } else {
            left = mid + 1
          }
        } else {
          if (itemTop <= position) {
            result = mid
            left = mid + 1
          } else {
            right = mid - 1
          }
        }
      }

      return result
    }

    const start = Math.max(0, findIndex(startPos, true))
    const end =
      Math.min(transformsRef.value.length - 1, findIndex(endPos, false)) + 1

    visibleRange.value = {
      start,
      end: Math.max(end, start + minRenderItems) // 确保至少渲染最小数量
    }
  }

  // 获取项目样式
  const getItemStyle = (index: number) => {
    const item = transformsRef.value[index]
    if (!item) {
      return {
        width: isResizing.value ? `${wrapperWidth.value / 3}px` : '100%'
      }
    }

    return {
      transform: `translate(${item.translateX}, ${item.translateY})`,
      width: `${item.width}px`,
      height: `${item.height}px`
    }
  }

  // 处理滚动事件
  const handleScroll = useThrottleFn(async () => {
    if (!wrapperEl.value) return

    const target = wrapperEl.value
    scrollTop.value = target.scrollTop
    updateVisibleRange()

    if (shouldRecalculateLayout()) {
      await calculateLayout(list.value)
    }
  }, 100)

  // 使用防抖处理窗口大小变化
  const updateWrapperSize = useDebounceFn(async () => {
    if (!wrapperEl.value) return

    // 标记开始调整大小
    isResizing.value = true

    const rect = wrapperEl.value.getBoundingClientRect()
    const newWidth = rect.width
    viewportHeight.value = rect.height

    // 只有当宽度变化超过阈值时才重新计算
    if (Math.abs(newWidth - wrapperWidth.value) > 3) {
      try {
        // 1. 先保存当前宽度作为临时值
        const { itemWidth: lastItemWidth } = calculateItemWidth(
          wrapperWidth.value
        )

        // 2. 立即应用临时宽度，避免闪烁
        transformsRef.value = transformsRef.value.map((item) => ({
          ...item,
          width: lastItemWidth
        }))

        // 3. 更新容器宽度
        wrapperWidth.value = newWidth

        // 4. 等待DOM更新
        await nextTick()

        // 5. 计算新布局
        const newLayout = await calculateLayout(list.value)

        // 6. 一次性更新所有状态
        transformsRef.value = newLayout.transforms
        wrapperHeight.value = newLayout.totalHeight

        // 7. 更新可视区域
        updateVisibleRange()
      } catch (error) {
        console.error('布局计算错误:', error)
      } finally {
        // 8. 标记调整完成
        isResizing.value = false
      }
    } else {
      isResizing.value = false
    }
  }, 200)

  // 监听容器尺寸变化
  const resizeObserver = new ResizeObserver(() => {
    updateWrapperSize()
  })

  onMounted(async () => {
    if (wrapperEl.value) {
      resizeObserver.observe(wrapperEl.value)

      // 先强制更新容器尺寸
      await updateWrapperSize()

      // 确保容器尺寸已更新
      await nextTick()

      // 计算初始布局
      await calculateLayout(list.value)

      // 手动触发一次可视区域更新
      updateVisibleRange()

      // 添加滚动事件监听
      wrapperEl.value.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    resizeObserver.disconnect()
    if (wrapperEl.value) {
      wrapperEl.value.removeEventListener('scroll', handleScroll)
    }
  })

  const shouldRecalculateLayout = () => {
    if (!wrapperEl.value || !transformsRef.value.length) return false

    const { scrollTop, clientHeight, scrollHeight } = wrapperEl.value
    const threshold = scrollHeight * 0.2 // 当距离底部20%时重新计算

    return scrollHeight - (scrollTop + clientHeight) < threshold
  }
  // 计算布局
  async function calculateLayout(items: T[]): Promise<Layout<T>> {
    if (!items?.length || !wrapperEl.value) {
      return { transforms: [], totalHeight: 0 }
    }

    // 计算新的布局参数
    const { numItems, widthGap, itemWidth } = calculateItemWidth(
      wrapperWidth.value
    )

    // 获取所有项目的高度映射
    const heightMap = await getHeightMap(items, itemWidth)

    // 计算最终位置和总高度
    const { transforms, totalHeight } = calculateTransformStyle(
      itemWidth,
      heightMap,
      widthGap,
      numItems,
      items
    )

    // 只有在非调整状态下才直接更新状态
    if (!isResizing.value) {
      transformsRef.value = transforms
      wrapperHeight.value = totalHeight
      isLayoutReady.value = true
      updateVisibleRange()
    }

    return { transforms, totalHeight }
  }

  // 获取高度映射
  async function getHeightMap(
    items: T[],
    itemWidth: number
  ): Promise<Map<T, number>> {
    const item2HeightMap = new Map<T, number>()
    await batchGetHeightQueue(items, async (item, cb) => {
      let height: number
      if (heightCache.has(item) && widthCache.get(item) === itemWidth) {
        height = heightCache.get(item)
      } else {
        height = await innerGetHeight(slots, item, itemWidth, wrapperEl.value!)
        heightCache.set(item, height)
        widthCache.set(item, itemWidth)
      }
      item2HeightMap.set(item, height)
      cb && cb()
    })
    return item2HeightMap
  }

  return {
    wrapperWidth,
    wrapperHeight,
    scrollTop,
    isLayoutReady,
    transforms: transformsRef,
    visibleRange,
    visibleItems,
    getItemStyle,
    calculateLayout,
    handleScroll
  }
}

/**
 * 计算元素高度
 */
async function innerGetHeight<T>(
  slots: SlotsType,
  item: T,
  width: number,
  wrapperID: HTMLDivElement
): Promise<number> {
  return new Promise((resolve) => {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.left = '-9999px'
    div.style.width = width + 'px'
    div.style.visibility = 'hidden'
    div.style.opacity = '0'
    div.style.pointerEvents = 'none'

    if (slots.default) {
      render(h(slots.default, { item, index: { col: 1, row: 1 } }), div)
    }

    wrapperID.appendChild(div)

    // 等待图片加载完成
    const images = div.getElementsByTagName('img')
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve()
        } else {
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }
      })
    })

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
      const height = div.getBoundingClientRect().height
      if (height > 0) {
        observer.disconnect()
        // 继续等待图片加载
        Promise.all(imagePromises).then(() => {
          const finalHeight = div.getBoundingClientRect().height
          wrapperID.removeChild(div)
          resolve(Math.max(finalHeight, 100))
        })
      }
    })

    observer.observe(div, {
      attributes: true,
      childList: true,
      subtree: true
    })

    // 设置超时，避免无限等待
    setTimeout(() => {
      observer.disconnect()
      if (div.parentNode === wrapperID) {
        const height = div.getBoundingClientRect().height
        wrapperID.removeChild(div)
        resolve(Math.max(height, 100))
      }
    }, 3000)
  })
}

/**
 * 批量获取高度队列
 */
function batchGetHeightQueue<T extends object>(
  list: T[],
  cb: (item: T, next: () => void) => Promise<unknown>
): Promise<void> {
  const MAX_BATCH_COUNT = 50 // 增加批量处理数量
  let count = 0
  let index = 0
  let completeCount = 0
  return new Promise((resolve) => {
    const next = () => {
      if (count >= MAX_BATCH_COUNT || index >= list.length) {
        if (completeCount >= list.length) {
          resolve()
        }
        return
      }
      count++
      const item = list[index]
      index++
      cb(item, () => {
        completeCount++
        count--
        next()
      })
      next()
    }
    next()
  })
}

/**
 * 计算项宽度
 */
export function calculateItemWidth(currentWidth: number) {
  const breakpoints = [
    { range: [1680, 1920], items: 5, gap: 16 },
    { range: [1580, 1680], items: 5, gap: 16 },
    { range: [1440, 1580], items: 4, gap: 16 },
    { range: [1020, 1440], items: 3, gap: 16 },
    { range: [768, 1020], items: 2, gap: 16 },
    { range: [0, 768], items: 2, gap: 16 }
  ]
  const defaultConfig = { items: 6, gap: 16 }

  const config =
    breakpoints.find(({ range }) => {
      const [min, max] = range
      return currentWidth >= min && currentWidth < max
    }) || defaultConfig

  return {
    numItems: config.items,
    widthGap: config.gap,
    itemWidth: Math.floor(
      (currentWidth - (config.items + 1) * config.gap) / config.items
    )
  }
}

/**
 * @description: 计算瀑布流布局中每个子项的transform样式及总高度
 */
export function calculateTransformStyle(
  itemWidth: number,
  itemHeights: Map<unknown, number>,
  gap: number,
  numItemsPerRow: number,
  originalList: unknown[]
): {
  transforms: Array<{
    translateX: string
    translateY: string
    width: number
    height: number
  }>
  totalHeight: number
} {
  const columnHeights = new Array(numItemsPerRow).fill(0)
  const transforms = new Array(originalList.length)
  let currentIndex = 0

  for (const item of originalList) {
    const height = itemHeights.get(item)
    if (height === undefined) continue

    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    )

    transforms[currentIndex] = {
      translateX: `${shortestColumnIndex * (itemWidth + gap) + gap}px`,
      translateY: `${columnHeights[shortestColumnIndex] + gap}px`,
      width: itemWidth,
      height
    }

    columnHeights[shortestColumnIndex] += height + gap
    currentIndex++
  }

  const totalHeight = Math.max(...columnHeights)
  return { transforms: transforms.slice(0, currentIndex), totalHeight }
}
