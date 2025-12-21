<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { attention } from '@/service/attention'
import { useCount } from '@/hooks/useCount'
import SwiperControlModal from '@/components/swiper/swiper-control-modal.vue'
import MoreActionBox from './more-action-box.vue'
import SharePanel from './share-panel.vue'
import type { IMusic } from '@/api/tyeps/common/music'
import type { IShareInfo } from '@/api/tyeps/common/aweme'
import type { BitRate } from '@/api/tyeps/common/video'

const props = defineProps({
  aweme_id: String,
  user_id: String,
  avatar: String,
  digg_count: Number,
  comment_count: Number,
  collect_count: Number,
  share_count: Number,
  user_digged: Number,
  collect_stat: Number,
  follow_status: Number,
  isShowAvatar: {
    type: Boolean,
    default: true
  },
  // 是否显示 swiper 控制按钮
  showSwiperControl: {
    type: Boolean,
    default: false
  },
  // 音乐信息
  music: {
    type: Object as () => IMusic | null,
    default: null
  },
  // 是否禁用缩放
  disableScale: {
    type: Boolean,
    default: false
  },
  // 分享信息
  shareInfo: {
    type: Object as () => IShareInfo | null,
    default: null
  },
  // 视频比特率信息（用于下载）
  bitRates: {
    type: Array as () => BitRate[],
    default: () => []
  },
  // 视频描述（用于下载文件名）
  videoDesc: {
    type: String,
    default: ''
  }
})

const digg_count = ref(props.digg_count)
const liked = ref(props.user_digged)
// const addDianzan = async () => {
//   try {
//     await applaud(props.id as number)
//     liked.value = !liked.value
//     if (liked.value) {
//       dianzan.value++
//     } else {
//       dianzan.value--
//     }
//   } catch (e) {
//     console.log(e)
//   }
// }
// watchEffect(() => {
//   console.log(liked.value, dianzan.value)
// })
const collect_count = ref(props.collect_count) as any
const isCollect = ref(props.collect_stat) as any

// console.log(isCollect.value)
// const addShoucang = async () => {
//   try {
//     await collection({ video_id: props.id as number })
//     isCollect.value = !isCollect.value
//     if (isCollect.value) {
//       collect_count.value++
//     } else {
//       collect_count.value--
//     }
//   } catch (e) { }
// }

//默认456，如果是关注，就是520
const width = ref(456)
const maXWidth = ref('unset')
//是否关注
const isAttent = ref(props.follow_status)

// console.log(isAttention.value)
//关注
const handleAttention = async () => {
  //调用接口
  try {
    // await attention(props.user_id)
    // if (isAttent.value === 1 || isAttent.value === 3) {
    //   isAttent.value = 2
    // } else {
    //   isAttent.value = 1
    // }
  } catch (e) {
    console.log(e)
  }
}

watchEffect(() => {
  // console.log(isAttent.value)
  if (isAttent.value === 1 || isAttent.value === 3) {
    width.value = 520
    maXWidth.value = 'unset'
  } else {
    width.value = 456
    maXWidth.value = 'unset'
  }
})

//是否显示like-box
const showLikeBox = ref(false)
//是否显示comment-box
const showCommentBox = ref(false)
//是否显示collection-box
const showCollectionBox = ref(false)
//是否显示more-box
const showMoreBox = ref(false)
//是否显示share-box
const showShareBox = ref(false)
// 搜索框是否有焦点
const isSearchFocused = ref(false)
// 分享面板关闭延迟定时器
let shareBoxTimer: ReturnType<typeof setTimeout> | null = null

// 显示分享面板
const handleShareEnter = () => {
  if (shareBoxTimer) {
    clearTimeout(shareBoxTimer)
    shareBoxTimer = null
  }
  showShareBox.value = true
}

// 延迟关闭分享面板
const handleShareLeave = () => {
  // 如果搜索框有焦点，不关闭面板
  if (isSearchFocused.value) return

  shareBoxTimer = setTimeout(() => {
    showShareBox.value = false
  }, 150)
}

const handleSearchFocus = () => {
  isSearchFocused.value = true
  if (shareBoxTimer) {
    clearTimeout(shareBoxTimer)
    shareBoxTimer = null
  }
}

const handleSearchBlur = () => {
  isSearchFocused.value = false
}

