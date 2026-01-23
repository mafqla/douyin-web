<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import BasePlayer from './base-player.vue'
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'
import type { ILiveStreamInfo } from '@/api/tyeps/common/aweme'
import { videosCtrolStore } from '@/stores/videos-control'
import { playerSettingStore } from '@/stores/player-setting'
import LiveRefresh from './plugin/live-refresh/live-refresh'
import FlvPlayer from 'xgplayer-flv'
import HlsPlayer from 'xgplayer-hls'

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

/**
 * 检测流类型（从 URL 推断）
 */
const detectStreamType = (url: string): string => {
  const urlLower = url.toLowerCase()
  
  // HLS 流 (.m3u8)
  if (urlLower.includes('.m3u8')) {
    return 'HLS'
  }
  
  // FLV 流 (.flv)
  if (urlLower.includes('.flv')) {
    return 'FLV'
  }
  
  // RTMP 流
  if (urlLower.startsWith('rtmp://') || urlLower.startsWith('rtmps://')) {
    return 'RTMP'
  }
  
  // WebRTC 流
  if (urlLower.startsWith('webrtc://') || urlLower.includes('webrtc')) {
    return 'WebRTC'
  }
  
  // HTTP-FLV
  if (urlLower.includes('http') && urlLower.includes('flv')) {
    return 'HTTP-FLV'
  }
  
  // MP4 流
  if (urlLower.includes('.mp4')) {
    return 'MP4'
  }
  
  // 默认根据协议判断
  if (urlLower.startsWith('http://') || urlLower.startsWith('https://')) {
    return 'HTTP'
  }
  
  return '未知'
}

// 根据当前流类型动态选择插件
const currentPlugins = computed(() => {
  const url = currentStreamUrl.value
  const type = detectStreamType(url)
  
  console.log(`[LivePreview] 当前流类型: ${type}, URL: ${url}`)
  
  // 根据流类型选择对应的插件
  if (type === 'FLV' || type === 'HTTP-FLV') {
    console.log('[LivePreview] 使用 FLV 插件')
    return [FlvPlayer, LiveRefresh]
  } else if (type === 'HLS') {
    console.log('[LivePreview] 使用 HLS 插件')
    return [HlsPlayer, LiveRefresh]
  } else {
    // 默认使用 HLS 插件
    console.log('[LivePreview] 使用默认 HLS 插件')
    return [HlsPlayer, LiveRefresh]
  }
})

const playerOptions = computed(() => ({
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
  plugins: currentPlugins.value
}))

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
const playerKey = ref(Date.now()) // 播放器 key，用于强制重新创建，使用时间戳避免冲突

// 线路面板相关
const showStreamPanel = ref(false) // 是否显示线路面板
const streamLatencies = ref<number[]>([]) // 各线路延迟（毫秒）
const streamQualities = ref<string[]>([]) // 各线路清晰度
const streamTypes = ref<string[]>([]) // 各线路流类型

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
  const url = urls[index]
  // console.log(`[LivePreview] currentStreamUrl 计算: index=${index}, url=${url}`)
  return url
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
      playerKey.value = Date.now() // 使用时间戳强制重新创建播放器
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
 * 手动切换到指定线路
 */
const switchToStream = (index: number) => {
  if (index === currentStreamIndex.value) {
    showStreamPanel.value = false
    return
  }

  if (index < 0 || index >= streamUrls.value.length) return

  const newUrl = streamUrls.value[index]
  const newType = detectStreamType(newUrl)
  const oldUrl = currentStreamUrl.value
  const oldType = detectStreamType(oldUrl)

  console.log(`[LivePreview] ========== 开始切换线路 ==========`)
  console.log(`[LivePreview] 当前索引: ${currentStreamIndex.value} -> 新索引: ${index}`)
  console.log(`[LivePreview] 当前 URL: ${oldUrl}`)
  console.log(`[LivePreview] 新 URL: ${newUrl}`)
  console.log(`[LivePreview] 流类型变化: ${oldType} -> ${newType}`)
  console.log(`[LivePreview] 旧 playerKey: ${playerKey.value}`)
  
  currentStreamIndex.value = index
  const newPlayerKey = Date.now()
  playerKey.value = newPlayerKey
  
  console.log(`[LivePreview] 新 playerKey: ${playerKey.value}`)
  console.log(`[LivePreview] currentStreamIndex 已更新为: ${currentStreamIndex.value}`)
  console.log(`[LivePreview] ========== 切换完成 ==========`)
  
  lastSwitchTime = Date.now()
  isSwitchingStream.value = true
  showStreamPanel.value = false

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

  emit('streamSwitch', index)
}

