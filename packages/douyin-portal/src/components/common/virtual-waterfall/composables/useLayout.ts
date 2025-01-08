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
  transforms: Array<{
    translateX: string
    translateY: string
    width: number
    height: number
  }>
  totalHeight: number
}

type SlotsType = ReturnType<typeof useSlots>

// 使用 WeakMap 缓存高度
const heightCache = new WeakMap()
const widthCache = new WeakMap()

export async function useLayout<T extends Object>(
  wrapperID: HTMLDivElement,
  list: T[] | Ref<T[]>,
  wrapperWidth: number,
  slots: SlotsType
): Promise<Layout<T>> {
  const { numItems, widthGap, itemWidth } = calculateItemWidth(wrapperWidth)
  const getHeightMap = async (list: WaterfallList<T>) => {
    const item2HeightMap = new Map<T, number>()
    await batchGetHeightQueue<T>(list, async (item, cb) => {
      let height: number
      // 检查缓存的宽度是否与当前宽度相同
      if (heightCache.has(item) && widthCache.get(item) === itemWidth) {
        height = heightCache.get(item)
      } else {
        height = await innerGetHeight(slots, item, itemWidth, wrapperID)
        heightCache.set(item, height)
        widthCache.set(item, itemWidth)
      }
      item2HeightMap.set(item, height)
      cb && cb()
    })
    return item2HeightMap
  }

  const actualList = Array.isArray(list) ? list : list.value
  const heightMap = await getHeightMap(actualList)
  const { transforms, totalHeight } = calculateTransformStyle(
    itemWidth,
    heightMap,
    widthGap,
    numItems,
    actualList
  )

  return {
    totalHeight,
    transforms
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
    div.style.display = 'block'

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
    { range: [1680, 1920], items: 7, gap: 16 },
    { range: [1580, 1680], items: 6, gap: 16 },
    { range: [1440, 1580], items: 4, gap: 16 },
    { range: [1020, 1440], items: 4, gap: 16 },
    { range: [768, 1020], items: 2, gap: 16 },
    { range: [0, 768], items: 2, gap: 16 }
  ]
  const defaultConfig = { items: 8, gap: 16 }

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
