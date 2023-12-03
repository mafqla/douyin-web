<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import CommentItem from './comment-item.vue'
import { commentStore } from '@/stores/comment'
import { addVideoComment } from '@/service/videos/videos'

const commentCount = ref(0)
const textarea = ref('')
const loading = ref(false)
const props = defineProps({
  id: Number
})
// const store = commentStore()

const list = ref([]) as any
// watchEffect(async () => {
//   list.value = await store.getVideoCommentList(props.id as any)
//   commentCount.value = list.value.length
// })

async function submitComment() {
  //清空输入框
  textarea.value = ''
  if (!textarea.value) return

  loading.value = true
  await addVideoComment(props.id as any, textarea.value)
  textarea.value = ''
  // list.value = await store.getVideoCommentList(props.id as any)
  commentCount.value = list.value.length
  console.log(list.value)
}
</script>
<template>
  <div class="video-comment">
    <div class="video-comment-header">
      <div class="video-comment-header-title">
        <span>全部评论({{ 2 }})</span>
      </div>
    </div>

    <div class="video-comment-list">
      <!-- <el-scrollbar height="712px"> -->
      <template v-for="it in list as any" :key="it.id">
        <comment-item
          :srcd="it.user.userAvatar"
          :username="it.user.username"
          :likenum="it.commentLike"
          :time="it.commentTime"
          :comment="it.commentInfo"
        />
      </template>

      <list-footer />
      <!-- </el-scrollbar> -->
    </div>
    <div class="video-comment-footer">
      <div class="comment-input-linear-bg"></div>
      <div class="video-comment-footer-input">
        <div class="video-comment-footer-input-text">
          <input
            type="text"
            v-model="textarea"
            placeholder="留下你的精彩评论吧"
            @keyup.enter="submitComment"
          />
        </div>
        <div class="commentInput-right-ct">
          <div class="commentInput-right-ct-content">
            <span class="">
              <svg-icon icon="at" class="icon" />
            </span>
            <span class="">
              <svg-icon icon="emoji" class="icon" />
            </span>
            <span
              class="submit"
              :class="{ 'is-loading': loading }"
              @click="submitComment"
            >
              <svg-icon icon="submit" class="submit-icon" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-comment {
  display: flex;
  flex-direction: column;
  height: calc(100% - 46px);

  .video-comment-header {
    padding: 0 16px;

    .video-comment-header-title {
      align-items: center;
      display: flex;
      flex-grow: 0;
      flex-shrink: 0;
      font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
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

    .video-comment-header-title,
    span {
      height: unset;
      margin: 12px 0 8px;
      padding: 0;
      // color: #161823;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .video-comment-list {
    padding: 0 7px 0 16px;
    // scrollbar-color: hsla(0, 0%, 100%, 0.16) transparent;
    // scrollbar-width: thin;

    // -ms-overflow-style: none;
    flex-direction: column;
    flex-grow: 1;
    outline: none;
    // overflow: scroll;
    // overflow-x: hidden;
    // overflow: -moz-scrollbars-none;
    // padding: 0 16px;
    position: relative;
    scrollbar-width: none;
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
</style>