/**
 * 测量线路延迟
 */
const measureStreamLatency = async (url: string): Promise<number> => {
  try {
    const startTime = performance.now()
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors' // 避免 CORS 问题
    })
    const endTime = performance.now()
    return Math.round(endTime - startTime)
  } catch {
    return -1 // 表示无法测量
  }
}

/**
 * 检测线路清晰度（从 URL 推断）
 */
const detectStreamQuality = (url: string): string => {
  const urlLower = url.toLowerCase()
  
  if (urlLower.includes('4k') || urlLower.includes('2160p') || urlLower.includes('uhd')) {
    return '超清 4K'
  } else if (urlLower.includes('1080p') || urlLower.includes('fhd') || urlLower.includes('fullhd')) {
    return '高清 1080P'
  } else if (urlLower.includes('720p') || urlLower.includes('hd')) {
    return '高清 720P'
  } else if (urlLower.includes('540p')) {
    return '标清 540P'
  } else if (urlLower.includes('480p') || urlLower.includes('sd')) {
    return '标清 480P'
  } else if (urlLower.includes('360p')) {
    return '流畅 360P'
  } else if (urlLower.includes('240p')) {
    return '流畅 240P'
  }
  
  // 尝试从 URL 参数中提取清晰度
  const qualityMatch = url.match(/quality[=_](\w+)/i)
  if (qualityMatch) {
    const quality = qualityMatch[1].toLowerCase()
    if (quality.includes('origin') || quality.includes('source')) {
      return '原画'
    } else if (quality.includes('high') || quality.includes('hd')) {
      return '高清'
    } else if (quality.includes('medium') || quality.includes('md')) {
      return '标清'
    } else if (quality.includes('low') || quality.includes('ld')) {
      return '流畅'
    }
  }
  
  // 默认
  return '高清'
}

/**
 * 初始化线路信息
 */
const initStreamInfo = async () => {
  const urls = streamUrls.value
  if (urls.length === 0) return

  // 初始化流类型
  streamTypes.value = urls.map(url => detectStreamType(url))

  // 初始化清晰度信息
  streamQualities.value = urls.map(url => detectStreamQuality(url))

  // 测量延迟（仅测量前几个线路，避免过多请求）
  const latencyPromises = urls.slice(0, 5).map(url => measureStreamLatency(url))
  const latencies = await Promise.all(latencyPromises)
  
  // 填充剩余线路的延迟为 -1
  streamLatencies.value = [
    ...latencies,
    ...Array(Math.max(0, urls.length - 5)).fill(-1)
  ]
}

/**
 * 切换线路面板显示状态
 */
const toggleStreamPanel = () => {
  showStreamPanel.value = !showStreamPanel.value
  
  // 首次打开时初始化线路信息
  if (showStreamPanel.value && streamLatencies.value.length === 0) {
    initStreamInfo()
  }
}

/**
 * 关闭线路面板
 */
const closeStreamPanel = () => {
  showStreamPanel.value = false
}

/**
 * 重置流切换状态（当 URL 变化时调用）
 */
const resetStreamState = () => {
  currentStreamIndex.value = 0
  playerKey.value = Date.now() // 重置时也强制重新创建播放器
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
  // 防止在切换过程中重复触发
  if (isSwitchingStream.value) {
    console.log('[LivePreview] 正在切换流，忽略错误事件')
    return
  }

  console.error('[LivePreview] 播放错误，尝试切换备用流')

  // 尝试切换到备用流
  if (hasAlternativeStream.value && switchToNextStream()) {
    streamCheckMessage.value = '正在切换备用线路...'
    return
  }

  // 所有流都失败，可能是直播已结束
  isStreamAvailable.value = false
  streamCheckMessage.value = '直播可能已结束'
  emit('streamUnavailable')
}

