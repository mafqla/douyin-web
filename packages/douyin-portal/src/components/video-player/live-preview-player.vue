<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, onMounted, nextTick } from 'vue'
import BasePlayer from './base-player.vue'
import type { ILiveStreamInfo } from '@/api/tyeps/common/aweme'
import { videosCtrolStore } from '@/stores/videos-control'
import { playerSettingStore } from '@/stores/player-setting'
import LiveRefresh from './plugin/live-refresh/live-refresh'
import HlsPlugin from 'xgplayer-hls'
import FlvPlugin from 'xgplayer-flv'

interface LivePreviewPlayerProps {
  url: string | string[]
  roomData?: ILiveStreamInfo | null
  isPlay?: boolean
}

const props = withDefaults(defineProps<LivePreviewPlayerProps>(), {
  isPlay: true
})

const emit = defineEmits<{
  streamUnavailable: []
  streamAvailable: []
  streamSwitch: [index: number]
}>()

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
    'time', // 直播没有时间显示
    'claritySwitch'
  ],
  isLive: true, // 标记为直播模式
  // HLS 直播配置
  hls: {
    retryCount: 3,
    retryDelay: 1000,
    loadTimeout: 10000,
    targetLatency: 5, // 目标延迟 5 秒
    maxLatency: 10, // 最大延迟 10 秒
    disconnectTime: 0 // 暂停时立即断流
  },
  // FLV 直播配置
  flv: {
    retryCount: 3,
    retryDelay: 1000,
    loadTimeout: 10000,
    targetLatency: 5,
    maxLatency: 10,
    disconnectTime: 0,
    maxReaderInterval: 5000
  },
  plugins: [HlsPlugin, FlvPlugin, LiveRefresh] // HLS、FLV 和直播刷新插件
}

// 直播流状态
const isStreamAvailable = ref(true)
const streamCheckMessage = ref('')
const basePlayerRef = ref<InstanceType<typeof BasePlayer> | null>(null)

// 流切换相关
const currentStreamIndex = ref(0) // 当前使用的流索引
const isSwitchingStream = ref(false) // 是否正在切换流
const failedStreamIndexes = ref<Set<number>>(new Set()) // 已失败的流索引
const MAX_SWITCH_ATTEMPTS = 3 // 最大切换尝试次数
const SWITCH_COOLDOWN = 2000 // 切换冷却时间（毫秒）
let lastSwitchTime = 0

// 获取所有可用的流地址列表
const streamUrls = computed(() => {
  if (Array.isArray(props.url)) {
    return props.url
  }
  return props.url ? [props.url] : []
})

// 当前使用的流地址
const currentStreamUrl = computed(() => {
  const urls = streamUrls.value
  if (urls.length === 0) return ''
  // 确保索引在有效范围内
  const index = Math.min(currentStreamIndex.value, urls.length - 1)
  return urls[index]
})

// 是否还有可用的备用流
const hasAlternativeStream = computed(() => {
  const urls = streamUrls.value
  if (urls.length <= 1) return false
  // 检查是否还有未尝试过的流
  return urls.some(
    (_, index) =>
      !failedStreamIndexes.value.has(index) &&
      index !== currentStreamIndex.value
  )
})

// 检测配置
const STREAM_CHECK_DELAY = 3000 // 开始检测前的延迟（毫秒）
const STREAM_CHECK_INTERVAL = 2000 // 检测间隔（毫秒）
const BLACK_FRAME_THRESHOLD = 10 // 黑屏检测阈值（像素平均亮度）
const STALL_TIMEOUT = 5000 // 卡顿超时时间（毫秒）
const ISSUE_THRESHOLD = 2 // 连续检测到问题的次数阈值

let streamCheckTimer: ReturnType<typeof setInterval> | null = null
let stallCheckTimer: ReturnType<typeof setTimeout> | null = null
let lastPlaybackTime = 0
let stallStartTime = 0
let consecutiveIssueCount = 0 // 连续检测到问题的次数

/**
 * 检测视频是否黑屏
 * 通过 canvas 采样视频帧，计算平均亮度
 */
const checkBlackFrame = (video: HTMLVideoElement): boolean => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    // 使用较小的采样尺寸提高性能
    const sampleWidth = 64
    const sampleHeight = 36
    canvas.width = sampleWidth
    canvas.height = sampleHeight

    ctx.drawImage(video, 0, 0, sampleWidth, sampleHeight)
    const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight)
    const data = imageData.data

    // 计算平均亮度
    let totalBrightness = 0
    const pixelCount = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      // 使用感知亮度公式
      const brightness =
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      totalBrightness += brightness
    }

    const avgBrightness = totalBrightness / pixelCount
    return avgBrightness < BLACK_FRAME_THRESHOLD
  } catch {
    // 跨域或其他错误时返回 false（假设不是黑屏）
    return false
  }
}

