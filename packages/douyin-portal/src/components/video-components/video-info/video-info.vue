<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'

const props = defineProps<{
  username: string
  uploadTime: string
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

    <ellipsis-expand :description="props.description" />
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
  color: #fff;
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

  .video-info-desc.text-ellipsis {
    // max-width: 100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    // white-space: nowrap;
  }
  // .video-info-desc {
  //   // display: flex;
  //   // align-items: center;
  //   font-size: 14px;

  //   height: 44px;
  //   cursor: auto;

  //   .btn {
  //     color: rgba(255, 255, 255, 0.9);
  //     font-weight: 400;
  //     height: 20px;
  //     line-height: 20px;
  //     width: 40px;
  //     min-width: 40px;
  //     background: rgba(255, 255, 255, 0.15);
  //     border-width: initial;
  //     border-style: none;
  //     border-color: initial;
  //     border-image: initial;
  //     padding: 0px !important;
  //     margin-left: 15px;
  //   }
  //   span {
  //     display: inline-block;
  //   }

  //   .video-info-tag {
  //     padding: 0 10px;
  //     font-size: 14px;

  //     a {
  //       color: #f1c40f;
  //       text-decoration: none;
  //       padding: 0 5px;

  //       &:hover {
  //         text-decoration: underline;
  //         background-color: transparent;
  //       }
  //     }
  //   }
  // }
}
</style>
