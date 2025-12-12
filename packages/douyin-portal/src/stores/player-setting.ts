import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const VOLUME_STORAGE_KEY = 'player-volume'
const MUTED_STORAGE_KEY = 'player-muted'

export const playerSettingStore = defineStore('playerSetting', () => {
  const isMini = ref(false)

  // 从 localStorage 读取保存的音量设置
  const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY)
  const savedMuted = localStorage.getItem(MUTED_STORAGE_KEY)

  const volume = ref(savedVolume !== null ? parseFloat(savedVolume) : 0.5)
  const muted = ref(savedMuted === 'true')

  // 监听音量变化并保存到 localStorage
  watch(volume, (newVolume) => {
    localStorage.setItem(VOLUME_STORAGE_KEY, String(newVolume))
  })

  watch(muted, (newMuted) => {
    localStorage.setItem(MUTED_STORAGE_KEY, String(newMuted))
  })

  // 设置音量
  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume))
  }

  // 设置静音状态
  const setMuted = (newMuted: boolean) => {
    muted.value = newMuted
  }

  return {
    isMini,
    volume,
    muted,
    setVolume,
    setMuted
  }
})
