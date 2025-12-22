<script setup lang="ts">
import apis from '@/api/apis'
import type { IComments } from '@/api/tyeps/request_response/commentListRes'
import dyInput from '@/components/common/dy-input/index.vue'
import ImagePreview from '@/components/common/image-preview/index.vue'
import { vInfiniteScroll } from '@vueuse/components'
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import { userStore } from '@/stores/user'
import CommentItem from './comment-item.vue'

const route = useRoute()

const commentCount = ref(0)
const textarea = ref('')
const loading = ref(false)
const props = defineProps({
  id: String,
  author_id: Number,
  relatedText: String,
  // 是否显示内联输入框，默认 false，只在 video/note 页面手动设置为 true
  showInlineInput: {
    type: Boolean,
    default: false
  }
})

// 回复用户信息
const replyTo = ref<{ 
  uid: number | string; 
  username: string; 
  comment?: string;
  cid?: string;  // 被回复评论的cid
  parentCid?: string;  // 父评论的cid（如果是回复子评论）
  sec_uid?: string;  // 被回复用户的sec_uid
} | null>(null)

// 设置回复用户
const setReplyTo = (uid: number | string, username: string, comment?: string, cid?: string, parentCid?: string, sec_uid?: string) => {
  replyTo.value = { uid, username, comment, cid, parentCid, sec_uid }
}

// 取消回复
const cancelReply = () => {
  replyTo.value = null
}

// 提供给子组件
provide('setReplyTo', setReplyTo)
// 提供是否显示内联输入框的配置
provide('showInlineInput', props.showInlineInput)

// 生成唯一ID
const generateCid = () => {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 获取当前用户信息
const getCurrentUser = () => {
  const store = userStore()
  const user = store.userInfo?.user
  if (user) {
    return user
  }
  // 如果没有登录，返回默认用户信息
  return {
    uid: 'guest_user',
    sec_uid: '',
    nickname: '游客',
    avatar_thumb: {
      url_list: ['https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/default_avatar.jpeg'],
      uri: '',
      width: 100,
      height: 100
    },
    signature: '',
    unique_id: '',
    short_id: ''
  }
}

// 将图片文件转换为图片列表格式
const convertImagesToImageList = (images: File[]) => {
  if (!images || images.length === 0) return undefined
  
  return images.map(file => {
    const url = URL.createObjectURL(file)
    return {
      origin_url: {
        url_list: [url],
        uri: '',
        width: 0,
        height: 0
      },
      medium_url: {
        url_list: [url],
        uri: '',
        width: 0,
        height: 0
      }
    }
  })
}

const list = ref([]) as any
async function submitComment(data: { text: string; images: File[]; replyTo: { uid: number | string; username: string; comment?: string; cid?: string; parentCid?: string; sec_uid?: string } | null }) {
  console.log('提交评论:', data)
  
  // 如果没有文字和图片，不提交
  if (!data.text.trim() && (!data.images || data.images.length === 0)) {
    return
  }

  loading.value = true
  
  // 构造新评论数据
  const currentUser = getCurrentUser()
  const isReply = !!data.replyTo
  
  const newComment: IComments = {
    cid: generateCid(),
    text: data.text,
    aweme_id: props.id ?? '',
    create_time: Math.floor(Date.now() / 1000),
    digg_count: 0,
    status: 1,
    user: currentUser as any,
    reply_id: isReply ? (data.replyTo?.parentCid || data.replyTo?.cid || '0') : '0',
    user_digged: 0,
    reply_comment: null,
    text_extra: [],
    reply_comment_total: 0,
    // 只有回复子评论时才设置 reply_to 相关字段（显示 "用户名 ▸ 被回复用户名"）
    // 回复一级评论时不设置（只显示评论者用户名）
    reply_to_reply_id: data.replyTo?.parentCid ? data.replyTo.cid : '0',
    reply_to_username: data.replyTo?.parentCid ? data.replyTo?.username : undefined,
    reply_to_userid: data.replyTo?.parentCid ? String(data.replyTo?.uid) : undefined,
    reply_to_user_sec_id: data.replyTo?.parentCid ? data.replyTo?.sec_uid : undefined,
    is_author_digged: false,
    user_buried: false,
    is_hot: false,
    image_list: convertImagesToImageList(data.images),
    ip_label: '本地',
    can_share: true,
    is_folded: false
  }

  if (!isReply) {
    // 直接评论：添加到列表第一个位置
    commentList.value.unshift(newComment)
  } else {
    // 回复评论：通过事件通知 comment-item 添加到子评论列表
    const parentCid = data.replyTo?.parentCid || data.replyTo?.cid
    addReplyToComment(parentCid!, newComment)
  }
  
  // 更新总数
  total.value += 1
  
  // 清除回复状态
  replyTo.value = null
  loading.value = false
  
  // TODO: 调用接口发送评论
}

// 添加回复到对应的评论
const addReplyToComment = (parentCid: string, reply: IComments) => {
  // 查找父评论并添加回复
  const parentComment = commentList.value.find(c => c.cid === parentCid)
  if (parentComment) {
    // 增加回复计数
    parentComment.reply_comment_total = (parentComment.reply_comment_total || 0) + 1
  }
  // 通知子组件添加回复
  replyToAdd.value = { parentCid, reply }
}

// 用于传递新回复给子组件
const replyToAdd = ref<{ parentCid: string; reply: IComments } | null>(null)

// 提供给子组件
provide('replyToAdd', replyToAdd)
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

// 图片预览相关
const isOpenPreview = ref(false)
const previewIndex = ref(0)

// 收集所有评论的图片
const allImages = computed(() => {
  const images: { url: string; alt?: string; cid: string }[] = []
  const collectImages = (comments: IComments[]) => {
    comments.forEach((comment) => {
      if (comment.image_list) {
        comment.image_list.forEach((item) => {
          const url =
            item.origin_url?.url_list?.[1] ??
            item.origin_url?.url_list?.[0] ??
            item.medium_url?.url_list?.[2]
          if (url) images.push({ url, alt: 'comment_img', cid: comment.cid })
        })
      }
      if (comment.sticker?.animate_url?.url_list?.[0]) {
        images.push({
          url: comment.sticker.animate_url.url_list[0],
          alt: 'sticker',
          cid: comment.cid
        })
      }
    })
  }
  collectImages(commentList.value)
  return images
})

const openPreview = (cid: string, indexInComment: number) => {
  // 找到该评论第一张图片在 allImages 中的位置
  const startIndex = allImages.value.findIndex((img) => img.cid === cid)
  if (startIndex !== -1) {
    previewIndex.value = startIndex + indexInComment
    isOpenPreview.value = true
  }
}

provide('imagePreview', { openPreview })
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
      <dy-input 
        :reply-to="replyTo"
        :group-id="props.id"
        @submit="submitComment"
        @cancel-reply="cancelReply"
      />
    </div>

    <ImagePreview
      :open="isOpenPreview"
      :images="allImages"
      :initial-index="previewIndex"
      @close="isOpenPreview = false"
    />
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