//根据父容器宽高，计算scale的值
const scale = ref(1)
//监听父容器的宽高变化
const calculateScale = () => {
  const parentElement = document.querySelector('.video-action')?.parentElement
  if (parentElement) {
    const parentHeight = parentElement.clientHeight
    const desiredHeight = 850
    // console.log(parentHeight, desiredHeight)
    if (parentHeight > 0) {
      scale.value = parentHeight / desiredHeight
      // console.log(scale.value)
    }
  }
}

// 创建一个 ResizeObserver 实例来监听父元素尺寸变化
const resizeObserver = new ResizeObserver((entries) => {
  // 当父元素尺寸变化时，重新计算 scale
  calculateScale()
})

onMounted(() => {
  const parentElement = document.querySelector('.video-action')?.parentElement
  if (parentElement) {
    // 开始监听父元素尺寸变化
    resizeObserver.observe(parentElement)
  }
})

onUnmounted(() => {
  // 组件卸载时停止监听
  resizeObserver.disconnect()
})
</script>

<template>
  <div
    class="video-action"
    :style="{ transform: props.disableScale ? 'none' : `scale(${scale})`, transformOrigin: 'right bottom' }"
  >

    <div class="video-action-content">
      <slot />
      <!-- Swiper 控制按钮 -->
      <SwiperControlModal v-if="showSwiperControl" />

      <div class="video-action-item" v-if="isShowAvatar">
        <div class="avatar-content">
          <div class="video-action-avatar">
            <dy-avatar size="small" :src="props.avatar" />
          </div>
          <div class="video-action-avatar-follow" @click="handleAttention">
            <svg-icon class="icon" icon="avfollow" v-show="!isAttent" />
          </div>
        </div>
      </div>
      <div
        class="video-action-item"
        @mouseenter="showLikeBox = true"
        @mouseleave="showLikeBox = false"
      >
        <div class="like-box postion swiper" v-if="showLikeBox">
          <svg
            width="4"
            height="17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="like-box-icon postion"
            viewBox="0 0 4 17"
          >
            <path
              d="M0 0a8 8 0 002.168 5.476l1.174 1.25a2 2 0 010 2.738l-1.174 1.25A8 8 0 000 16.19V0z"
              fill="#323442"
            ></path>
          </svg>
          <div class="like-box-title">
            点赞<span class="like-box-text">Z</span>
          </div>
        </div>
        <svg-icon class="icon" :class="{ liked: liked }" icon="dianzan" />
        <span class="num">{{ useCount(digg_count ?? 0) }}</span>
      </div>
      <div
        class="video-action-item"
        @click="$emit('toggleComments')"
        @mouseenter="showCommentBox = true"
        @mouseleave="showCommentBox = false"
      >
        <div class="like-box postion swiper" v-if="showCommentBox">
          <svg
            width="4"
            height="17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="like-box-icon postion"
            viewBox="0 0 4 17"
          >
            <path
              d="M0 0a8 8 0 002.168 5.476l1.174 1.25a2 2 0 010 2.738l-1.174 1.25A8 8 0 000 16.19V0z"
              fill="#323442"
            ></path>
          </svg>
          <div class="like-box-title">
            评论<span class="like-box-text">X</span>
          </div>
        </div>
        <svg-icon class="icon" icon="comment" />
        <span class="num">{{ useCount(props.comment_count ?? 0) }}</span>
      </div>
      <div
        class="video-action-item"
        @mouseenter="showCollectionBox = true"
        @mouseleave="showCollectionBox = false"
      >
        <svg-icon
          class="icon-collect"
          icon="collection"
          :class="{ collect: isCollect }"
        />
        <span class="num">{{ useCount(collect_count) }}</span>

        <div class="collection-box" v-if="showCollectionBox">
          <div class="collection-box-content">
            <div class="collection-box-item">
              <div class="collection-box-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  class="box-icon-all collection-folder-icon"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 7a2 2 0 012-2h3.338a2 2 0 01.791.163l2.777 1.195a4 4 0 001.582.326H19a2 2 0 012 2V17a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    stroke="#fff"
                    stroke-opacity="0.75"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M7 14h9M7 10h2"
                    stroke="#fff"
                    stroke-opacity="0.8"
                    stroke-width="2"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </div>
              <p class="collection-box-title">收藏至收藏夹</p>
            </div>
            <div class="collection-box-item">
              <div class="collection-box-icon">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="box-icon-all video-collection"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.972 6.014l-.89 2.504-.012.032c-.04.112-.107.302-.196.482A3.259 3.259 0 018.487 10.8a4.344 4.344 0 01-.552.048l-2.74.126 2.284 1.91.025.02c.087.073.234.196.366.335.69.724 1.01 1.726.865 2.717-.027.19-.077.375-.106.484a6.606 6.606 0 00-.008.032l-.745 2.826 2.09-1.455.03-.02c.1-.07.27-.19.452-.286a3.26 3.26 0 013.047 0c.182.096.352.215.453.285l.029.02 2.09 1.456-.745-2.826a4.343 4.343 0 01-.114-.516 3.259 3.259 0 01.865-2.717 4.32 4.32 0 01.367-.334l.025-.021 2.283-1.91-2.74-.126-.034-.001a4.344 4.344 0 01-.518-.047 3.259 3.259 0 01-2.387-1.768c-.089-.18-.156-.37-.196-.482l-.01-.032-.891-2.504zm-1.048-2.91c-.086.13-.183.4-.376.943l-1.351 3.8c-.055.154-.082.23-.115.297-.18.363-.523.617-.922.683a2.867 2.867 0 01-.317.024l-3.995.183c-.532.025-.798.037-.943.08a1.259 1.259 0 00-.66 1.953c.09.122.295.293.703.635l3.247 2.716c.119.099.178.148.227.2.267.28.39.667.334 1.05-.01.07-.03.145-.07.294l-1.084 4.113c-.142.54-.214.81-.216.964-.012.89.876 1.511 1.707 1.194.144-.055.374-.214.833-.534l3.183-2.215c.138-.096.207-.144.274-.18a1.259 1.259 0 011.177 0c.068.037.137.085.274.18l3.184 2.215c.458.32.688.48.832.534a1.259 1.259 0 001.707-1.194c-.002-.154-.073-.424-.216-.965l-1.085-4.112c-.039-.15-.059-.224-.069-.294-.056-.383.068-.77.334-1.05.05-.052.109-.101.227-.2l3.247-2.716c.409-.342.613-.513.703-.635a1.259 1.259 0 00-.66-1.953c-.145-.043-.41-.055-.942-.08L16.1 8.851a2.869 2.869 0 01-.317-.024c-.399-.066-.742-.32-.922-.683-.033-.067-.06-.143-.115-.296l-1.351-3.801c-.193-.542-.29-.814-.376-.943a1.259 1.259 0 00-2.095 0z"
                    fill="rgba(22, 24, 35, 0.75)"
                    fill-opacity="0.75"
                  ></path>
                </svg>
              </div>
              <p class="collection-box-title">仅收藏视频</p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="video-action-item"
        @mouseenter="handleShareEnter"
        @mouseleave="handleShareLeave"
      >
        <svg-icon class="icon" icon="fenxiang" />
        <span class="num">{{ useCount(props.share_count ?? 0) }}</span>

        <!-- 分享面板 -->
        <div
          class="share-panel-wrapper"
          v-if="showShareBox"
          @mouseenter="handleShareEnter"
          @mouseleave="handleShareLeave"
        >
          <SharePanel
            :show-bottom-actions="true"
            :share-url="props.shareInfo?.share_url || ''"
            :share-title="props.shareInfo?.share_title || ''"
            :aweme-id="props.aweme_id"
            :bit-rates="props.bitRates"
            :video-desc="props.videoDesc"
            @search-focus="handleSearchFocus"
            @search-blur="handleSearchBlur"
          />
        </div>
      </div>

      <div
        class="video-action-item"
        @mouseenter="showMoreBox = true"
        @mouseleave="showMoreBox = false"
      >
        <svg-icon class="icon" icon="more" />
        <MoreActionBox
          v-if="showMoreBox"
          class="more-box-wrapper"
          :style="{ width: `${width}px` }"
          :is-attent="isAttent"
          :music-name="props.music?.title || props.music?.author || ''"
          :music-use-count="props.music?.user_count || 0"
          :music-play-url="props.music?.play_url?.url_list || []"
          :aweme-id="props.aweme_id"
          :user-id="props.user_id"
          @cancel-follow="handleAttention"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-action {
  position: absolute;
  bottom: 60px;
  right: 0;
  height: auto;
  padding-right: 12px;
  z-index: 11;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  .video-action-content {
    align-items: center;
    display: flex;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
    flex-direction: column;
    flex-shrink: 0;
    justify-content: center;
    margin-bottom: 0;
    position: relative;

    .avatar-content {
      margin-bottom: 23px;
      margin-top: 24px;
      position: relative;

      .video-action-avatar {
        height: 40px;
        width: 40px;
        box-sizing: content-box;
        flex-grow: 0;
        flex-shrink: 0;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid rgba(231, 231, 236, 0.3) !important;
        transition: transform 0.35s cubic-bezier(0.34, 0.69, 0.1, 1);

        &:hover {
          transform: scale(1.1);
        }

        .el-avatar {
          height: 100%;
          width: 100%;
        }
      }

      .video-action-avatar-follow {
        bottom: -12px;
        cursor: pointer;
        height: 24px;
        left: 0px;
        position: absolute;
        right: 0px;
        width: 24px;
        margin: 0px auto;
        display: flex;
        justify-content: center;

        .icon {
          height: 20px;
          width: 20px;
          opacity: 1;
          color: #fff;
        }

        .icon.liked {
          color: red !important;
        }
      }
    }
  }

  .video-action-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    cursor: pointer;
    position: relative;
    padding-top: 6px;

    .num {
      margin-left: 5px;
    }

    .icon {
      height: 50px;
      width: 50px;
      color: #fff;
      opacity: 1;
    }

    .icon-collect {
      height: 42px;
      width: 42px;
      color: #fff;
      opacity: 1;
      margin-left: 5px;
    }

    .icon.liked {
      color: rgb(254, 44, 85);
    }

    .icon-collect.collect {
      color: rgb(255, 184, 2) !important;
    }
  }
}

