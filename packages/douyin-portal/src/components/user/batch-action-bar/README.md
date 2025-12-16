# BatchActionBar 批量操作工具栏组件

通用的批量选择和操作工具栏组件，可用于视频列表、文件列表等多种场景。

## 功能特性

- ✅ 全选/取消全选功能
- ✅ 实时显示已选数量
- ✅ 自动处理半选状态（indeterminate）
- ✅ 支持禁用状态
- ✅ 可自定义操作按钮文本和提示文案
- ✅ 简洁的 API 设计
- ✅ 完整的无障碍支持
- ✅ 支持批量管理模式切换

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| selectedCount | number | 0 | 当前选中的数量 |
| disabled | boolean | false | 是否禁用操作按钮 |
| allSelected | boolean | false | 是否全选状态 |
| actionText | string | '取消喜欢' | 操作按钮文本 |
| selectedTextTemplate | string | '已选 {count} 个喜欢的作品' | 选中项提示文本模板（{count} 会被替换为实际数量） |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select-all | - | 全选/取消全选事件 |
| action | - | 点击操作按钮事件 |

## 完整使用示例（含批量管理模式）

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import BatchActionBar from '@/components/user/batch-action-bar/index.vue'

interface VideoItem {
  aweme_id: string
  title: string
}

const videoList = ref<VideoItem[]>([
  { aweme_id: '1', title: '视频1' },
  { aweme_id: '2', title: '视频2' },
  { aweme_id: '3', title: '视频3' }
])

// 批量管理模式
const isBatchMode = ref(false)
const selectedIds = ref<Set<string>>(new Set())

const isAllSelected = computed(() => {
  return videoList.value.length > 0 && selectedIds.value.size === videoList.value.length
})

// 切换批量管理模式
const toggleBatchMode = () => {
  isBatchMode.value = !isBatchMode.value
  // 退出批量管理时清空选中状态
  if (!isBatchMode.value) {
    selectedIds.value.clear()
  }
}

// 切换全选
const handleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value.clear()
  } else {
    selectedIds.value = new Set(videoList.value.map((item) => item.aweme_id))
  }
}

// 切换单个项的选中状态
const toggleItem = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}

// 处理视频项点击
const handleVideoClick = (item: VideoItem) => {
  if (isBatchMode.value) {
    // 批量管理模式：切换选中
    toggleItem(item.aweme_id)
  } else {
    // 普通模式：打开播放器
    openPlayer(item)
  }
}

// 处理取消喜欢
const handleCancelLike = async () => {
  if (selectedIds.value.size === 0) return

  try {
    // 调用 API 取消喜欢
    await api.cancelLike(Array.from(selectedIds.value))

    // 从列表中移除已取消的项
    videoList.value = videoList.value.filter(
      item => !selectedIds.value.has(item.aweme_id)
    )

    // 清空选中状态
    selectedIds.value.clear()
  } catch (error) {
    console.error('取消喜欢失败:', error)
  }
}
</script>

<template>
  <div>
    <!-- 批量操作工具栏（批量管理模式下显示） -->
    <BatchActionBar
      v-if="isBatchMode"
      :selected-count="selectedIds.size"
      :all-selected="isAllSelected"
      :disabled="videoList.length === 0"
      @select-all="handleSelectAll"
      @action="handleCancelLike"
    />

    <!-- 批量管理按钮（普通模式下显示） -->
    <button v-else @click="toggleBatchMode">
      批量管理
    </button>

    <div class="video-list">
      <VideoItem
        v-for="item in videoList"
        :key="item.aweme_id"
        :aweme="item"
        :selectable="isBatchMode"
        :selected="selectedIds.has(item.aweme_id)"
        @click="handleVideoClick(item)"
      />
    </div>
  </div>
