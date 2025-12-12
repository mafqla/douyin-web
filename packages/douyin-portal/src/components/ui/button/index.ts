import { withInstall } from '../utils/with-install'
import Button from './button.vue'
import ButtonGroup from './button-group.vue'
import SplitButtonGroup from './split-button-group.vue'

// 使用 withInstall 包装组件，添加 install 方法
export const DyButton = withInstall(Button)
export const DyButtonGroup = withInstall(ButtonGroup)
export const DySplitButtonGroup = withInstall(SplitButtonGroup)

// 导出类型
export * from './types'

// 默认导出
export default DyButton
