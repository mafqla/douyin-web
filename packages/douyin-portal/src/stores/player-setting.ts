import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const VOLUME_STORAGE_KEY = 'player-volume'
const MUTED_STORAGE_KEY = 'player-muted'
const CLARITY_STORAGE_KEY = 'player-clarity'
const PLAYBACK_RATE_STORAGE_KEY = 'player-playback-rate'
const AUTO_CONTINUOUS_STORAGE_KEY = 'player-auto-continuous'
const IMMERSIVE_STORAGE_KEY = 'player-immersive'

export const playerSettingStore = defineStore('playerSetting', () => {
  const isMini = ref(false)

  // 从 localStorage 读取保存的设置
  const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY)
  const savedMuted = localStorage.getItem(MUTED_STORAGE_KEY)
  const savedClarity = localStorage.getItem(CLARITY_STORAGE_KEY)
  const savedPlaybackRate = localStorage.getItem(PLAYBACK_RATE_STORAGE_KEY)
  const savedAutoContinuous = localStorage.getItem(AUTO_CONTINUOUS_STORAGE_KEY)
  const savedImmersive = localStorage.getItem(IMMERSIVE_STORAGE_KEY)

  const volume = ref(savedVolume !== null ? parseFloat(savedVolume) : 0.5)
  const muted = ref(savedMuted === 'true')
  // 清晰度设置：auto | 1080p | 720p | 540p
  const clarity = ref(savedClarity || 'auto')
  // 倍率设置
  const playbackRate = ref(
    savedPlaybackRate !== null ? parseFloat(savedPlaybackRate) : 1.0
  )
  // 自动连播设置（默认开启）
  const isAutoContinuous = ref(
    savedAutoContinuous !== null ? savedAutoContinuous === 'true' : true
  )
  // 清屏模式设置（默认关闭）
  const isImmersive = ref(savedImmersive === 'true')

  // 监听音量变化并保存到 localStorage
  watch(volume, (newVolume) => {
    localStorage.setItem(VOLUME_STORAGE_KEY, String(newVolume))
  })

  watch(muted, (newMuted) => {
    localStorage.setItem(MUTED_STORAGE_KEY, String(newMuted))
  })

  watch(clarity, (newClarity) => {
    localStorage.setItem(CLARITY_STORAGE_KEY, newClarity)
  })

  watch(playbackRate, (newRate) => {
    localStorage.setItem(PLAYBACK_RATE_STORAGE_KEY, String(newRate))
  })

  watch(isAutoContinuous, (newValue) => {
    localStorage.setItem(AUTO_CONTINUOUS_STORAGE_KEY, String(newValue))
  })

  watch(isImmersive, (newValue) => {
    localStorage.setItem(IMMERSIVE_STORAGE_KEY, String(newValue))
  })

  // 设置音量
  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume))
  }

  // 设置静音状态
  const setMuted = (newMuted: boolean) => {
    muted.value = newMuted
  }

  // 设置清晰度
  const setClarity = (newClarity: string) => {
    clarity.value = newClarity
  }

  // 设置倍率
  const setPlaybackRate = (newRate: number) => {
    playbackRate.value = newRate
  }

  // 设置自动连播
  const setAutoContinuous = (newValue: boolean) => {
    isAutoContinuous.value = newValue
  }

  // 设置清屏模式
  const setImmersive = (newValue: boolean) => {
    isImmersive.value = newValue
  }

  return {
    isMini,
    volume,
    muted,
    clarity,
    playbackRate,
    isAutoContinuous,
    isImmersive,
    setVolume,
    setMuted,
    setClarity,
    setPlaybackRate,
    setAutoContinuous,
    setImmersive
  }
})
