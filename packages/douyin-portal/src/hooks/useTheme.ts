/**
 * @description 主题切换
 */

import { settingStore } from '@/stores/setting'
import { ref, onBeforeMount, watchEffect } from 'vue'

const useTheme = () => {
  // 使用 ref 创建一个响应式变量来存储当前主题
  const theme = ref('light') // 默认主题为 'light'

  onBeforeMount(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
  })

  // 创建一个切换主题的方法
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    // 将主题保存到本地存储
    localStorage.setItem('theme', theme.value)
  }

  watchEffect(() => {
    settingStore().theme = theme.value
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // console.log('theme changed', theme.value)
  })

  return {
    theme,
    toggleTheme
  }
}

export default useTheme
