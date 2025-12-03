<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ISegment } from '@/api/tyeps/common/aweme'
import formatTime from '@/utils/date-format'

const props = defineProps<{
  username: string
  uploadTime: string | number
  description: string
  textExtra: ISegment[]
}>()

const videoInfoRef = ref<HTMLElement | null>(null)
const maxWidth = ref('485px')
const minWidth = ref('285px')

const calcMaxWidth = () => {
  if (videoInfoRef.value) {
    const container = videoInfoRef.value.closest(
      '.videos-container'
    ) as HTMLElement
    if (container) {
      const containerWidth = container.offsetWidth
      maxWidth.value = `${containerWidth * 0.45}px`
    }
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  calcMaxWidth()
  const container = videoInfoRef.value?.closest(
    '.videos-container'
  ) as HTMLElement
  if (container) {
    resizeObserver = new ResizeObserver(calcMaxWidth)
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>
<template>
  <div class="video-info" ref="videoInfoRef" :style="{ maxWidth, minWidth }">
    <div class="video-info-top">
      <div class="video-info-author">
        <span>@{{ props.username }}</span>
      </div>
      <div class="video-info-time">
        <span> · {{ formatTime(props.uploadTime) }}</span>
      </div>
    </div>

    <ellipsis-expand
      style="--lineClamp: 2; --lineHeight: 22px; --maxHeight: 44px"
      class="video-desc-swiper"
      :description="props.description"
      :text-extra="props.textExtra"
    />
  </div>
</template>

<style lang="scss" scoped>
.video-info {
  position: absolute;
  bottom: 48px;
  left: 0;
  padding: 16px 95px 16px 16px;
  width: 100%;
  color: var(--color-const-text-white);

  user-select: none;
  z-index: 2;

  & div {
    pointer-events: all;
  }

  .video-info-top {
    display: flex;
    align-items: center;
    margin-bottom: 2px;

    .video-info-author {
      font-size: 18px;
      white-space: nowrap;

      &:hover {
        text-decoration: underline;
        background-color: transparent;
      }
    }
    @media (max-width: 1440px) {
      .video-info-author span {
        font-size: 18px;
        line-height: 26px;
      }
    }
    .video-info-time {
      padding: 0 10px;
      font-size: 14px;
      white-space: nowrap;
    }
  }
}

@media (min-width: 1440px) and (max-width: 1920px) {
  .video-info {
    .video-info-top {
      margin-bottom: calc(-4px + 0.416667vw) !important;
    }
  }
}
</style>
