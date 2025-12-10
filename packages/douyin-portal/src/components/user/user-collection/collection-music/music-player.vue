<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'

// 播放模式枚举
type PlayMode = 'sequence' | 'loop' | 'shuffle'

const props = withDefaults(
  defineProps<{
    src: string
    duration: number
    playMode?: PlayMode
  }>(),
  {
    playMode: 'sequence'
  }
)

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  'toggle-play-mode': []
}>()

// ========== 音频播放相关 ==========
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(props.duration || 0)
const progress = ref(0)
const isDragging = ref(false)
const progressBarRef = ref<HTMLElement | null>(null)

// ========== 音量控制 ==========
const volume = ref(0.5)
const isMuted = ref(false)
const prevVolume = ref(0.5)
const volumeBarRef = ref<HTMLElement | null>(null)
const isVolumeDragging = ref(false)

// ========== 播放模式 ==========
const playModeConfig = {
  sequence: { label: '顺序播放' },
  loop: { label: '单曲循环' },
  shuffle: { label: '随机播放' }
}
const currentModeLabel = computed(() => playModeConfig[props.playMode].label)

// 格式化时长 (秒 -> mm:ss)
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`
}

// 当前播放时间文本
const currentTimeText = computed(() => formatDuration(currentTime.value))
const durationText = computed(() => formatDuration(duration.value))

// 音量百分比
const volumePercent = computed(() => (isMuted.value ? 0 : volume.value * 100))

// ========== 播放控制 ==========
const play = () => {
  audioRef.value?.play()
}

const pause = () => {
  audioRef.value?.pause()
}

const togglePlay = () => {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

// 音频事件处理
const onPlay = () => {
  isPlaying.value = true
  emit('play')
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
}

const onTimeUpdate = () => {
  if (!audioRef.value || isDragging.value) return
  currentTime.value = audioRef.value.currentTime
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100
  }
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration || props.duration || 0
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  emit('ended')
}

// ========== 进度条控制 ==========
const handleProgressClick = (e: MouseEvent) => {
  if (!progressBarRef.value || !audioRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const percentage = Math.max(0, Math.min(1, clickX / rect.width))
  currentTime.value = percentage * duration.value
  progress.value = percentage * 100
  audioRef.value.currentTime = currentTime.value
}

const handleProgressDragStart = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  document.addEventListener('mousemove', handleProgressDrag)
  document.addEventListener('mouseup', handleProgressDragEnd)
  handleProgressDrag(e)
}

const handleProgressDrag = (e: MouseEvent) => {
  if (!isDragging.value || !progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const percentage = Math.max(0, Math.min(1, clickX / rect.width))
  progress.value = percentage * 100
  currentTime.value = percentage * duration.value
}

const handleProgressDragEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  document.removeEventListener('mousemove', handleProgressDrag)
  document.removeEventListener('mouseup', handleProgressDragEnd)
  if (audioRef.value) {
    audioRef.value.currentTime = currentTime.value
  }
}

// ========== 音量控制 ==========
const toggleMute = () => {
  if (isMuted.value) {
    isMuted.value = false
    volume.value = prevVolume.value || 0.5
  } else {
    prevVolume.value = volume.value
    isMuted.value = true
  }
  if (audioRef.value) {
    audioRef.value.muted = isMuted.value
  }
}

const handleVolumeClick = (e: MouseEvent) => {
  if (!volumeBarRef.value || !audioRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const percentage = Math.max(0, Math.min(1, clickX / rect.width))
  volume.value = percentage
  isMuted.value = false
  audioRef.value.volume = percentage
  audioRef.value.muted = false
}

const handleVolumeDragStart = (e: MouseEvent) => {
  e.preventDefault()
  isVolumeDragging.value = true
  document.addEventListener('mousemove', handleVolumeDrag)
  document.addEventListener('mouseup', handleVolumeDragEnd)
  handleVolumeDrag(e)
}

const handleVolumeDrag = (e: MouseEvent) => {
  if (!isVolumeDragging.value || !volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const percentage = Math.max(0, Math.min(1, clickX / rect.width))
  volume.value = percentage
  isMuted.value = false
  if (audioRef.value) {
    audioRef.value.volume = percentage
    audioRef.value.muted = false
  }
}

const handleVolumeDragEnd = () => {
  if (!isVolumeDragging.value) return
  isVolumeDragging.value = false
  document.removeEventListener('mousemove', handleVolumeDrag)
  document.removeEventListener('mouseup', handleVolumeDragEnd)
}

// ========== 播放模式控制 ==========
const togglePlayMode = () => {
  emit('toggle-play-mode')
}

// 监听播放模式变化，设置循环
watch(
  () => props.playMode,
  (newMode) => {
    if (audioRef.value) {
      audioRef.value.loop = newMode === 'loop'
    }
  },
  { immediate: true }
)

// 监听音量变化
watch(volume, (newVal) => {
  if (audioRef.value && !isMuted.value) {
    audioRef.value.volume = newVal
  }
})

// 暴露方法
defineExpose({
  play,
  pause,
  togglePlay,
  isPlaying
})

// 组件卸载时清理
onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
  document.removeEventListener('mousemove', handleProgressDrag)
  document.removeEventListener('mouseup', handleProgressDragEnd)
  document.removeEventListener('mousemove', handleVolumeDrag)
  document.removeEventListener('mouseup', handleVolumeDragEnd)
})
</script>

<template>
  <div class="music-player" :class="{ 'is-playing': isPlaying }">
    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioRef"
      :src="src"
      preload="metadata"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    />

    <!-- 播放状态：显示进度条和控制 -->
    <template v-if="isPlaying || progress > 0">
      <!-- 进度条 -->
      <div
        ref="progressBarRef"
        class="player-progress"
        @click="handleProgressClick"
        @mousedown="handleProgressDragStart"
      >
        <div class="player-progress-bar">
          <div
            class="player-progress-played"
            :style="{ width: `${progress}%` }"
          />
          <div class="player-progress-dot" :style="{ left: `${progress}%` }" />
        </div>
      </div>

      <!-- 控制栏 -->
      <div class="player-controls">
        <!-- 时间显示 -->
        <div class="player-time">
          <span class="player-time-current">{{ currentTimeText }}</span>
          <span class="player-time-separator">/</span>
          <span class="player-time-duration">{{ durationText }}</span>
        </div>

        <!-- 右侧控制 -->
        <div class="player-right-controls">
          <!-- 音量控制 -->
          <HoverDropdown placement="left" content-class="volume-popup">
            <template #trigger>
              <div class="volume-btn" @click.stop="toggleMute">
                <!-- 静音图标 -->
                <svg
                  class="xg-volume-mute"
                  v-if="isMuted || volume === 0"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75 9.00001C5.92157 9.00001 5.25 9.67158 5.25 10.5V13.5C5.25 14.3284 5.92157 15 6.75 15H7.5L10.7699 17.7249C11.2584 18.132 12 17.7846 12 17.1487V6.85129C12 6.21541 11.2584 5.86804 10.7699 6.27512L7.5 9.00001H6.75Z"
                    fill="currentColor"
                    fill-opacity="0.9"
                  ></path>
                  <path
                    d="M17.6255 15.3778L15.7515 13.1622L13.8775 15.3778L12.7504 14.391L14.7706 12.0024L12.75 9.61332L13.8771 8.62647L15.7515 10.8427L17.6259 8.62647L18.753 9.61332L16.7324 12.0024L18.7526 14.391L17.6255 15.3778Z"
                    fill="currentColor"
                    fill-opacity="0.9"
                  ></path>
                </svg>
                <!-- 低音量图标 -->
                <svg
                  class="xg-volume-small"
                  v-else-if="volume < 0.5"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75 9.00001C5.92157 9.00001 5.25 9.67158 5.25 10.5V13.5C5.25 14.3284 5.92157 15 6.75 15H7.5L10.7699 17.7249C11.2584 18.132 12 17.7846 12 17.1487V6.85129C12 6.21541 11.2584 5.86804 10.7699 6.27512L7.5 9.00001H6.75Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M13.5 9.75001L13.5 14.25C14.7426 14.25 15.75 13.2426 15.75 12C15.75 10.7574 14.7426 9.75001 13.5 9.75001Z"
                    fill="currentColor"
                  ></path>
                  <path
                    opacity="0.3"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.5 6.19934C16.5355 6.39255 18.9376 8.91572 18.9376 11.9999C18.9376 15.0842 16.5355 17.6073 13.5 17.8006V15.9198C15.4988 15.7311 17.0626 14.0481 17.0626 11.9999C17.0626 9.95176 15.4988 8.26882 13.5 8.08006V6.19934Z"
                    fill="currentColor"
                    fill-opacity="0.9"
                  ></path>
                </svg>
                <!-- 高音量图标 -->
                <svg
                  class="xg-volume"
                  v-else
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.25 10.4002C5.25 9.57173 5.92157 8.90015 6.75 8.90015H7.5L10.7699 6.17527C11.2584 5.76819 12 6.11556 12 6.75143V17.0489C12 17.6847 11.2584 18.0321 10.7699 17.625L7.5 14.9002H6.75C5.92157 14.9002 5.25 14.2286 5.25 13.4002V10.4002Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M13.5 14.1502L13.5 9.65015C14.7426 9.65015 15.75 10.6575 15.75 11.9002C15.75 13.1428 14.7426 14.1502 13.5 14.1502Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M18.9375 11.9001C18.9375 14.9843 16.5354 17.5074 13.5 17.7007L13.5 15.82C15.4987 15.6312 17.0625 13.9483 17.0625 11.9001C17.0625 9.85198 15.4987 8.16908 13.5 7.98024V6.09952C16.5354 6.2928 18.9375 8.81594 18.9375 11.9001Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </template>
            <template #content>
              <div class="volume-slider-wrapper">
                <div
                  ref="volumeBarRef"
                  class="volume-slider"
                  @click.stop="handleVolumeClick"
                  @mousedown.stop="handleVolumeDragStart"
                >
                  <div class="volume-slider-bar">
                    <div
                      class="volume-slider-filled"
                      :style="{ width: `${volumePercent}%` }"
                    />
                    <div
                      class="volume-slider-dot"
                      :style="{ left: `${volumePercent}%` }"
                    />
                  </div>
                </div>
              </div>
            </template>
          </HoverDropdown>

          <!-- 播放模式控制 -->
          <HoverDropdown placement="top" content-class="play-mode-tooltip">
            <template #trigger>
              <div class="play-mode-btn" @click.stop="togglePlayMode">
                <!-- 顺序播放图标 -->
                <svg
                  v-if="props.playMode === 'sequence'"
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.803 5.161a.6.6 0 0 1 .848 0l1.273 1.273a.8.8 0 0 1 0 1.131l-1.272 1.273a.6.6 0 0 1-.85-.849l.237-.236H8.75a3.25 3.25 0 0 0-3.25 3.25v2a3.25 3.25 0 0 0 3.25 3.25h1a.75.75 0 0 1 0 1.5h-1A4.75 4.75 0 0 1 4 13.003v-2a4.75 4.75 0 0 1 4.75-4.75h1.298l-.244-.243a.6.6 0 0 1 0-.849zm4.304 13.678a.6.6 0 0 1-.848 0l-1.273-1.273a.8.8 0 0 1 0-1.131l1.273-1.273a.6.6 0 0 1 .848.848l-.243.243h1.386a3.25 3.25 0 0 0 3.25-3.25v-2a3.25 3.25 0 0 0-3.25-3.25h-1a.75.75 0 0 1 0-1.5h1a4.75 4.75 0 0 1 4.75 4.75v2a4.75 4.75 0 0 1-4.75 4.75h-1.38l.237.237a.6.6 0 0 1 0 .849z"
                    fill="#fff"
                    fill-opacity=".5"
                  ></path>
                </svg>
                <!-- 单曲循环图标 -->
                <svg
                  v-else-if="props.playMode === 'loop'"
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.803 5.176a.6.6 0 0 1 .849 0l1.272 1.273a.8.8 0 0 1 0 1.13l-1.272 1.274a.6.6 0 1 1-.849-.849l.236-.236H8.75a3.25 3.25 0 0 0-3.25 3.25v2a3.25 3.25 0 0 0 3.25 3.25h6.5a3.25 3.25 0 0 0 3.25-3.25v-2a3.25 3.25 0 0 0-3.25-3.25h-1a.75.75 0 0 1 0-1.5h1a4.75 4.75 0 0 1 4.75 4.75v2a4.75 4.75 0 0 1-4.75 4.75H8.745A4.75 4.75 0 0 1 4 13.018v-2a4.75 4.75 0 0 1 4.75-4.75h1.297l-.244-.244a.6.6 0 0 1 0-.848zm3.147 4.842h-.958a3.124 3.124 0 0 1-.63.49c-.252.14-.384.205-.608.261l-.004.9a2.367 2.367 0 0 0 1.035-.576l.004 3.473h1.16l.001-4.548z"
                    fill="#fff"
                    fill-opacity=".5"
                  ></path>
                </svg>
                <!-- 随机播放图标 -->
                <svg
                  v-else
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.551 8.573a.5.5 0 0 0 .01-.845l-2.043-1.324a.5.5 0 0 0-.772.42v.522h-.272c-.69 0-1.355.304-1.8.848-.206.251-.379.467-.544.672-.25.312-.483.602-.786.961a.75.75 0 0 0 1.148.966c.31-.367.564-.684.825-1.01.165-.204.332-.412.518-.639a.825.825 0 0 1 .64-.298h.27v.562a.5.5 0 0 0 .763.425l2.043-1.26zM5.18 15.696c0 .414.336.75.75.75H7.484c.791 0 1.48-.402 1.93-.964.211-.263.365-.421.57-.632.136-.14.295-.302.506-.533a.75.75 0 0 0-1.105-1.014c-.144.157-.28.297-.412.434-.247.255-.481.498-.73.807-.21.264-.492.402-.76.402H5.93a.75.75 0 0 0-.75.75zm0-7.258a.75.75 0 0 1 .75-.75h1.656a2.35 2.35 0 0 1 1.797.837l5.441 6.46a.85.85 0 0 0 .65.303h.303v-.696a.5.5 0 0 1 .763-.426l2.043 1.26a.5.5 0 0 1 .009.846l-2.043 1.324a.5.5 0 0 1-.772-.42v-.388h-.303a2.35 2.35 0 0 1-1.797-.836L8.236 9.491a.85.85 0 0 0-.65-.303H5.93a.75.75 0 0 1-.75-.75z"
                    fill="#fff"
                    fill-opacity=".5"
                  ></path>
                </svg>
              </div>
            </template>
            <template #content>
              <div class="play-mode-label">{{ currentModeLabel }}</div>
            </template>
          </HoverDropdown>
        </div>
      </div>
    </template>

    <!-- 未播放状态：只显示总时长 -->
    <template v-else>
      <div class="player-duration-only">
        <span>{{ durationText }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.music-player {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.player-progress {
  width: 100%;
  height: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;

  .player-progress-bar {
    width: 100%;
    height: 2px;
    background-color: var(--color-progress);
    border-radius: 1px;
    position: relative;

    &:hover {
      height: 4px;
      border-radius: 2px;
    }

    .player-progress-played {
      height: 100%;
      background-color: var(--color-progress-played);
      border-radius: 1px;
      position: absolute;
      left: 0;
      top: 0;
    }

    .player-progress-dot {
      width: 10px;
      height: 10px;
      background-color: var(--color-progress-dot);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 3px var(--color-progress-dot-outline);
      opacity: 0;
      transition: opacity 0.2s;
    }
  }

  &:hover .player-progress-dot {
    opacity: 1;
  }
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
}

.player-time {
  display: flex;
  align-items: center;
  gap: 2px;

  .player-time-current,
  .player-time-duration,
  .player-time-separator {
    color: var(--color-text-t3);
    font-variant-numeric: slashed-zero;
    user-select: none;
    font-size: 12px;
    line-height: 20px;
  }
}

.player-right-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.volume-btn,
.play-mode-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  color: var(--color-text-t3);
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: var(--color-text-t1);
    background-color: var(--color-bg-b2);
  }

  .xg-volume-mute,
  .xg-volume-small,
  .xg-volume {
    transform: rotateY(180deg);
  }
}

.player-duration-only {
  height: 20px;
  display: flex;
  align-items: center;

  span {
    color: var(--color-text-t3);
    font-variant-numeric: slashed-zero;
    user-select: none;
    font-size: 12px;
    line-height: 20px;
  }
}

// 音量弹窗样式
:deep(.volume-popup) {
  padding: 8px 12px;

  .volume-slider-wrapper {
    width: 80px;
  }

  .volume-slider {
    width: 100%;
    height: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;

    .volume-slider-bar {
      width: 100%;
      height: 4px;
      background-color: var(--color-volume-bar);
      border-radius: 2px;
      position: relative;

      .volume-slider-filled {
        height: 100%;
        background-color: var(--color-text-t1);
        border-radius: 2px;
        position: absolute;
        left: 0;
        top: 0;
      }

      .volume-slider-dot {
        width: 10px;
        height: 10px;
        background-color: var(--color-volume-dot);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

// 播放模式提示样式
:deep(.play-mode-tooltip) {
  padding: 6px 10px;
  white-space: nowrap;

  .play-mode-label {
    color: var(--color-text-t1);
    font-size: 12px;
    line-height: 18px;
  }
}
</style>
