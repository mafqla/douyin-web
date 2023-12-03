<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watchEffect, watch } from 'vue'

const props = defineProps({
  description: {
    type: String,
    required: true
  }
})

const spanText = ref<HTMLElement | null>(null)
const expanded = ref(false)
const shouldShowButton = ref(false)
const addShow = ref(false)
const spanHeight = ref()
const clientHeight = ref()

// 监听容器尺寸变化
onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      spanHeight.value = entry.target.scrollHeight
      clientHeight.value = entry.target.clientHeight
      // console.log(spanHeight.value, clientHeight.value)

      shouldShowButton.value = spanHeight.value > clientHeight.value
      addShow.value = spanHeight.value > clientHeight.value
      if (expanded.value) {
        shouldShowButton.value = true
      }
    }
  })
  resizeObserver.observe(spanText.value!)
})

// watchEffect(() => {
//   console.log(shouldShowButton.value)
// })
const toggleExpand = () => {
  expanded.value = !expanded.value
  // addShow.value = !expanded.value
}

const formattedDescription = computed(() => {
  const tags = props.description.split(' ')
  const formattedParts = tags.map((tag) => {
    if (tag.startsWith('#')) {
      return `<a href="#" class="tag"><span>${tag}</span></a>`
    } else {
      return tag
    }
  })
  return formattedParts.join(' ')
})
</script>
<template>
  <div class="video-title">
    <div
      class="video-info-desc"
      :class="{ 'text-expanded': expanded }"
      ref="spanText"
    >
      <div class="btn-content" :class="{ show: addShow }">
        <button class="btn" @click="toggleExpand" v-if="shouldShowButton">
          {{ expanded ? '收起' : '展开' }}
        </button>
      </div>
      <span class="text" v-html="formattedDescription"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-title {
  display: flex;
  width: 100%;
  overflow: hidden;
  pointer-events: all;
}
.video-info-desc {
  font-size: 14px;
  max-height: 44px;
  line-height: 22px;

  max-height: calc(2 * 22px + 2px);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  position: relative;
  text-align: justify;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  pointer-events: all;

  &::before {
    content: '';
    float: right;
    height: calc(100% - 22px + 1px);
    width: 0px;
  }
  &.text-expanded {
    max-height: 748px;
    -webkit-line-clamp: 34;
  }
}

.show::before {
  content: '...';
  left: -14px;
  position: absolute;
}

.btn-content {
  // margin-left: -4px;
  position: relative;
  height: 20px;
  align-items: center;
  display: flex;
  float: right;
  clear: both;

  .btn {
    color: rgba(255, 255, 255, 0.9);

    font-weight: 400;
    height: 20px;
    line-height: 20px;
    width: 40px;
    min-width: 40px;
    background: rgba(255, 255, 255, 0.15);
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    padding: 0px !important;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.text {
  .tag {
    color: #f1c40f;
    text-decoration: none;
    padding: 0 5px;

    &:hover {
      text-decoration: underline;
      background-color: transparent;
    }
  }
}
</style>
