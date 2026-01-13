<script setup lang="ts">
import { computed, ref } from 'vue'
import miniPlayer from '@/components/video-player/mini-player.vue'
import { useCount } from '@/hooks'
import { formatMillisecondsToTime } from '@/utils/date-format'

interface DiscoverVideoProps {
  img?: string
  videoTime?: number
  like?: number
  videoUrl?: string | string[]
  itemWidth?: number
  itemHeight?: number
  // 直播相关
  isLive?: boolean
  liveStreamUrls?: string[]
  liveViewCount?: string | number
  anchorAvatar?: string
}

const props = withDefaults(defineProps<DiscoverVideoProps>(), {
  img: '',
  videoTime: 0,
  like: 0,
  videoUrl: '',
  isLive: false,
  liveStreamUrls: () => [],
  liveViewCount: '',
  anchorAvatar: ''
})

const isVideoVisible = ref(false)
let timer: any = null
let volume = ref(0)
const showVideo = () => {
  timer = setTimeout(() => {
    isVideoVisible.value = true
    volume.value = 0.6
  }, 1000)
}
const hideVideo = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    isVideoVisible.value = false
  }, 200)
}

const video_time = computed(() => {
  return formatMillisecondsToTime(props.videoTime)
})

const video_like = useCount(props.like)
const img_url = ref(props.img)
const isShowImg = ref(true)
const onError = () => {
  isShowImg.value = false
}

// 直播流状态
const isLiveStreamError = ref(false)
const livePlayerKey = ref(0)

// 是否有可用的直播流
const hasLiveStream = computed(() => props.liveStreamUrls && props.liveStreamUrls.length > 0)

// 直播流加载错误处理
const onLiveStreamError = () => {
  isLiveStreamError.value = true
}

