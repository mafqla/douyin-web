<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'

const props = defineProps<{
  username: string
  uploadTime: string | number
  description: string
}>()
</script>
<template>
  <div class="video-info">
    <div class="video-info-top">
      <div class="video-info-author">
        <span>@{{ props.username }}</span>
      </div>
      <div class="video-info-time">
        <span> · {{ props.uploadTime }}</span>
      </div>
    </div>

    <ellipsis-expand
      style="
        --lineClamp: 2;
        --lineHeight: 22px;
        --maxHeight: 48px;
        margin: 16px 0;
      "
      :description="props.description"
    />
  </div>
</template>

<style lang="scss" scoped>
.video-info {
  position: absolute;
  // bottom: 45px;
  bottom: 48px;
  left: 0;
  // height: 100px;
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
    margin-bottom: 10px;

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
</style>
