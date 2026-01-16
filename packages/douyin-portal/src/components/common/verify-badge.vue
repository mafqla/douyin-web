<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  certInfo?: string | null
  size?: number
}>()

// label_style 到颜色的映射
const STYLE_MAP: Record<number, string> = {
  5: 'blue',
  3: 'yellow',
  7: 'red'
}

// 解析 account_cert_info JSON 字符串获取认证颜色
const badgeColor = computed(() => {
  if (!props.certInfo) return null
  try {
    const { label_style } = JSON.parse(props.certInfo)
    return STYLE_MAP[label_style] || null
  } catch {
    return null
  }
})

const badgeStyle = computed(() =>
  props.size
    ? { width: `${props.size}px`, height: `${props.size}px` }
    : undefined
)
</script>

<template>
  <span
    v-if="badgeColor"
    class="verify-badge"
    :class="badgeColor"
    :style="badgeStyle"
  />
</template>

<style lang="scss" scoped>
.verify-badge {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-left: 4px;
  flex-shrink: 0;

  &.blue {
    background: url('https://lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/douyin-pc-icons-color@ic_verify_blue_outlined.5451acea860fbfb1.svg')
      no-repeat center / contain;
  }

  &.yellow {
    background: url('https://lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/douyin-pc-icons-color@ic_verify_yellow_outlined.4a5e14eb950c5d79.svg')
      no-repeat center / contain;
  }

  &.red {
    background: url('https://lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/douyin-pc-icons-color@ic_verify_red_filled.4ec9a1314e2180d3.svg')
      no-repeat center / contain;
  }
}
</style>