/**
 * 处理视频结束事件（直播流不应该有 ended 事件，如果有说明直播结束了）
 */
const onEnded = () => {
  console.log('[LivePreview] 直播流结束')
  isStreamAvailable.value = false
  streamCheckMessage.value = '直播已结束'
  emit('streamUnavailable')
  
  // 停止检测
  stopStreamCheck()
  
  // 5秒后自动跳转到下一个视频
  // setTimeout(() => {
  //   if (!isStreamAvailable.value && streamCheckMessage.value === '直播已结束') {
  //     console.log('[LivePreview] 直播已结束，自动跳转到下一个')
  //     store.handleNext()
  //   }
  // }, 5000)
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
    // 重新初始化线路信息
    if (streamUrls.value.length > 1) {
      initStreamInfo()
    }
  }
)
</script>

<template>
  <div class="live-preview-player">
    <BasePlayer
      ref="basePlayerRef"
      :key="`player-${playerKey}`"
      :url="currentStreamUrl"
      :options="playerOptions"
      :isPlay="props.isPlay && !isSwitchingStream"
      :loop="false"
      :marginControls="false"
      class="live-preview"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
      @ended="onEnded"
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
      <div class="tip-hint" v-if="hasAlternativeStream && streamCheckMessage !== '直播已结束'">
        正在尝试切换备用线路...
      </div>
      <div class="tip-hint" v-else-if="streamCheckMessage === '直播已结束'">
        主播已下播，感谢观看
      </div>
      <div class="tip-hint" v-else-if="streamCheckMessage === '直播可能已结束'">
        所有线路均无法连接，直播可能已结束
      </div>
      <div class="tip-hint" v-else>
        可能是主播暂时离开或网络问题
      </div>
    </div>

    <!-- 当前线路指示器（多线路时显示） -->
    <div
      v-if="streamUrls.length > 1 && !isSwitchingStream"
      class="stream-indicator"
      data-scrollable
      @click="toggleStreamPanel"
    >
      <div class="indicator-content">
        <span class="indicator-text">线路 {{ currentStreamIndex + 1 }}</span>
        <svg
          class="indicator-icon"
          :class="{ 'rotate': showStreamPanel }"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- 线路切换面板 -->
    <transition name="stream-panel">
      <div
        v-if="showStreamPanel && streamUrls.length > 1"
        class="stream-panel"
        @click.stop
        @wheel.stop
        @touchmove.stop
      >
        <div class="stream-panel-header">
          <span class="panel-title">选择线路</span>
          <button class="panel-close" @click="closeStreamPanel">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <div 
          class="stream-panel-body"
          @wheel.stop
          @touchmove.stop
        >
          <div
            v-for="(url, index) in streamUrls"
            :key="index"
            class="stream-item"
            :class="{
              'active': index === currentStreamIndex,
              'failed': failedStreamIndexes.has(index)
            }"
            @click="switchToStream(index)"
          >
            <div class="stream-item-left">
              <div class="stream-name">
                <span class="stream-label">线路 {{ index + 1 }}</span>
                <span
                  v-if="index === currentStreamIndex"
                  class="current-badge"
                >
                  当前
                </span>
                <span
                  v-if="failedStreamIndexes.has(index)"
                  class="failed-badge"
                >
                  异常
                </span>
              </div>
              <div class="stream-info">
                <span 
                  class="stream-type"
                  :class="`stream-type--${(streamTypes[index] || 'HTTP').toLowerCase().replace('-', '')}`"
                >
                  {{ streamTypes[index] || 'HTTP' }}
                </span>
                <span class="stream-separator">·</span>
                <span class="stream-quality">
                  {{ streamQualities[index] || '高清' }}
                </span>
                <span class="stream-separator">·</span>
                <span class="stream-latency">
                  <template v-if="streamLatencies[index] === -1">
                    延迟未知
                  </template>
                  <template v-else-if="streamLatencies[index] > 0">
                    {{ streamLatencies[index] }}ms
                  </template>
                  <template v-else>
                    测量中...
                  </template>
                </span>
              </div>
            </div>
            <div class="stream-item-right">
              <svg
                v-if="index === currentStreamIndex"
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M16.667 5L7.5 14.167L3.333 10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                v-else
                class="arrow-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="stream-panel-footer">
          <div class="panel-tip">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
                stroke="currentColor"
                stroke-width="1.2"
              />
              <path
                d="M7 4.5V7.5M7 9.5H7.005"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
            <span>自动选择最优线路，也可手动切换</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 点击遮罩关闭面板 -->
    <div
      v-if="showStreamPanel"
      class="stream-panel-overlay"
      @click="closeStreamPanel"
      @wheel.stop.prevent
      @touchmove.stop.prevent
    ></div>

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

  // 确保视频画面不被控制栏遮挡
  :deep(.xgplayer) {

    .xgplayer-controls {
      // 确保控制栏在底部
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      // 使用透明到半透明的渐变，而不是黑色
      background-image: linear-gradient(
        transparent 0%,
        rgba(0, 0, 0, 0.3) 50%,
        rgba(0, 0, 0, 0.5) 100%
      ) !important;
    }
  }

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
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.75);
    transform: scale(1.05);
  }

  .indicator-content {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .indicator-text {
    font-weight: 500;
  }

  .indicator-icon {
    transition: transform 0.3s ease;
    
    &.rotate {
      transform: rotate(180deg);
    }
  }
}

