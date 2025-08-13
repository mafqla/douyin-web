<script setup lang="ts">
import { computed } from 'vue'
import BasePlayer from './base-player.vue'

interface ImageItem {
  uri: string
  width: number
  height: number
  url_list: string[]
  download_url_list: string[]
}

const props = defineProps<{
  url: string | string[]
  imgGallery: ImageItem[]
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
    :url="props.url"
    :options="playerOptions"
    :isPlay="true"
    :loop="true"
    class="mini-video"
  />
</template>

<style lang="scss" scoped></style>
