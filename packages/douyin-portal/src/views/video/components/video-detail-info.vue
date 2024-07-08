<script setup lang="ts">
import { } from 'vue'
import VideoDetailAction from './video-detail-action.vue'

const description =
  '艾特你一起去看宫崎骏电影《你想活出怎样的人生》的人 一定是想过「有你」的人生. #你想活出怎样的人生'

defineProps({
  description: String,
  seoDescription: String
})
</script>
<template>
  <div class="video-detail-info">
    <ellipsis-expand :description="description" style="--lineClamp: 2; --lineHeight: 26px; --maxHeight: 52px"
      class="video-info-desc" />
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
