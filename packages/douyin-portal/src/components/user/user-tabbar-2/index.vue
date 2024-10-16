<script setup lang="ts">
import {} from 'vue'

// 滚动监听
const { y } = useScroll(window)
const isScroll = ref(false)

watchEffect(() => {
  if (y.value > 160) {
    isScroll.value = true
  } else {
    isScroll.value = false
  }
})
const parentElement = ref<HTMLElement | null>(null)
// 侧边栏宽度
const sidebarWidth = ref<HTMLElement | null>(null)
onMounted(() => {
  parentElement.value = document.querySelector('.user-content')
  sidebarWidth.value = document.querySelector('.aside')
  // console.log(parentElement.value)
})

const paddingStyle = computed(() => {
  if (!isScroll.value) {
    return 'padding: 0px;'
  }
  if (parentElement.value && sidebarWidth.value && isScroll) {
    // 计算左侧空间大小
    const elementOffsetLeft =
      parentElement.value.offsetLeft + sidebarWidth.value.offsetWidth
    const offsetParent = parentElement.value.offsetParent

    // 计算包含元素的总宽度
    const offsetParentWidth = (offsetParent as HTMLElement)?.offsetWidth

    // 计算右侧空间大小
    const elementRightSpace =
      offsetParentWidth -
      (parentElement.value.offsetLeft + parentElement.value.offsetWidth)

    // console.log(
    //   `padding: 0px ${elementRightSpace}px 0px${elementOffsetLeft}px;`
    // )
    // 返回样式字符串
    return `padding: 0px ${elementRightSpace}px 0px ${elementOffsetLeft}px; top: 126px;`
  }
})
</script>
<template>
  <div
    class="user-tabbar-2"
    :class="{ scroll: isScroll }"
    :style="paddingStyle"
  >
    <div class="user-tabbar-2-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-tabbar-2 {
  min-height: 40px;
  width: 100%;
  align-items: center;
  display: flex;
  background-image: var(--global-bg-img), var(--global-bg-img-thin);
  background-size: 0 0;

  --global-bg-img: url(https://lf3-static.bytednsdoc.com/obj/eden-cn/medeh7bmupenuhd/dkw8.jpg);
  --global-bg-img-thin: url(https://lf3-static.bytednsdoc.com/obj/eden-cn/medeh7bmupenuhd/dkt8.jpg);

  &.scroll {
    z-index: 3;
    background-color: var(--color-bg-b0);
    position: fixed;
    left: 0;
    right: 0;
    transform: translateZ(0);

    background-image: var(--global-bg-img),
      linear-gradient(var(--color-bg-b0), var(--color-bg-b0));
    background-size: auto, calc(100% - 500px) 100%;
    background-position: 0 calc(0px - var(--header-height) - 58px), right 0;
    background-repeat: no-repeat;
  }

  &-content {
    height: 44px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    display: flex;
  }
}

@media (max-width: 1240px) {
  .user-tabbar-2.scroll {
    background-image: var(--global-bg-img-thin),
      linear-gradient(var(--color-bg-b0), var(--color-bg-b0));
  }
  :root[dark] .user-tabbar-2.scroll {
    background-image: var(--global-bg-img-thin),
      linear-gradient(var(--color-bg-b0), var(--color-bg-b0));
  }
}

:root[dark] .user-tabbar-2.scroll {
  background-image: var(--global-bg-img),
    linear-gradient(var(--color-bg-b0), var(--color-bg-b0));
  background-size: auto, calc(100% - 500px) 100%;
  background-position: 0 calc(0px - var(--header-height) - 58px), right 0;
  background-repeat: no-repeat;
}
</style>
