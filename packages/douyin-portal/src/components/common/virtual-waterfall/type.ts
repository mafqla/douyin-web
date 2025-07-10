import { useSlots } from 'vue'

export type WaterfallList<T = any> = T[]
export type HeightHook<T, U = any> =
  | null
  | ((slots: T, item: U, width: number, errorImgSrc: string) => Promise<number>)

// 定义 props 类型
export interface WaterfallProps<T> {
  list?: WaterfallList<T>
  isLoading?: boolean
  isOver?: boolean
  active?: boolean
  swipeableDelay?: number
  animation?: boolean
  distanceToScroll?: number
  scrollBodySelector?: string
  isMounted?: boolean
  virtualTime?: number
  virtualLength?: number
  bufferSize?: number
  minRenderItems?: number
}

// 内部需要生成的一些属性
export interface WaterfallInnerProperty {
  width?: number
  height?: number
  transform?: number
}

export interface WaterfallExpose<T = any> {
  reRender: () => void
  insertBefore: (insertList: WaterfallList<T>) => Promise<void>
}
