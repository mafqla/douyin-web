import { render, type Ref } from 'vue'
import type { WaterfallList } from '../type'

/**
 * @description: 分列布局计算
 * @param {HTMLDivElement} wrapperID 父元素绑定的id
 * @param {number} list 待处理的列表
 * @param {number} wrapperWidth 元素宽度
 * @param {SlotsType} slots slots句柄
 * @return {Layout} { wrapperHeight, layout }
 */
type Layout<T> = {
  // totalHeight: Ref<number>
  // layout: (list: T[]) => void
  transforms: Array<{
    translateX: string
    translateY: string
    width: number
    height: number
  }>
  totalHeight: number
}
type SlotsType = ReturnType<typeof useSlots>
export async function useLayout<T extends Object>(
  wrapperID: HTMLDivElement,
  list: Ref<T[]>,
  wrapperWidth: number,
  slots: SlotsType,
  noLayoutedList: WaterfallList<T>
): Promise<Layout<T>> {
  const { numItems, widthGap, itemWidth } = calculateItemWidth(wrapperWidth)
  const getHeightMap = async (list: WaterfallList<T>) => {
    const item2HeightMap = new Map<T, number>()

    await batchGetHeightQueue<T>(list, async (item, cb) => {
      const height = await innerGetHeight(slots, item, itemWidth, wrapperID)
      item2HeightMap.set(item, height)
      cb && cb()
    })
    return item2HeightMap
  }

  // if (!noLayoutedList.length) return
  const heightMap = await getHeightMap(noLayoutedList)
  const { transforms, totalHeight } = calculateTransformStyle(
    itemWidth,
    heightMap,
    widthGap,
    numItems
  )

  return {
    totalHeight,
    transforms
  }
}

/**
 * 计算元素高度
 * @param {SlotsType} slots 内部 slots 组
 * @param {T} item 该元素块对应数据信息
 * @param {number} width 元素块宽度
 * @param {string} wrapperID 父元素绑定的id
 * @returns {Promise<number>} 高度
 */
async function innerGetHeight<T>(
  slots: SlotsType,
  item: T,
  width: number,
  wrapperID: HTMLDivElement
): Promise<number> {
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.left = '-1000px'
  div.style.width = width + 'px'
  div.style.visibility = 'hidden'

  if (slots.default) {
    render(h(slots.default, { item, index: { col: 1, row: 1 } }), div)
  } else {
    // Handle the case when slots.default is undefined
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 600)
  })

  if (wrapperID) {
    wrapperID.appendChild(div)
    const height = div.getBoundingClientRect().height
    wrapperID.removeChild(div)
    return height
  } else {
    return 0
  }
}

/**
 * 批量获取高度队列
 *
 * @param list 列表数据
 * @param cb 回调函数，用于处理列表中的每一项，返回 Promise
 * @returns 返回 Promise，无返回值
 */
function batchGetHeightQueue<T extends object>(
  list: T[],
  cb: (item: T, next: () => void) => Promise<unknown>
): Promise<void> {
  const MAX_BATCH_COUNT = 5
  let count = 0
  let index = 0
  let completeCount = 0
  return new Promise((resolve, reject) => {
    const next = () => {
      if (count >= MAX_BATCH_COUNT) return
      count++
      const item = list[index]
      if (!item) return
      index++
      cb(item, () => {
        completeCount++
        if (completeCount >= list.length) {
          resolve()
          return
        }
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
 *
 * @param currentWidth 当前宽度
 * @returns 返回包含项数、间隙、边距和项宽度的对象
 */
export function calculateItemWidth(currentWidth: number) {
  const breakpoints = [
    { range: [1680, 1920], items: 7, gap: 16 },
    { range: [1500, 1680], items: 6, gap: 16 },
    { range: [1440, 1500], items: 5, gap: 16 },
    { range: [1020, 1440], items: 4, gap: 16 },
    { range: [768, 1020], items: 3, gap: 16 },
    { range: [0, 768], items: 2, gap: 16 }
  ]
  const defaultConfig = { items: 8, gap: 16 }

  const config =
    breakpoints.find(({ range }) => {
      const [min, max] = range
      return currentWidth >= min && currentWidth < max
    }) || defaultConfig

  const numItems = config.items
  const widthGap = config.gap
  const itemWidth = (currentWidth - (numItems - 1) * widthGap) / numItems

  return {
    numItems,
    widthGap,
    itemWidth
  }
}

/**
 * @description: 计算瀑布流布局中每个子项的transform样式及总高度
 * @param {number} itemWidth 子项宽度
 * @param {Map<number, number>} itemHeights 子项高度映射
 * @param {number} gap 子项间间隙
 * @param {number} marginWidth 容器左右边距
 * @param {number} numItemsPerRow 每行子项数
 * @return {{transforms: Array<{translateX: string, translateY: string, height: number}>, totalHeight: number}}
 *   transforms - 每个子项的transform样式数组
 *   totalHeight - 瀑布流容器总高度
 */
export function calculateTransformStyle(
  itemWidth: number,
  itemHeights: Map<number, number>,
  gap: number,
  numItemsPerRow: number
): {
  transforms: Array<{
    translateX: string
    translateY: string
    width: number
    height: number
  }>
  totalHeight: number
} {
  const columnHeights: number[] = new Array(numItemsPerRow).fill(0) // 初始化每列高度数组
  const transforms: Array<{
    translateX: string
    translateY: string
    width: number
    height: number
  }> = [] // 初始化存储transform样式的数组

  // 遍历每个子项并计算其位置
  itemHeights.forEach((height, index) => {
    // 找到当前最矮的列
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    )
    // 计算translateX（水平偏移）
    const translateX = `${shortestColumnIndex * (itemWidth + gap) + 8}px`
    // 计算translateY（垂直偏移）
    const translateY = `${columnHeights[shortestColumnIndex] + 16}px`
    // 更新该列的高度
    columnHeights[shortestColumnIndex] += height + gap

    transforms.push({
      translateX,
      translateY,
      width: itemWidth,
      height
    })
  })

  // 确保总高度覆盖所有列的最大高度
  let totalHeight = Math.max(...columnHeights)
  //获取页面高度
  const defaultHeight = 1600
  if (totalHeight < defaultHeight) {
    totalHeight = defaultHeight
  }
  return { transforms, totalHeight }
}
