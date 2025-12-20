<script setup lang="ts">
import apis from '@/api/apis'
import { Loading } from '@/components/common'
import BasePlayer from '@/components/video-player/base-player.vue'
import PageFooter from '@/layout/page-footer.vue'
import { playerSettingStore } from '@/stores/player-setting'
import { settingStore } from '@/stores/setting'
import { useCurrentVideoStore } from '@/stores/current-video'
import { useSidebarStore } from '@/stores/sidebar'
import SwiperControl from '@/components/swiper/swiper-control.vue'
import { toRef } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import RelatedComment from './components/related-comment.vue'
import RelatedVideo from './components/related-video.vue'
import VideoDetailInfo from './components/video-detail-info.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { getAwemeLink } from '@/utils/aweme-link'

const currentVideoStore = useCurrentVideoStore()
const playerSetting = playerSettingStore()
const sidebarStore = useSidebarStore()

const playerOptions = {
  cssFullscreen: true,
  ignores: ['playbackrate']
} as any

const isShowSwitchControl = toRef(settingStore(), 'isShowSwitchControl')

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const videoDetail = ref<IAwemeInfo>()
provide('videoDetail', videoDetail)

// 推荐视频列表
const relatedList = computed(() => sidebarStore.relatedVideoList)

// 当前视频在推荐列表中的索引（排除第一个当前视频）
const nextVideoIndex = computed(() => {
  // 推荐列表第一个是当前视频，所以下一个视频从索引1开始
  return relatedList.value.length > 1 ? 1 : -1
})

// 是否可以向上切换（历史记录中有视频）
const canGoPrev = computed(() => sidebarStore.canGoPrevVideo)
// 是否可以向下切换（推荐列表中有下一个视频）
const canGoNext = computed(() => nextVideoIndex.value > 0)

const getVideoDetail = async (awemeId: string) => {
  try {
    loading.value = true
    const res = await apis.getVideoDetail(awemeId)
    const detail = res.aweme_detail
    
    // 如果是图集类型（aweme_type === 68 且不是实况照片），跳转到note页面
    if (detail?.aweme_type === 68 && detail?.is_live_photo !== 1) {
      router.replace(`/note/${awemeId}`)
      return
    }
    
    videoDetail.value = detail
    currentVideoStore.setScene('comment_top_rec')
    currentVideoStore.setCurrentVideo(detail)
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

// 切换到上一个视频（从历史记录中取）
const switchToPrevVideo = () => {
  if (!canGoPrev.value) return
  const prevItem = sidebarStore.popVideoHistory()
  if (prevItem) {
    router.push(getAwemeLink(prevItem))
  }
}

// 切换到下一个视频（从推荐列表中取，并记录当前视频到历史）
const switchToNextVideo = () => {
  if (!canGoNext.value || !videoDetail.value) return
  // 将当前视频加入历史记录
  sidebarStore.pushVideoHistory(videoDetail.value)
  // 取推荐列表中的下一个视频（索引1）
  const nextItem = relatedList.value[nextVideoIndex.value]
  if (nextItem) {
    router.push(getAwemeLink(nextItem))
  }
}

// 视频播放结束处理
const onEnded = () => {
  // 如果开启了自动连播，则自动切换到下一个视频
  if (playerSetting.isAutoContinuous && canGoNext.value) {
    switchToNextVideo()
  }
}

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  // 上箭头 - 上一个视频
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (canGoPrev.value) {
      switchToPrevVideo()
    }
  }
  // 下箭头 - 下一个视频
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (canGoNext.value) {
      switchToNextVideo()
    }
  }
}

// 监听路由参数变化，重新获取视频详情
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      getVideoDetail(newId as string)
    }
  }
)

onMounted(() => {
  getVideoDetail(route.params.id as string)
  window.addEventListener('keydown', handleKeydown)
})

// 只有真正离开 video 页面时才清空历史记录
onBeforeRouteLeave((to) => {
  // 如果跳转到其他 video 页面，不清空
  if (to.path.startsWith('/video/')) {
    return
  }
  // 离开 video 页面，清空历史记录
  sidebarStore.setRelatedVideoList([])
  sidebarStore.clearVideoHistory()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  useTitle('抖音-记录美好生活')
})

const awemeUrl = computed<string | string[]>(() => {
  if (
    videoDetail.value?.is_live_photo === 1 &&
    videoDetail.value?.images?.[0]?.video
  ) {
    return videoDetail.value?.images[0]?.video.play_addr?.url_list ?? []
  }
  return videoDetail.value?.video.play_addr.url_list ?? []
})

const metaTitle = computed(() => {
  return videoDetail.value?.desc
    ? `${videoDetail.value?.desc} - 抖音`
    : window.location.href
})
useTitle(metaTitle)
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
              :bit-rates="videoDetail?.video.bit_rate"
              :options="playerOptions"
              :isPlay="true"
              class="related-video"
              @ended="onEnded"
            >
              <template v-slot:switch>
                <SwiperControl
                  class="swiper-control"
                  v-show="isShowSwitchControl"
                  :customControl="true"
                  :disablePrev="!canGoPrev"
                  :disableNext="!canGoNext"
                  @prev="switchToPrevVideo"
                  @next="switchToNextVideo"
                  style="justify-content: center; height: auto; bottom: 50%"
                />
              </template>
            </BasePlayer>
          </div>
          <video-detail-info
            :description="videoDetail?.desc"
            :text-extra="videoDetail?.text_extra"
            :seo-description="videoDetail?.seo_info.ocr_content"
          />
          <related-video
            :author="videoDetail?.author"
            :aweme-id="videoDetail?.aweme_id"
            :current-aweme="videoDetail"
            class="left-content-recommend"
          />
          <related-comment
            :aweme_id="videoDetail?.aweme_id"
            :author_id="videoDetail.author.uid"
            :related-text="
              videoDetail?.suggest_words?.suggest_words[0]?.words[0]?.word ?? ''
            "
          />
        </div>
        <div class="right-content">
          <related-video
            :author="videoDetail?.author"
            :aweme-id="videoDetail?.aweme_id"
            :current-aweme="videoDetail"
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

    .video-blur {
      bottom: 0;
      left: 0;
      overflow: hidden;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
      transform: scale(1.2);

      img {
        filter: blur(60px);
        height: 100%;
        opacity: 0.8;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 100%;
      }
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
