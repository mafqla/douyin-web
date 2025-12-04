<script setup lang="ts">
import startPlayIcon from '@/assets/videos-player-icon/all-play.svg'
import cssFullScreenIcon from '@/assets/videos-player-icon/xg-pagefull.svg'
import exitCssFullScreenIcon from '@/assets/videos-player-icon/xg-exit-pagefull.svg'
import fullscreenExitIcon from '@/assets/videos-player-icon/xg-exit-fullscreen.svg'
import fullscreenIcon from '@/assets/videos-player-icon/xg-get-fullscreen.svg'
import pauseIcon from '@/assets/videos-player-icon/pause.svg'
import playIcon from '@/assets/videos-player-icon/play.svg'
import volumeMuteIcon from '@/assets/videos-player-icon/xg-volume-mute.svg'
import volumeSmallIcon from '@/assets/videos-player-icon/xg-volume-small.svg'
import volumeIcon from '@/assets/videos-player-icon/xg-volume.svg'
import { playerSettingStore } from '@/stores/player-setting'
import { settingStore } from '@/stores/setting'
import { v4 as uuidv4 } from 'uuid'
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import Player, { Events, type IPlayerOptions } from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import automaticContinuous from './plugin/automatic-continuous/automatic-continuous'
import immersiveSwitch from './plugin/immersive-switch/immersive-switch'
import miniWin from './plugin/miniWin/miniWin'
import PlaybackPlugin from './plugin/playbackSetting/playbackPlugin'
import watchLater from './plugin/watch-later/watch-later'
import ImageGalleryPlugin from './plugin/ImageGallery/ImageGallery'

interface PlayerProps {
  url: string | string[]
  thumbnail?: {
    img_urls?: string[] // 雪碧图url列表
    pic_num?: number // 预览图总帧数
    row?: number // 每张雪碧图包含的预览图行数
    col?: number // 每张雪碧图包含的预览图列数
    height?: number // 预览图每一帧的高度（单位：px）
    width?: number // 预览图每一帧的宽度（单位：px）
  }
  options?: IPlayerOptions
  isPlay?: boolean
  autoHide?: boolean
  mode?: string
  marginControls?: boolean
  loop?: boolean
}
const props = withDefaults(defineProps<PlayerProps>(), {
  url: '',
  isPlay: false,
  autoHide: false,
  mode: 'normal',
  marginControls: true,
  loop: false
})
// const player = ref<any>(null)
const uniqueId = uuidv4()
const playerId = ref(`xgplayer-${uniqueId}`)
const isShowSwitchControl = toRef(settingStore(), 'isShowSwitchControl')
/**
 * 处理播放器url数组，转为{
 *  src: 'url', type: 'video/mp4'}
 */

const url = computed(() => {
  if (Array.isArray(props.url)) {
    return (props.url as string[]).map((item: string) => {
      return {
        src: item,
        type: ''
      }
    })
  } else {
    return props.url
  }
})

