<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

import {
  VideoInfo,
  VideoSidebar,
  VideoSideBarBtn,
  VideoAction
} from '@/components/video-components'
import { videosCtrolStore } from '@/stores/videos-control'
import BasePlayer from './base-player.vue'
import ImageGalleryPlayer from './ImageGalleryPlyer.vue'

interface SwiperPlayerProps {
  awemeInfo: IAwemeInfo
  isPlay: boolean
  globalVolume?: number
  isShowInfo?: boolean
  isShowAvatar?: boolean
}
const props = withDefaults(defineProps<SwiperPlayerProps>(), {
  globalVolume: 0,
  isShowInfo: true,
  isShowAvatar: true
})

const { isPlay } = toRefs(props)
const playerOptions = {
  ignores: ['miniWin', 'playbackrate']
}
const awemeUrl = computed(() => {
  if (
    props.awemeInfo?.is_live_photo === 1 &&
    props.awemeInfo?.images?.[0]?.video
  ) {
    return props.awemeInfo?.images[0].video.play_addr.url_list
  }
  return props.awemeInfo?.video.play_addr.url_list ?? []
})
const isImageGallery = computed(
  () => props.awemeInfo.aweme_type === 68 && props.awemeInfo.is_live_photo !== 1
)

const imgGallery = computed(() => {
  if (!isImageGallery.value) return []
  return props.awemeInfo.images || []
})

const control = videosCtrolStore()
let currentWidth = ref('100%')

watch(control, () => {
  if (control.isShowComment) {
    //设置宽度
    currentWidth.value = '100%'
  } else {
    //设置宽度
    currentWidth.value = 'calc(100% - 336px)'

    //获取屏幕宽度
    const screenWidth = document.body.clientWidth
    // console.log(screenWidth)

    //如果屏幕宽度大于等于2560px，就设置宽度为100%-28.5714285714%
    if (screenWidth >= 1440) {
      currentWidth.value = 'calc(100% - 28.5714285714%)'
    }
  }
})
//打开评论
const openComments = () => {
  //隐藏按钮
  control.isShowComment = false
}

//关闭评论
const closeComments = () => {
  //显示按钮
  control.isShowComment = true
}

//切换评论区的显示状态
const toggleComments = (id: any) => {
  control.isShowComment = !control.isShowComment
  if (!control.isShowComment) {
    //如果评论区关闭，就执行打开评论操作
    openComments()
  } else {
    //否则执行关闭评论操作
    closeComments()
  }
}

//打开相关内容
const openRelated = () => {
  control.isShowRelated = true
}

const thumbnail = computed(() => {
  if (props.awemeInfo.video.big_thumbs) {
    return {
      img_urls: props.awemeInfo.video?.big_thumbs[0]?.img_urls,
      pic_num: props.awemeInfo.video?.big_thumbs[0]?.img_num,
      row: props.awemeInfo.video?.big_thumbs[0]?.img_x_len,
      col: props.awemeInfo.video?.big_thumbs[0]?.img_y_len,
      height: props.awemeInfo.video?.big_thumbs[0]?.img_y_size,
      width: props.awemeInfo.video?.big_thumbs[0]?.img_x_size
    }
  } else {
    return {}
  }
})
</script>

