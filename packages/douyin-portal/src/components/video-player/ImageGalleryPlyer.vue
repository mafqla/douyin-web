<script setup lang="ts">
import { computed } from 'vue'
import BasePlayer from './base-player.vue'

import type { IAwemeImage } from '@/api/tyeps/common/aweme'

const props = defineProps<{
  music_url: string | string[]
  imgGallery: IAwemeImage[]
  isPlay?: boolean
}>()

const playerOptions = computed(() => {
  const imgGallery = props.imgGallery || []
  const length = imgGallery.length || 1

  return {
    ignores: [
      'playbackrate',
      'PlaybackPlugin',
      'watchLater',
      'miniWin',
      'automaticContinuous',
      'immersiveSwitch'
    ],
    imageGallery: {
      images: imgGallery,
      autoplay: 5000, // 5秒自动切换
      preloadCount: 3, // 预加载前后3张图
      loop: false // 不循环播放
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
    :loop="true"
    class="mini-video"
  >
    <slot />
  </BasePlayer>
</template>

<style lang="scss" scoped></style>
