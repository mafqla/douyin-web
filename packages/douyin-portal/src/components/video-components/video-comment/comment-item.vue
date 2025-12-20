<script setup lang="ts">
import apis from '@/api/apis'
import type { IComments } from '@/api/tyeps/request_response/commentListRes'
import DyInput from '@/components/common/dy-input/index.vue'
import commentExpand from './comment-expand.vue'
import { useCount } from '@/hooks'
import { handleCommentParser } from '@/utils/commentParser'
import formatTime from '@/utils/date-format'
import { computed, inject, ref, watchEffect } from 'vue'

const props = defineProps<IComments & { author_id: string | number }>()

// 注入图片预览方法
const imagePreview = inject<{ openPreview: (cid: string, index: number) => void }>('imagePreview')

const openPreview = (index: number) => {
  imagePreview?.openPreview(props.cid, index)
}
//回复用户
//输入框的值
const comment = ref('')
watchEffect(() => {
  // console.log('textValue', comment.value)
})
const isOpenInput = ref(false)
const replyText = computed(() => {
  return isOpenInput.value ? '回复中' : '回复'
})
const replyUser = (uid: Number, username: String) => {
  console.log('replyUser', uid, username)
}
const handleSubmit = (data: string) => {
  console.log('handleSubmit', data)
}

const cursor = ref(0)
const count = ref(3)
const comment_id = ref('')
// 实现展开评论
const isOpenExpand = ref(props.is_folded)
const noMore = ref(false)
//子评论列表
const replyCommentList = ref<IComments[]>([])
//获取回复评论列表
const getReplyCommentList = async () => {
  try {
    // console.log('getReplyCommentList', comment_id.value)
    const res = await apis.getCommentReply(
      props.aweme_id,
      comment_id.value,
      cursor.value,
      count.value
    )
    cursor.value = res.cursor
    count.value = 10
    noMore.value = Boolean(res.has_more)
    replyCommentList.value.push(...res.comments)
  } catch (error) {
    console.log(error)
  }
}

const onExpand = (commentId: string) => {
  console.log(commentId)
  comment_id.value = commentId
  // console.log('onExpand')
  isOpenExpand.value = true
  getReplyCommentList()
}

const onExpandMore = (commentId: string) => {
  // console.log('onExpandMore', commentId)
  comment_id.value = commentId
  isOpenExpand.value = true
  getReplyCommentList()
}

