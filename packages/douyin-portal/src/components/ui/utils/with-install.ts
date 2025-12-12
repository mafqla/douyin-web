import type { App, Component, Plugin } from 'vue'

// 组件前缀
export const COMPONENT_PREFIX = 'Dy'

// 组件名称类型
export type SFCWithInstall<T> = T & Plugin

/**
 * 为组件添加 install 方法，使其可以通过 app.use() 注册
 * 参考 Element Plus / Naive UI 的实现方式
 */
export function withInstall<T extends Component>(
  component: T,
  alias?: string
): SFCWithInstall<T> {
  const comp = component as SFCWithInstall<T>

  comp.install = (app: App) => {
    const name = (component as any).name || alias
    if (name) {
      // 注册带前缀的组件名
      app.component(name, component)
    }
  }

  return comp
}

/**
 * 为组件添加前缀名称
 * @param name 组件名称（不带前缀）
 * @returns 带前缀的组件名称
 */
export function withPrefix(name: string): string {
  return `${COMPONENT_PREFIX}${name}`
}

/**
 * 批量注册组件
 */
export function installComponents(app: App, components: Component[]) {
  components.forEach((component) => {
    const name = (component as any).name
    if (name) {
      app.component(name, component)
    }
  })
}