const isPlay = computed(() => {
  return props.isPlay
})
const loop = computed(() => {
  return props.loop
})
const setting = toRef(playerSettingStore(), 'isMini')
const playerOptions = ref<IPlayerOptions>({
  ...props.options,
  id: `xgplayer-${uniqueId}`,
  url: url.value,
  width: '100%',
  height: '100%',
  playsinline: true,
  autoplay: isPlay.value,
  loop: loop.value,

  lang: 'zh-cn',
  enter: {
    innerHtml: `
      <div class="xg-douyin-loading"></div>`
  },
  volume: {
    default: 0.5,
    showValueLabel: true
  },
  // autoplayMuted: true,
  closeInactive: true,
  allowSeekPlayed: true,
  allowPlayAfterEnded: true,
  allowSeekAfterEnded: true,
  enableContextmenu: false,
  marginControls: props.marginControls,
  controls: {
    autoHide: props.autoHide,
    initShow: true,
    mode: props.mode
  },
  dynamicBg: {
    disable: false,
    mode: 'firstframe'
  },
  MiniScreen: {
    disableDrag: true
  },
  miniWin: {
    height: 197,
    top: 728,
    left: 1329
  },
  immersiveState: false,
  automatic: false,
  thumbnail: {
    urls: props.thumbnail?.img_urls ?? [], // 雪碧图url列表
    pic_num: props.thumbnail?.pic_num ?? 120, // 预览图总帧数
    row: props.thumbnail?.row ?? 5, // 每张雪碧图包含的预览图行数
    col: props.thumbnail?.col ?? 5, // 每张雪碧图包含的预览图列数
    height: props.thumbnail?.height, // 预览图每一帧的高度（单位：px）
    width: props.thumbnail?.width // 预览图每一帧的宽度（单位：px）
  },
  icons: {
    startPlay: startPlayIcon,
    // startPause: startPause,
    startPause: startPlayIcon,
    play: playIcon,
    pause: pauseIcon,
    fullscreen: fullscreenIcon,
    exitFullscreen: fullscreenExitIcon,
    volumeLarge: volumeIcon,
    volumeMuted: volumeMuteIcon,
    volumeSmall: volumeSmallIcon,
    fullscreenExit: fullscreenExitIcon,
    cssFullscreen: cssFullScreenIcon,
    exitCssFullscreen: exitCssFullScreenIcon,
    loadingIcon: `<div class="loading-content">
      <div class="loading-content-img"></div>
    </div>`
  },
  cssfullscreen: document.querySelector('.slide-list') as HTMLElement,
  fullscreenTarget: document.querySelector('.slide-list') as HTMLElement,
  plugins: [
    PlaybackPlugin,
    miniWin,
    watchLater,
    automaticContinuous,
    immersiveSwitch,
    ImageGalleryPlugin
  ]
})

let xgPlayer: Player | null = null
let isDestroyed = false
const initPlayer = () => {
  xgPlayer = new Player(playerOptions.value)
}

const play = () => {
  xgPlayer?.play()
}

const pause = () => {
  xgPlayer?.pause()
}
defineExpose({
  play,
  pause
})

