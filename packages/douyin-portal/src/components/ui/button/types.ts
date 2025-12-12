import type { CSSProperties, VNode } from 'vue'

// 按钮类型
export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger'

// 按钮主题
export type ButtonTheme = 'solid' | 'light' | 'borderless' | 'outline'

// 按钮尺寸
export type ButtonSize = 'large' | 'default' | 'small'

// 原生 button type
export type ButtonHtmlType = 'button' | 'submit' | 'reset'

// 按钮 Props
export interface ButtonProps {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮主题 */
  theme?: ButtonTheme
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 是否为块级按钮 */
  block?: boolean
  /** 原生 button 的 type 属性 */
  htmlType?: ButtonHtmlType
  /** 图标 */
  icon?: VNode
  /** 图标位置 */
  iconPosition?: 'left' | 'right'
  /** 是否去除水平内边距（仅对图标按钮有效） */
  noHorizontalPadding?: boolean | 'left' | 'right' | ('left' | 'right')[]
  /** 自定义类名 */
  className?: string
  /** 内容区域类名 */
  contentClassName?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** aria-label */
  ariaLabel?: string
}

// 按钮组 Props
export interface ButtonGroupProps {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮主题 */
  theme?: ButtonTheme
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** aria-label */
  ariaLabel?: string
}

// 分裂按钮组 Props
export interface SplitButtonGroupProps {
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** aria-label */
  ariaLabel?: string
}
