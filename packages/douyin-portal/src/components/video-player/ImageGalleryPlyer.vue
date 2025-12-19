<script setup lang="ts">
import { computed } from 'vue'
import BasePlayer from './base-player.vue'
import ImageGalleryPlugin from './plugin/ImageGallery/ImageGallery'

import type {
  IAwemeImage,
  IImageAlbumMusicInfo
} from '@/api/tyeps/common/aweme'

const props = withDefaults(
  defineProps<{
    music_url: string | string[]
    imgGallery: IAwemeImage[]
    isPlay?: boolean
    showAutoContinuous?: boolean
    showImmersiveSwitch?: boolean
    arrowStyle?: 'side' | 'bottom'
    // 图集音乐信息，用于控制播放时间
    musicInfo?: IImageAlbumMusicInfo
    // 默认每张图片展示时长（毫秒）
    defaultDuration?: number
  }>(),
  {
    isPlay: false,
    showAutoContinuous: true,
    showImmersiveSwitch: true,
    arrowStyle: 'side',
    defaultDuration: 5000
  }
)

// 是否只有一张图片
const isSingleImage = computed(() => {
  return (props.imgGallery?.length ?? 0) <= 1
})

const playerOptions = computed(() => {
  const imgGallery = props.imgGallery || []

  const ignores = [
    'playbackrate',
    'PlaybackPlugin',
    'watchLater',
    'miniWin',
    'claritySwitch'
  ]
  if (!props.showAutoContinuous) {
    ignores.push('automaticContinuous')
  }
  if (!props.showImmersiveSwitch) {
    ignores.push('immersiveSwitch')
  }
  // 单张图片时隐藏进度条
  if (isSingleImage.value) {
    ignores.push('progress')
  }

  // 计算每张图片的进度分片（基于时长）
  const fragments = calculateProgressFragments(imgGallery)

  return {
    ignores,
    imageGallery: {
      images: imgGallery,
      autoplay: 5000,
      preloadCount: 3,
      loop: false,
      arrowStyle: props.arrowStyle,
      musicInfo: props.musicInfo,
      defaultDuration: props.defaultDuration
    },
    progress: {
      fragments
    },
    // 只在图集播放器中加载 ImageGalleryPlugin
    plugins: [ImageGalleryPlugin]
  }
})

/**
 * 根据图片数量计算进度条分片（等分）
 */
function calculateProgressFragments(images: IAwemeImage[]) {
  if (!images || images.length === 0) {
    return []
  }

  // 每张图片占用相同的进度条长度
  const percent = 1 / images.length

  return images.map(() => ({
    percent
  }))
}
</script>
<template>
  <BasePlayer
    :url="props.music_url"
    :options="playerOptions"
    :isPlay="props.isPlay"
    :loop="false"
    class="image-gallery-player"
    :class="{ 'single-image': isSingleImage }"
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
  // 隐藏进度条上不需要的元素（时间提示、拖动按钮等）
  .xg-spot-info,
  .xgplayer-progress-btn,
  .xgplayer-progress-point,
  .xg-spot-ext-text,
  .xg-spot-line,
  .xgplayer-progress-tip {
    display: none !important;
  }

  .xgplayer-progress.active {
    .xgplayer-progress-outer {
      height: 6px !important;
      margin: unset !important;
      .xgplayer-progress-inner {
        &:hover {
          background: #fff !important;
        }
      }
    }
  }
  .xgplayer-progress {
    height: 12px;
    .xgplayer-progress-outer {
      height: 2px;
    }
    .xgplayer-progress-inner {
      pointer-events: auto;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 4px;
      margin-right: 6px;
      transition: none;
      &:hover {
        height: 6px !important;
        background: #fff !important;
      }
    }
  }
  // 单张图片时隐藏进度条相关元素
  &.single-image {
    .xgplayer-progress {
      display: none !important;
    }
  }
}
</style>
