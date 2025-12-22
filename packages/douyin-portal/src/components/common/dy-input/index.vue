<script setup lang="ts">
import { ref, watchEffect, watch, computed } from 'vue'
import atBox from './at-box.vue'
import emojiBox from './emoji-box.vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '留下你的精彩评论吧'
  },
  replyTo: {
    type: Object as () => { uid: number | string; username: string; comment?: string } | null,
    default: null
  },
  groupId: {
    type: String,
    default: ''
  }
})

// 图片相关
const imageList = ref<{ file: File; url: string }[]>([])
const imageInputRef = ref<HTMLInputElement | null>(null)

const onImageClick = () => {
  imageInputRef.value?.click()
}

const handleImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    // 最多支持1张图片
    if (imageList.value.length >= 1) {
      return
    }
    const file = files[0]
    const url = URL.createObjectURL(file)
    imageList.value.push({ file, url })
  }
  // 清空 input 以便重复选择同一文件
  target.value = ''
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(imageList.value[index].url)
  imageList.value.splice(index, 1)
}

const textareaRef = ref('')
const richtextRef = ref<HTMLElement | null>(null)
const loading = ref(false)
//超出的字数
const overLimit = ref(0)
// 定义 emits
const emits = defineEmits(['update:value', 'submit', 'cancelReply'])

// 更新 value 的方法
const updateValue = (newValue: string) => {
  textareaRef.value = newValue
  emits('update:value', newValue)
}

// 取消回复
const cancelReply = () => {
  emits('cancelReply')
}

async function submitComment() {
  // 如果输入为空且没有图片，直接返回
  if (!textareaRef.value.trim() && imageList.value.length === 0) return

  // 提交内容，包含图片
  emits('submit', {
    text: textareaRef.value,
    images: imageList.value.map(img => img.file),
    replyTo: props.replyTo
  })

  // 清空输入框的内容
  textareaRef.value = ''
  // 清空图片
  imageList.value.forEach(img => URL.revokeObjectURL(img.url))
  imageList.value = []

  // 清空富文本的内容
  if (richtextRef.value) {
    richtextRef.value.innerHTML = ''
  }
}

const onTextareaInput = (e: any) => {
  // console.log(e.target.innerHTML)
  const content = e.target.innerHTML
  const updatedText = content
    .replace(/<img.*?alt="(.*?)".*?>/g, '$1')
    .replace(/<br>/g, '\n')
    .replace(/<\/?[^>]+>/g, '')
  textareaRef.value = updatedText
  updateValue(updatedText)
  if (textareaRef.value) {
    saveSelection()
  }
}

const savedRange = ref<Range | null>(null)
const saveSelection = () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    savedRange.value = selection.getRangeAt(0)
  }
}

const restoreSelection = () => {
  const selection = window.getSelection()
  if (selection && savedRange.value) {
    selection.removeAllRanges()
    selection.addRange(savedRange.value)
  }
}
const insertAtCursor = (element: HTMLElement): void => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.deleteContents() // 删除光标位置的内容（可选）
    range.insertNode(element)

    // 保存新的光标位置
    savedRange.value = document.createRange()
    savedRange.value.setStartAfter(element)
    savedRange.value.collapse(true)

    selection.removeAllRanges()
    selection.addRange(savedRange.value)
  }
}

const handleMouseUp = (event: MouseEvent) => {
  if (richtextRef.value) {
    if (richtextRef.value.contains(event.target as Node)) {
      saveSelection()
    } else {
      richtextRef.value.blur()
    }
  }
}

watchEffect(() => {
  if (richtextRef.value) {
    richtextRef.value.addEventListener('mouseup', handleMouseUp)
    richtextRef.value.addEventListener('keydown', saveSelection)
  }
})
onUnmounted(() => {
  if (richtextRef.value) {
    richtextRef.value.removeEventListener('mouseup', handleMouseUp)
    richtextRef.value.removeEventListener('keydown', saveSelection)
  }
})
const isShowAt = ref(false)

//点击at按钮，打开at弹窗
const onAtClick = () => {
  isShowAt.value = !isShowAt.value
  const editableDiv = richtextRef.value
  if (isShowAt.value) {
    if (editableDiv) {
      editableDiv.focus()
      const atSpan = document.createElement('span')
      atSpan.textContent = '@'
      insertAtCursor(atSpan)
    }
  }
}

