<script setup lang="ts">
import {} from 'vue'
import VideoDetailAction from './video-detail-action.vue'
import type { ISegment } from '@/api/tyeps/common/aweme'

interface IProps {
  description: string
  seoDescription?: string
  textExtra: ISegment[]
}
defineProps<IProps>()
</script>
<template>
  <div class="video-detail-info">
    <ellipsis-expand
      :description
      :text-extra="textExtra"
      style="--lineClamp: 2; --lineHeight: 26px; --maxHeight: 52px"
      class="video-info-desc"
    />
    <p class="video-title-p">
      {{ seoDescription }}
    </p>
    <video-detail-action />
  </div>
</template>

<style lang="scss" scoped>
.video-detail-info {
  color: var(--color-text-t1);
  margin: 16px 0;
}

.video-title-p {
  display: none;
}
</style>
