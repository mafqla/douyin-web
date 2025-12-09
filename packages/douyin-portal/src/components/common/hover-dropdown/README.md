# HoverDropdown 悬停下拉菜单

鼠标悬停时显示下拉菜单的通用组件，支持自动计算位置避免超出视口，也可手动指定显示位置。

## 基础用法

```vue
<template>
  <HoverDropdown>
    <template #trigger>
      <button>悬停显示菜单</button>
    </template>
    <template #content>
      <div class="menu-item">选项1</div>
      <div class="menu-item">选项2</div>
      <div class="menu-item">选项3</div>
    </template>
  </HoverDropdown>
</template>

<script setup lang="ts">
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'
</script>
```

## 指定位置

通过 `placement` 属性指定菜单显示位置：

```vue
<!-- 底部左对齐（默认） -->
<HoverDropdown placement="bottom-start">
  ...
</HoverDropdown>

<!-- 底部居中 -->
<HoverDropdown placement="bottom">
  ...
</HoverDropdown>

<!-- 底部右对齐 -->
<HoverDropdown placement="bottom-end">
  ...
</HoverDropdown>

<!-- 顶部左对齐 -->
<HoverDropdown placement="top-start">
  ...
</HoverDropdown>

<!-- 顶部居中 -->
<HoverDropdown placement="top">
  ...
</HoverDropdown>

<!-- 顶部右对齐 -->
<HoverDropdown placement="top-end">
  ...
</HoverDropdown>

<!-- 自动计算最佳位置（推荐） -->
<HoverDropdown placement="auto">
  ...
</HoverDropdown>
```

## 自定义样式

通过 `content-class` 传递自定义 class 来定制菜单样式：

```vue
<template>
  <HoverDropdown content-class="my-custom-menu">
    <template #trigger>
      <button>更多操作</button>
    </template>
    <template #content>
      <div class="my-menu-item">编辑</div>
      <div class="my-menu-item">删除</div>
    </template>
  </HoverDropdown>
</template>

<style lang="scss" scoped>
// 使用 :deep() 穿透 scoped 样式
:deep(.my-custom-menu) {
  width: 150px;

  .my-menu-item {
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: var(--color-bg-b2);
    }
  }
}
</style>
```

## 延迟显示/隐藏

通过 `show-delay` 和 `hide-delay` 控制显示和隐藏的延迟时间：

```vue
<!-- 悬停 200ms 后显示，离开 150ms 后隐藏 -->
<HoverDropdown :show-delay="200" :hide-delay="150">
  ...
</HoverDropdown>
```

## 调整间距

通过 `offset` 属性调整菜单与触发元素之间的间距：

```vue
<!-- 间距设为 8px -->
<HoverDropdown :offset="8">
  ...
</HoverDropdown>
```

## 禁用状态

通过 `disabled` 属性禁用悬停触发：

```vue
<HoverDropdown :disabled="isDisabled">
  ...
</HoverDropdown>
```

## 调整层级

通过 `z-index` 属性调整菜单的层级：

```vue
<HoverDropdown :z-index="200">
  ...
</HoverDropdown>
```

## 监听事件

```vue
<template>
  <HoverDropdown @show="onShow" @hide="onHide">
    ...
  </HoverDropdown>
</template>

<script setup lang="ts">
const onShow = () => {
  console.log('菜单显示')
}

const onHide = () => {
  console.log('菜单隐藏')
}
</script>
```

## 通过 ref 控制

```vue
<template>
  <HoverDropdown ref="dropdownRef">
    ...
  </HoverDropdown>
  <button @click="dropdownRef?.show()">手动显示</button>
  <button @click="dropdownRef?.hide()">手动隐藏</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'

const dropdownRef = ref<InstanceType<typeof HoverDropdown> | null>(null)
</script>
```

## 完整示例：更多操作菜单

```vue
<template>
  <HoverDropdown placement="auto" content-class="action-menu">
    <template #trigger>
      <div class="more-btn">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M16.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z
               M10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z
               M5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"
            fill="currentColor"
          />
        </svg>
      </div>
    </template>
    <template #content>
      <div class="menu-item" @click="handleEdit">
        <span class="icon">✏️</span>
        <span>编辑</span>
      </div>
      <div class="menu-item" @click="handleShare">
        <span class="icon">🔗</span>
        <span>分享</span>
      </div>
      <div class="menu-item danger" @click="handleDelete">
        <span class="icon">🗑️</span>
        <span>删除</span>
      </div>
    </template>
  </HoverDropdown>
</template>

<script setup lang="ts">
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'

const handleEdit = () => console.log('编辑')
const handleShare = () => console.log('分享')
const handleDelete = () => console.log('删除')
</script>

<style lang="scss" scoped>
.more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text-t3);

  &:hover {
    background-color: var(--color-bg-b2);
    color: var(--color-text-t1);
  }
}

:deep(.action-menu) {
  width: 140px;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    color: var(--color-text-t3);

    &:hover {
      background-color: var(--color-bg-b2);
      color: var(--color-text-t1);
    }

    &.danger {
      color: #ff4d4f;

      &:hover {
        background-color: rgba(255, 77, 79, 0.1);
      }
    }

    .icon {
      font-size: 16px;
    }
  }
}
</style>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `placement` | 菜单位置，`auto` 时自动计算最佳位置 | `'auto'` \| `'top-start'` \| `'top'` \| `'top-end'` \| `'bottom-start'` \| `'bottom'` \| `'bottom-end'` | `'auto'` |
| `offset` | 菜单与触发元素的间距(px) | `number` | `4` |
| `show-delay` | 显示延迟时间(ms) | `number` | `0` |
| `hide-delay` | 隐藏延迟时间(ms)，建议设置一定延迟避免鼠标移动时闪烁 | `number` | `100` |
| `disabled` | 是否禁用悬停触发 | `boolean` | `false` |
| `content-class` | 自定义内容区域的 class | `string` | `''` |
| `z-index` | 菜单层级 | `number` | `100` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `trigger` | 触发元素，鼠标悬停在此元素上时显示菜单 |
| `content` | 下拉菜单内容 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `show` | 菜单显示时触发 | - |
| `hide` | 菜单隐藏时触发 | - |

### Exposes

| 方法/属性 | 说明 | 类型 |
|-----------|------|------|
| `show` | 手动显示菜单 | `() => void` |
| `hide` | 手动隐藏菜单 | `() => void` |
| `visible` | 当前菜单是否可见 | `Ref<boolean>` |

## 自动定位说明

当 `placement="auto"` 时，组件会自动计算最佳显示位置：

1. **垂直方向**：优先在下方显示，如果下方空间不足则显示在上方
2. **水平对齐**：优先左对齐，如果会超出右边界则改为右对齐或居中

这确保了菜单在任何位置都不会超出视口边界。

## 注意事项

1. **样式穿透**：由于组件使用了 `scoped` 样式，自定义菜单项样式时需要使用 `:deep()` 穿透
2. **事件冒泡**：菜单项的点击事件可能需要阻止冒泡，使用 `@click.stop` 或在处理函数中调用 `event.stopPropagation()`
3. **隐藏延迟**：建议保留一定的 `hide-delay`（默认 100ms），避免鼠标从触发元素移动到菜单时菜单消失
4. **层级问题**：如果菜单被其他元素遮挡，可以通过 `z-index` 属性调整层级
