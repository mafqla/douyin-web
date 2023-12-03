import type { ElScrollbar } from 'element-plus'
import { onMounted, watchEffect, type Ref, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export const useElScrollbarScroll = (
  scrollbarRef: Ref<InstanceType<typeof ElScrollbar> | null>,
  callback: (scrollTop: number) => void,
  wait = 0
) => {
  const debouncedCallback = useDebounceFn(callback, wait)

  onMounted(() => {
    const scrollbar = scrollbarRef.value
    console.log('scrollbar', scrollbar)
    if (scrollbar) {
      const scrollContent = scrollbar.$el.querySelector('.el-scrollbar__wrap')
      if (scrollContent) {
        scrollContent.addEventListener(
          'scroll',
          (event: { target: HTMLElement }) => {
            const target = event.target as HTMLElement
            console.log('target.scrollTop', target.scrollTop) 
            debouncedCallback(target.scrollTop)
          }
        )
      }
    }
  })
}
/**
 * @description: 监听页面滚动
 * @param scrollbarRef 
 * @returns 
 */
export const useElScroll = (
  scrollbarRef: Ref<HTMLElement | null>,
  callback: (scrollTop: number) => void,
  wait = 0
) => {
  const debouncedCallback = useDebounceFn(callback, wait)

  onMounted(() => {
    const scrollbar = scrollbarRef.value
    console.log('scrollbar', scrollbar)
    if (scrollbar) {
      const listener = (event: Event) => {
        console.log('event', event)
        const target = event.target as HTMLElement
        debouncedCallback(target.scrollTop)
        console.log('target.scrollTop', target.scrollTop)
      }
      
      scrollbar.addEventListener('scroll', listener)
    }
  })
}


/**
 * 页面滚动监听 Hook
 * @param targetRef 目标元素的 Ref 对象
 * @param callback 滚动事件回调函数
 * @param wait 回调函数的防抖等待时间（毫秒）
 */
export const useScroll = (
  targetRef: Ref<HTMLElement | null>,
  callback: (scrollTop: number) => void,
  wait = 0
) => {
  const debouncedCallback = useDebounceFn(callback, wait)

  const handleScroll = () => {
    const target = targetRef.value
    if (target) {
      debouncedCallback(target.scrollTop)
    }
  }

  onMounted(() => {
    const target = targetRef.value
    if (target) {
      target.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    const target = targetRef.value
    if (target) {
      target.removeEventListener('scroll', handleScroll)
    }
  })
}