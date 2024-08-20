<script setup lang="ts">
import apis from '@/api/apis'
import type { IawemeDetail } from '@/api/tyeps/request_response/videoDetailRes'
import { Loading } from '@/components/common'
import BasePlayer from '@/components/video-player/base-player.vue'
import PageFooter from '@/layout/page-footer.vue'
import { playerSettingStore } from '@/stores/player-setting'
import { settingStore } from '@/stores/setting'
import { toRef } from 'vue'
import { useRoute } from 'vue-router'
import RelatedComment from './components/related-comment.vue'
import RelatedVideo from './components/related-video.vue'
import VideoDetailInfo from './components/video-detail-info.vue'

const playerOptions = {
  volume: 0.5,
  autoplayMuted: true,
  keyShortcut: 'on',
  cssFullscreen: true,
  ignores: ['playbackrate']
} as any

const isShowSwitchControl = toRef(settingStore(), 'isShowSwitchControl')

//获取当前请求参数
const route = useRoute()
const awemeId = Number(route.params.id)
/**
 * todo
 * 调用接口获取视频信息
 * 1.点赞接口
 * 2. 收藏接口
 * 3. 分享接口
 * 4. 相关推荐视频接口
 */

const loading = ref(true)
const videoDetail = ref<IawemeDetail>()
provide('videoDetail', videoDetail)
const getVideoDetail = async (awemeId: number) => {
  try {
    const res = await apis.getVideoDetail(awemeId)
    videoDetail.value = res.aweme_detail
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getVideoDetail(awemeId)
})
const awemeUrl = computed(() => {
  return videoDetail.value?.video.play_addr.url_list ?? []
})

const metaTitle = computed(() => {
  return videoDetail.value?.desc
    ? `${videoDetail.value?.desc} - 抖音`
    : window.location.href
})
useTitle(metaTitle)
onUnmounted(() => {
  useTitle('抖音-记录美好生活')
})
</script>
<template>
  <Loading
    :show="loading"
    :isShowText="true"
    :center="true"
    text="视频数据加载中"
  >
    <div class="video" v-if="videoDetail">
      <div class="video-detail">
        <div class="left-content">
          <div class="video-detail-container">
            <BasePlayer
              :url="awemeUrl"
              :options="playerOptions"
              class="related-video"
            >
              <template v-slot:switch>
                <swiper-control-modal
                  class="swiper-control"
                  v-show="isShowSwitchControl"
                  style="justify-content: center; height: auto; bottom: 50%"
                />
              </template>
            </BasePlayer>
          </div>
          <video-detail-info
            :description="videoDetail?.desc"
            :seo-description="videoDetail?.seo_info.ocr_content"
          />
          <related-video
            :author="videoDetail?.author"
            :aweme-id="videoDetail?.aweme_id"
            class="left-content-recommend"
          />
          <related-comment
            :aweme_id="videoDetail?.aweme_id"
            :author_id="videoDetail.author.uid"
            :related-text="
              videoDetail?.suggest_words.suggest_words[0].words[0].word
            "
          />
        </div>
        <div class="right-content">
          <related-video
            :author="videoDetail?.author"
            :aweme-id="videoDetail?.aweme_id"
          />
        </div>
      </div>
      <page-footer />
    </div>
  </Loading>
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
