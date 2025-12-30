<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'

const props = defineProps({
  url: {
    type: [String, Array],
    required: true
  }
})

const emit = defineEmits<{
  error: []
}>()

const playerOptions = {
  autoplayMuted: videosCtrolStore().isMuted,
  ignores: [
    'fullscreen',
    'cssfullscreen',
    'playbackrate',
    'PlaybackPlugin',
    'miniWin',
    'watchLater',
    'automaticContinuous',
    'immersiveSwitch',
    'claritySwitch'
  ]
}

// 音量改变
const volumeChange = () => {
  // console.log('音量改变')
  videosCtrolStore().isMuted = false
}

// 播放器错误
const onError = () => {
  emit('error')
}
</script>

<template>
  <div class="mini-play">
    <BasePlayer
      :url="props.url"
      :options="playerOptions"
      :isPlay="true"
      :loop="true"
      class="mini-video"
      @volumechange="volumeChange"
      @error="onError"
      :mode="'bottom'"
      :marginControls="false"
    />
    <!-- <video-process /> -->
  </div>
</template>

<style lang="scss" scoped>
.mini-play {
  position: relative;
  width: 100%;
  height: 100%;
  // bottom: 48px;
  // bottom: 60px;

  .xgplayer {
    overflow: unset;
  }
}
</style>

<style lang="scss">
.mini-video {
  background: transparent;
  .xgplayer-controls {
    background: transparent;
  }

  .xg-left-grid {
    margin-left: 0;
  }

  .xg-right-grid {
    margin-right: 0;
  }

  .xg-left-grid,
  .xg-right-grid {
    bottom: 2px !important;
    /* z-index: -1; */
  }

  .xg-inner-controls {
    height: 32px !important;
  }

  .xgplayer-progress-bottom {
    .xgplayer-progress-btn:before {
      width: 20px;
      height: 20px;
    }
    .xgplayer-progress-outer {
      top: 10px;
    }
  }
  .xgplayer-time {
    font-size: 12px;
  }
}
</style>
