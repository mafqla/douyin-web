<script setup lang="ts">
import { ref, computed } from 'vue'
import TitleBox from './title-box.vue'
import DiscoverVideo from './discover-video.vue'
import { ElSkeleton } from 'element-plus'

const props = defineProps({
  video_id: {
    type: String,
    default: ''
  },
  video_img: {
    type: String,
    default: ''
  },
  video_url: {
    type: [String, Array],
    default: ''
  },
  video_time: {
    type: Number,
    default: 0
  },
  video_uploadtime: {
    type: Number,
    default: 0
  },
  video_like: {
    type: Number,
    default: 0
  },
  video_title: {
    type: String,
    default: ''
  },
  video_author: {
    type: String,
    default: ''
  },
  video_isFellow: {
    type: Number,
    default: 0
  },
  // 视频类型，68为图集
  aweme_type: {
    type: Number,
    default: 0
  },
  // 是否为实况照片
  is_live_photo: {
    type: Number,
    default: 0
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// 根据类型生成链接
const videoLink = computed(() => {
  const isImageGallery = props.aweme_type === 68 && props.is_live_photo !== 1
  return isImageGallery ? `/note/${props.video_id}` : `/video/${props.video_id}`
})
</script>
<template>
  <div class="waterfall-item">
    <el-skeleton animated :loading="isLoading" class="discover-item-skeleton">
      <template #template>
        <div class="skeleton-content">
          <div class="skeleton-logo">
            <svg-icon class="icon" icon="loading-logo" />
          </div>

          <div class="skeleton-bottom">
            <el-skeleton-item variant="h3" style="width: 40%" />
            <el-skeleton-item variant="h3" style="width: 100%" />
          </div>
        </div>
      </template>
      <template #default>
        <a :href="videoLink" class="waterfall-videoCardContainer">
          <div class="item-content">
            <discover-video
              :img="props.video_img"
              :videoTime="props.video_time"
              :like="video_like"
              :videoUrl="props.video_url"
            />
            <title-box
              :author="props.video_author"
              :title="props.video_title"
              :time="props.video_uploadtime"
              :fellow="props.video_isFellow"
            />
          </div>
        </a>
      </template>
    </el-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.waterfall-item {
  .waterfall-videoCardContainer {
    // border: 0.5px solid var(--color-line-l3);
    // box-shadow: 0 0 0.5px 0 var(--color-secondary-default);
    // border-radius: 12px;
    flex-direction: column;
    transition-property: transform, box-shadow;
    transition-duration: 0.35s;
    display: flex;
    position: relative;
    overflow: hidden;

    .item-content {
      display: flex;
      flex-direction: column;

      &:hover {
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.discover-item-skeleton {
  background: var(--color-bg-b1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;

  .skeleton-content {
    padding: 16px;

    .skeleton-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      // padding-bottom: 16px;
      padding-top: 60px;
    }

    .skeleton-bottom {
      padding-top: 20px;
      padding-top: 96px;
    }
  }
}

.icon {
  width: 105px;
  height: 120px;
  // color: var(--color-bg-b2);
}
</style>
