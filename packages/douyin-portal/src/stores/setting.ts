import { defineStore } from 'pinia'
import { ref } from 'vue'

export const settingStore = defineStore('setting', () => {
  const theme = ref('light') // 默认主题为 'light'
  const isShowSwitchControl = ref(true) // 是否显示视频切换按钮控制

  return {
    theme,
    isShowSwitchControl
  }
})