// 线路切换面板样式
.stream-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 14;
  background: transparent;
}

.stream-panel {
  position: absolute;
  top: 48px;
  right: 12px;
  z-index: 15;
  width: 280px;
  background: rgba(20, 20, 24, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .stream-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }

    .panel-close {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    }
  }

  .stream-panel-body {
    max-height: 320px;
    overflow-y: auto;
    padding: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .stream-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 4px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    &.active {
      background: rgba(255, 255, 255, 0.12);
      
      .stream-label {
        color: #fff;
        font-weight: 600;
      }
    }

    &.failed {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        background: transparent;
      }
    }

    .stream-item-left {
      flex: 1;
      min-width: 0;
    }

    .stream-name {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;

      .stream-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }

      .current-badge {
        padding: 2px 6px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        font-size: 10px;
        font-weight: 600;
        border-radius: 4px;
        line-height: 1;
      }

      .failed-badge {
        padding: 2px 6px;
        background: rgba(255, 59, 48, 0.2);
        color: #ff3b30;
        font-size: 10px;
        font-weight: 600;
        border-radius: 4px;
        line-height: 1;
      }
    }

    .stream-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);

      .stream-type {
        padding: 2px 6px;
        font-size: 10px;
        font-weight: 600;
        border-radius: 4px;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        
        // 默认样式
        background: rgba(102, 126, 234, 0.2);
        color: #8b9cff;
        
        // HLS 流 - 蓝色
        &--hls {
          background: rgba(102, 126, 234, 0.2);
          color: #8b9cff;
        }
        
        // FLV 流 - 橙色
        &--flv,
        &--httpflv {
          background: rgba(255, 149, 0, 0.2);
          color: #ffb366;
        }
        
        // RTMP 流 - 红色
        &--rtmp {
          background: rgba(255, 59, 48, 0.2);
          color: #ff6b6b;
        }
        
        // WebRTC 流 - 绿色
        &--webrtc {
          background: rgba(52, 199, 89, 0.2);
          color: #6dd58c;
        }
        
        // MP4/HTTP 流 - 紫色
        &--mp4,
        &--http {
          background: rgba(175, 82, 222, 0.2);
          color: #bf9aff;
        }
        
        // 未知类型 - 灰色
        &--未知 {
          background: rgba(142, 142, 147, 0.2);
          color: #a8a8ad;
        }
      }

      .stream-quality {
        color: rgba(255, 255, 255, 0.6);
      }

      .stream-separator {
        color: rgba(255, 255, 255, 0.3);
      }

      .stream-latency {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .stream-item-right {
      display: flex;
      align-items: center;
      margin-left: 12px;

      .check-icon {
        color: #667eea;
      }

      .arrow-icon {
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .stream-panel-footer {
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);

    .panel-tip {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);

      svg {
        flex-shrink: 0;
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }
}

// 面板动画
.stream-panel-enter-active,
.stream-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stream-panel-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.stream-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
