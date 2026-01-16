<script setup lang="ts">
import { reactive } from 'vue'

const shortcuts = reactive([
  { action: '赞', keyBinding: 'Z/双击空格' },
  { action: '取消赞', keyBinding: 'Z' },
  { action: '评论', keyBinding: 'X' },
  { action: '开启/关闭弹幕', keyBinding: 'B' },
  { action: '收藏/取消收藏', keyBinding: 'C' },
  { action: '复制分享口令', keyBinding: 'V' },
  { action: '清屏', keyBinding: 'J' },
  { action: '自动连播', keyBinding: 'K' },
  { action: '不感兴趣', keyBinding: 'R' },
  { action: '进入作者主页', keyBinding: 'F' },
  { action: '关注/取消关注', keyBinding: 'G' },
  { action: '抖音搜索', keyBinding: 'Shift+F' },
  { action: '一键关闭当前页', keyBinding: 'Shift+Q' },
  { action: '上下翻页', keyBinding: '↑↓' },
  { action: '快进快退', keyBinding: '← →' },
  { action: '暂停', keyBinding: '空格' },
  { action: '网页内全屏', keyBinding: 'Y' },
  { action: '全屏', keyBinding: 'H' },
  { action: '稍后再看', keyBinding: 'L' },
  { action: '音量调整', keyBinding: 'Shift + / Shift -' },
  { action: '呼出快捷键列表', keyBinding: '?' },
  { action: '关闭快捷键列表', keyBinding: 'ESC' },
  { action: '相关推荐', keyBinding: 'N' }
])
</script>

<template>
  <div class="shortcut-keys">
    <div
      class="shortcut-key-item"
      v-for="(key, index) in shortcuts"
      :key="index"
    >
      <span class="action">{{ key.action }}</span>
      <span class="key-binding">{{ key.keyBinding }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shortcut-keys {
  scrollbar-width: none;
  height: calc(100% - 84px);
  width: calc(100% - 80px);
  flex-direction: column;
  display: flex;
  position: relative;
  top: 54px;
  overflow: scroll;
}

.shortcut-key-item {
  flex-shrink: 0;
  justify-content: space-between;
  margin-bottom: 7px;
  font-size: 13px;
  line-height: 21px;
  display: flex;
}

.action {
  color: var(--color-text-t3);
}

.key-binding {
  color: var(--color-text-t0);
  width: 102px;
  height: 22px;
  justify-content: center;
  display: inline-flex;
  background: var(--color-secondary-default);
  border-radius: 3px;
}
</style>
