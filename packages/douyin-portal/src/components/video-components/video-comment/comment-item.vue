<script setup lang="ts">
import apis from '@/api/apis'
import type { IComments } from '@/api/tyeps/request_response/commentListRes'
import DyInput from '@/components/common/dy-input/index.vue'
import commentExpand from './comment-expand.vue'
import SharePanel from '../video-action/share-panel.vue'
import { useCount } from '@/hooks'
import { handleCommentParser } from '@/utils/commentParser'
import formatTime from '@/utils/date-format'
import { computed, inject, ref, watchEffect, watch, provide, onMounted, onUnmounted, nextTick, type Ref } from 'vue'

const props = defineProps<IComments & { author_id: string | number; isSubComment?: boolean }>()

// 注入图片预览方法
const imagePreview = inject<{ openPreview: (cid: string, index: number) => void }>('imagePreview', { openPreview: () => {} })

// 注入设置回复用户方法
const setReplyTo = inject<(uid: number | string, username: string, comment?: string, cid?: string, parentCid?: string, sec_uid?: string) => void>('setReplyTo', () => {})

// 注入是否显示内联输入框的配置（默认不显示，只在 video/note 页面显示）
const showInlineInput = inject<boolean>('showInlineInput', false)

// 注入新回复数据
const replyToAdd = inject<Ref<{ parentCid: string; reply: IComments } | null>>('replyToAdd', ref(null))

// 注入提交评论方法
const submitCommentToParent = inject<(data: { text: string; images: File[]; replyTo: any }) => void>('submitComment', () => {})

// 注入取消回复的cid
const cancelReplyCid = inject<Ref<string>>('cancelReplyCid')

// 注入当前回复状态
const currentReplyTo = inject<Ref<{ cid?: string } | null>>('currentReplyTo')

const openPreview = (index: number) => {
  imagePreview.openPreview(props.cid, index)
}

// 响应式时间显示，自动更新
const timeKey = ref(0)
let timeUpdateTimer: ReturnType<typeof setInterval> | null = null

const displayTime = computed(() => {
  // timeKey 用于触发重新计算
  timeKey.value
  return formatTime(props.create_time ?? '')
})

onMounted(() => {
  // 每30秒更新一次时间显示
  timeUpdateTimer = setInterval(() => {
    timeKey.value++
  }, 30000)
})

onUnmounted(() => {
  if (timeUpdateTimer) {
    clearInterval(timeUpdateTimer)
    timeUpdateTimer = null
  }
})

//回复用户
//输入框的值
const comment = ref('')
watchEffect(() => {
  // console.log('textValue', comment.value)
})
const isOpenInput = ref(false)
const isReplying = computed(() => {
  return currentReplyTo?.value?.cid === props.cid && currentReplyTo?.value !== null
})
const replyText = computed(() => {
  return isReplying.value ? '回复中' : '回复'
})

// 监听取消回复
watch(() => cancelReplyCid?.value, (newCid) => {
  if (newCid && newCid === props.cid) {
    isOpenInput.value = false
  }
})

// 判断当前评论是否是子评论
const isSubCommentFlag = computed(() => props.isSubComment || !!props.reply_to_userid)

// 获取父评论的 cid（如果是子评论，需要从外部传入）
const parentCommentCid = inject<string>('parentCommentCid', '')

const replyUser = (uid: string, username: string, comment?: string, sec_uid?: string) => {
  // 调用父组件的回复方法（设置底部输入框的回复状态）
  // 如果是子评论，传递 parentCid（一级评论的 cid）
  const parentCid = props.isSubComment ? parentCommentCid : undefined
  setReplyTo(uid, username, comment, props.cid, parentCid, sec_uid)
  // 只有在允许显示内联输入框时才展开
  if (showInlineInput) {
    isOpenInput.value = !isOpenInput.value
  }
}
const handleSubmit = (data: { text: string; images: File[]; replyTo: any }) => {
  // 构造完整的回复信息
  const replyData = {
    ...data,
    replyTo: {
      uid: props.user.uid,
      username: props.user.nickname,
      comment: props.text,
      cid: props.cid,
      parentCid: props.isSubComment ? parentCommentCid : undefined,
      sec_uid: props.user.sec_uid
    }
  }
  // 调用父组件的提交方法
  submitCommentToParent(replyData)
  isOpenInput.value = false
}

const cursor = ref(0)
const count = ref(3)
const comment_id = ref('')
// 实现展开评论
const isOpenExpand = ref(props.is_folded)
const noMore = ref(false)
//子评论列表
const replyCommentList = ref<IComments[]>([])

// 监听新回复，添加到子评论列表（只有一级评论需要监听）
watch(() => replyToAdd?.value, (newReply) => {
  if (!props.isSubComment && newReply && newReply.parentCid === props.cid) {
    // 如果是回复当前评论，添加到子评论列表第一位
    replyCommentList.value.unshift(newReply.reply)
    // 自动展开子评论
    isOpenExpand.value = true
  }
}, { deep: true })

// 提供当前评论的 cid 给子评论使用（只有一级评论需要提供）
if (!props.isSubComment) {
  provide('parentCommentCid', props.cid)
}

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

