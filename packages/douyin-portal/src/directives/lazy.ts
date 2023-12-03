import {useIntersectionObserver} from '@vueuse/core'

/**
 * @description: 懒加载指令
 */
export const lazy = {
    mounted(el: any, binding: any) {
        const {stop} = useIntersectionObserver(
            el,
            ([{isIntersecting}], observerElement) => {
                // console.log(isIntersecting)
                if (isIntersecting) {
                    el.src = binding.value
                    // 停止监听
                    stop()
                }
            }
        )
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
