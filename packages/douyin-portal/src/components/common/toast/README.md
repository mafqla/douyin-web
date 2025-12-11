# Toast 提示组件

Toast 提示是对用户的操作做出及时反馈，由用户的操作触发，反馈信息可以是操作的结果状态，如成功、失败、出错、警告等。

## 引入方式

```typescript
import { Toast, ToastFactory, useToast } from '@/components/common'
// 或
import { Toast } from '@/components/common/toast'
```

## 代码示例

### 普通提示

```typescript
// 直接传入字符串
Toast.info('这是一条普通提示')

// 传入配置对象
Toast.info({
  content: '这是一条普通提示',
  duration: 3000
})
```

### 不同类型提示

```typescript
// 信息提示
Toast.info('这是一条信息')

// 成功提示
Toast.success('操作成功')

// 警告提示
Toast.warning('请注意')

// 错误提示
Toast.error('操作失败')
```

### 多色样式（light 主题）

使用 `theme: 'light'` 设置浅色填充样式，提高与界面的对比度。

```typescript
Toast.success({
  content: '保存成功',
  theme: 'light'
})

Toast.error({
  content: '请求失败',
  theme: 'light'
})
```

### 修改延时

自定义显示时长，默认为 3000ms（3秒）。

```typescript
// 显示 10 秒
Toast.info({
  content: '这条消息会显示 10 秒',
  duration: 10000
})
```

### 手动关闭

当 `duration` 设置为 0 时，Toast 不会自动关闭，需要手动调用 `close` 方法。

```typescript
// 创建不自动关闭的 Toast
const toastId = Toast.info({
  content: '正在处理中...',
  duration: 0
})

// 处理完成后手动关闭
setTimeout(() => {
  Toast.close(toastId)
}, 5000)
```

### 更新消息内容

通过指定相同的 `id` 来更新已存在的 Toast 内容。

```typescript
// 第一次显示
Toast.info({
  content: '正在上传...',
  id: 1,
  duration: 0
})

// 更新内容
setTimeout(() => {
  Toast.success({
    content: '上传成功！',
    id: 1,
    duration: 3000
  })
}, 2000)
```

### 销毁所有

```typescript
Toast.destroyAll()
```

### 全局配置

在应用初始化时配置全局默认值。

```typescript
// main.ts 或入口文件
Toast.config({
  top: 50,           // 距离顶部 50px
  duration: 5000,    // 默认 5 秒后关闭
  theme: 'normal',   // 默认主题
  maxCount: 3,       // 最多同时显示 3 条
  zIndex: 2000       // z-index 层级
})
```

### 使用 Hook（组合式 API）

在组件中使用 `useToast` Hook。

```vue
<script setup lang="ts">
import { useToast } from '@/components/common'

const toast = useToast()

const handleSubmit = () => {
  // 提交逻辑...
  toast.success('提交成功')
}

const handleError = () => {
  toast.error('操作失败，请重试')
}
</script>
```

### 创建独立配置的 Toast

使用 `ToastFactory.create()` 创建拥有独立配置的 Toast 实例。

```typescript
import { ToastFactory } from '@/components/common'

// 创建一个显示在底部的 Toast 实例
const bottomToast = ToastFactory.create({
  top: undefined,
  bottom: 50,
  theme: 'light'
})

bottomToast.info('这条消息显示在底部')

// 创建一个显示在左侧的 Toast 实例
const leftToast = ToastFactory.create({
  left: 20,
  right: undefined
})

leftToast.success('这条消息显示在左侧')
```

### 自定义图标

```typescript
import { h } from 'vue'

Toast.info({
  content: '自定义图标',
  icon: h('span', { style: 'font-size: 20px' }, '🎉')
})

// 不显示图标
Toast.info({
  content: '无图标提示',
  icon: null
})
```

### 关闭回调

```typescript
Toast.success({
  content: '操作成功',
  onClose: () => {
    console.log('Toast 已关闭')
    // 执行后续操作...
  }
})
```

## API 参考

### 静态方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `Toast.info(options)` | 信息提示 | `ToastOptions \| string` | `toastId: number` |
| `Toast.success(options)` | 成功提示 | `ToastOptions \| string` | `toastId: number` |
| `Toast.warning(options)` | 警告提示 | `ToastOptions \| string` | `toastId: number` |
| `Toast.error(options)` | 错误提示 | `ToastOptions \| string` | `toastId: number` |
| `Toast.close(id)` | 关闭指定 Toast | `id: number` | `void` |
| `Toast.destroyAll()` | 销毁所有 Toast | - | `void` |
| `Toast.config(config)` | 全局配置 | `ToastConfig` | `void` |
| `Toast.useToast()` | 获取 Hook 实例 | - | `ToastHook` |

### ToastFactory

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `ToastFactory.create(config)` | 创建独立配置的 Toast | `ToastConfig` | `Toast` |

### ToastOptions

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content` | 提示内容 | `string \| VNode` | - |
| `type` | 提示类型 | `'info' \| 'success' \| 'warning' \| 'error'` | - |
| `icon` | 自定义图标，设为 `null` 不显示 | `VNode \| null` | - |
| `duration` | 自动关闭延时(ms)，设为 0 不自动关闭 | `number` | `3000` |
| `showClose` | 是否显示关闭按钮 | `boolean` | `true` |
| `textMaxWidth` | 内容最大宽度 | `number \| string` | `450` |
| `theme` | 填充样式 | `'normal' \| 'light'` | `'normal'` |
| `onClose` | 关闭时的回调函数 | `() => void` | - |
| `id` | 自定义 Toast ID，用于更新内容 | `number` | - |

### ToastConfig（全局配置）

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `top` | 距离顶部位置 | `number \| string` | `24` |
| `bottom` | 距离底部位置 | `number \| string` | - |
| `left` | 距离左侧位置 | `number \| string` | - |
| `right` | 距离右侧位置 | `number \| string` | - |
| `zIndex` | 弹层 z-index | `number` | `1010` |
| `theme` | 默认主题 | `'normal' \| 'light'` | `'normal'` |
| `duration` | 默认延时 | `number` | `3000` |
| `maxCount` | 最大同时显示数量 | `number` | `5` |
| `getPopupContainer` | 指定挂载容器 | `() => HTMLElement` | `() => document.body` |

## 无障碍

- Toast 的 `role` 属性设置为 `alert`，屏幕阅读器会自动朗读内容

## 文案规范

- 保持简洁
- 句尾不使用句号
- 使用 **名词 + 动词** 的格式进行说明

| ✅ 推荐用法 | ❌ 不推荐用法 |
|------------|--------------|
| 保存成功 | 您的内容已经保存成功了。 |
| 上传失败 | 无法完成上传操作 |
| 网络异常 | 当前网络连接出现了问题 |
