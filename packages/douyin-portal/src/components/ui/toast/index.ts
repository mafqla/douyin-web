import { createApp, reactive, h, type App } from 'vue'
import ToastContainer from './toast-container.vue'
import type {
  ToastOptions,
  ToastConfig,
  ToastInstance,
  ToastType
} from './types'

// 默认配置
const DEFAULT_CONFIG: Readonly<ToastConfig> = {
  top: '50%', // 默认显示在页面中间偏下
  zIndex: 1010,
  theme: 'normal',
  duration: 3000,
  maxCount: 5,
  getPopupContainer: () => document.body
}

// 全局配置
let globalConfig: ToastConfig = { ...DEFAULT_CONFIG }

// Toast 队列
const toasts = reactive<ToastInstance[]>([])

// 自增 id
let toastId = 0

// 容器实例
let containerApp: App | null = null
let containerEl: HTMLElement | null = null

// 确保容器已挂载
function ensureContainer(): void {
  if (containerApp) return

  containerEl = document.createElement('div')
  containerEl.className = 'dy-toast-wrapper'
  const container = globalConfig.getPopupContainer?.() || document.body
  container.appendChild(containerEl)

  containerApp = createApp({
    render() {
      return h(ToastContainer, {
        toasts,
        config: globalConfig,
        onClose: removeToast
      })
    }
  })

  containerApp.mount(containerEl)
}

// 移除 toast
function removeToast(id: number): void {
  const index = toasts.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
  }
}

// 规范化选项
function normalizeOptions(options: ToastOptions | string): ToastOptions {
  return typeof options === 'string' ? { content: options } : options
}

// 创建 Toast 实例
function createToastInstance(
  type: ToastType,
  opts: ToastOptions,
  id: number
): ToastInstance {
  return {
    id,
    type,
    content: opts.content,
    icon: opts.icon,
    duration: opts.duration ?? globalConfig.duration ?? DEFAULT_CONFIG.duration!,
    showClose: opts.showClose ?? true,
    textMaxWidth: opts.textMaxWidth ?? 450,
    theme: opts.theme ?? globalConfig.theme ?? DEFAULT_CONFIG.theme!,
    onClose: opts.onClose,
    visible: true
  }
}

// 添加 toast
function addToast(type: ToastType, options: ToastOptions | string): number {
  ensureContainer()

  const opts = normalizeOptions(options)
  const id = opts.id ?? ++toastId

  const instance = createToastInstance(type, opts, id)

  // 检查是否存在相同 id，更新内容
  const existingIndex = toasts.findIndex((t) => t.id === id)
  if (existingIndex > -1) {
    toasts[existingIndex] = instance
    return id
  }

  // 检查最大数量限制
  const maxCount = globalConfig.maxCount ?? DEFAULT_CONFIG.maxCount!
  while (toasts.length >= maxCount) {
    toasts.shift()
  }

  toasts.push(instance)
  return id
}

// 关闭指定 toast
function close(id: number): void {
  const toast = toasts.find((t) => t.id === id)
  if (toast) {
    toast.visible = false
    setTimeout(() => removeToast(id), 300)
  }
}

// 销毁所有 toast
function destroyAll(): void {
  toasts.length = 0
}

// 全局配置
function config(options: ToastConfig): void {
  Object.assign(globalConfig, options)
}

// 重置配置
function resetConfig(): void {
  globalConfig = { ...DEFAULT_CONFIG }
}

// useToast hook
function useToast() {
  return {
    info: (options: ToastOptions | string) => addToast('info', options),
    success: (options: ToastOptions | string) => addToast('success', options),
    warning: (options: ToastOptions | string) => addToast('warning', options),
    error: (options: ToastOptions | string) => addToast('error', options),
    close,
    destroyAll
  }
}

// 创建独立配置的 Toast 实例
function create(customConfig: ToastConfig) {
  const localConfig = { ...DEFAULT_CONFIG, ...globalConfig, ...customConfig }
  const localToasts = reactive<ToastInstance[]>([])
  let localId = 0
  let localApp: App | null = null
  let localEl: HTMLElement | null = null

  function ensureLocalContainer(): void {
    if (localApp) return

    localEl = document.createElement('div')
    localEl.className = 'dy-toast-wrapper-local'
    const container = localConfig.getPopupContainer?.() || document.body
    container.appendChild(localEl)

    localApp = createApp({
      render() {
        return h(ToastContainer, {
          toasts: localToasts,
          config: localConfig,
          onClose: (id: number) => {
            const index = localToasts.findIndex((t) => t.id === id)
            if (index > -1) localToasts.splice(index, 1)
          }
        })
      }
    })

    localApp.mount(localEl)
  }

  function addLocalToast(
    type: ToastType,
    options: ToastOptions | string
  ): number {
    ensureLocalContainer()

    const opts = normalizeOptions(options)
    const id = opts.id ?? ++localId
    const instance = createToastInstance(type, opts, id)

    // 检查最大数量限制
    const maxCount = localConfig.maxCount ?? DEFAULT_CONFIG.maxCount!
    while (localToasts.length >= maxCount) {
      localToasts.shift()
    }

    localToasts.push(instance)
    return id
  }

  function closeLocal(id: number): void {
    const toast = localToasts.find((t) => t.id === id)
    if (toast) {
      toast.visible = false
      setTimeout(() => {
        const index = localToasts.findIndex((t) => t.id === id)
        if (index > -1) localToasts.splice(index, 1)
      }, 300)
    }
  }

  function destroyAllLocal(): void {
    localToasts.length = 0
    if (localApp && localEl) {
      localApp.unmount()
      localEl.remove()
      localApp = null
      localEl = null
    }
  }

  return {
    info: (options: ToastOptions | string) => addLocalToast('info', options),
    success: (options: ToastOptions | string) =>
      addLocalToast('success', options),
    warning: (options: ToastOptions | string) =>
      addLocalToast('warning', options),
    error: (options: ToastOptions | string) => addLocalToast('error', options),
    close: closeLocal,
    destroyAll: destroyAllLocal
  }
}

// Toast 服务对象
const Toast = {
  info: (options: ToastOptions | string) => addToast('info', options),
  success: (options: ToastOptions | string) => addToast('success', options),
  warning: (options: ToastOptions | string) => addToast('warning', options),
  error: (options: ToastOptions | string) => addToast('error', options),
  close,
  destroyAll,
  config,
  resetConfig
}

// ToastFactory 用于创建不同配置的 Toast
const ToastFactory = {
  create
}

export { Toast, ToastFactory, useToast }
export type { ToastOptions, ToastConfig, ToastType, ToastTheme } from './types'
