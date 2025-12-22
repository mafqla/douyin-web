<script setup lang="ts">
import apis from '@/api/apis'
import type { IComments } from '@/api/tyeps/request_response/commentListRes'
import DyAvatar from '@/components/common/dy-avatar.vue'
import DyInput from '@/components/common/dy-input/index.vue'
import Loading from '@/components/common/loading.vue'
import SearchSuggestion from '@/components/common/search-suggestion.vue'
import ImagePreview from '@/components/common/image-preview/index.vue'
import { userStore } from '@/stores/user'

const props = defineProps({
  aweme_id: String,
  author_id: String,
  relatedText: String
})

// 回复用户信息
const replyTo = ref<{ 
  uid: number | string; 
  username: string; 
  comment?: string;
  cid?: string;
  parentCid?: string;
  sec_uid?: string;
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
provide('showInlineInput', true)

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

// 当前用户头像
const currentUserAvatar = computed(() => {
  const user = getCurrentUser()
  return user.avatar_thumb?.url_list?.[0] || 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/default_avatar.jpeg'
})

// 当前用户主页链接
const currentUserLink = computed(() => {
  const user = getCurrentUser()
  return user.sec_uid ? `/user/${user.sec_uid}` : ''
})

// 将图片文件转换为图片列表格式
const convertImagesToImageList = (images: File[]): any[] | undefined => {
  if (!images || images.length === 0) return undefined
  
  return images.map(file => {
    const url = URL.createObjectURL(file)
    return {
      origin_url: { url_list: [url], uri: '', width: 0, height: 0 },
      medium_url: { url_list: [url], uri: '', width: 0, height: 0 },
      crop_url: { url_list: [url], uri: '', width: 0, height: 0 },
      thumb_url: { url_list: [url], uri: '', width: 0, height: 0 },
      download_url: { url_list: [url], uri: '', width: 0, height: 0 }
    }
  })
}

// 提交评论
const submitComment = (data: { text: string; images: File[]; replyTo: any }) => {
  if (!data.text.trim() && (!data.images || data.images.length === 0)) return

  const currentUser = getCurrentUser()
  const isReply = !!data.replyTo
  
  const newComment: IComments = {
    cid: generateCid(),
    text: data.text,
    aweme_id: props.aweme_id ?? '',
    create_time: Math.floor(Date.now() / 1000),
    digg_count: 0,
    status: 1,
    user: currentUser as any,
    reply_id: isReply ? (data.replyTo?.parentCid || data.replyTo?.cid || '0') : '0',
    user_digged: 0,
    reply_comment: null,
    text_extra: [],
    reply_comment_total: 0,
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
    commentList.value.unshift(newComment)
  } else {
    const parentCid = data.replyTo?.parentCid || data.replyTo?.cid
    const parentComment = commentList.value.find(c => c.cid === parentCid)
    if (parentComment) {
      parentComment.reply_comment_total = (parentComment.reply_comment_total || 0) + 1
    }
    replyToAdd.value = { parentCid, reply: newComment }
  }

  replyTo.value = null
}

// 用于传递新回复给子组件
const replyToAdd = ref<{ parentCid: string; reply: IComments } | null>(null)
provide('replyToAdd', replyToAdd)

// 提供提交评论方法给子组件（用于内联输入框）
provide('submitComment', submitComment)

// 图片预览相关
const isOpenPreview = ref(false)
const previewIndex = ref(0)

const allImages = computed(() => {
  const images: { url: string; alt?: string; cid: string }[] = []
  commentList.value.forEach((comment) => {
    if (comment.image_list) {
      comment.image_list.forEach((item) => {
        const url = item.origin_url?.url_list?.[1] ?? item.origin_url?.url_list?.[0] ?? item.medium_url?.url_list?.[2]
        if (url) images.push({ url, alt: 'comment_img', cid: comment.cid })
      })
    }
    if (comment.sticker?.animate_url?.url_list?.[0]) {
      images.push({ url: comment.sticker.animate_url.url_list[0], alt: 'sticker', cid: comment.cid })
    }
  })
  return images
})

const openPreview = (cid: string, indexInComment: number) => {
  const startIndex = allImages.value.findIndex((img) => img.cid === cid)
  if (startIndex !== -1) {
    previewIndex.value = startIndex + indexInComment
    isOpenPreview.value = true
  }
}

provide('imagePreview', { openPreview })

const commentList = ref<IComments[]>([])
const isLoadingMore = ref(true)
const hasMore = ref(true)
const cursor = ref(0)
const count = ref(5)
const getCommentList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getCommentList(
      props.aweme_id ?? '',
      cursor.value,
      count.value
    )
    cursor.value = res.cursor
    count.value = 20
    commentList.value.push(...res.comments)
    if (!isLoadingMore.value) {
      hasMore.value = Boolean(res.has_more)
    }
    isLoadingMore.value = false
  } catch (error) {
    console.log(error)
  }
}
const containerRef = ref(null)
onMounted(() => {
  getCommentList()
})

useInfiniteScroll(
  window,
  () => {
    getCommentList()
  },
  { distance: 100 }
)
</script>
<template>
  <div class="related-comment">
    <div class="related-comment-content">
      <div class="related-comment-header">
        <div class="related-comment-header-title">
          <span class="comment-title">全部评论</span>
          <div class="comment-title-line">
            <div class="comment-title-line-inner"></div>
          </div>
        </div>

        <div class="search-input-content">
          <dy-avatar
            :userLink="currentUserLink"
            :src="currentUserAvatar"
            size="small"
          />
          <dy-input 
            :group-id="props.aweme_id"
            @submit="submitComment"
          />
        </div>

        <div class="search-trend-container" v-if="relatedText != ''">
          <div class="trend-header">
            <span class="trend-title">大家都在搜：</span>
            <search-suggestion :relatedText />
          </div>
        </div>
      </div>
      <div class="comment-list" ref="containerRef">
        <template v-for="it in commentList" :key="it.cid">
          <comment-item v-bind="it" :author_id="props.author_id" />
        </template>

        <Loading
          :show="isLoadingMore"
          :isShowText="true"
          text="评论加载中..."
        />
        <list-footer v-if="!hasMore" />
      </div>
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
.related-comment {
  width: 100%;
  margin-top: 16px;
}

.related-comment-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.related-comment-header {
  margin-bottom: 7.5px;

  .related-comment-header-title {
    color: var(--color-text-t4);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    position: relative;

    .comment-title {
      background-color: var(--color-bg-b0);
      z-index: 2;
      padding-right: 8px;
      font-size: 16px;
      line-height: 24px;
      display: inline-block;
      position: relative;
    }

    .comment-title-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;

      .comment-title-line-inner {
        width: 100%;
        height: 1px;
        min-height: 1px;
        // background-color: rgba(22, 24, 35, 0.06);
        background-color: var(--color-line-l3);
        display: block;
        position: relative;
      }
    }
  }

  // 搜索输入框样式

  .search-input-content {
    margin-top: 16px;
    padding-bottom: 24.5px;
    display: flex;
  }

  // 搜索趋势模块样式
  .search-trend-container {
    padding-bottom: 2px;

    .trend-header {
      -webkit-app-region: no-drag;
      color: var(--color-text-t4);
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      flex: 1;
      margin-right: 20px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      display: flex;
      overflow: hidden;

      .trend-title {
        flex-shrink: 0;
      }
    }
  }
}
</style>
