import { onUnmounted, ref, watchEffect } from 'vue'

export function useTitle(title: string, restoreOnUnmount = true) {
  const cachedTitle = document.title
  const titleRef = ref(title)

  watchEffect(() => {
    document.title = titleRef.value
  })
  if (restoreOnUnmount) {
    onUnmounted(() => {
      document.title = cachedTitle
    })
  }
  const setTitle = (newTitle: string) => {
    titleRef.value = newTitle
  }
  return setTitle
}
