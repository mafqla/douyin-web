import { useIntersectionObserver } from '@vueuse/core'

/**
 * @description: 懒加载指令
 */
export const lazy = {
  mounted(el: null | HTMLImageElement, binding: { value: string }) {
    if (el) {
      const { stop } = useIntersectionObserver(
        el,
        ([{ isIntersecting }], observerElement) => {
          if (isIntersecting) {
            el.src = binding.value
            stop()
          }
        }
      )
    }
  }
}

// 第二种写法
// const images = document.querySelectorAll('img')
// const callback = (entries: IntersectionObserverEntry[]) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       const img = entry.target as HTMLImageElement
//       const data_src = img.getAttribute('data-src')
//       img.setAttribute('src', data_src!)
//       observer.unobserve(img)
//       console.log('懒加载')
//     }
//   })
// }

// const observer = new IntersectionObserver(callback)
// images.forEach((img) => {
//   observer.observe(img)
// })
