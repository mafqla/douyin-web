import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const VOLUME_STORAGE_KEY = 'player-volume'
const MUTED_STORAGE_KEY = 'player-muted'
const CLARITY_STORAGE_KEY = 'player-clarity'

export const playerSettingStore = defineStore('playerSetting', () => {
  const isMini = ref(false)

  // 从 localStorage 读取保存的音量设置
  const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY)
  const savedMuted = localStorage.getItem(MUTED_STORAGE_KEY)
  const savedClarity = localStorage.getItem(CLARITY_STORAGE_KEY)

  const volume = ref(savedVolume !== null ? parseFloat(savedVolume) : 0.5)
  const muted = ref(savedMuted === 'true')
  // 清晰度设置：auto | 1080p | 720p | 540p
  const clarity = ref(savedClarity || 'auto')

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

  return {
    isMini,
    volume,
    muted,
    clarity,
    setVolume,
    setMuted,
    setClarity
  }
})
