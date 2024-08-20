import { defineStore } from 'pinia'
import { ref } from 'vue'

export const playerSettingStore = defineStore('playerSetting', () => {
  const isMini = ref(false)

  return {
    isMini
  }
})
