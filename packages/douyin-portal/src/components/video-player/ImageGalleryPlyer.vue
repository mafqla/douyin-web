<script setup lang="ts">
import { computed } from 'vue'
import BasePlayer from './base-player.vue'

import type { IAwemeImage } from '@/api/tyeps/common/aweme'

const props = withDefaults(
  defineProps<{
    music_url: string | string[]
    imgGallery: IAwemeImage[]
    isPlay?: boolean
    showAutoContinuous?: boolean
    showImmersiveSwitch?: boolean
    arrowStyle?: 'side' | 'bottom'
  }>(),
  {
    isPlay: false,
    showAutoContinuous: true,
    showImmersiveSwitch: true,
    arrowStyle: 'side'
  }
)

const playerOptions = computed(() => {
  const imgGallery = props.imgGallery || []
  const length = imgGallery.length || 1

  const ignores = ['playbackrate', 'PlaybackPlugin', 'watchLater', 'miniWin']
  if (!props.showAutoContinuous) {
    ignores.push('automaticContinuous')
  }
  if (!props.showImmersiveSwitch) {
    ignores.push('immersiveSwitch')
  }

  return {
    ignores,
    imageGallery: {
      images: imgGallery,
      autoplay: 5000,
      preloadCount: 3,
      loop: false,
      arrowStyle: props.arrowStyle
    },
    progress: {
      fragments: imgGallery.map(() => ({
        percent: 1 / length
      }))
    }
  }
})
</script>
<template>
  <BasePlayer
    :url="props.music_url"
    :options="playerOptions"
    :isPlay="props.isPlay"
    :loop="false"
    class="image-gallery-player"
  >
    <slot />
  </BasePlayer>
</template>

<style lang="scss">
.image-gallery-player {
  .xgplayer-time {
    display: none !important;
  }
  .xgplayer-progress-played {
    background: #fff !important;
  }
  .xg-spot-info,
  .xgplayer-progress-btn,
  .xgplayer-progress-point,
  .xg-spot-ext-text,
  .xg-spot-line {
    display: none !important;
  }
}
</style>
