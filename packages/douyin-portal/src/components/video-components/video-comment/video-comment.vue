<script setup lang="ts">
import apis from '@/api/apis'
import type { IComments } from '@/api/tyeps/request_response/commentListRes'
import dyInput from '@/components/common/dy-input/index.vue'
import { vInfiniteScroll } from '@vueuse/components'
import { ref } from 'vue'
import CommentItem from './comment-item.vue'

const commentCount = ref(0)
const textarea = ref('')
const loading = ref(false)
const props = defineProps({
  id: String,
  author_id: Number,
  relatedText: String
})
// const store = commentStore()

const list = ref([]) as any
async function submitComment() {
  //清空输入框
  textarea.value = ''
  if (!textarea.value) return

  loading.value = true
  textarea.value = ''
  commentCount.value = list.value.length
  console.log(list.value)
}
const commentList = ref<IComments[]>([])
const isLoadingMore = ref(true)
const hasMore = ref(true)
const cursor = ref(0)
const count = ref(5)
const total = ref(0)
const hotsoon_text = ref('')

const getCommentList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getCommentList(
      props.id ?? '',
      cursor.value,
      count.value
    )
    cursor.value = res.cursor
    count.value = 20
    hotsoon_text.value = res.hotsoon_text
    commentList.value.push(...res.comments)
    total.value = res.total

    if (!res.has_more) {
      hasMore.value = false
      isLoadingMore.value = false
    }
  } catch (error) {
    // console.log(error)
    hasMore.value = false
    isLoadingMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}
</script>
<template>
  <div class="video-comment" ref="target">
    <div class="video-comment-header">
      <div class="comment-header-with-search" v-if="relatedText != ''">
        <div class="trend-header">
          <span class="trend-title">大家都在搜：</span>
          <search-suggestion :relatedText />
        </div>
      </div>
      <div class="video-comment-header-title">
        <span>全部评论({{ total }})</span>
      </div>
    </div>

    <div
      class="video-comment-list"
      ref="containerRef"
      data-scrollable
      v-infinite-scroll="[getCommentList, { distance: 10 }]"
    >
      <template v-for="it in commentList" :key="it.cid">
        <comment-item v-bind="it" :author_id="props.author_id ?? ''" />
      </template>

      <Loading :show="isLoadingMore" :isShowText="true" text="评论加载中..." />
      <list-footer v-if="!hasMore" :text="hotsoon_text" />
    </div>
    <div class="video-comment-footer">
      <dy-input />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-comment {
  height: 100%;
  user-select: text;
  display: flex;
  flex-direction: column;

  .video-comment-header {
    padding: 0 16px;
    margin: 12px 0 0px;
    .video-comment-header-title {
      align-items: center;
      display: flex;
      flex-grow: 0;
      flex-shrink: 0;
      font-size: 16px;
      font-weight: 500;
      height: 54px;
      justify-content: space-between;
      line-height: 24px;
      padding: 0 16px;
      position: relative;
      top: 0;
      z-index: 1;

      span {
        display: inline-block;
        position: relative;
        font-size: 12px;
        z-index: 2;
      }
    }

    .video-comment-header-title {
      height: unset;
      margin: 12px 0 8px;
      padding: 0;
      color: rgba(255, 255, 255, 0.9);
    }

    .comment-header-with-search {
      color: var(--color-text-t1);
      // height: 54px;
      z-index: 1;
      flex-grow: 0;
      flex-shrink: 0;
      justify-content: space-between;
      align-items: center;
      // padding: 0 16px;
      // font-size: 16px;
      font-size: 12px;
      font-weight: 500;
      line-height: 24px;
      display: flex;
      position: relative;
      top: 0;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      height: unset;
      // padding: 0 0 8px;
      .trend-header {
        color: var(--color-text-t2);
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        flex: 1;
        margin-right: 20px;
        // font-size: 14px;
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        display: flex;
        overflow: hidden;
        -webkit-app-region: no-drag !important;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);

        .trend-title {
          font-size: 12px;
        }
      }
    }
  }

  .video-comment-list {
    overflow-x: hidden;
    overflow-y: scroll;
    scrollbar-width: none;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    outline: none;
    text-shadow: rgba(0, 0, 0, 0.2) 0px 1px 1px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
    padding: 0px 7px 0px 16px;
  }

  .video-comment-footer {
    flex-grow: 0;
    flex-shrink: 0;
    margin: 0 0 16px;
    // margin-bottom: 10px;
    // margin-bottom: 10px;
    max-height: calc(100% - 74px);
    padding: 0 16px;
    position: relative;
    width: 100%;
    z-index: 10;

    .comment-input-linear-bg {
      background: linear-gradient(0deg, #f2f2f4, hsla(240, 8%, 95%, 0));
      height: 126px;
      left: 0;
      pointer-events: none;
      position: absolute;
      right: -16px;
      top: -126px;

      display: none;
    }

    .video-comment-footer-input {
      height: 100%;

      background-color: hsla(0, 0%, 100%, 0.2);
      border: unset !important;

      align-items: center;
      // background-color: #e4e4e6;
      // background: #eff0f3;
      // border: 1px solid #e4e4e6;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      min-height: 44px;
      position: relative;
      width: 100%;

      .video-comment-footer-input-text {
        flex: 1 1;
        flex-grow: 1;
        height: 100%;
        overflow: hidden;
        padding-left: 12px;
        width: 0;

        input {
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          caret-color: #fff;
          user-select: text;
          white-space: pre-wrap;
          overflow-wrap: break-word;
          background-color: transparent;
          outline: none;
          border: none;
          // color: #161823;
          color: rgba(255, 255, 255, 0.9);

          &::placeholder {
            color: rgba(255, 255, 255, 0.34);
          }
        }
      }

      .commentInput-right-ct {
        flex: 0 1;
        flex-basis: 110px !important;
        // flex-basis: 152px;
        margin-right: 4px;
        position: static;

        .commentInput-right-ct-content {
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
              color: #fe2c55;
              opacity: 1;
            }
          }
          .icon {
            width: 36px;
            height: 36px;
            color: rgba(255, 255, 255, 0.34);
            fill-opacity: 1;
          }
          span:hover {
            opacity: 1;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .video-comment-header * {
    font-size: calc(0.892857vw - 0.857143px) !important;
  }
}
@media screen and (min-width: 2560px) {
  .video-comment-header * {
    font-size: 22px !important;
  }
}
</style>
