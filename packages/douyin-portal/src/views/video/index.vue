<script setup lang="ts">
import { toRef } from 'vue'
import VideoDetailInfo from './components/video-detail-info.vue'
import RelatedVideo from './components/related-video.vue'
import BasePlayer from '@/components/video-player/base-player.vue'
import RelatedComment from './components/related-comment.vue'
import testVideo from '/test-video/test1.mp4?url'
import testImg from '@/assets/test-img/test-img.jpeg'
import { settingStore } from '@/stores/setting'
import { useRoute } from 'vue-router'
const playerOptions = {
  url: testVideo,
  miniScreen: {
    disable: false,
    height: 197,
    top: 728,
    left: 1329,
    isScrollSwitch: true,
    disableDrag: true,
    isShowIcon: true
  },
  volume: 0.5,
  autoplayMuted: true,
  keyShortcut: 'on',
  cssFullscreen: true,
  playbackRate: [0.5, 1.0, 1.5, 1.75, 2]
} as any

const isShowSwitchControl = toRef(settingStore(), 'isShowSwitchControl')

//获取当前请求参数
const route = useRoute()
console.log(route.params)
/**
 * todo
 * 调用接口获取视频信息
 * 1.点赞接口
 * 2. 收藏接口
 * 3. 分享接口
 * 4. 相关推荐视频接口
 */
</script>
<template>
  <div class="video">
    <div class="video-detail">
      <div class="left-content">
        <div class="video-detail-container">
          <BasePlayer :options="playerOptions" class="related-video">
            <template v-slot:switch>
              <swiper-control-modal
                class="swiper-control"
                v-show="isShowSwitchControl"
                style="justify-content: center; height: auto; bottom: 50%"
              />
            </template>
          </BasePlayer>
        </div>
        <video-detail-info />
        <related-video class="left-content-recommend" />
        <related-comment />
      </div>
      <div class="right-content">
        <related-video />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: unset;
  min-height: 100%;
}

.video-detail {
  width: 100%;
  margin-bottom: 64px;
  padding: 0 40px;
}

.left-content {
  width: 100%;

  .video-detail-container {
    margin-top: 16px;
    min-height: 300px;
    border-radius: 16px;
    // margin-top: 24px;
    position: relative;
    overflow: hidden;
    &:before {
      width: 100%;
      height: 0;
      content: '';
      // padding-top: calc(56.25% + 33px);
      padding-top: calc(56.25% + 60px);
      display: block;
    }

    .related-video {
      position: absolute;
      top: 0;
      left: 0;

      .swiper-control {
        height: 100%;
        z-index: 11;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-right: 12px;
        display: flex;
        position: absolute;
        right: 0;
      }
    }
  }
}
.right-content {
  margin-bottom: 40px;
}
@media (min-width: 1240px) {
  .video-detail {
    padding: 0 24px 0 0;
  }
}

@media (min-width: 1032px) {
  .video-detail {
    max-width: calc(175.2vh + 57.816px) !important;
    .right-content {
      width: 25%;
      display: block !important;
    }
  }
  .left-content {
    width: 75%;
    padding-right: 20px;
  }
  .left-content-recommend {
    display: none;
  }
}
@media (min-width: 1032px) {
  .video-detail {
    // max-width: 175.2vh;
    display: flex;
  }
}
@media (min-width: 1024px) {
  .video-detail {
    padding: 0 24px 0 0;
  }
}
@media (min-width: 0) {
  .video-detail {
    min-width: 852px;
    max-width: 134.2vh;
    margin-left: auto;
    margin-right: auto;
    .right-content {
      display: none;
    }
  }
}
</style>