// 分享面板相关
const showSharePanel = ref(false)
const shareBtnRef = ref<HTMLElement | null>(null)
const panelPosition = ref<'bottom' | 'top'>('bottom')

// 计算面板垂直方向位置
const calculatePanelPosition = () => {
  const btn = shareBtnRef.value
  if (!btn) return
  
  const btnRect = btn.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const panelHeight = 360 // 面板大约高度
  
  // 检查下方空间是否足够
  const bottomSpace = viewportHeight - btnRect.bottom
  
  if (bottomSpace < panelHeight + 20) {
    panelPosition.value = 'top'
  } else {
    panelPosition.value = 'bottom'
  }
}

// 生成评论分享链接
const getCommentShareUrl = () => {
  const baseUrl = window.location.origin
  // 构建评论分享链接，包含视频ID和评论ID
  return `${baseUrl}/video/${props.aweme_id}?comment_id=${props.cid}`
}

// 生成评论分享标题
const getCommentShareTitle = () => {
  const nickname = props.user?.nickname || '用户'
  const text = props.text || ''
  // 截取评论前30个字符作为标题
  const shortText = text.length > 30 ? text.slice(0, 30) + '...' : text
  return `${nickname}的评论: ${shortText}`
}

// 打开分享面板
const openSharePanel = (event: Event) => {
  event.stopPropagation()
  showSharePanel.value = !showSharePanel.value
  if (showSharePanel.value) {
    nextTick(() => {
      calculatePanelPosition()
    })
  }
}

// 关闭分享面板
const closeSharePanel = () => {
  showSharePanel.value = false
}

// 处理分享给用户
const handleShareToUser = (userId: string) => {
  console.log('分享评论给用户:', userId, '评论ID:', props.cid)
  closeSharePanel()
}

// 处理复制链接
const handleCopyLink = () => {
  console.log('复制评论链接:', getCommentShareUrl())
  closeSharePanel()
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
      <div class="comment-item-index" :class="{ oninput: isOpenInput, replying: isReplying }">
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
            {{ displayTime }}
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
              <div 
                ref="shareBtnRef"
                class="footer-share-content" 
                :class="{ active: showSharePanel }" 
                @click="openSharePanel"
              >
                <svg-icon icon="small-share" class="icon" />
                <span>分享</span>
              </div>
              <!-- 分享面板 -->
              <div 
                v-if="showSharePanel"
                class="share-panel-wrapper" 
                :class="[`position-${panelPosition}`]"
                @click.stop
              >
                <div class="share-panel-overlay" @click="closeSharePanel"></div>
                <SharePanel
                  :show-bottom-actions="false"
                  :share-url="getCommentShareUrl()"
                  :share-title="getCommentShareTitle()"
                  @share="handleShareToUser"
                  @copy-link="handleCopyLink"
                />
              </div>
            </div>

            <div
              class="comment-item-content-footer-reply"
              @click="replyUser(props.user.uid, props.user.nickname, props.text, props.user.sec_uid)"
            >
              <div class="footer-reply-content" :class="{ active: isReplying }">
                <svg-icon icon="small-reply" class="icon" />
                <span>{{ replyText }}</span>
              </div>
            </div>
          </div>
          <div class="reply-input" v-if="showInlineInput && isOpenInput">
            <dy-input 
              :reply-to="{ uid: props.user.uid, username: props.user.nickname, comment: props.text }"
              @update:value="comment = $event" 
              @submit="handleSubmit"
              @cancel-reply="isOpenInput = false"
            />
          </div>
        </div>
      </div>

      <div class="comment-item-reply" v-if="!props.isSubComment && isOpenExpand">
        <comment-item
          v-for="it in replyCommentList"
          :key="it.cid"
          v-bind="it"
          :author_id="props.author_id"
          :is-sub-comment="true"
        />
      </div>
      <comment-expand
        v-if="!props.isSubComment && props.reply_comment_total"
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

      &.replying {
        background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.06) 18.23%, rgba(255, 255, 255, 0.06) 51.56%, rgba(255, 255, 255, 0.06) 82.29%, rgba(255, 255, 255, 0) 100%);
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

            &:hover {
              color: var(--color-text-t1);

              .icon {
                color: var(--color-text-t1);
              }
            }
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

            span {
              font-size: 12px;
            }

            &:hover,
            &.active {
              color: var(--color-text-t1);

              .icon {
                color: var(--color-text-t1);
              }
            }
          }

        }

        .footer-share-content {
          margin-left: 10px;
        }

        .comment-item-content-footer-share {
          position: static;
        }

        .share-panel-wrapper {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 1001;
          display: flex;
          justify-content: center;

          &.position-bottom {
            top: 100%;
            margin-top: 8px;
          }

          &.position-top {
            bottom: 100%;
            margin-bottom: 8px;
          }

          .share-panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
          }
   
          :deep(.share-panel) {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            max-height: 360px;
            min-height: 200px;
          }
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

<style lang="scss">
// 全局样式 - Teleport 到 body 的分享面板
.comment-share-panel-wrapper {
  position: fixed;
  z-index: 10001;

  .share-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  .share-panel {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    max-height: 360px;
    min-height: 200px;
  }
}
</style>