.like-box {
  background-color: var(--color-bg-toast);
  border-radius: 6px;
  color: var(--color-const-text-white);
  font-size: 12px;
  font-weight: 400;
  line-height: 40px;
  position: absolute;
  text-align: center;

  &.postion {
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
  }

  &.swiper {
    background-color: var(--color-bg-toast);
    top: 10px !important;
    transform: translateY(0) !important;
  }

  .like-box-icon {
    position: absolute;

    &.postion {
      right: -4px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .like-box-title {
    padding: 0 16px;
    white-space: nowrap;

    .like-box-text {
      align-items: center;
      background: #fff;
      border: 1px solid #fff;
      border-radius: 3px;
      color: #323442;
      display: flex;
      display: inline-flex;
      font-size: 13px;
      font-weight: 500;
      height: 18px;
      justify-content: center;
      line-height: 21px;
      margin: 0 5px;
      vertical-align: baseline;
      width: 18px;
    }
  }
}

.more-box-wrapper {
  position: absolute;
  bottom: 0;
  right: 50px;
  z-index: 10;
}

.share-panel-wrapper {
  position: absolute;
  bottom: 0;
  right: 50px;
  z-index: 10;
  width: 340px;
}

.collection-box {
  background-color: var(--color-bg-b1);
  border-radius: 4px;
  bottom: 0;
  box-shadow: var(--shadow-2);
  cursor: auto;
  overflow: hidden;
  position: absolute;
  right: 50px;

  &-content,
  &-item {
    align-items: center;
    display: flex;
  }

  &-content {
    gap: 18px;
    padding: 16px !important;
  }

  &-item {
    cursor: pointer;
    flex-direction: column;

    .collection-box-icon {
      align-items: center;
      background-color: var(--color-bg-b2);
      border-radius: 100%;
      cursor: pointer;
      display: flex;
      height: 48px;
      justify-content: center;
      transition: 0.3s;
      width: 48px;

      .box-icon-all {
        height: 24px;
        width: 24px;

        &.collection-folder-icon path {
          stroke: var(--color-text-1);
        }

        &.video-collection {
          height: 24px;
          width: 24px;

          path {
            fill: var(--color-text-1);
          }
        }
      }
    }

    &:hover .collection-box-icon {
      background: var(--color-bg-b3);
      transform: scale(1.05);
    }

    .collection-box-title {
      color: var(--color-text-t3);
      font-size: 12px;
      line-height: 20px;
      margin-top: 8px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
</style>
