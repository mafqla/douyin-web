<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { ISegment } from '@/api/tyeps/common/aweme'

interface IProps {
  description: string
  textExtra: ISegment[]
}
const props = defineProps<IProps>()

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
  // // 使用正则表达式匹配所有以 # 开头的单词
  // const tags = props.description.split(/(#\S+)/)
  // const formattedParts = tags.map((tag, index) => {
  //   if (index === 1) {
  //     return `<span class="tag"><span>${tag}</span></span>`
  //   } else if (tag.startsWith('#')) {
  //     return `<span><span> </span></span>
  //     <span class="tag"><span>${tag}</span></span>`
  //   } else {
  //     return `<span><span>${tag}</span></span>`
  //   }
  // })
  // return formattedParts.join('')

  let parsedContent = props.description
  let textExtra = props.textExtra
  // 1. 根据传入的textExtra，替换content中的文本额外信息
  if (textExtra && textExtra.length > 0) {
    // 按 start 位置降序排列，避免替换时影响后续替换
    textExtra.sort((a, b) => b.start - a.start)

    textExtra.forEach((item) => {
      // 处理用户名
      if (item.type === 0) {
        const username = props.description.slice(item.start, item.end).trim()
        const replacement = `<a href="/user/${item.sec_uid}" class="header-name-link" target="_blank"><span>${username}</span></a>`
        parsedContent =
          parsedContent.slice(0, item.start) +
          replacement +
          parsedContent.slice(item.end)
      }
      // 处理标签
      else if (item.type === 1) {
        const tag = props.description.slice(item.start, item.end).trim()
        const replacement = `<a href="/tag/${item.hashtag_id}" class="hashtag-link" target="_blank"><span class="tag"><span>${tag}</span></span></a>`
        parsedContent =
          parsedContent.slice(0, item.start) +
          replacement +
          parsedContent.slice(item.end)
      }
    })
  }
  return parsedContent
})
</script>
<template>
  <div class="video-title">
    <div
      class="ellipsis-expand"
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
.ellipsis-expand {
  max-height: calc(2 * 22px + 2px);
  max-height: calc(var(--lineClamp) * var(--lineHeight) + 2px);
  -webkit-line-clamp: 2;
  -webkit-line-clamp: var(--lineClamp);
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
    height: calc(100% - var(--lineHeight) + 1px);
    width: 0px;
  }
  &.text-expanded {
    max-height: 748px;
    -webkit-line-clamp: 34;
  }
}

.show::before {
  // content: '...';
  // left: -14px;
  // position: absolute;

  content: '';
  float: right;
  height: 100%;
  margin-bottom: -22px;
  width: 0;
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
    // color: var(--color-text-t3);
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
    height: 20px;
    line-height: 20px;
    width: 40px;
    min-width: 40px;
    // background: var(--color-secondary-default);
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
  font-size: 14px;
  max-height: 44px;
  line-height: 22px;
  .tag {
    color: #f1c40f;
    text-decoration: none;
    padding: 0 5px;
    span {
      font-weight: 500;
      // color: var(--color-text-t1);
      font-size: 14px;
      line-height: 22px;
    }
    &:hover {
      text-decoration: underline;
      background-color: transparent;
    }
  }
}
@media screen and (min-width: 1920px) {
  // :root {
  //   --lineClamp: 3 !important;
  //   --lineHeight: 26px !important;
  //   --maxHeight: 78px !important;
  // }
  .text {
    font-size: 18px !important;
    line-height: 24px;
    .tag span {
      font-size: 18px !important;
      line-height: 24px;
    }
  }
}
// @media screen and (min-width: 1440px) and (max-width: 2560px) {
//   .text {
//     font-size: 0.972222vw !important;
//     line-height: 1.52778vw;

//     .tag span {
//       font-size: 0.972222vw !important;
//       line-height: 1.52778vw;
//     }
//   }
// }

.video-desc-swiper {
}
.video-info-desc {
  &.search {
    .tag {
      padding: unset !important;
    }
    .text,
    .tag span {
      font-size: 16px !important;
      line-height: 24px !important;
    }
  }
  .text {
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    .tag {
      text-decoration: none;
      padding: 0 5px;
      span {
        font-weight: 500;
        color: var(--color-text-t1);
        font-size: 18px;
        line-height: 26px;
      }
      &:hover {
        span {
          color: #ff2c55;
        }
      }
    }
  }
}
</style>
