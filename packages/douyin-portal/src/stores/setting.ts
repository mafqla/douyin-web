import { defineStore } from 'pinia'
import { ref } from 'vue'

export const settingStore = defineStore('setting', () => {
  const theme = ref('light') // 默认主题为 'light'

  return {
    theme
  }
})