// 刷新直播流
const refreshLiveStream = () => {
  isLiveStreamError.value = false
  livePlayerKey.value++
}
</script>
<template>
  <div
    class="item-video videoImage"
    :class="{ 'is-live': isLive }"
    @mouseenter="showVideo"
    @mouseleave="hideVideo"
  >
    <div class="item-video-content" ref="renderedImg">
      <div class="item-video-content-img item-video-content-img-hover">
        <div class="item-video-content-img-item-defalut"></div>
        <div class="item-video-content-img-item-block"></div>
        <img
          :src="img_url"
          alt="video-cut"
          fetchpriority="high"
          decoding="async"
          loading="lazy"
          @error="onError"
          v-if="isShowImg && !isLive"
        />
        <svg-icon
          class="icon"
          icon="loading-logo"
          v-if="!isShowImg && !isLive"
        />
        <!-- 直播封面图（流错误时显示） -->
        <img
          :src="img_url"
          alt="live-cover"
          class="live-cover"
          v-if="isLive && (isLiveStreamError || !hasLiveStream)"
        />
        <!-- 直播流播放 -->
        <miniPlayer
          v-if="isLive && hasLiveStream && !isLiveStreamError"
          :key="livePlayerKey"
          class="video-player live-player"
          :url="liveStreamUrls"
          @error="onLiveStreamError"
        />
        <!-- 直播流错误提示 -->
        <div
          class="live-stream-error"
          v-if="isLive && (isLiveStreamError || !hasLiveStream)"
        >
          <div class="error-text">不支持的音频/视频格式</div>
          <div class="error-action" @click.stop="refreshLiveStream">
            请试试<span class="refresh-link">刷新</span>
          </div>
        </div>
        <!-- 普通视频 hover 播放 -->
        <miniPlayer
          v-else-if="isVideoVisible && !isLive"
          class="video-player"
          :url="videoUrl"
          :volume="volume"
        />
        <!-- 普通视频的点击层 -->
        <div
          class="overlay"
          v-if="isVideoVisible && !isLive"
          @click="$emit('openModal')"
        ></div>
      </div>

      <!-- 直播信息覆盖层 -->
      <div class="live-overlay" v-if="isLive">
        <!-- 直播中标签 -->
        <div class="live-tag">
          <span class="live-dot"></span>
          <span>直播中</span>
        </div>
        <!-- 主播头像 -->
        <div class="anchor-avatar" v-if="anchorAvatar">
          <img :src="anchorAvatar" alt="" />
        </div>
        <!-- 观看人数 -->
        <div class="live-view-count" v-if="liveViewCount">
          <svg
            width="12"
            height="14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.81 3.615c0 1.485-1.24 2.692-2.777 2.71h-.066C4.43 6.306 3.189 5.1 3.189 3.614v-.904C3.19 1.214 4.45 0 6 0c1.552 0 2.81 1.214 2.81 2.711v.904zM1.163 8.594c1.167-.557 3.512-.864 4.837-.864 1.327 0 3.676.307 4.846.868.679.38 1.155 1.23 1.155 2.225v.572c0 .738-.39 1.357-.928 1.556-1.284.366-3.698.563-5.071.563-1.375 0-3.79-.201-5.078-.565C.391 12.748 0 12.13 0 11.393v-.572c0-.997.478-1.85 1.162-2.227z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
          </svg>
          <span>{{ liveViewCount }}</span>
        </div>
      </div>

      <!-- 普通视频信息 -->
      <div class="item-video-info" v-if="!isVideoVisible && !isLive">
        <div class="item-video-block"></div>
        <div class="item-video-info-content">
          <div class="info-content-blank"></div>
          <div class="info-content-blank2"></div>
          <div class="video-time">{{ video_time }}</div>
          <div class="likes">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="BnHuaqS7"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.224 4.667C6.326 4.667 4 7.151 4 10.043l.002.169a1.078 1.078 0 00-.002.094c.009.387.097.855.195 1.245.096.382.23.806.38 1.113.605 1.301 1.664 2.563 2.683 3.6a30.679 30.679 0 003.425 3.008l.02.017.015.012c.226.226.703.7 1.554.7h.025c.241 0 .816-.001 1.331-.502.009-.008.022-.02.042-.035l.182-.151.004-.004c.565-.465 1.886-1.554 3.188-2.867.834-.836 1.698-1.807 2.359-2.81.09-.136.176-.273.258-.41.033-.055.06-.112.082-.17.03-.077.044-.108.055-.13.013-.025.034-.063.088-.146.038-.06.07-.122.096-.188.037-.093.064-.156.085-.199l.004-.009c.087-.11.152-.238.19-.374.162-.576.273-1.082.284-1.705 0-.03 0-.058-.002-.087a7.123 7.123 0 00.001-.206c-.019-2.876-2.338-5.341-5.224-5.341-1.094 0-2.159.339-2.999 1.021-.909-.658-1.957-1.021-3.097-1.021zm9.162 5.377v.134a2.388 2.388 0 000 .14c-.01.294-.057.559-.156.935-.043.07-.076.135-.1.186a4.313 4.313 0 00-.116.26c-.108.173-.178.31-.251.492-.05.082-.104.167-.16.252h-.001c-.55.834-1.304 1.69-2.087 2.476l-.003.002c-1.223 1.234-2.474 2.266-3.033 2.727l-.041.034c-.05.04-.105.086-.157.13l-.06-.061c-.065-.064-.154-.135-.197-.17l-.008-.006a28.517 28.517 0 01-3.214-2.817l-.003-.004c-.968-.985-1.824-2.042-2.27-3.009a4.077 4.077 0 01-.24-.719 4.491 4.491 0 01-.129-.715l.001-.036v-.098l-.001-.005-.002-.129c0-1.778 1.436-3.218 3.066-3.218.857 0 1.667.348 2.393 1.102a1.079 1.079 0 001.66-.129c.428-.61 1.155-.973 2.043-.973 1.63 0 3.066 1.441 3.066 3.218v.001z"
                fill="#fff"
              ></path>
            </svg>
            <span>{{ video_like }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-video {
  // 使用 aspect-ratio 替代 padding-top，更可靠的宽高比控制
  aspect-ratio: 4 / 3;
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;

  .item-video-content {
    align-items: center;
    background: unset;
    cursor: pointer;
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;

    .item-video-content-img {
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
      position: relative;
      width: 100%;

      .item-video-content-img-item-block,
      .item-video-content-img-item-defalut {
        bottom: 0px;
        left: 0px;
        position: absolute;
        right: 0px;
        top: 0px;
      }

      .item-video-content-img-item-defalut {
        background-size: cover;
        filter: blur(20px);
        background-repeat: no-repeat;
      }

      .item-video-content-img-item-block {
        background-color: rgba(0, 0, 0, 0.3);
      }

      img {
        width: 100%;
        object-fit: contain;
        color: rgb(22, 23, 34);
        max-height: 100%;
        max-width: 100%;
        position: relative;
        // transition: all 0.3s linear 0s;
        border-radius: 12px;
      }

      .icon {
        width: 100px;
        height: 100px;
        color: rgba(22, 23, 34, 1);
      }
    }

    .item-video-content-img-hover {
      animation-timeline: unset !important;
      // animation-range-start: unset !important;
      // animation-range-end: unset !important;
      animation: unset !important;
    }

    .item-video-info {
      height: 100%;
      left: 0px;
      position: absolute;
      top: 0px;
      width: 100%;

      .item-video-block {
        bottom: 0px;
        height: 64px;
        position: absolute;
        width: 100%;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
      }

      .item-video-info-content {
        height: 100%;
        position: relative;
        width: 100%;

        .info-content-blank2 {
          display: flex;
          left: 12px;
          position: absolute;
          top: 12px;
        }

        .info-content-blank {
          display: flex;
          left: 8px;
          position: absolute;
          top: 8px;
        }

        .video-time {
          background-color: rgba(0, 0, 0, 0.7);
          bottom: 10px;
          color: rgb(255, 255, 255);
          font-size: 12px;
          line-height: 20px;
          min-width: 43px;
          position: absolute;
          right: 8px;
          text-align: center;
          border-radius: 4px;
          padding: 0px 5px;
        }

        .likes {
          align-items: center;
          bottom: 8px;
          color: rgb(255, 255, 255);
          display: inline-flex;
          font-size: 13px;
          height: 24px;
          left: 8px;
          line-height: 21px;
          opacity: 0.9;
          position: absolute;
          text-shadow: rgba(0, 0, 0, 0.15) 0px 0.712644px 0.712644px;
        }
      }
    }

    .video-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 1;
    }

    // 直播播放器样式
    .live-player {
      :deep(video) {
        object-fit: cover;
      }
      // 隐藏播放器控件
      :deep(.xgplayer-controls) {
        display: none !important;
      }
    }

    // 直播封面图
    .live-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 12px;
    }

    // 直播流错误提示
    .live-stream-error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #fff;
      pointer-events: auto;

      .error-text {
        font-size: 14px;
        margin-bottom: 8px;
      }

      .error-action {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);

        .refresh-link {
          color: #fe2c55;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      z-index: 2;
    }
  }
}

// 直播卡片样式
.item-video.is-live {
  .item-video-content {
    background: #000;
  }
}

// 直播信息覆盖层
.live-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;

  // 直播中标签
  .live-tag {
    position: absolute;
    top: 8px;
    right: 8px;
    gap: 4px;
    color: rgb(255, 255, 255);
    justify-content: center;
    align-items: center;
    display: flex;
    background: linear-gradient(
      131.17deg,
      rgb(255, 23, 100) 0%,
      rgb(237, 52, 149) 94.15%
    );
    border-radius: 6px;
    padding: 4px;
    text-align: center;
    vertical-align: middle;
    font-family: 'PingFang SC';
    font-size: 12px;
    font-weight: 500;
    line-height: 100%;
    white-space: nowrap;
    flex: 1 1 0%;

    .live-dot {
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
      animation: live-pulse 1.5s ease-in-out infinite;
    }
  }

  // 主播头像
  .anchor-avatar {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.8);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  // 观看人数
  .live-view-count {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      flex-shrink: 0;
    }
  }
}

@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// .item-content:hover {
//   .item-video-content-img-hover {
//     transform: scale(1.05);
//   }
// }
</style>
