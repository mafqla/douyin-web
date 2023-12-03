<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Player, { Events } from 'xgplayer'
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
import { videosCtrolStore } from '@/stores/videos-control'

const props = defineProps({
  url: {
    type: String,
    required: true,
    default: ''
  }
})

const player = ref<any>(null)
const playerOptions = {
  id: 'mini-player',
  url: props.url,
  autoplay: true,
  autoplayMuted: videosCtrolStore().isMuted,
  loop: true,
  width: '100%',
  height: '100%',
  // autoplayMuted: true,
  // volume: props.volume,
  closeVideoClick: true,
  lang: 'zh-cn',
  // playsinline: true,
  closeInactive: true,
  ignores: ['fullscreen', 'cssfullscreen', 'playbackrate'],
  controls: {
    autoHide: false,
    mode: 'bottom',
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
}
onMounted(() => {
  player.value = new Player(playerOptions)
  player.value.on(Events.VOLUME_CHANGE, () => {
    console.log('音量改变')
    videosCtrolStore().isMuted = false
  })
})

onBeforeUnmount(() => {
  player.value.destroy()
})
</script>

<template>
  <div class="mini-play">
    <div id="mini-player"></div>
  </div>
</template>

<style lang="scss" scoped>
.mini-play {
  position: relative;
  width: 100%;
  height: 100%;
  // bottom: 48px;
  // bottom: 60px;
}
</style>

<style>
.mini-play video {
  background: var(--color-bg-b1) !important;
}
.mini-play .xgplayer-time {
  font-size: 10px;
  margin: unset;
}

.mini-play xg-start-inner {
  background: none;
}
.mini-play .xgplayer-controls {
  background: transparent;
}
.mini-play .xgplayer-time .time-duration {
  color: unset !important;
}

.mini-play .xg-inner-controls {
  height: 37px !important;
}
/* .mini-play .bottom-controls .xg-center-grid {
  top: 26px;
  padding: 0;
} */
.mini-play .bottom-controls .xg-left-grid,
.mini-play .bottom-controls .xg-right-grid {
  bottom: 2px !important;
  /* z-index: -1; */
}
.mini-play .xgplayer-start .xg-icon-play,
.xg-icon-pause {
  width: 100%;
  height: 100%;
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
.mini-play .xgplayer-progress-btn {
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
.mini-play .xgplayer-progress-bottom .xgplayer-progress-btn:before {
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
.mini-play .xgplayer-progress-btn,
.mini-play .xgplayer-progress-btn:before {
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
.xgplayer.xgplayer-pc .xg-inner-controls {
  left: 0 !important;
  right: 0 !important;
}
</style>
