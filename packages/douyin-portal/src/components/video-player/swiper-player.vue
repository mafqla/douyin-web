<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue'
import xgplayer from 'xgplayer'
import { Events } from 'xgplayer'
import 'xgplayer/dist/index.min.css'
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

import { v4 as uuidv4 } from 'uuid'

import {
  VideoInfo,
  VideoSidebar,
  VideoSideBarBtn
} from '@/components/video-components'
import { commentStore } from '@/stores/comment'
import { videosCtrolStore } from '@/stores/videos-control'

const props = defineProps({
  id: {
    type: Number,
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

const player = ref<any>(null)
const uniqueId = uuidv4()

const { isPlay } = toRefs(props)
//西瓜播放器选项
const playerOptions = ref({
  id: `xgplayer-${uniqueId}`,
  url: props.url,
  width: '100%',
  height: '100%',
  playsinline: true,
  autoplayMuted: true,
  autoplay: isPlay.value,

  loop: true,
  lang: 'zh-cn',
  volume: props.globalVolume,
  // keyShortcut: {
  //   isIgnoreUserActive: true
  // },
  playbackRate: [0.75, 1.0, 1.25, 1.5, 2.0],
  closeInactive: true,
  allowSeekPlayed: true,
  allowPlayAfterEnded: true,
  allowSeekAfterEnded: true,
  enableContextmenu: true,
  marginControls: true,
  // dynamicBg: {
  //   disable: false,
  //   mode:'firstframe'
  // },
  cssfullscreen: {
    target: document.getElementById('slide-list')
  },
  fullscreen: {
    target: document.getElementById('slide-list')
  },
  controls: {
    autoHide: false,
    initShow: true
  },
  enter: {
    innerHtml: `<div class="xg-douyin-loading"></div>`
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
    loadingIcon: `<div class="loading-content">
      <div class="loading-content-img"></div>
    </div>`
  }
})
onMounted(() => {
  playerOptions.value.fullscreen = {
    target: document.getElementById('slidelist')
  }
  playerOptions.value.cssfullscreen = {
    target: document.getElementById('slidelist')
  }
  //@ts-ignore
  player.value = new xgplayer(playerOptions.value)
  const playerRef = ref<HTMLDivElement | null>(null)
  playerRef.value?.appendChild(player.value.root)
  player.value.on(Events.CSS_FULLSCREEN_CHANGE, (isCssFullscreen: any) => {
    const carousel = document.getElementsByClassName('carousel') as any
    const main = document.getElementById('slidelist')
    if (isCssFullscreen) {
      carousel[0].style.height = '100%'
      carousel[0].style.top = '0'
      carousel[0].style.padding = '0'
      main?.classList.add('isCssFullscreen')
    } else {
      carousel[0].style.height = 'calc(100% - 24px)'
      carousel[0].style.top = 'calc(0% + 12px)'
      carousel[0].style.padding = '0 60px 0 30px '
      main?.classList.remove('isCssFullscreen')
    }
  })
  player.value.on(Events.FULLSCREEN_CHANGE, (isFullscreen: any) => {
    const carousel = document.getElementsByClassName('carousel') as any
    if (isFullscreen) {
      carousel[0].style.height = '100%'
      carousel[0].style.top = '0'
      carousel[0].style.padding = '0'
    } else {
      carousel[0].style.height = 'calc(100% - 24px)'
      carousel[0].style.top = 'calc(0% + 12px)'
      carousel[0].style.padding = '0 60px 0 30px '
    }
  })
})

watch(isPlay, () => {
  // console.log(isPlay)
  playerOptions.value.autoplay = isPlay.value
  playerOptions.value.id = `xgplayer-${uniqueId}`
  playerOptions.value.volume = 0.6
  playerOptions.value.autoplayMuted = false
  //@ts-ignore
  player.value = new xgplayer(playerOptions.value)
  player.value.on(Events.CSS_FULLSCREEN_CHANGE, (isCssFullscreen: any) => {
    const carousel = document.getElementsByClassName('carousel') as any
    const main = document.getElementById('slidelist')
    if (isCssFullscreen) {
      carousel[0].style.height = '100%'
      carousel[0].style.top = '0'
      carousel[0].style.padding = '0'
      main?.classList.add('isCssFullscreen')
    } else {
      carousel[0].style.height = 'calc(100% - 24px)'
      carousel[0].style.top = 'calc(0% + 12px)'
      carousel[0].style.padding = '0 60px 0 30px '
      main?.classList.remove('isCssFullscreen')
    }
  })
  player.value.on(Events.FULLSCREEN_CHANGE, (isFullscreen: any) => {
    const carousel = document.getElementsByClassName('carousel') as any
    if (isFullscreen) {
      carousel[0].style.height = '100%'
      carousel[0].style.top = '0'
      carousel[0].style.padding = '0'
    } else {
      carousel[0].style.height = 'calc(100% - 24px)'
      carousel[0].style.top = 'calc(0% + 12px)'
      carousel[0].style.padding = '0 60px 0 30px '
    }
  })

  console.log(playerOptions.value)
})

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
</script>

<template>
  <div class="swiper-player">
    <div
      class="videos-container"
      :style="{ width: currentWidth }"
      id="videos-controll"
    >
      <!-- <ViliPlayer :options="playerOptions" :isPlay="isPlay" /> -->

      <div class="slide-video">
        <div class="swiper" ref="player" :id="playerId">
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
            :isAttention="props.isAttention"
            @toggleComments="toggleComments(props.id)"
          >
          </video-action>
        </div>
      </div>
      <video-side-bar-btn
        @click="openComments"
        v-show="control.isShowComment"
      />
    </div>

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

  .videos-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: transparent;

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

// @media screen and (min-width: 1440px) and (max-width: 2560px) {
//   .modal {
//     width: 71.4285714286%;
//   }
// }

// @media screen and (min-width: 2560px) {
//   .modal {
//     width: calc(100% - 656px);
//   }
// }
</style>

<style lang="scss">
.swiper .xgplayer-time {
  font-size: 14px;
  margin: unset;
  min-height: 40px;
}
.xgplayer .xg-center-grid {
  top: -1px;
  transform: translateY(-50%);
}
.xgplayer .xg-tips {
  background-color: #41424c;
  border-radius: 4px;
  // bottom: 36px;
  bottom: 53px;
  color: #fff;
  // height: 38px;
  height: 27px;
  font-size: 12px;
  // left: auto;
  // padding: 10px;
  // position: absolute;
  // right: 0;
  // text-align: center;
  // top: auto;
  // transition-delay: 0.05s !important;
  // -webkit-transition-delay: 0.05s !important;
  // transition-property: visibility;
  // -webkit-transition-property: visibility;
  // visibility: hidden;
  white-space: nowrap;
}
.xgplayer xg-icon {
  margin-left: 0;
  margin-right: 0;
  height: 32px;
}
.xgplayer .xg-left-grid {
  align-items: center;
  display: flex;
  flex: 1 1;
  height: 40px;
  margin-right: 50px;
  z-index: 2;
  margin-left: 8px;
  margin-right: 50px;
}
.xgplayer .xg-right-grid {
  align-items: center;
  display: flex;
  height: 40px;
  margin-right: 16px;
}
.xgplayer-pause.xgplayer .xgplayer-start.hide {
  display: block;
  pointer-events: auto;
  z-index: 10;
}

// .xg-douyin-loading {
//   animation: loading 1s steps(60, start) infinite;
//   background-image: url(@/assets/loading.png);
//   background-size: 48px;
//   display: inline-block;
//   font-size: 0;
//   height: 48px;
//   left: 50%;
//   position: relative;
//   top: 50%;
//   transform: scale(0.7) translateX(-50%) translateY(-50%);
//   transform-origin: left top;
//   width: 48px;
// }
.loading-content {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 100%;

  .loading-content-img {
    animation: loading 1s steps(60, start) infinite;
    background-image: url(@/assets/loading.png);
    background-size: 48px;
    display: inline-block;
    font-size: 0;
    height: 48px;
    transform: scale(0.7);
    width: 48px;
    overflow: hidden;
  }
}
@keyframes loading {
  to {
    background-position-y: -2880px;
  }
}
.xgplayer xg-start-inner {
  background: none;
}
.xgplayer .xgplayer-start .xg-icon-play,
.xg-icon-pause {
  width: 100%;
  height: 100%;
}
.xgplayer-skin-default .xgplayer-progress-played {
  background: rgba(255, 255, 255, 0.4);
}
.xgplayer-skin-default .xgplayer-progress-cache {
  background: transparent;
}
.xgplayer-skin-default .xgplayer-playbackrate ul {
  width: 48px;
  border-radius: 4px;
}

.xgplayer-skin-default .xgplayer-playbackrate ul li.selected,
.xgplayer-skin-default .xgplayer-playbackrate ul li:hover {
  color: rgb(210, 27, 70);
  pointer-events: all;
}
</style>

<style>
.xgplayer {
  background-color: transparent !important;
}
.xgplayer.xgplayer-is-fullscreen {
  position: absolute !important;
  z-index: auto !important;
}
.xgplayer .xgplayer-controls {
  background: transparent;
}
.xgplayer .btn-text span {
  font-size: 14px;
  font-weight: 500;
  /* line-height: 32px; */
  text-align: center;
  color: #e4e4e6;
  background: unset;
}
.xgplayer .xg-options-list {
  width: 57px;
  background-color: #41424c;
  border-radius: 4px;
  bottom: 40px;
  /* bottom: 53px; */
  color: #fff;
  font-size: 14px;
  opacity: 1;
  /* padding: 20px 0 0; */
  top: auto;
}
.xgplayer .xg-options-list li {
  cursor: pointer;
  line-height: 18px;
  margin-bottom: 16px;
  opacity: 0.7;
  text-align: center;
  width: 100%;
}
.xgplayer.xgplayer-pc .xgplayer-progress-outer {
  height: 2px;
}
.xgplayer-progress-inner .xgplayer-progress-played {
  background: hsla(0, 0%, 100%, 0.4);
}
.xgplayer-skin-default .xgplayer-progress-inner {
  background: transparent;
}
.xgplayer-progress-inner .xgplayer-progress-cache {
  background: transparent;
}
.xgplayer-progress-inner .xgplayer-progress-played {
  background: hsla(0, 0%, 100%, 0.4);
}

.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-outer,
.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-outer {
  height: 12px;
  margin: 0;
  transition: none;
}

.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-inner,
.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-inner {
  background: linear-gradient(
    180deg,
    transparent,
    transparent 3px,
    hsla(0, 0%, 100%, 0.4) 0,
    hsla(0, 0%, 100%, 0.4) 9px,
    transparent 0,
    transparent
  );
}

.xgplayer.xgplayer-pc
  .xgplayer-progress.active
  .xgplayer-progress-inner
  .xgplayer-progress-cache,
.xgplayer.xgplayer-pc
  .xgplayer-progress.active
  .xgplayer-progress-inner
  .xgplayer-progress-cache {
  background: linear-gradient(
    180deg,
    transparent,
    transparent 3px,
    hsla(0, 0%, 100%, 0.6) 0,
    hsla(0, 0%, 100%, 0.6) 9px,
    transparent 0,
    transparent
  );
}

.xgplayer.xgplayer-pc
  .xgplayer-progress.active
  .xgplayer-progress-inner
  .xgplayer-progress-played,
.xgplayer.xgplayer-pc
  .xgplayer-progress.active
  .xgplayer-progress-inner
  .xgplayer-progress-played {
  background: linear-gradient(
    180deg,
    transparent,
    transparent 3px,
    #fff 0,
    #fff 9px,
    transparent 0,
    transparent
  );
}

.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-btn:before,
.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-btn:before {
  background-clip: content-box;
  border: 5px solid hsla(0, 0%, 100%, 0.2);
}
.xgplayer.xgplayer-pc .xgplayer-progress-btn {
  background: none;
  box-shadow: none;
}
.xgplayer .xgplayer-progress-btn {
  background: rgba(255, 94, 94, 0.304);
  border: 0.5px solid rgba(255, 94, 94, 0.057);
  border-radius: 30px;
  box-shadow: 0 0 1px rgba(255, 0, 0, 0.383);
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  height: 20px;
  left: 0;
  pointer-events: none;
  position: absolute;
  width: 20px;
  z-index: 1;
}
.xgplayer .xgplayer-progress-btn:before {
  background: #fff;
  border-radius: 30px;
  content: ' ';
  /* height: 12px; */
  width: 20px;
  height: 20px;
  left: 50%;
  position: relative;
  /* width: 12px; */
}
.xgplayer .xgplayer-progress-btn,
.xgplayer .xgplayer-progress-btn:before {
  display: block;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.xgplayer.xgplayer-pc .xgplayer-progress-btn {
  -webkit-transform: translate(-50%, -50%) scale(0);
  -ms-transform: translate(-50%, -50%) scale(0);
  transform: translate(-50%, -50%) scale(0);
}
.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-btn {
  -webkit-transform: translate(-50%, -50%) scale(1);
  -ms-transform: translate(-50%, -50%) scale(1);
  transform: translate(-50%, -50%) scale(1);
}
.swiper.xgplayer-pc .xg-inner-controls {
  left: 0 !important;
  right: 0 !important;
  height: 46px;
}
</style>
