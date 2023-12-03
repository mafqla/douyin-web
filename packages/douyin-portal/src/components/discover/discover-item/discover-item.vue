<script setup lang="ts">
import { ref } from 'vue'
import TitleBox from './title-box.vue'
import DiscoverVideo from './discover-video.vue'
import { useElementSize } from '@vueuse/core'
import { ElSkeleton } from 'element-plus'
import { discoverStore } from '@/stores/discover'

const props = defineProps({
  img: String,
  videoTime: String,
  like: Number,
  title: String,
  author: String,
  fellow: Number,
  comment: Number,
  collect: Number,
  postTime: String,
  videoUrl: String,
  itemWidth: Number,
  isLoading: Boolean
})

const renderedImg = ref()
const { height } = useElementSize(renderedImg)

setTimeout(() => {
  discoverStore().listHeight.push(height.value)
}, 1500)
</script>
<template>
  <div
    class="discover-item"
    :style="{
      height: `${height}px`
    }"
  >
    <el-skeleton
      animated
      :loading="props.isLoading"
      class="discover-item-skeleton"
    >
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
        <a href="#" class="item-link rlkYqFL_ waterfall-videoCardContainer">
          <div class="item-content" ref="renderedImg">
            <discover-video
              :img="props.img"
              :videoTime="props.videoTime"
              :like="props.like"
              :videoUrl="props.videoUrl"
              :itemWidth="props.itemWidth"
              :itemHeight="height"
            />

            <title-box
              :author="props.author"
              :title="props.title"
              :time="props.postTime"
            />
          </div>
        </a>
      </template>
    </el-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.discover-item {
  position: absolute;
  will-change: transform;

  .item-link {
    position: relative;

    .item-content {
      display: flex;
      flex-direction: column;
    }

    .item-content:hover {
      box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
    }
  }

  .rlkYqFL_ {
    box-shadow: 0 0 0.5px 0 rgba(242, 242, 243, 0.08);
    display: flex;
    flex-direction: column;
    position: relative;
    transition-duration: 0.35s;
    transition-property: transform, box-shadow;
    border: 0.5px solid rgba(255, 255, 255, 0.04);
    border-radius: 6px;
    overflow: hidden;
  }

  // html[dark] .waterfall-videoCardContainer.rlkYqFL_ {
  //   border-width: 0.5px;
  //   border-style: solid;
  //   border-color: rgba(255, 255, 255, 0.1);
  //   border-image: initial;
  // }

  html .waterfall-videoCardContainer.rlkYqFL_ {
    border-width: 0.5px;
    border-style: solid;
    border-color: rgba(22, 24, 35, 0.1);
    border-image: initial;
  }
  .waterfall-videoCardContainer.rlkYqFL_ {
    border-radius: 12px;
  }
}

.discover-item-skeleton {
  // background: #fff;
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
// @media (min-width: 884px) and (max-width: 1139px) {
//   .discover-item {
//     width: calc(33.3% - 16px);
//   }
// }
// @media (min-width: 1140px) and (max-width: 1359px) {
//   .discover-item {
//     width: calc(25% - 16px);
//   }
// }
// @media (min-width: 1360px) and (max-width: 1871px) {
//   .discover-item {
//     width: calc(20% - 16px);
//   }
// }

// @media (min-width: 1872px) and (max-width: 2231px) {
//   .discover-item {
//     width: calc(16.6% - 16px);
//   }
// }

// @media (min-width: 2231px) {
//   .discover-item {
//     width: calc(14.2% - 16px);
//   }
// }
</style>
