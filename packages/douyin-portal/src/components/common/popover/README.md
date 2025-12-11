# Popover 气泡卡片组件

Popover 气泡卡片组件用于展示与目标元素相关的内容，支持多种触发方式和位置。参考 Semi Design Popover 设计实现。

## 引入方式

```typescript
import { Popover } from '@/components/common'
// 或
import { Popover } from '@/components/common/popover'
```

## 代码示例

### 基础用法 - hover 触发

```vue
<Popover content="这是提示内容">
  <button>悬停显示</button>
</Popover>
```

### 点击触发

```vue
<Popover trigger="click" content="点击显示的内容">
  <button>点击显示</button>
</Popover>
```

### 自定义内容

使用 `content` 插槽自定义弹出层内容：

```vue
<Popover position="bottomLeft">
  <template #content>
    <div class="menu-item">选项1</div>
    <div class="menu-item">选项2</div>
    <div class="menu-item">选项3</div>
  </template>
  <button>菜单</button>
</Popover>
```

### 不同位置

支持 12 种位置：

```vue
<!-- 顶部 -->
<Popover position="topLeft" content="topLeft">...</Popover>
<Popover position="top" content="top">...</Popover>
<Popover position="topRight" content="topRight">...</Popover>

<!-- 底部 -->
<Popover position="bottomLeft" content="bottomLeft">...</Popover>
<Popover position="bottom" content="bottom">...</Popover>
<Popover position="bottomRight" content="bottomRight">...</Popover>

<!-- 左侧 -->
<Popover position="leftTop" content="leftTop">...</Popover>
<Popover position="left" content="left">...</Popover>
<Popover position="leftBottom" content="leftBottom">...</Popover>

<!-- 右侧 -->
<Popover position="rightTop" content="rightTop">...</Popover>
<Popover position="right" content="right">...</Popover>
<Popover position="rightBottom" content="rightBottom">...</Popover>
```

### 显示箭头

```vue
<Popover content="带箭头的气泡" :show-arrow="true">
  <button>带箭头</button>
</Popover>
```

### 受控模式

通过 `v-model:visible` 或 `visible` 控制显示状态：

```vue
<script setup>
const visible = ref(false)
</script>

<template>
  <button @click="visible = !visible">Toggle</button>
  <Popover v-model:visible="visible" trigger="custom" content="受控模式">
    <span>目标元素</span>
  </Popover>
</template>
```

### 延迟显示/隐藏

```vue
<Popover
  :mouse-enter-delay="200"
  :mouse-leave-delay="200"
  content="延迟显示"
>
  <button>延迟 200ms</button>
</Popover>
```

### 主题

支持 `dark`（默认）和 `light` 两种主题：

```vue
<Popover theme="light" content="浅色主题">
  <button>浅色</button>
</Popover>

<Popover theme="dark" content="深色主题">
  <button>深色</button>
</Popover>
```

### 自动调整位置

当弹出层可能超出视口时，自动调整到合适的位置：

```vue
<Popover :auto-adjust-overflow="true" position="bottom" content="自动调整">
  <button>自动调整位置</button>
</Popover>
```

### 编程式控制

```vue
<script setup>
const popoverRef = ref()

const showPopover = () => {
  popoverRef.value?.show()
}

const hidePopover = () => {
  popoverRef.value?.hide()
}
</script>

<template>
  <button @click="showPopover">显示</button>
  <button @click="hidePopover">隐藏</button>
  <Popover ref="popoverRef" trigger="custom" content="编程控制">
    <span>目标</span>
  </Popover>
</template>
```

