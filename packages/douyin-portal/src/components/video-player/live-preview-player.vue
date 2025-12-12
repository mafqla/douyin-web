<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import BasePlayer from './base-player.vue'
import type { ILiveStreamInfo } from '@/api/tyeps/common/aweme'
import { videosCtrolStore } from '@/stores/videos-control'

interface LivePreviewPlayerProps {
  url: string | string[]
  roomData?: ILiveStreamInfo | null
  isPlay?: boolean
}

const props = withDefaults(defineProps<LivePreviewPlayerProps>(), {
  isPlay: true
})

const store = videosCtrolStore()

const playerOptions = {
  ignores: [
    'fullscreen',
    'cssfullscreen',
    'playbackrate',
    'PlaybackPlugin',
    'miniWin',
    'watchLater',
    'immersiveSwitch',
    'progress', // 直播没有进度条
    'time' // 直播没有时间显示
  ],
  isLive: true // 标记为直播模式
}

// 解析直播间数据
const liveData = computed(() => {
  if (props.roomData) {
    return props.roomData
  }
  return null
})

// 倒计时逻辑
const COUNTDOWN_SECONDS = 16
const remainingTime = ref(COUNTDOWN_SECONDS)
const isPaused = ref(false) // 播放器是否暂停
let countdownTimer: ReturnType<typeof setInterval> | null = null

