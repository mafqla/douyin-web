# DyButton 按钮

用户使用按钮来触发一个操作或者进行跳转。

## 代码演示

### 如何引入

```typescript
import { DyButton, DyButtonGroup, DySplitButtonGroup } from '@/components/ui'
// 或者从 common 导入（兼容）
import { DyButton, DyButtonGroup, DySplitButtonGroup } from '@/components/common'
```

### 按钮类型

按钮支持以下类型：

- 主按钮（`primary`，默认）
- 次要按钮（`secondary`）
- 第三按钮（`tertiary`）
- 警告按钮（`warning`）
- 危险按钮（`danger`）

```vue
<template>
  <DyButton type="primary">Primary</DyButton>
  <DyButton type="secondary">Secondary</DyButton>
  <DyButton type="tertiary">Tertiary</DyButton>
  <DyButton type="warning">Warning</DyButton>
  <DyButton type="danger">Danger</DyButton>
</template>
```

#### 关于类型字体色值

- `var(--color-primary)`：主要
- `var(--color-text-t1)`：次要
- `var(--color-text-t3)`：第三
- `#faad14`：警告
- `#ff4d4f`：危险

### 按钮主题

目前可用的主题（theme）为：

- `light`：浅色背景（默认）
- `solid`：深色背景
- `borderless`：无背景
- `outline`：边框模式

```vue
<template>
  <!-- 浅色背景 -->
  <DyButton theme="light" type="primary">Light</DyButton>

  <!-- 深色背景 -->
  <DyButton theme="solid" type="primary">Solid</DyButton>

  <!-- 无背景 -->
  <DyButton theme="borderless" type="primary">Borderless</DyButton>

  <!-- 边框模式 -->
  <DyButton theme="outline" type="primary">Outline</DyButton>
</template>
```

### 尺寸

默认定义了三种尺寸：

- 大：`large`（高度 44px）
- 默认：`default`（高度 36px）
- 小：`small`（高度 28px）

```vue
<template>
  <DyButton size="large">大按钮</DyButton>
  <DyButton size="default">默认按钮</DyButton>
  <DyButton size="small">小按钮</DyButton>
</template>
```

### 块级按钮

块级按钮具有预先定义好的宽度，它的宽度与按钮里面内容的宽度无关。

```vue
<template>
  <DyButton block>块级按钮</DyButton>
</template>
```

### 图标按钮

可通过 `icon` 插槽或 `icon` 属性定义按钮的图标。

```vue
<template>
  <!-- 使用插槽 -->
  <DyButton>
    <template #icon>
      <IconPlus />
    </template>
    新增
  </DyButton>

  <!-- 图标在右侧 -->
  <DyButton icon-position="right">
    下一步
    <template #icon>
      <IconArrowRight />
    </template>
  </DyButton>

  <!-- 仅图标按钮 -->
  <DyButton aria-label="搜索">
    <template #icon>
      <IconSearch />
    </template>
  </DyButton>
</template>
```

### 禁用状态

```vue
<template>
  <DyButton disabled>禁用按钮</DyButton>
  <DyButton disabled theme="solid" type="primary">禁用按钮</DyButton>
</template>
```

### 加载状态

按钮支持加载状态，通过设置 `loading` 参数值为 `true` 即可。注意：`disabled` 状态优先级高于 `loading` 状态。

```vue
<template>
  <DyButton loading>加载中</DyButton>
  <DyButton loading theme="solid" type="primary">提交中</DyButton>
</template>
```

### 按钮组合

可以将多个按钮放入 `DyButtonGroup` 的容器中，通过设置 `size`、`disabled`、`type` 可统一设置按钮组合中的按钮尺寸、是否禁用和类型。

```vue
<template>
  <DyButtonGroup>
    <DyButton>按钮1</DyButton>
    <DyButton>按钮2</DyButton>
    <DyButton>按钮3</DyButton>
  </DyButtonGroup>
</template>
```

#### 组合尺寸

```vue
<template>
  <DyButtonGroup size="large">
    <DyButton>大</DyButton>
    <DyButton>大</DyButton>
  </DyButtonGroup>

  <DyButtonGroup size="default">
    <DyButton>默认</DyButton>
    <DyButton>默认</DyButton>
  </DyButtonGroup>

  <DyButtonGroup size="small">
    <DyButton>小</DyButton>
    <DyButton>小</DyButton>
  </DyButtonGroup>
</template>
```

#### 组合禁用

```vue
<template>
  <DyButtonGroup disabled>
    <DyButton>禁用1</DyButton>
    <DyButton>禁用2</DyButton>
  </DyButtonGroup>
</template>
```

#### 组合类型

```vue
<template>
  <DyButtonGroup type="primary" theme="solid">
    <DyButton>主要1</DyButton>
    <DyButton>主要2</DyButton>
  </DyButtonGroup>

  <DyButtonGroup type="warning" theme="outline">
    <DyButton>警告1</DyButton>
    <DyButton>警告2</DyButton>
  </DyButtonGroup>
</template>
```

### 分裂按钮组合

在 `DyButton` 和 `Dropdown` 结合的场景下，可以使用分裂按钮，分裂按钮添加了按钮之间的间隔，并改变了按钮的边框圆角。

```vue
<template>
  <DySplitButtonGroup>
    <DyButton theme="solid" type="primary">主操作</DyButton>
    <DyButton theme="solid" type="primary">
      <template #icon>
        <IconChevronDown />
      </template>
    </DyButton>
  </DySplitButtonGroup>
</template>
```

