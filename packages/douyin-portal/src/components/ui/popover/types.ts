import type { CSSProperties, VNode } from 'vue'

// 位置类型
export type PopoverPosition =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'

// 触发方式
export type PopoverTrigger = 'hover' | 'focus' | 'click' | 'custom'

// 主题
export type PopoverTheme = 'light' | 'dark' | 'transparent'

export interface PopoverProps {
  /** 弹出层内容 */
  content?: string | VNode
  /** 弹出层位置 */
  position?: PopoverPosition
  /** 触发方式 */
  trigger?: PopoverTrigger
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示箭头 */
  showArrow?: boolean
  /** 弹出层与触发元素的间距 */
  spacing?: number
  /** 是否显示（受控模式） */
  visible?: boolean
  /** 默认是否显示 */
  defaultVisible?: boolean
  /** 鼠标移入弹出层的延迟时间(ms) */
  mouseEnterDelay?: number
  /** 鼠标移出弹出层的延迟时间(ms) */
  mouseLeaveDelay?: number
  /** 点击空白处是否关闭 */
  clickToHide?: boolean
  /** 弹出层 z-index */
  zIndex?: number
  /** 弹出层样式 */
  popoverStyle?: CSSProperties
  /** 弹出层类名 */
  popoverClass?: string
  /** 内容区域类名 */
  contentClassName?: string
  /** 是否在关闭时销毁内容 */
  destroyOnClose?: boolean
  /** 指定弹出层挂载的容器 */
  getPopupContainer?: () => HTMLElement
  /** 关闭时停止冒泡 */
  stopPropagation?: boolean
  /** 弹出层最小宽度跟随触发元素 */
  autoAdjustOverflow?: boolean
  /** 自动调整位置 */
  adjustPosition?: boolean
  /** 主题 */
  theme?: PopoverTheme
}

export interface PopoverExpose {
  show: () => void
  hide: () => void
  toggle: () => void
}
