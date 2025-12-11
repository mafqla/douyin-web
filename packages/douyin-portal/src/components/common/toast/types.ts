import type { VNode } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'
export type ToastTheme = 'normal' | 'light'

export interface ToastOptions {
  /** 提示内容 */
  content: string | VNode
  /** Toast 类型 */
  type?: ToastType
  /** 自定义图标 */
  icon?: VNode | null
  /** 自动关闭延时(ms)，设为 0 时不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 内容最大宽度 */
  textMaxWidth?: number | string
  /** 填充样式 */
  theme?: ToastTheme
  /** 关闭回调 */
  onClose?: () => void
  /** 自定义 id */
  id?: number
  /** 是否堆叠 */
  stack?: boolean
}

export interface ToastConfig {
  /** 弹出位置 top */
  top?: number | string
  /** 弹出位置 bottom */
  bottom?: number | string
  /** 弹出位置 left */
  left?: number | string
  /** 弹出位置 right */
  right?: number | string
  /** z-index */
  zIndex?: number
  /** 主题 */
  theme?: ToastTheme
  /** 默认延时 */
  duration?: number
  /** 最大显示数量 */
  maxCount?: number
  /** 指定挂载容器 */
  getPopupContainer?: () => HTMLElement | null
}

export interface ToastInstance {
  id: number
  content: string | VNode
  type: ToastType
  icon?: VNode | null
  duration: number
  showClose: boolean
  textMaxWidth: number | string
  theme: ToastTheme
  onClose?: () => void
  visible: boolean
}