onMounted(() => {
  initPlayer()
  if (!xgPlayer) return
  //@ts-ignore
  xgPlayer.on(Events.CSS_FULLSCREEN_CHANGE, (isCssFullscreen: any) => {
    const carousel = document.getElementsByClassName('carousel') as any
    const main = document.getElementById('slidelist')
    if (isCssFullscreen && carousel) {
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
  xgPlayer.on(Events.FULLSCREEN_CHANGE, (isFullscreen: any) => {
    const carousel = document.getElementsByClassName('carousel') as any
    console.log(isFullscreen)
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

  xgPlayer.on(Events.MINI_STATE_CHANGE, (isMini: any) => {
    if (isMini) {
      console.log('enter miniScreen')
      isShowSwitchControl.value = false
    } else {
      console.log('exit miniScreen')
      isShowSwitchControl.value = true
    }
  })
  xgPlayer.on(Events.PLAY, () => {
    emit('play')
  })
  xgPlayer.on(Events.PAUSE, () => {
    emit('pause')
  })
  xgPlayer.on(Events.ENDED, () => {
    emit('ended')
  })
  xgPlayer.on(Events.TIME_UPDATE, () => {
    emit('timeupdate')
  })
  xgPlayer.on(Events.VOLUME_CHANGE, () => {
    emit('volumechange')
    console.log('volumechange')
    const muted = xgPlayer?.muted
    console.log(muted)
  })
  xgPlayer.usePluginHooks('progresspreview', 'previewClick', (plugin, time) => {
    console.log('...args', time)
    return true
  })

  xgPlayer.on(Events.FULLSCREEN_CHANGE, () => {
    emit('fullscreenchange')
    console.log('fullscreenchange')
  })
  xgPlayer.on(Events.CSS_FULLSCREEN_CHANGE, () => {
    emit('cssfullscreenchange')
  })

  xgPlayer.on('atuoPlayChange', (automatic: boolean) => {
    console.log('atuoPlayChange', automatic)
  })
  xgPlayer.on('immersiveStateChange', (isImmersive: boolean) => {
    console.log('immersiveStateChange', isImmersive)
  })
  xgPlayer.on('watch-later', (data: any) => {
    console.log('watch-later', data)
  })
})

watch(
  () => props.isPlay,
  (newVal) => {
    if (isDestroyed || !xgPlayer) return
    if (newVal) {
      xgPlayer.play()
    } else {
      xgPlayer.pause()
    }
  }
)

onBeforeUnmount(() => {
  isDestroyed = true
  if (xgPlayer) {
    xgPlayer.destroy()
    xgPlayer = null
  }
})

//把播放器的事件导出给父组件
const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: []
  volumechange: []
  fullscreenchange: []
  cssfullscreenchange: []
  error: []
  destroy: []
}>()
</script>
<template>
  <div class="base-player" ref="player" :id="playerId">
    <slot name="switch" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.base-player {
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
  .xgplayer-time {
    margin: unset;
    min-height: 40px;
  }

  .xg-tips {
    background-color: #41424c;
    border-radius: 4px;
    // bottom: 36px;
    bottom: 53px;
    color: #fff;
    // height: 38px;
    height: 27px;
    font-size: 12px;
    white-space: nowrap;
  }

  .xg-options-list {
    width: 57px;
    background-color: #41424c;
    border-radius: 4px;
    // bottom: 40px;
    // bottom: 53px;
    color: #fff;
    font-size: 14px;
    opacity: 1;
    /* padding: 20px 0 0; */
    top: auto;

    li {
      cursor: pointer;
      line-height: 18px;
      margin-bottom: 16px;
      opacity: 0.7;
      text-align: center;
      width: 100%;
    }
  }

  .xgplayer-controls {
    height: 48px;
    background-image: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  }

  .xgplayer-replay {
    display: none !important;
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

  xg-icon {
    margin-left: 0;
    margin-right: 0;
    height: 32px;
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
    height: 40px;
    align-items: center;
    display: flex;
    flex: 1 1 0%;

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
    z-index: 2;
  }

  .xgplayer-volume {
    .xgplayer-value-label {
      padding-top: 2px;
      position: static;

      opacity: 1;
      letter-spacing: 0.6px;
      color: rgba(255, 255, 255, 0.7);
      background-color: #252632;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      font-size: 12px;
      line-height: 20px;
    }

    .xgplayer-bar {
      height: 137px;
      position: relative;
      top: 8px;
      left: 10px;

      .xgplayer-drag {
        max-height: 137px;
      }
    }

    .xgplayer-slider {
      width: 56px;
      height: 196px;
      left: -10px;
    }
  }

  .xgplayer-slider {
    color: #fff;
    opacity: 1;
    background-color: #252632;
    padding: 10px 16px;
    font-size: 14px;
    top: auto;
    bottom: 32px;
    border-radius: 12px !important;
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

    .xgplayer-start.hide,
    .xgplayer-start.interact,
    .xgplayer-pause {
      display: none;
    }
  }

  .xg-mini-layer {
    background: transparent;

    .mini-cancel-btn {
      // width: 36px;
      // height: 36px;
      justify-content: center;
      align-items: center;
      line-height: 0;
      display: flex;
      position: absolute;
      // top: 6px;
      // bottom: auto;
      left: auto;
      // right: 6px;
      width: 17px;
      height: 17px;
      top: auto;
      bottom: 13px;
      right: 11px;
    }

    .play-icon {
      position: relative;
      background: transparent;
    }

    .xg-icon-play,
    .xg-icon-pause {
      width: 50px;
      height: 50px;
      // opacity: 0.7;
      position: relative;
      // top: -16px;
      // left: -16px;
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

  &.xgplayer-is-fullscreen {
    position: absolute !important;
    z-index: auto !important;
  }
}
</style>