const handleUserSelected = (selectedUser: { username: string }) => {
  isShowAt.value = false

  const editableDiv = richtextRef.value
  if (editableDiv) {
    editableDiv.focus()

    // 获取当前文本选区
    const selection = window.getSelection()
    const atSpan = document.createElement('span')
    if (selection) {
      const range = selection.getRangeAt(0)
      range.deleteContents() // 删除选区中原有的内容
      const startContainer = range.startContainer as Text
      const textBefore =
        startContainer?.textContent?.slice(0, range.startOffset) || ''
      //获取当前文本选区，判断是否单独存在@符号，如果存在，插入的到时候不用添加@符号
      const endsWithAtSymbol = textBefore.replace(/\s/g, '').endsWith('@')
      if (endsWithAtSymbol) {
        atSpan.textContent = `${selectedUser.username}`
      } else {
        atSpan.textContent = `@${selectedUser.username}`
      }
      insertAtCursor(atSpan)
      // 更新 textarea 的值
      textareaRef.value = textareaRef.value + `@${selectedUser.username}` + ' '
    }
  }
  isShowAt.value = false // 关闭 at 面板
}

//点击emoji按钮，打开emoji弹窗
const isShowEmoji = ref(false)
const onEmojiClick = () => {
  isShowEmoji.value = !isShowEmoji.value
  const editableDiv = richtextRef.value
  if (isShowEmoji.value) {
    if (editableDiv) {
      editableDiv.focus()
    }
  } else {
    if (editableDiv) {
      editableDiv.focus()
    }
  }
}

const handleSelectEmoji = (emoji: any) => {
  const { display_name, emoji_url } = emoji
  const emojiName = display_name
  const emojiImg = emoji_url.url_list[0]
  const editableDiv = richtextRef.value
  if (editableDiv) {
    editableDiv.focus()
    const imgElement = document.createElement('img')
    imgElement.src = emojiImg
    imgElement.alt = emojiName
    imgElement.style.width = '24px' // 可以设置表情符号的宽度，根据需要调整
    insertAtCursor(imgElement)
    // 更新 textarea 的值
    textareaRef.value = textareaRef.value + emojiName
  }

  // console.log(emojiName) // 打印表情符号的名称
  isShowEmoji.value = false // 关闭表情符号面板
}

// 计算是否可以提交（有文字或有图片）
const canSubmit = computed(() => {
  return textareaRef.value.trim() !== '' || imageList.value.length > 0
})

