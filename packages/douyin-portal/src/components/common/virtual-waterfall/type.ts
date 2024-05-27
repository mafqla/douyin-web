import type { CSSProperties } from 'vue'

export interface IVirtualWaterFallProps {
  gap: number
  column: number
  enterSize?: number
  request: () => Promise<ICardItem[]>
}

export interface ICardItem {
  aweme_id: number | string
  [key: string]: any
}

export interface IColumnQueue {
  list: IRenderItem[]
  height: number
}

// 渲染视图项
export interface IRenderItem {
  item: ICardItem
  y: number
  h: number
  style: CSSProperties
}

export interface IItemRect {
  width: number
  height: number
}

export interface ITemporaryItem {
  item: ICardItem
  y: number
  h: number
  itemHeight: number
  style: CSSProperties
}

export interface IVirtualWaterfallItem {
  item: ICardItem
  itemWidth: number
  itemHeight: number
  style: CSSProperties
}

export interface IVirtualWaterfallOptions {
  items: { id: string }[]
  columns: number
  columnWidth: number
  rowHeight: number
  containerWidth: number
  containerHeight: number
  scrollTop: number
}