/**
 * 检测视频是否有音频轨道
 */
const checkAudioTrack = (video: HTMLVideoElement): boolean => {
  // 扩展类型，包含非标准属性
  const videoEl = video as HTMLVideoElement & {
    audioTracks?: { length: number }
    webkitAudioDecodedByteCount?: number
  }

  // 检查是否有音频轨道
  if (videoEl.audioTracks && videoEl.audioTracks.length > 0) {
    return true
  }
  // 备用检测：检查 webkitAudioDecodedByteCount（Chrome）
  if (videoEl.webkitAudioDecodedByteCount !== undefined) {
    return videoEl.webkitAudioDecodedByteCount > 0
  }
  // 无法确定时返回 true
  return true
}

/**
 * 检测视频是否卡顿（播放时间不变化）
 */
const checkPlaybackStall = (video: HTMLVideoElement): boolean => {
  const currentTime = video.currentTime
  const now = Date.now()

  if (video.paused || video.ended) {
    // 暂停或结束时重置
    lastPlaybackTime = currentTime
    stallStartTime = 0
    return false
  }

  if (currentTime === lastPlaybackTime) {
    // 播放时间没有变化
    if (stallStartTime === 0) {
      stallStartTime = now
    } else if (now - stallStartTime > STALL_TIMEOUT) {
      return true
    }
  } else {
    // 播放时间有变化，重置
    lastPlaybackTime = currentTime
    stallStartTime = 0
  }

  return false
}

/**
 * 综合检测直播流状态
 */
const checkStreamStatus = () => {
  // 正在切换流时跳过检测
  if (isSwitchingStream.value) return

  const playerEl = basePlayerRef.value?.$el as HTMLElement
  if (!playerEl) return

  const video = playerEl.querySelector('video') as HTMLVideoElement
  if (!video) return

  // 检查视频是否已加载
  if (video.readyState < 2) {
    // HAVE_CURRENT_DATA
    return // 视频还未加载足够数据，跳过检测
  }

  const issues: string[] = []

  // 1. 检测黑屏
  const isBlackFrame = checkBlackFrame(video)
  if (isBlackFrame) {
    issues.push('视频黑屏')
  }

  // 2. 检测音频
  const hasAudio = checkAudioTrack(video)
  if (!hasAudio && !video.muted) {
    issues.push('无音频')
  }

  // 3. 检测卡顿
  const isStalled = checkPlaybackStall(video)
  if (isStalled) {
    issues.push('播放卡顿')
  }

  // 更新状态
  if (issues.length > 0) {
    consecutiveIssueCount++
    console.log(
      `[LivePreview] 检测到问题: ${issues.join(
        '、'
      )} (连续 ${consecutiveIssueCount} 次)`
    )

    // 连续检测到问题达到阈值时，尝试切换流
    if (
      consecutiveIssueCount >= ISSUE_THRESHOLD &&
      hasAlternativeStream.value
    ) {
      console.log('[LivePreview] 尝试切换到备用流...')
      if (switchToNextStream()) {
        streamCheckMessage.value = '正在切换备用线路...'
        return
      }
    }

    isStreamAvailable.value = false
    streamCheckMessage.value = issues.join('、')
    emit('streamUnavailable')
  } else {
    // 没有问题，重置计数
    consecutiveIssueCount = 0

    if (!isStreamAvailable.value) {
      // 从不可用恢复到可用
      isStreamAvailable.value = true
      streamCheckMessage.value = ''
      emit('streamAvailable')
    }
  }
}

/**
 * 开始直播流检测
 */
const startStreamCheck = () => {
  stopStreamCheck()

  // 延迟开始检测，给直播流加载时间
  stallCheckTimer = setTimeout(() => {
    checkStreamStatus()
    streamCheckTimer = setInterval(checkStreamStatus, STREAM_CHECK_INTERVAL)
  }, STREAM_CHECK_DELAY)
}

/**
 * 停止直播流检测
 */
const stopStreamCheck = () => {
  if (streamCheckTimer) {
    clearInterval(streamCheckTimer)
    streamCheckTimer = null
  }
  if (stallCheckTimer) {
    clearTimeout(stallCheckTimer)
    stallCheckTimer = null
  }
  // 重置状态
  lastPlaybackTime = 0
  stallStartTime = 0
}

/**
 * 切换到下一个可用的流
 */
