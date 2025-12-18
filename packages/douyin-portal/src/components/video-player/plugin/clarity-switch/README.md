# ClaritySwitch 清晰度切换插件

基于 xgplayer 的视频清晰度切换插件，支持直接传入接口返回的 `bit_rate` 数组自动解析清晰度列表。

## 基本用法

```ts
import ClaritySwitch from './plugin/clarity-switch/clarity-switch'

const player = new Player({
  // ...其他配置
  plugins: [ClaritySwitch]
})
```

## 配合接口数据使用

```ts
// 接口返回的视频数据
const videoData = await fetchVideo()

const player = new Player({
  url: videoData.play_addr.url_list[0],
  // 传入 bit_rate 数组，插件会自动解析清晰度列表
  claritySwitch: {
    bitRates: videoData.bit_rate
  },
  plugins: [ClaritySwitch]
})
```

## 在 base-player 中使用

```vue
<template>
  <BasePlayer
    :url="videoUrl"
    :bit-rates="video.bit_rate"
    @clarity-change="handleClarityChange"
  />
</template>

<script setup>
const handleClarityChange = ({ value, label, clarityOption }) => {
  console.log('切换到:', label, value)
  // clarityOption 包含完整的 BitRate 信息
}
</script>
```

## 配置项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | string | `POSITIONS.CONTROLS_RIGHT` | 插件在控制栏的位置 |
| index | number | `3` | 插件在控制栏的排序索引 |
| className | string | `'xgplayer-clarity-switch'` | 插件容器类名 |
| defaultClarity | string | `'智能'` | 默认选中的清晰度 |
| bitRates | BitRate[] | - | 接口返回的 bit_rate 数组（推荐） |
| clarityList | ClarityOption[] | 见下方 | 手动指定清晰度选项列表 |

## 事件

### clarityChange

清晰度切换时触发：

```ts
player.on('clarityChange', ({ value, label, clarityOption }) => {
  // value: "1080p" | "720p" | "540p" | "auto"
  // label: "高清 1080P" | "高清 720P" | "标清 540P" | "智能"
  // clarityOption: ClarityOption 完整信息
})
```

## API 方法

### setBitRates(bitRates: BitRate[])

动态设置清晰度列表（通过接口数据）：

```ts
const clarityPlugin = player.getPlugin('claritySwitch')
clarityPlugin.setBitRates(newVideoData.bit_rate)
```

### setClarityList(list: ClarityOption[])

手动设置清晰度列表：

```ts
const clarityPlugin = player.getPlugin('claritySwitch')
clarityPlugin.setClarityList([
  { label: '高清 1080P', value: '1080p', url: 'xxx' },
  { label: '标清 540P', value: '540p', url: 'xxx' }
])
```

## 类型定义

```ts
// 清晰度选项
interface ClarityOption {
  label: string      // 显示文本，如 "高清 1080P"
  value: string      // 清晰度值，如 "1080p"
  bitRate?: BitRate  // 对应的比特率信息
  url?: string       // 播放地址
}

// 插件配置
interface ClaritySwitchConfig {
  position?: string
  index?: number
  className?: string
  defaultClarity?: string
  bitRates?: BitRate[]       // 接口返回的 bit_rate 数组
  clarityList?: ClarityOption[]
}
```

## bit_rate 数据结构说明

接口返回的 `bit_rate` 数组中，每个元素包含：

| 字段 | 说明 |
|------|------|
| gear_name | 档位名称，如 `normal_1080_0`（标准1080p h264）、`adapt_lowest_720_1`（自适应最低720p h265） |
| quality_type | 质量类型标识 |
| bit_rate | 比特率 (bps) |
| play_addr | 播放地址信息 |
| is_h265 | 是否 H.265 编码 |
| format | 格式：`mp4` 或 `dash` |
| video_extra | JSON 字符串，包含 `definition`（清晰度）、`quality`（质量）等 |

插件会自动解析 `video_extra` 中的 `definition` 字段来确定清晰度，并优先选择 mp4 格式、h264 编码的视频源。

## DOM 结构

```html
<xg-icon class="xgplayer-clarity-switch" data-state="normal">
  <div class="clarity-container">
    <div class="clarity-menu">
      <div class="clarity-item" data-value="1080p" data-label="高清 1080P">
        <span class="clarity-label">高清 1080P</span>
      </div>
      <div class="clarity-item" data-value="720p" data-label="高清 720P">
        <span class="clarity-label">高清 720P</span>
      </div>
      <div class="clarity-item" data-value="540p" data-label="标清 540P">
        <span class="clarity-label">标清 540P</span>
      </div>
      <div class="clarity-item selected" data-value="auto" data-label="智能">
        <span class="clarity-label">智能</span>
      </div>
    </div>
    <div class="clarity-btn" tabindex="0">
      <span class="clarity-btn-text">智能</span>
    </div>
  </div>
</xg-icon>
```

## 样式类名

| 类名 | 说明 |
|------|------|
| `.xgplayer-clarity-switch` | 插件根容器 |
| `.clarity-container` | 内容容器 |
| `.clarity-btn` | 触发按钮 |
| `.clarity-btn-text` | 按钮文字 |
| `.clarity-menu` | 清晰度菜单 |
| `.clarity-menu.show` | 菜单展开状态 |
| `.clarity-item` | 清晰度选项 |
| `.clarity-item.selected` | 选中的选项 |
| `.clarity-label` | 选项文字 |
