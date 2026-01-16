import type { App, Plugin } from 'vue'

// 导入组件
import { DyButton, DyButtonGroup, DySplitButtonGroup } from './button'
import { DyPopover } from './popover'
import { Toast, ToastFactory, useToast } from './toast'

// 组件列表
const components = [DyButton, DyButtonGroup, DySplitButtonGroup, DyPopover]

// 创建安装函数
const install = (app: App) => {
  components.forEach((component) => {
    if ((component as any).install) {
      app.use(component as Plugin)
    }
  })
}

// 导出组件
export {
  // Button
  DyButton,
  DyButtonGroup,
  DySplitButtonGroup,
  // Popover
  DyPopover,
  // Toast (服务)
  Toast,
  ToastFactory,
  useToast
}

// 导出类型
export type {
  ButtonProps,
  ButtonGroupProps,
  SplitButtonGroupProps,
  ButtonType,
  ButtonTheme,
  ButtonSize,
  ButtonHtmlType
} from './button'
export type {
  PopoverPosition,
  PopoverTrigger,
  PopoverTheme,
  PopoverProps
} from './popover'
export type { ToastOptions, ToastConfig, ToastType, ToastTheme } from './toast'

// 导出工具函数
export { withInstall, withPrefix, COMPONENT_PREFIX } from './utils/with-install'

// 默认导出插件
export default {
  install
}