const onCollapse = () => {
  isOpenExpand.value = false
  cursor.value = 0
  count.value = 3
  replyCommentList.value = []
  console.log('onCollapse')
}
</script>
<template>
  <div class="comment-item">
    <dy-avatar
      :userLink="`/user/${props.user.sec_uid}`"
      :src="props.user.avatar_thumb.url_list[0]"
      size="small"
      class="comment-item-avatar"
    />
    <div class="comment-item-content">
      <div class="comment-item-index" :class="{ oninput: isOpenInput }">
        <div class="comment-item-info-wrap">
          <div class="comment-item-content-header-name">
            <a
              :href="`/user/${props.user.sec_uid}`"
              class="header-name-link"
              target="_blank"
            >
              <span class="header-name-text">{{ props.user.nickname }}</span>
            </a>
            <comment-item-tag
              v-if="props.label_text"
              :tag="props.label_text"
              style="background: rgb(254, 44, 85)"
            />
            <template v-if="props.reply_to_userid">
              <div
                class="comment-item-reply-line"
                style="
                  border-top-width: 4px;
                  border-bottom-width: 4px;
                  border-left-width: 5px;
                  border-left-color: rgba(255, 255, 255, 0.6);
                "
              ></div>
              <a
                :href="`/user/${props.reply_to_user_sec_id}`"
                class="header-name-link"
                target="_blank"
                :uid="props.reply_to_userid"
              >
                <span class="header-name-text">{{
                  props.reply_to_username
                }}</span>
              </a>
            </template>
          </div>
          <div class="comment-item-content-header-more">
            <div class="header-more-text">...</div>
            <div class="video-report">
              <div class="video-report-text">举报</div>
            </div>
          </div>
        </div>
        <div class="comment-item-content-text">
          <span class="comment-item-content-text-text">
            <span
              v-html="handleCommentParser(props.text ?? '', props.text_extra)"
            >
            </span>
            <div class="comment-img-list" v-if="props.image_list">
              <div class="img-box" v-for="(item, index) in props.image_list" :key="item.medium_url.uri">
                <div class="img-inner">
                  <img
                    :src="
                      item.medium_url.url_list[1] ??
                      item.medium_url.url_list[0] ??
                      item.origin_url.url_list[2]
                    "
                    alt="comment_img"
                    @click="openPreview(index)"
                  />
                </div>
              </div>
            </div>
            <div class="comment-sticker comment-img-list" v-if="props.sticker">
              <div class="img-box">
                <div class="img-inner">
                  <img
                    :src="props.sticker.animate_url.url_list[0]"
                    alt="comment_sticker"
                    @click="openPreview(props.image_list?.length ?? 0)"
                  />
                </div>
              </div>
            </div>
            <div class="comment-author-digged" v-if="props.is_author_digged">
              <span>作者赞过</span>
            </div>
          </span>
        </div>
        <div class="comment-item-content-time">
          <span class="comment-item-content-time-text">
            {{ formatTime(props.create_time ?? '') }}
            ·
            {{ props.ip_label }}
          </span>
        </div>
        <div class="comment-item-content-footer">
          <div class="comment-footer-content">
            <div class="comment-item-content-footer-like">
              <p class="like">
                <svg-icon icon="small-like" class="icon" />
                <span>{{ useCount(props.digg_count ?? 0) }}</span>
              </p>
              <p class="dislike">
                <svg-icon icon="small-dislike" class="icon" />
              </p>
            </div>
            <div class="comment-item-content-footer-share">
              <div class="footer-share-content">
                <svg-icon icon="small-share" class="icon" />
                <span>分享</span>
              </div>
            </div>

            <div
              class="comment-item-content-footer-reply"
              @click="isOpenInput = !isOpenInput"
            >
              <div class="footer-reply-content">
                <svg-icon icon="small-reply" class="icon" />
                <span>{{ replyText }}</span>
              </div>
            </div>
          </div>
          <div class="reply-input" v-if="isOpenInput">
            <dy-input @update:value="comment = $event" @submit="handleSubmit" />
          </div>
        </div>
      </div>

      <div class="comment-item-reply" v-if="isOpenExpand">
        <comment-item
          v-for="it in replyCommentList"
          :key="it.cid"
          v-bind="it"
          :author_id="props.author_id"
        />
      </div>
      <comment-expand
        v-if="props.reply_comment_total"
        :comment-count="useCount(props.reply_comment_total ?? 0)"
        :isExpanded="isOpenExpand"
        :noMore
        @onExpand="() => onExpand(props.cid)"
        @onExpandMore="() => onExpandMore(props.cid)"
        @onCollapse="onCollapse"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  margin-top: 9px;
  position: relative;

  &:hover {
    .comment-item-content-header-more {
      opacity: 1 !important;
    }
  }

  .comment-item-avatar {
    margin-right: 8px;
    cursor: pointer;
    // margin-right: 12px;
    z-index: 1;

    .comment-item-avatar-link {
      position: relative;

      .avatar-container {
        height: 32px;
        margin-top: 4px;
        width: 32px;

        border: 1px solid rgba(255, 255, 255, 0.04) !important;
        border-radius: 50%;
        box-sizing: content-box;
        flex-grow: 0;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;

        .img {
          border-radius: 50%;
          height: 100%;
          position: relative;
          width: 100%;
        }
      }
    }
  }

  .comment-item-content {
    flex-grow: 1;
    width: 0;

    .comment-item-index {
      padding: 4px 0;
      position: relative;

      &.oninput {
        background: var(--input-linear);
      }

      .comment-item-info-wrap {
        align-items: center;
        display: flex;
        margin-bottom: 4px;

        .comment-item-content-header-name {
          align-items: center;
          display: flex;
          flex: 1 1;
          margin-right: 12px;
          overflow: hidden;
          position: relative;

          .header-name-link {
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--color-text-t3);
            margin-right: 8px;
            line-height: 20px;
            overflow: hidden;

            .header-name-text {
              color: var(--color-text-t1);
              font-size: 13px;
              font-weight: 400;
              line-height: 20px;
            }
          }

          .comment-item-reply-line {
            border: 8px solid transparent;
            border-left: 10px solid #000;
            border-right: none;
            display: inline-block;
            height: 0;
            vertical-align: middle;
            width: 0;

            margin: 0 8px;
          }
        }

        .comment-item-content-header-more {
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          display: inline;
          position: relative;
          width: 14px;
          opacity: 0;

          .header-more-text {
            color: var(--color-text-t4);
            border-radius: 8px;
            font-size: 16px;
          }

          &:hover {
            .video-report {
              display: flex;
            }
          }

          .video-report {
            background: var(--color-bg-b1);
            width: 95px;
            color: var(--color-text-t1);
            height: 38px;
            cursor: pointer;
            z-index: 1000;
            border-radius: 12px;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            display: none;
            position: absolute;
            top: 22px;
            left: -80px;
            box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
            padding: 8px;

            position: absolute;
            inset: 0px auto auto 0px;
            transform: translate3d(-82.6667px, 20.6667px, 0px);

            .video-report-text {
              color: var(--color-text-t1);
              white-space: nowrap;
              padding: 4px 8px;
              font-size: 14px;
              font-weight: 400;
              line-height: 22px;
            }
          }
        }
      }

      .comment-item-content-text {
        position: relative;
        text-align: justify;
        word-break: break-all;

        .comment-item-content-text-text {
          margin-top: 8px;
          font-size: 13px;
          color: var(--color-text-t1);
          font-weight: 400;
          line-height: 22px;
        }

        :deep(.emoji-img) {
          width: 16px;
          height: 16px;
          vertical-align: text-bottom;
          margin: 0 4px;
          position: relative;
          top: -2px;
        }

        :deep(.header-name-link) {
          margin-left: 2px;
          margin-right: 2px;

          &:hover {
            text-decoration: underline;
          }
        }

        .comment-img-list {
          display: flex;

          .img-box {
            min-width: 90px;
            max-width: 213px;
            object-fit: cover;
            height: 120px;

            .img-inner {
              position: relative;

              img {
                min-width: 90px;
                max-width: 213px;
                object-fit: cover;
                height: 120px;
                cursor: zoom-in;
                justify-content: flex-start;
                border-radius: 8px;
              }
            }
          }
        }

        .comment-author-digged {
          justify-content: center;
          align-items: center;
          padding: 0 4px;
          font-size: 10px;
          font-weight: 500;
          line-height: 16px;
          display: inline-flex;
          margin-right: 0;
          vertical-align: middle;
          background: rgba(226, 227, 236, 0.7);
          color: rgba(22, 24, 35, 0.6);
          height: 16px;
          border-radius: 4px;
        }
      }

      .comment-item-content-time {
        color: var(--color-text-t3);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        position: relative;

        .comment-item-content-time-text {
          margin-right: 8px;
          // &::after {
          //   content: '';
          //   position: absolute;
          //   top: 50%;
          //   width: 2px;
          //   height: 2px;
          //   border-radius: 50%;
          //   margin: 0 3px;
          //   background-color: rgba(255, 255, 255, 0.5);
          // }
        }
      }

      .comment-item-content-footer {
        position: relative;

        .comment-footer-content {
          flex-direction: row-reverse;
          justify-content: flex-end;

          align-items: center;
          color: var(--color-text-t3);
          display: flex;
          font-size: 12px;
          font-weight: 500;
          height: 20px;
          line-height: 20px;
          margin-top: 11px;
        }

        .comment-item-content-footer-like {
          display: flex;
          margin-left: 10px;

          .like {
            span {
              font-size: 12px;
              margin-top: 1px;
            }
          }

          .dislike {
            margin-right: 2px;
          }

          .like,
          .dislike {
            align-items: center;
            cursor: pointer;
            display: flex;
            justify-content: center;
            margin-right: 10px;
          }
        }

        .comment-item-content-footer-reply,
        .comment-item-content-footer-share {
          position: relative;

          .footer-reply-content,
          .footer-share-content {
            align-items: center;
            cursor: pointer;
            display: flex;
            // margin-left: 0;

            span {
              font-size: 12px;
            }
          }
        }

        .footer-share-content {
          margin-left: 10px;
        }

        .icon {
          width: 20px;
          height: 20px;
          color: var(--color-text-t3);
          opacity: 0.9;
        }

        .reply-input {
          margin-top: 17px;
          margin-bottom: 12px;
        }
      }
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .header-name-text {
    font-size: calc(0.535714vw + 4.28571px) !important;
  }
  .comment-item-content-text-text {
    font-size: calc(0.803571vw + 1.42857px) !important;
    line-height: calc(0.892857vw + 9.14286px) !important;
  }
  .comment-item-content-time {
    padding-top: calc(0.714286vw - 10.2857px) !important;
    font-size: calc(0.535714vw + 4.28571px) !important;
  }
  .comment-footer-content {
    span {
      font-size: calc(0.535714vw + 4.28571px) !important;
    }
    .icon {
      width: calc(0.357143vw + 14.8571px) !important;
      height: calc(0.357143vw + 14.8571px) !important;
    }
  }

  .comment-expand .comment-expand-btn,
  .comment-expand .comment-content-collapse {
    font-size: calc(0.535714vw + 4.28571px) !important;
  }
}
@media screen and (min-width: 2560px) {
  .header-name-text {
    font-size: 18px !important;
  }
  .comment-item-content-text-text {
    font-size: 22px !important;
    line-height: 32px !important;
  }
  .comment-item-content-time {
    padding-top: 8px !important;
    font-size: 18px !important;
  }
  .comment-footer-content {
    span {
      font-size: 18px !important;
    }
    .icon {
      width: 24px !important;
      height: 24px !important;
    }
  }
  .comment-expand .comment-expand-btn,
  .comment-expand .comment-content-collapse * {
    font-size: 18px !important;
  }
}
</style>