const switchToNextStream = (): boolean => {
  const now = Date.now()
  // 检查冷却时间
  if (now - lastSwitchTime < SWITCH_COOLDOWN) {
    return false
  }

  const urls = streamUrls.value
  if (urls.length <= 1) return false

  // 标记当前流为失败
  failedStreamIndexes.value.add(currentStreamIndex.value)

  // 查找下一个可用的流
  for (let i = 0; i < urls.length; i++) {
    if (!failedStreamIndexes.value.has(i)) {
      console.log(
        `[LivePreview] 切换直播流: ${currentStreamIndex.value} -> ${i}`
      )
      currentStreamIndex.value = i
      lastSwitchTime = now
      isSwitchingStream.value = true

      // 重置检测状态
      consecutiveIssueCount = 0
      isStreamAvailable.value = true
      streamCheckMessage.value = ''
      lastPlaybackTime = 0
      stallStartTime = 0

      // 切换后延迟恢复检测
      setTimeout(() => {
        isSwitchingStream.value = false
        startStreamCheck()
      }, STREAM_CHECK_DELAY)

      emit('streamSwitch', i)
      return true
    }
  }

  return false
}

/**
 * 重置流切换状态（当 URL 变化时调用）
 */
const resetStreamState = () => {
  currentStreamIndex.value = 0
  failedStreamIndexes.value.clear()
  consecutiveIssueCount = 0
  isSwitchingStream.value = false
  isStreamAvailable.value = true
  streamCheckMessage.value = ''
  lastPlaybackTime = 0
  stallStartTime = 0
  lastSwitchTime = 0
}

/**
 * 处理视频错误事件
 */
const onError = () => {
  // 尝试切换到备用流
  if (hasAlternativeStream.value && switchToNextStream()) {
    streamCheckMessage.value = '正在切换备用线路...'
    return
  }

  isStreamAvailable.value = false
  streamCheckMessage.value = '直播流加载失败'
  emit('streamUnavailable')
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
  // 开始播放时启动流检测
  if (props.isPlay) {
    startStreamCheck()
  }
}

// 播放器暂停事件
const onPause = () => {
  isPaused.value = true
  // 暂停时停止流检测
  stopStreamCheck()
}

// 当组件激活、连播开启且未暂停时开始倒计时
const playerSettings = playerSettingStore()
watch(
  [() => props.isPlay, () => playerSettings.isAutoContinuous, isPaused],
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
  stopStreamCheck()
})

// 监听 isPlay 变化，控制流检测
watch(
  () => props.isPlay,
  (newVal) => {
    if (newVal) {
      // 组件激活时，延迟启动检测
      nextTick(() => {
        startStreamCheck()
      })
    } else {
      // 组件非激活时，停止检测并重置状态
      stopStreamCheck()
      isStreamAvailable.value = true
      streamCheckMessage.value = ''
    }
  },
  { immediate: true }
)

// 监听 URL 变化，重置流切换状态
watch(
  () => props.url,
  () => {
    resetStreamState()
  }
)
</script>

<template>
  <div class="live-preview-player">
    <BasePlayer
      ref="basePlayerRef"
      :key="currentStreamIndex"
      :url="currentStreamUrl"
      :options="playerOptions"
      :isPlay="props.isPlay && !isSwitchingStream"
      :loop="false"
      :marginControls="false"
      class="live-preview"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
    />

    <!-- 正在切换线路提示 -->
    <div v-if="isSwitchingStream" class="stream-switching-tip">
      <div class="switching-spinner"></div>
      <div class="tip-text">正在切换线路...</div>
    </div>

    <!-- 直播流异常提示 -->
    <div v-else-if="!isStreamAvailable" class="stream-unavailable-tip">
      <div class="tip-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div class="tip-text">{{ streamCheckMessage || '直播流异常' }}</div>
      <div class="tip-hint" v-if="hasAlternativeStream">
        正在尝试切换备用线路...
      </div>
      <div class="tip-hint" v-else>可能是主播暂时离开或网络问题</div>
    </div>

    <!-- 当前线路指示器（多线路时显示） -->
    <div
      v-if="streamUrls.length > 1 && !isSwitchingStream"
      class="stream-indicator"
    >
      线路 {{ currentStreamIndex + 1 }}/{{ streamUrls.length }}
    </div>

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
        <div
          class="live-btn-time"
          v-if="playerSettings.isAutoContinuous && !isPaused"
        >
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
          animation: 1s ease-in-out infinite wave-bounce;
          left: 10%;
        }
        span {
          animation: 1s ease-in-out 0.2s infinite wave-bounce;
          left: 50%;
          transform: translate(-50%);
        }
        &::after {
          animation: 1s ease-in-out 0.4s infinite wave-bounce;
          right: 10%;
        }
        @keyframes wave-bounce {
          0%,
          100% {
            height: 50%;
          }
          50% {
            height: 100%;
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

// 直播流异常提示样式
.stream-unavailable-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;

  .tip-icon {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 12px;
    animation: pulse 2s ease-in-out infinite;
  }

  .tip-text {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 8px;
    text-align: center;
  }

  .tip-hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

// 切换线路提示样式
.stream-switching-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(8px);

  .switching-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 12px;
  }

  .tip-text {
    font-size: 14px;
    color: #fff;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 线路指示器样式
.stream-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 12;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: none;
}
</style>