## API 参考

### DyButton

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'primary'` \| `'secondary'` \| `'tertiary'` \| `'warning'` \| `'danger'` | `'primary'` |
| theme | 按钮主题 | `'solid'` \| `'light'` \| `'borderless'` \| `'outline'` | `'light'` |
| size | 按钮尺寸 | `'large'` \| `'default'` \| `'small'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| block | 是否为块级按钮 | `boolean` | `false` |
| htmlType | 原生 button 的 type 属性 | `'button'` \| `'submit'` \| `'reset'` | `'button'` |
| icon | 图标 | `VNode` | - |
| iconPosition | 图标位置 | `'left'` \| `'right'` | `'left'` |
| noHorizontalPadding | 是否去除水平内边距（仅对图标按钮有效） | `boolean` \| `'left'` \| `'right'` \| `('left' \| 'right')[]` | `false` |
| className | 自定义类名 | `string` | - |
| contentClassName | 内容区域类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |
| ariaLabel | aria-label 属性 | `string` | - |

### DyButton Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发 | `(event: MouseEvent) => void` |
| mousedown | 鼠标按下时触发 | `(event: MouseEvent) => void` |
| mouseenter | 鼠标移入时触发 | `(event: MouseEvent) => void` |
| mouseleave | 鼠标移出时触发 | `(event: MouseEvent) => void` |

### DyButton Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 图标内容 |

### DyButtonGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'primary'` \| `'secondary'` \| `'tertiary'` \| `'warning'` \| `'danger'` | `'primary'` |
| theme | 按钮主题 | `'solid'` \| `'light'` \| `'borderless'` \| `'outline'` | `'light'` |
| size | 按钮尺寸 | `'large'` \| `'default'` \| `'small'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |
| ariaLabel | aria-label 属性 | `string` | - |

### DySplitButtonGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |
| ariaLabel | aria-label 属性 | `string` | - |

## 无障碍

### ARIA

- `aria-label` 用于表示按钮的作用，对于图标按钮，推荐使用此属性
- `aria-disabled` 与 disabled 属性同步，表示按钮禁用

### 键盘和焦点

- DyButton 的焦点管理与原生 button 一致，键盘用户可以使用 Tab 及 Shift + Tab 切换焦点
- DyButton 的触发与原生 button 一致，当按钮聚焦时，可以通过 Enter 或 Space 键激活
- DyButtonGroup 中的按钮与单个按钮的焦点管理方式一致，可以通过 Tab 以及 Shift + Tab 进行切换

## 类型定义

```typescript
// 按钮类型
type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger'

// 按钮主题
type ButtonTheme = 'solid' | 'light' | 'borderless' | 'outline'

// 按钮尺寸
type ButtonSize = 'large' | 'default' | 'small'

// 原生 button type
type ButtonHtmlType = 'button' | 'submit' | 'reset'

// Button Props
interface ButtonProps {
  type?: ButtonType
  theme?: ButtonTheme
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  block?: boolean
  htmlType?: ButtonHtmlType
  icon?: VNode
  iconPosition?: 'left' | 'right'
  noHorizontalPadding?: boolean | 'left' | 'right' | ('left' | 'right')[]
  className?: string
  contentClassName?: string
  style?: CSSProperties
  ariaLabel?: string
}

// ButtonGroup Props
interface ButtonGroupProps {
  type?: ButtonType
  theme?: ButtonTheme
  size?: ButtonSize
  disabled?: boolean
  className?: string
  style?: CSSProperties
  ariaLabel?: string
}

// SplitButtonGroup Props
interface SplitButtonGroupProps {
  className?: string
  style?: CSSProperties
  ariaLabel?: string
}
```

## 主题变量

组件使用以下 CSS 变量：

| 变量名 | 说明 |
| --- | --- |
| `--color-primary` | 主色 |
| `--color-primary-hover` | 主色悬停态 |
| `--color-primary-active` | 主色激活态 |
| `--color-bg-b2` | 背景色 2 |
| `--color-bg-b3` | 背景色 3 |
| `--color-bg-b4` | 背景色 4 |
| `--color-bg-b5` | 背景色 5 |
| `--color-text-t1` | 文字色 1 |
| `--color-text-t2` | 文字色 2 |
| `--color-text-t3` | 文字色 3 |
| `--color-line-l2` | 线条色 2 |
| `--color-line-l3` | 线条色 3 |
| `--color-const-text-white` | 常量白色文字 |
| `--secondary-bg-color` | 次要背景色 |

## 文案规范

- 按钮需要清晰可预测，用户应该能够预测他们点击按钮时会发生什么
- 按钮应该总是以鼓励行动的强动词开头
- 为了给用户提供足够的上下文，在按钮上使用 {动词}+{名词} 内容公式；除了常见的动作，如"完成"、"关闭"、"取消"或"确定"
- 当按钮和其他组件一起时候，如果其他组件（比如 Modal 和 Sidesheet）已经提供了足够信息的上下文的话，按钮可以只展示 {动词}，如"添加"、"创建"

## 目录结构

```
button/
├── index.ts              # 导出文件
├── index.scss            # 样式文件
├── types.ts              # 类型定义
├── button.vue            # Button 组件
├── button-group.vue      # ButtonGroup 组件
├── split-button-group.vue # SplitButtonGroup 组件
└── README.md             # 文档
```