watchEffect(() => {
  // console.log('textarea', textareaRef.value)
  // console.log('range', savedRange.value)
  if (textareaRef.value.length > 300) {
    overLimit.value = textareaRef.value.length - 300
  } else {
    overLimit.value = 0
  }

  //监听文本是否存在@
  if (textareaRef.value.includes('@')) {
    isShowAt.value = true
  } else {
    isShowAt.value = false
  }
})
</script>
<template>
  <div class="dy-input" :class="{ 'has-images': imageList.length > 0 }">
    <!-- 回复提示栏 - 只在有 replyTo 时显示 -->
    <div class="reply-hint" v-if="replyTo">
      <span class="reply-text">回复@{{ replyTo.username }}: {{ replyTo.comment }}</span>
      <span class="reply-close" @click="cancelReply">
        <svg-icon icon="close" class="close-icon" />
      </span>
    </div>
    
    <div class="input-main">
      <div class="comment-input-left">
        <div class="richtext-container">
          <div class="DraftEditor-root">
            <div
              class="public-DraftEditorPlaceholder-inner"
              v-if="textareaRef === ''"
            >
              <span>{{ placeholder }}</span>
            </div>
            <div class="DraftEditor-editorContainer">
              <div
                class="public-DraftEditor-content"
                contenteditable="true"
                spellcheck="false"
                role="combobox"
                style="
                  outline: none;
                  user-select: text;
                  white-space: pre-wrap;
                  overflow-wrap: break-word;
                "
                ref="richtextRef"
                @input="onTextareaInput"
                @focus="restoreSelection"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="comment-input-right-ct">
        <div class="comment-input-right-ct-content">
          <p class="over-limit" v-if="overLimit">-{{ overLimit }}</p>
          <span @click="onImageClick">
            <svg-icon icon="image" class="icon" />
          </span>
          <input
            type="file"
            ref="imageInputRef"
            accept="image/*"
            style="display: none"
            @change="handleImageSelect"
          />
          <span :class="{ 'at-icon': isShowAt }" @click="onAtClick">
            <svg-icon icon="at" class="icon" />
          </span>
          <span :class="{ 'emoji-icon': isShowEmoji }" @click="onEmojiClick">
            <svg-icon icon="emoji" class="icon" />
          </span>
          <span
            class="submit"
            :class="{ 'is-loading': loading }"
            @click="submitComment"
            v-if="canSubmit"
          >
            <svg-icon icon="submit" class="submit-icon" />
          </span>
        </div>
      </div>
    </div>
    
    <!-- 图片预览区域 - 在输入框下方 -->
    <div class="image-preview-list" v-if="imageList.length > 0">
      <div class="image-preview-item" v-for="(img, index) in imageList" :key="index">
        <img :src="img.url" alt="preview" />
        <span class="image-remove" @click="removeImage(index)">
          <svg-icon icon="close" class="remove-icon" />
        </span>
      </div>
    </div>

    <!-- at-box 和 emoji-box 显示在输入框上方 -->
    <at-box
      v-if="isShowAt"
      :group-id="groupId"
      @user-selected="handleUserSelected"
      @close="isShowAt = false"
    />
    
    <emoji-box
      v-if="isShowEmoji"
      @select-emoji="handleSelectEmoji"
      @close="isShowEmoji = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.dy-input {
  width: 100%;
  min-height: 44px;
  background-color: var(--color-bg-b3);
  background: var(--container-bg);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    outline: 1px solid rgba(255, 255, 255, 0.5);
  }

  .reply-hint {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px 12px 0 0;
    font-size: 12px;
    color: var(--color-text-t2);

    .reply-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .reply-close {
      cursor: pointer;
      margin-left: 8px;
      opacity: 0.6;
      
      &:hover {
        opacity: 1;
      }

      .close-icon {
        width: 16px;
        height: 16px;
      }
    }
  }

  .input-main {
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .comment-input-left {
    width: 0;
    flex: 1;
    padding-left: 12px;
  }

  .image-preview-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 12px 8px;

    .image-preview-item {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-remove {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 18px;
        height: 18px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        
        &:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .remove-icon {
          width: 12px;
          height: 12px;
          color: #fff;
        }
      }
    }
  }

  .public-DraftEditorPlaceholder-inner {
    color: var(--color-text-t4);
    white-space: pre-wrap;
    z-index: 1;
    position: absolute;
  }

  .public-DraftStyleDefault-ltr {
    direction: ltr;
    text-align: left;
  }

  .public-DraftStyleDefault-block {
    white-space: pre-wrap;
    position: relative;
  }

  .public-DraftEditor-content[contenteditable='true'] {
    -webkit-user-modify: read-write-plaintext-only;
  }

  .DraftEditor-editorContainer {
    z-index: 1;
    background-color: rgba(255, 255, 255, 0);
    border-left: 0.1px solid transparent;
    position: relative;
  }

  .DraftEditor-editorContainer,
  .DraftEditor-root,
  .public-DraftEditor-content {
    height: inherit;
    text-align: initial;
  }

  .richtext-container {
    height: 100%;
    margin: 11px 0;

    .DraftEditor-root {
      height: 100%;
      max-height: 300px;
      padding-right: 2px;
      overflow-y: scroll;
    }

    .DraftEditor-editorContainer {
      z-index: 10;
      scrollbar-width: none;
      overflow-y: scroll;
    }

    span,
    div {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    .public-DraftEditor-content {
      color: var(--color-text-t1);
    }
  }

  .comment-input-right {
    flex: 0 152px;
    margin-right: 4px;
    position: static;
  }

  .comment-input-right-ct {
    flex: 0 152px;
    margin-right: 4px;
    position: static;

    .comment-input-right-ct-content {
      bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      right: 4px;

      span:not(.submit) {
        cursor: pointer;
        opacity: 44%;
      }

      .submit {
        cursor: pointer;

        .submit-icon {
          width: 36px;
          height: 36px;

          svg path[fill-rule='evenodd'] {
            fill: var(--color-primary);
            fill-opacity: 1;
          }
        }
      }

      .icon {
        width: 36px;
        height: 36px;
        color: var(--color-text-t3);
        fill-opacity: 1;
      }

      span:hover,
      span.emoji-icon,
      span.at-icon {
        opacity: 1;

        .icon {
          color: var(--color-text-t0);
        }
      }

      .over-limit {
        color: var(--color-semantic-danger);
        width: 36px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 36px;
      }
    }
  }
}
</style>
