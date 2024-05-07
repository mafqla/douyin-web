<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import emojiList from './emojiList'

interface EmojiItem {
  origin_uri: string
  display_name: string
  hide: number
  emoji_url: {
    uri: string
    url_list: string[]
  }
}
// 定义emit函数，用于向父组件发送事件
const emit = defineEmits(['select-emoji', 'close'])

// 定义处理表情选择的方法
const handleSelectEmoji = (emoji: EmojiItem) => {
  emit('select-emoji', emoji)
}
//点击emoji弹窗外部关闭emoji弹窗
const handleClickOutside = (event: MouseEvent) => {
  // 检查点击的目标元素是否不是.emoji类或.emoji的子元素
  if (
    !(event.target as HTMLElement).closest('.emoji') &&
    !(event.target as HTMLElement).closest('.emoji-icon')
  ) {
    emit('close')
  }
}
// 监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
// 移除监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="emoji">
    <div class="emoji-content">
      <div class="emoji-list">
        <span
          class="emoji-item"
          v-for="emoji in emojiList"
          :key="emoji.origin_uri"
        >
          <img
            :src="emoji.emoji_url.url_list[0]"
            :alt="emoji.display_name"
            @click="handleSelectEmoji(emoji)"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emoji {
  width: 414px;
  height: 295px;
  box-shadow: var(--shadow-1);
  background-color: var(--color-bg-b1-white);
  z-index: 3;
  border-radius: 12px;
  outline: none;
  flex-direction: column;
  display: flex;
  overflow: hidden;

  position: absolute;
  bottom: -300px;
  right: -1px;

  scrollbar-color: #363741 var(--color-bg-b1-white);
}

.emoji-content {
  width: 100%;
  flex-grow: 1;
  overflow: scroll;
}

.emoji-list {
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 8px 0 0 8px;
  display: flex;

  .emoji-item {
    cursor: pointer;
    padding: 8px;

    img {
      width: 24px;
      height: 24px;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
}
</style>
