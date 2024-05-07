<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import xgplayer, { Events } from 'xgplayer'
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

import { settingStore } from '@/stores/setting'

import { v4 as uuidv4 } from 'uuid'
const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  isPlay: {
    type: Boolean,
    required: false
  }
})

const player = ref<any>(null)
const uniqueId = uuidv4()

const isShowSwitchControl = toRef(settingStore(), 'isShowSwitchControl')
onMounted(() => {
  props.options.fullscreen = {
    target: document.getElementById('modalall')
  }
  //@ts-ignore
  player.value = new xgplayer({
    ...props.options,
    id: `xgplayer-${uniqueId}`,

    width: '100%',
    height: '100%',
    playsinline: true,
    autoplay: true,
    loop: true,
    lang: 'zh-cn',
    enter: {
      innerHtml: `
      <div class="xg-douyin-loading"></div>`
    },
    closeInactive: true,
    allowSeekPlayed: true,
    allowPlayAfterEnded: true,
    allowSeekAfterEnded: true,
    marginControls: true,
    fullscreen: {
      target: ''
    },
    controls: {
      autoHide: false,
      initShow: true
    },
    dynamicBg: {
      disable: false,
      mode: 'firstframe'
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
  })
  const playerRef = ref<HTMLDivElement | null>(null)
  playerRef.value?.appendChild(player.value.root)

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

  player.value.on(Events.MINI_STATE_CHANGE, (isMini: any) => {
    if (isMini) {
      console.log('enter miniScreen')
      isShowSwitchControl.value = false
    } else {
      console.log('exit miniScreen')
      isShowSwitchControl.value = true
    }
  })
})

onBeforeUnmount(() => {
  player.value.destroy()
})

const playerId = ref(`xgplayer-${uniqueId}`)

watch(
  () => props.isPlay,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if (newVal) {
        player.value.play()
      } else {
        player.value.pause()
      }
    }
  }
)
console.log(props.isPlay)
</script>
<template>
  <div class="modal" ref="player" :id="playerId">
    <slot name="switch" />
  </div>
</template>

<style lang="scss" scoped>
.modal {
  // position: relative;
  background: transparent;
}
</style>

<style lang="scss">
.loading-content {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 100%;
}

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
@keyframes loading {
  to {
    background-position-y: -2880px;
  }
}

//加载样式

xg-loading-inner {
  animation: unset;
}

xg-start-inner {
  border-radius: unset !important;
  background: unset !important;
}

.xgplayer-pause.xgplayer .xgplayer-start.hide {
  z-index: 10;
  pointer-events: auto;
  display: block;
}
.xgplayer-is-cssfullscreen {
  position: fixed !important;
}
.xgplayer {
  .xgplayer-controls {
    height: 48px;
    background-image: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  }
  .xgplayer-start {
    width: 98px;
    height: 98px;
    opacity: 0.7;
    z-index: 10;
    .xg-icon-play,
    .xg-icon-pause {
      width: 100%;
    }
  }
  .xg-inner-controls {
    left: 0 !important;
    right: 0 !important;
    height: 46px !important;
  }
  .xg-center-grid {
    z-index: 2;
    top: -1px;
    transform: translateY(-50%);
  }
  .xgplayer-progress {
    height: 12px;

    &.active {
      .xgplayer-progress-outer {
        height: 12px !important;
        margin: 0 !important;
        transition: none !important;
      }
      .xgplayer-progress-inner {
        background: linear-gradient(
          transparent,
          transparent 3px,
          rgba(255, 255, 255, 0.4) 3px,
          rgba(255, 255, 255, 0.4) 9px,
          transparent 9px,
          transparent
        ) !important;

        .xgplayer-progress-cache {
          background: linear-gradient(
            transparent,
            transparent 3px,
            rgba(255, 255, 255, 0.6) 3px,
            rgba(255, 255, 255, 0.6) 9px,
            transparent 9px,
            transparent
          ) !important;
        }
        .xgplayer-progress-played {
          background: linear-gradient(
            transparent,
            transparent 3px,
            #fff 3px,
            #fff 9px,
            transparent 9px,
            transparent
          ) !important;
        }
      }

      .xgplayer-progress-btn {
        transform: translate(-50%, -50%) scale(1) !important;

        &:before {
          background-clip: content-box !important;
          border: 5px solid rgba(255, 255, 255, 0.2) !important;
        }
      }
    }
  }
  .xgplayer-progress-outer {
    height: 2px !important;
    border-radius: 0;
  }
  .xgplayer-progress-btn {
    box-shadow: none !important;
    background: transparent !important;
    border: 0.5px solid rgba(255, 94, 94, 0.055) !important;

    &:before {
      content: ' ';
      // width: 12px;
      // height: 12px;
      width: 20px;
      height: 20px;
      background: #fff !important;
      border-radius: 30px;
      position: relative;
      left: 50%;
    }
  }
  .xgplayer-progress-inner {
    background: rgba(255, 255, 255, 0.2) !important;
    .xgplayer-progress-cache {
      background: transparent !important;
    }
    .xgplayer-progress-played {
      background: rgba(255, 255, 255, 0.4);
    }
  }

  .xg-left-grid {
    margin-left: 8px;

    .time-duration {
      // font-size: 15px;
      font-weight: 400;
      line-height: 18px;
      color: #fff !important;
    }
  }
  .xg-right-grid {
    height: 40px;
    align-items: center;
    margin-right: 16px;
    display: flex;
  }

  &.xgplayer-mini {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 24px;
    z-index: 501 !important;
    position: fixed !important;
    top: auto !important;
    bottom: 52px !important;
    left: auto !important;
    right: 8px !important;
    border-radius: 12px;

    &:hover {
      cursor: pointer !important;
    }

    .xg-video-container {
      bottom: 0px;
    }

    .xgplayer-start.hide {
      display: none;
    }
  }

  .xg-mini-layer {
    background: transparent;

    .mini-cancel-btn {
      width: 36px;
      height: 36px;
      justify-content: center;
      align-items: center;
      line-height: 0;
      display: flex;
      position: absolute;
      top: 6px;
      bottom: auto;
      left: auto;
      right: 6px;
    }
    .play-icon {
      position: relative;
      background: transparent;
    }
    .xg-icon-play,
    .xg-icon-pause {
      width: 80px;
      height: 80px;
      opacity: 0.7;
      position: relative;
      top: -16px;
      left: -16px;
    }
  }
  .xg-mini-layer,
  .xg-mini-layer .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>