const startCountdown = () => {
  stopCountdown()
  remainingTime.value = COUNTDOWN_SECONDS
  countdownTimer = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      stopCountdown()
      // 倒计时结束，切换到下一个视频
      store.handleNext()
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 播放器播放事件
const onPlay = () => {
  isPaused.value = false
}

// 播放器暂停事件
const onPause = () => {
  isPaused.value = true
}

// 当组件激活、连播开启且未暂停时开始倒计时
watch(
  [() => props.isPlay, () => store.isAutoContinuous, isPaused],
  ([isPlaying, isAutoContinuous, paused]) => {
    if (isPlaying && isAutoContinuous && !paused) {
      startCountdown()
    } else {
      stopCountdown()
      remainingTime.value = COUNTDOWN_SECONDS
    }
  },
  { immediate: true }
)

// 组件销毁时清理定时器
onBeforeUnmount(() => {
  stopCountdown()
})
</script>

<template>
  <div class="live-preview-player">
    <BasePlayer
      :url="props.url"
      :options="playerOptions"
      :isPlay="props.isPlay"
      :loop="false"
      class="live-preview"
      @play="onPlay"
      @pause="onPause"
    />

    <div class="live-preview-btn">
      <div class="live-btn-content">
        <div class="live-btn-top">
          <div
            class="live-btn--icon"
            style="width: 20px; height: 20px; --wave-border: 1.5px"
          >
            <span></span>
          </div>
          <div class="live-btn-text">
            点击或按
            <div class="f-icon"></div>
            进入直播间
          </div>
        </div>
        <div class="live-btn-time" v-if="store.isAutoContinuous && !isPaused">
          {{ remainingTime }}秒后进入下一个直播间
        </div>
      </div>
    </div>
    <!-- 直播间信息 -->
    <div class="live-info" v-if="liveData">
      <!-- 直播标识 -->
      <div class="live-badge">
        <span class="live-text">直播中</span>
      </div>
      <div class="live-author">
        <a :href="`/user/${liveData.owner_user_id}`" target="_blank">
          <span class="author-name">@{{ liveData.owner?.nickname }}</span>
        </a>

        <!-- <span class="viewer-count"
          >{{ liveData.stats?.user_count_str }} 观看</span
        > -->
      </div>
      <div class="live-title">{{ liveData.title }}</div>
    </div>
    <!--更多-->
    <div class="live-more">
      <svg
        width="36"
        height="36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M16.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"
          fill="#fff"
          fill-opacity="1"
        ></path>
      </svg>
    </div>
    <HoverDropdown placement="auto" content-class="live-more-menu">
      <template #trigger> </template>
      <template #content>
        <div class="more-menu-item">不感兴趣</div>
        <div class="more-menu-item">举报</div>
      </template>
    </HoverDropdown>
  </div>
</template>

<style lang="scss" scoped>
.live-preview-player {
  width: 100%;
  height: 100%;
  color: #fff;
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  .live-preview-btn {
    width: 100%;
    z-index: 14;
    padding: 0 16px;
    position: absolute;
    bottom: 108px;
    left: 0;
    cursor: pointer;
    .live-btn-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .live-btn-top {
      min-width: 254px;
      height: 72px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 117.732px;
      justify-content: center;
      animation: 1s 4s forwards wHRmEUTS;
      position: relative;
      align-items: center;
      padding: 0 34px;
      display: flex;

      @keyframes wHRmEUTS {
        100% {
          background: rgba(255, 255, 255, 0.2);
        }
      }
      .live-btn--icon {
        width: 20px;
        height: 20px;
        justify-content: space-between;
        align-items: flex-end;
        display: flex;
        position: relative;
        overflow: visible;

        span,
        &::before,
        &::after {
          content: '';
          width: 15%;
          height: 50%;
          border-radius: 1.5px;
          border-radius: var(--wave-border);
          transform-origin: bottom;
          background: #fff;
          position: absolute;
          bottom: 1px;
        }

        &::before {
          animation: 1s ease-in-out infinite VX_RNMqX;
          left: 38%;
        }
        &::after {
          animation: 1s ease-in-out 0.4s infinite VX_RNMqX;
          right: 10%;
        }
        @keyframes VX_RNMqX {
          50% {
            height: 50%;
          }
          100% {
            height: 100%;
          }
          50% {
            height: 50%;
          }
        }
      }
      .live-btn-text {
        height: 28px;
        color: #fff;
        align-items: center;
        margin-left: 10px;
        font-family: PingFang SC;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 28px;
        display: flex;

        .f-icon {
          height: 20px;
          width: 20px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIVSURBVHgB7ZvtcYJAEIZfmPyPJWAFSQeaCmIqECvQVJCxArUCtYKkg5gOtALpQDq47HKHwxiCMp4Iyz0zK/I14+vex8LtergApVSHNs9kA7IeWUDWwX2JybZkO7KN53lfl9zkFZ00QsdkE9xf4DkishXZmsRHKAuJHZMdVPPYk4VltLLYmWo+szxtXo7YJW1CyGBFzXuUPeBnd8y/EkIO4amnjx5Wut0vIZN38vScvySCSWxAm2/o6UYiPIV1SXScNukh5IpleErlqfXo4T1kC2YSL/sklqOnAPJJokVu0n20hwELfkJ76HnUpA+wGydzX3mDPfi3fcIOMQtWsEtEw38XljBT5h6W8NEynGDpPKBCzJxfdoC0+uKh0kGrDhGd68PScYKl4wRLxwUeN2ZU8vo+2QcsUqlgCkg2Za43T0pWcX1YOm7QuiXUJ/nt/2OJWwJYpupR+hXuaalanGDpOMHScYKl4wRLxwmWzi1WHmoNezhGe0jSliK0hy0L/kF72LHgixKrhbDhQYvXX3kZs+4J4NeSLOP6nH9IOwvIZ80faeqhdC9HZC9cGpAEHsbLU8hlmtZBHCMtk08ssWkvSNsq3ckrAeCTQ8iAK1zC7IE/sbS5QIKnF6diC+GSAKVLYpoGlx5N/tN1rlArgC76aELGfDq9zs0gnEuh4CxKJ5X1odONuSyvDqV4EXRozNHitkhoyi9mWs19miAxqAAAAABJRU5ErkJggg==);
          background-position: 50%;
          background-repeat: no-repeat;
          background-size: cover;
          margin: 0 4px;
          display: inline-block;
        }
      }
    }
    .live-btn-time {
      color: #fff;
      width: 100%;
      justify-content: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      display: flex;
      position: absolute;
      bottom: -28px;
    }
  }
  .live-badge {
    display: flex;
    margin-bottom: 8px;

    .live-text {
      background: linear-gradient(
        134.66deg,
        rgb(255, 23, 100) 0%,
        rgb(237, 52, 149) 100%
      );
      color: #fff;
      height: 20px;
      border-radius: 4px;
      justify-content: center;
      align-items: center;
      padding: 0 4px;
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      display: inline-flex;
    }
  }

  .live-info {
    width: 100%;
    z-index: 10;
    padding: 0 16px;
    position: absolute;
    bottom: 48px;
    left: 0;
    pointer-events: none;
    flex-direction: column;
    font-weight: 400;
    display: flex;
    overflow: hidden;
    .live-title {
      max-width: 75%;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 14px;
      line-height: 22px;
    }

    .live-author {
      display: flex;
      align-items: center;
      gap: 8px;

      .author-name {
        max-width: 75%;
        white-space: nowrap;
        text-overflow: ellipsis;
        align-items: center;
        display: flex;
        // overflow: hidden;
        font-size: 18px;
        font-weight: 500;
        line-height: 26px;
        color: #fff;
      }

      .viewer-count {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-left: auto;
      }
    }
  }
  .live-more {
    width: 40px;
    height: 40px;
    z-index: 12;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    display: flex;
    position: absolute;
    bottom: 60px;
    right: 13px;
  }
  :deep(.live-more-menu) {
    width: 140px;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