## API 参考

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content` | 弹出层内容（也可使用 slot） | `string` | - |
| `position` | 弹出层位置 | `PopoverPosition` | `'bottom'` |
| `trigger` | 触发方式 | `'hover' \| 'focus' \| 'click' \| 'custom'` | `'hover'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `showArrow` | 是否显示箭头 | `boolean` | `false` |
| `spacing` | 弹出层与触发元素的间距(px) | `number` | `8` |
| `visible` | 是否显示（受控模式） | `boolean` | - |
| `defaultVisible` | 默认是否显示 | `boolean` | `false` |
| `mouseEnterDelay` | 鼠标移入延迟(ms) | `number` | `50` |
| `mouseLeaveDelay` | 鼠标移出延迟(ms) | `number` | `50` |
| `clickToHide` | 点击空白处是否关闭 | `boolean` | `true` |
| `zIndex` | 弹出层 z-index | `number` | `1050` |
| `contentClassName` | 弹出层自定义类名 | `string` | `''` |
| `destroyOnClose` | 关闭时是否销毁内容 | `boolean` | `false` |
| `getPopupContainer` | 指定弹出层挂载容器 | `() => HTMLElement` | `() => document.body` |
| `autoAdjustOverflow` | 是否自动调整位置防止溢出 | `boolean` | `true` |
| `theme` | 主题 | `'dark' \| 'light'` | `'dark'` |
| `equalWidth` | 弹出层最小宽度是否等于触发器宽度 | `boolean` | `false` |

### PopoverPosition 类型

```typescript
type PopoverPosition =
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
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `update:visible` | 显示状态变化时触发（用于 v-model） | `(visible: boolean)` |
| `visibleChange` | 显示状态变化时触发 | `(visible: boolean)` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 触发元素 |
| `content` | 弹出层内容 |

### Expose 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `show()` | 显示弹出层 | - |
| `hide()` | 隐藏弹出层 | - |
| `toggle()` | 切换显示状态 | - |
| `updatePosition()` | 更新弹出层位置 | - |

---

# HoverDropdown 悬停下拉菜单组件

HoverDropdown 是基于 Popover 组件封装的悬停下拉菜单组件，保持了向后兼容的 API。

## 引入方式

```typescript
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'
// 或
import { HoverDropdown } from '@/components/common'
```

## 代码示例

### 基础用法

```vue
<HoverDropdown>
  <template #trigger>
    <button>悬停显示菜单</button>
  </template>
  <template #content>
    <div class="menu-item">选项1</div>
    <div class="menu-item">选项2</div>
  </template>
</HoverDropdown>
```

### 指定位置

```vue
<HoverDropdown placement="top-start">
  <template #trigger>
    <button>菜单在上方显示</button>
  </template>
  <template #content>
    <div>内容</div>
  </template>
</HoverDropdown>
```

### 自定义样式

```vue
<HoverDropdown
  :offset="8"
  :show-delay="100"
  :hide-delay="150"
  content-class="my-custom-menu"
>
  <template #trigger>
    <button>自定义</button>
  </template>
  <template #content>
    <div>内容</div>
  </template>
</HoverDropdown>
```

## API 参考

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `placement` | 菜单位置 | `Placement \| 'auto'` | `'auto'` |
| `offset` | 菜单与触发元素的间距(px) | `number` | `4` |
| `showDelay` | 显示延迟时间(ms) | `number` | `0` |
| `hideDelay` | 隐藏延迟时间(ms) | `number` | `100` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `contentClass` | 自定义内容区域的 class | `string` | `''` |
| `zIndex` | 菜单层级 | `number` | `1050` |

### Placement 类型

```typescript
type Placement =
  | 'top-start' | 'top' | 'top-end'
  | 'bottom-start' | 'bottom' | 'bottom-end'
  | 'left-start' | 'left' | 'left-end'
  | 'right-start' | 'right' | 'right-end'
  | 'auto'
```

### Events

| 事件名 | 说明 |
|--------|------|
| `show` | 菜单显示时触发 |
| `hide` | 菜单隐藏时触发 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `trigger` | 触发元素 |
| `content` | 下拉菜单内容 |

### Expose 方法

| 方法名 | 说明 |
|--------|------|
| `show()` | 显示菜单 |
| `hide()` | 隐藏菜单 |
| `visible` | 当前显示状态 |

## 样式注意事项

由于 Popover 使用 Teleport 将内容渲染到 body，如果需要自定义弹出层样式，请使用全局样式：

```scss
// 使用 :global() 包裹样式
:global(.my-custom-menu) {
  padding: 8px;

  .menu-item {
    // 菜单项样式
  }
}
```