</template>
```

## 自定义文案

```vue
<template>
  <!-- 文件管理场景 -->
  <BatchActionBar
    :selected-count="selectedIds.size"
    :all-selected="isAllSelected"
    action-text="删除"
    selected-text-template="已选 {count} 个文件"
    @select-all="handleSelectAll"
    @action="handleDelete"
  />

  <!-- 收藏管理场景 -->
  <BatchActionBar
    :selected-count="selectedIds.size"
    :all-selected="isAllSelected"
    action-text="取消收藏"
    selected-text-template="已选择 {count} 项"
    @select-all="handleSelectAll"
    @action="handleUnfavorite"
  />
</template>
```

## 样式自定义

组件使用 CSS 变量，可以通过覆盖以下变量来自定义样式：

```css
--color-fill-hover-alpha10  /* 容器背景色 */
--color-text-t2             /* 主要文本颜色 */
--color-text-t4             /* 禁用状态文本颜色 */
--color-border-t3           /* 边框颜色 */
--semi-color-primary        /* 主题色（复选框选中状态） */
--color-bg-t1               /* 复选框背景色 */
```

## 特性说明

### 自动半选状态

组件会根据 `selectedCount` 和 `allSelected` 自动判断并显示半选状态（indeterminate）：
- 当 `selectedCount > 0` 且 `allSelected = false` 时，自动显示半选状态
- 无需手动传递半选状态参数

### 自动禁用

当满足以下任一条件时，操作按钮会自动禁用：
- `disabled = true`
- `selectedCount = 0`

### 性能优化建议

1. **使用 Set 管理选中状态**：比数组性能更好，O(1) 时间复杂度
2. **使用 computed 计算全选状态**：避免手动维护状态
3. **批量操作使用 Set 构造函数**：比逐个添加更高效

```typescript
// ✅ 推荐：使用 Set
const selectedIds = ref<Set<string>>(new Set())
selectedIds.value = new Set(list.map(item => item.id))

// ❌ 不推荐：使用数组
const selectedIds = ref<string[]>([])
list.forEach(item => selectedIds.value.push(item.id))
```

## 注意事项

1. 组件不维护选中状态，需要父组件管理 `selectedIds`
2. 操作按钮图标目前硬编码为删除图标，如需其他图标请通过插槽扩展
3. 当列表数据变化时（如搜索、筛选），需要清理 `selectedIds` 中的无效 ID
4. 建议在列表项上添加复选框，与工具栏联动

## 完整示例

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import BatchActionBar from '@/components/user/batch-action-bar/index.vue'

interface VideoItem {
  aweme_id: string
  title: string
}

const videoList = ref<VideoItem[]>([
  { aweme_id: '1', title: '视频1' },
  { aweme_id: '2', title: '视频2' },
  { aweme_id: '3', title: '视频3' }
])

const selectedIds = ref<Set<string>>(new Set())

const isAllSelected = computed(() => {
  return videoList.value.length > 0 && selectedIds.value.size === videoList.value.length
})

const handleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value.clear()
  } else {
    selectedIds.value = new Set(videoList.value.map((item) => item.aweme_id))
  }
}

const handleCancelLike = async () => {
  if (selectedIds.value.size === 0) return

  try {
    // 调用 API 取消喜欢
    await api.cancelLike(Array.from(selectedIds.value))

    // 从列表中移除已取消的项
    videoList.value = videoList.value.filter(
      item => !selectedIds.value.has(item.aweme_id)
    )

    // 清空选中状态
    selectedIds.value.clear()
  } catch (error) {
    console.error('取消喜欢失败:', error)
  }
}

// 切换单个项的选中状态
const toggleItem = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}
</script>

<template>
  <div>
    <BatchActionBar
      :selected-count="selectedIds.size"
      :all-selected="isAllSelected"
      @select-all="handleSelectAll"
      @action="handleCancelLike"
    />

    <div class="video-list">
      <div
        v-for="item in videoList"
        :key="item.aweme_id"
        class="video-item"
      >
        <input
          type="checkbox"
          :checked="selectedIds.has(item.aweme_id)"
          @change="toggleItem(item.aweme_id)"
        />
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>
```
