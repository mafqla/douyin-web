<script setup lang="ts">
import type { ISegment } from '@/api/tyeps/common/aweme'
import formatTime from '@/utils/date-format'

const props = defineProps<{
  username: string
  uploadTime: string | number
  description: string
  textExtra: ISegment[]
}>()
</script>
<template>
  <div class="video-info">
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
