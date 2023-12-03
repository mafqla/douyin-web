<script setup lang="ts">
import ViliPlayer from './vili-player.vue'
import SwiperControl from '@/components/swper/swiper-control.vue'
import { ref } from 'vue'
import startPlay from '@/assets/videos-player-icon/all-play.svg'
import startPause from '@/assets/videos-player-icon/all-pause.svg'
import play from '@/assets/videos-player-icon/play.svg'
import pause from '@/assets/videos-player-icon/pause.svg'
import fullscreen from '@/assets/videos-player-icon/get-fullscreen.svg'
import fullscreenExit from '@/assets/videos-player-icon/exit-fullscreen.svg'
import volume from '@/assets/videos-player-icon/volume.svg'
import volumeMute from '@/assets/videos-player-icon/volume-mute.svg'
import volumeSmall from '@/assets/videos-player-icon/volume-small.svg'
import cssFullScreen from '@/assets/videos-player-icon/cssFullscreen.svg'
import exitCssFullScreen from '@/assets/videos-player-icon/exit-cssFullscreen.svg'

import {
  VideoInfo,
  VideoSidebar,
  VideoSideBarBtn
} from '@/components/video-components'
import { commentStore } from '@/stores/comment'

const props = defineProps({
  id: Number,
  userId: Number,
  username: {
    type: String,
    required: true
  },
  uploadTime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
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
  img: String,
  dianzan: Number,
  comment: Number,
  shoucang: Number,
  globalVolume: Number,
  isLike: {
    type: Boolean,
    required: false
  },
  isCollect: {
    type: Boolean,
    required: false
  },
  isAttention: {
    type: Number,
    required: false
  }
})

// 给组件传递的参数playerOptions
const playerOptions = {
  url: props.url,
  width: '100%',
  height: '100%',
  playsinline: true,
  autoplay: true,
  loop: true,
  lang: 'zh-cn',
  volume: props.globalVolume,
  // poster: props.poster,
  keyShortcut: 'on',
  cssFullscreen: true,
  playbackRate: [0.5, 1.0, 1.5, 1.75, 2],
  closeInactive: true,
  allowSeekPlayed: true,
  allowPlayAfterEnded: true,
  allowSeekAfterEnded: true,
  marginControls: true,
  ignores: ['cssfullscreen'],
  fullscreen: {
    target: ''
  },
  controls: {
    autoHide: false,
    initShow: true
  },
  enter: {
    innerHtml: `  
      <div class="xg-douyin-loading"></div>`
  },
  icons: {
    startPlay: startPlay,
    // startPause: startPause,
    startPause: startPlay,
    play: play,
    pause: pause,
    fullscreen: fullscreen,
    exitFullscreen: fullscreenExit,
    volumeLarge: volume,
    volumeMuted: volumeMute,
    volumeSmall: volumeSmall,
    fullscreenExit: fullscreenExit,
    cssFullscreen: cssFullScreen,
    exitCssFullscreen: exitCssFullScreen,
    loadingIcon: `   <div class="loading-content">
      <div class="loading-content-img"></div>
    </div>`
  }
} as any

let isShow = ref(true)
let currentWidth = ref('100%')
//打开评论
const openComments = () => {
  //隐藏按钮
  isShow.value = false
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

//关闭评论
const closeComments = () => {
  //显示按钮
  isShow.value = true
  //设置宽度
  currentWidth.value = '100%'
}

//切换评论区的显示状态
const toggleComments = (id: any) => {
  isShow.value = !isShow.value
  if (!isShow.value) {
    //如果评论区关闭，就执行打开评论操作
    openComments()
  } else {
    //否则执行关闭评论操作
    closeComments()
  }
  const store = commentStore()
  store.getVideoCommentList(id) as any
}
</script>

<template>
  <div class="modal-player" id="modalall">
    <div class="videos-container" :style="{ width: currentWidth }">
      <ViliPlayer :options="playerOptions" />
      <div class="close-btn" @click="$emit('closeBtn')">
        <svg-icon class="icon" icon="close-big" />
      </div>

      <video-info
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
        @toggleComments="toggleComments(props.id)"
      >
        <swiper-control-modal />
      </video-action>
    </div>

    <video-side-bar-btn @click="openComments" v-show="isShow" />

    <video-sidebar
      :id="props.id"
      :username="props.username"
      @closeComments="closeComments"
      v-show="!isShow"
    />

    <div class="video-blur">
      <img :src="props.poster" :alt="props.description" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-player {
  position: relative;
  width: 100%;
  height: 100vh;

  .videos-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;

  
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
    bottom: 0px;
    left: 0px;
    position: absolute;
    right: 0px;
    top: 0px;
    overflow: hidden;
    z-index: 0;

    img {
      width: 100%;
      height: 100%;
      filter: blur(60px);
      opacity: 0.8;
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