<template>
  <div class="swiper-player">
    <div
      class="videos-container"
      :style="{ width: currentWidth }"
      id="videos-controll"
    >
      <div class="slide-video">
        <BasePlayer
          v-if="!isImageGallery"
          ref="playerRef"
          :url="awemeUrl"
          :options="playerOptions"
          :is-play="isPlay"
          :thumbnail="thumbnail"
        >
          <video-info
            v-if="props.isShowInfo && !control.isImmersive"
            :username="props.awemeInfo.author.nickname"
            :uploadTime="props.awemeInfo.create_time"
            :description="props.awemeInfo.desc"
            :text-extra="props.awemeInfo?.text_extra ?? []"
          />
          <video-action
            v-if="!control.isImmersive"
            :aweme_id="props.awemeInfo.aweme_id"
            :user_id="props.awemeInfo.author.sec_uid"
            :avatar="props.awemeInfo.author.avatar_thumb.url_list[0] ?? ''"
            :digg_count="props.awemeInfo.statistics.digg_count"
            :comment_count="props.awemeInfo.statistics.comment_count"
            :collect_count="props.awemeInfo.statistics.collect_count"
            :share_count="props.awemeInfo.statistics.share_count"
            :user_digged="props.awemeInfo.user_digged"
            :collect_stat="props.awemeInfo.collect_stat"
            :follow_status="props.awemeInfo.author.follow_status"
            :isShowAvatar="props.isShowAvatar"
            @toggleComments="toggleComments(props.awemeInfo.aweme_id)"
          >
          </video-action>
        </BasePlayer>
        <ImageGalleryPlayer
          v-if="isImageGallery"
          :music_url="props.awemeInfo.music.play_url.url_list"
          :imgGallery="imgGallery"
          :isPlay="isPlay"
        >
          <video-info
            v-if="props.isShowInfo && !control.isImmersive"
            :username="props.awemeInfo.author.nickname"
            :uploadTime="props.awemeInfo.create_time"
            :description="props.awemeInfo.desc"
            :text-extra="props.awemeInfo?.text_extra ?? []"
          />
          <video-action
            v-if="!control.isImmersive"
            :aweme_id="props.awemeInfo.aweme_id"
            :user_id="props.awemeInfo.author.sec_uid"
            :avatar="props.awemeInfo.author.avatar_thumb.url_list[0] ?? ''"
            :digg_count="props.awemeInfo.statistics.digg_count"
            :comment_count="props.awemeInfo.statistics.comment_count"
            :collect_count="props.awemeInfo.statistics.collect_count"
            :share_count="props.awemeInfo.statistics.share_count"
            :user_digged="props.awemeInfo.user_digged"
            :collect_stat="props.awemeInfo.collect_stat"
            :follow_status="props.awemeInfo.author.follow_status"
            :isShowAvatar="props.isShowAvatar"
            @toggleComments="toggleComments(props.awemeInfo.aweme_id)"
          >
          </video-action>
        </ImageGalleryPlayer>
      </div>
      <video-search-btn @click="openRelated" v-if="!control.isShowRelated" />
      <!-- <video-side-bar-btn @click="openComments" v-if="control.isShowComment" /> -->
    </div>
    <slot></slot>
    <video-sidebar
      :user_sec_id="props.awemeInfo.author.sec_uid"
      :aweme_id="props.awemeInfo.aweme_id"
      :username="props.awemeInfo.author.nickname"
      :author_id="props.awemeInfo.author_user_id ?? ''"
      :relatedText="
        props.awemeInfo.suggest_words?.suggest_words[0]?.words[0]?.word ?? ''
      "
      @closeComments="closeComments"
      v-if="!control.isShowComment"
    />
    <!-- <div class="video-blur">
      <img
        :src="props.awemeInfo.video.cover.url_list[0] ?? ''"
        :alt="props.awemeInfo.desc"
      />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.swiper-player {
  border-radius: 16px;
  flex-grow: 1;
  height: 100%;
  opacity: 1;
  overflow: hidden;
  position: relative;
  transition: all 0.15s linear;
  width: 100%;
  min-width: 760px;
  display: flex;

  .videos-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: transparent;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 297px;
    display: inline-block;

    .slide-video {
      bottom: 0;
      overflow: hidden;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .close-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 64px;
      height: 64px;
      background-color: rgba(0, 0, 0, 0.18);
      border: 0.5px solid hsla(0, 0%, 100%, 0.15);
      border-radius: 32px;
      z-index: 100;

      &:hover {
        background-color: rgba(0, 0, 0, 0.35);

        .icon {
          color: #fff;
        }
      }

      .icon {
        height: 18px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 18px;
        color: hsla(0, 0%, 100%, 0.25);
      }
    }
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
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .videos-container {
    width: 71.4285714286%;
  }
}

@media screen and (min-width: 2560px) {
  .videos-container {
    width: calc(100% - 656px);
  }
}
</style>
