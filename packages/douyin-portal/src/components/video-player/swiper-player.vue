<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import {
  VideoInfo,
  VideoSidebar,
  VideoSideBarBtn
} from '@/components/video-components'
import { commentStore } from '@/stores/comment'
import { videosCtrolStore } from '@/stores/videos-control'
import BasePlayer from './base-player.vue'

type UrlType = string | string[]
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  uploadTime: {
    type: [String, Number],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: [String, Array],
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  isPlay: {
    type: Boolean,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  dianzan: {
    type: Number,
    required: true
  },
  comment: {
    type: Number,
    required: true
  },
  shoucang: {
    type: Number,
    required: false
  },
  globalVolume: {
    type: Number,
    required: false,
    default: 0
  },
  isLike: {
    type: Number,
    required: false
  },
  isCollect: {
    type: Number,
    required: false
  },
  isAttention: {
    type: Number,
    required: false
  },
  isShowInfo: {
    type: Boolean,
    required: false,
    default: true
  },
  isShowAvatar: {
    type: Boolean,
    required: false,
    default: true
  }
})

const uniqueId = uuidv4()

const { isPlay } = toRefs(props)
const playerOptions = {
  autoplayMuted: videosCtrolStore().isMuted,
  ignores: ['miniWin', 'playbackrate']
}

const playerId = ref(`xgplayer-${uniqueId}`)

const control = videosCtrolStore()
let currentWidth = ref('100%')

watch(control, () => {
  if (control.isShowComment) {
    //设置宽度
    currentWidth.value = '100%'
  } else {
    //设置宽度
    currentWidth.value = 'calc(100% - 336px)'

    //获取屏幕宽度
    const screenWidth = document.body.clientWidth
    // console.log(screenWidth)

    //如果屏幕宽度大于等于2560px，就设置宽度为100%-28.5714285714%
    if (screenWidth >= 1440) {
      currentWidth.value = 'calc(100% - 28.5714285714%)'
    }
  }
})
//打开评论
const openComments = () => {
  //隐藏按钮
  control.isShowComment = false
}

//关闭评论
const closeComments = () => {
  //显示按钮
  control.isShowComment = true
}

//切换评论区的显示状态
const toggleComments = (id: any) => {
  control.isShowComment = !control.isShowComment
  if (!control.isShowComment) {
    //如果评论区关闭，就执行打开评论操作
    openComments()
  } else {
    //否则执行关闭评论操作
    closeComments()
  }
  const store = commentStore()
  store.getVideoCommentList(id) as any
}

//打开相关内容
const openRelated = () => {
  control.isShowRelated = true
}
</script>

<template>
  <div class="swiper-player">
    <div
      class="videos-container"
      :style="{ width: currentWidth }"
      id="videos-controll"
    >
      <div class="slide-video">
        <BasePlayer :url="props.url" :options="playerOptions" :is-play="isPlay">
          <video-info
            v-if="props.isShowInfo"
            :username="props.username"
            :uploadTime="props.uploadTime"
            :description="props.description"
          />
          <video-action
            :id="props.id"
            :userId="props.userId"
            :avatar="props.img"
            :dianzan="props.dianzan"
            :comment="props.comment"
            :shoucang="props.shoucang"
            :isLike="props.isLike"
            :isCollect="props.isCollect"
            :isAttention="props.isAttention"
            :isShowAvatar="props.isShowAvatar"
            @toggleComments="toggleComments(props.id)"
          >
          </video-action>
        </BasePlayer>
      </div>
      <video-search-btn @click="openRelated" v-show="!control.isShowRelated" />
      <video-side-bar-btn
        @click="openComments"
        v-show="control.isShowComment"
      />
    </div>
    <slot></slot>
    <video-sidebar
      :id="props.id"
      :username="props.username"
      @closeComments="closeComments"
      v-show="!control.isShowComment"
    />
    <div class="video-blur">
      <img :src="props.poster" :alt="props.description" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.swiper-player {
  border-radius: 16px;
  flex-grow: 1;
  height: 100%;
  opacity: 1;
  overflow: hidden;
  position: relative;
  transition: all 0.15s linear;
  width: 100%;
  display: flex;

  .videos-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: transparent;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 297px;
    display: inline-block;

    .slide-video {
      bottom: 0;
      overflow: hidden;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .close-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 64px;
      height: 64px;
      background-color: rgba(0, 0, 0, 0.18);
      border: 0.5px solid hsla(0, 0%, 100%, 0.15);
      border-radius: 32px;
      z-index: 100;

      &:hover {
        background-color: rgba(0, 0, 0, 0.35);

        .icon {
          color: #fff;
        }
      }

      .icon {
        height: 18px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 18px;
        color: hsla(0, 0%, 100%, 0.25);
      }
    }
  }

  .video-blur {
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
    transform: scale(1.2);

    img {
      filter: blur(60px);
      height: 100%;
      opacity: 0.8;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      width: 100%;
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .videos-container {
    width: 71.4285714286%;
  }
}

@media screen and (min-width: 2560px) {
  .videos-container {
    width: calc(100% - 656px);
  }
}
</style>
