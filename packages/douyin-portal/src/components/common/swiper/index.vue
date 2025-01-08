<script setup lang="ts">
import {
  ref,
  withDefaults,
  onMounted,
  onUnmounted,
  computed,
  watchEffect
} from 'vue'
import arrowLeftIcon from './arrow-left-icon.vue'
import arrowRightIcon from './arrow-right-icon.vue'

interface Props {
  slides: any[]
  autoPlay?: boolean // 是否自动播放
  direction?: 'horizontal' | 'vertical'
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: false,
  direction: 'horizontal',
  loop: false
})

const activeIndex = ref(0)
const swiperWrapper = ref<HTMLElement | null>(null)
const visibleSlides = ref<any[]>([])
const overscan = 10 // 预渲染的幻灯片数量
const transitionDuration = ref(500) // 动画持续时间

// 为 slides 数组中的每个元素生成唯一 ID
const generateUniqueIds = () => {
  props.slides.forEach((slide) => {
    if (!slide._uniqueId) {
      slide._uniqueId = crypto.randomUUID() // 为每个 slide 动态生成唯一标识符
    }
  })
}

// 动态计算 slideHeight 和 slideWidth
const slideSize = computed(() => {
  if (!swiperWrapper.value || !props.slides.length)
    return { width: 0, height: 0 }
  const slideEl = swiperWrapper.value.children[0] as HTMLElement
  // console.log(slideEl.offsetWidth, slideEl.offsetHeight)
  return {
    width: slideEl.offsetWidth,
    height: slideEl.offsetHeight + 12
  }
})

// 计算可视区域内的幻灯片
const calculateVisibleSlides = () => {
  if (!swiperWrapper.value) return
  const { width, height } = slideSize.value
  const containerSize =
    props.direction === 'horizontal'
      ? swiperWrapper.value.offsetWidth
      : swiperWrapper.value.offsetHeight
  const slideSizeVal = props.direction === 'horizontal' ? width : height
  const visibleCount = Math.ceil(containerSize / slideSizeVal) + overscan
  const start = Math.max(0, activeIndex.value - overscan)
  const end = Math.min(props.slides.length, activeIndex.value + visibleCount)
  visibleSlides.value = props.slides.slice(start, end)
}

// 切换到下一个幻灯片
const next = () => {
  if (activeIndex.value < props.slides.length - 1) {
    activeIndex.value++
  } else if (props.loop) {
    activeIndex.value = 0
  }
  calculateVisibleSlides()
}

// 切换到上一个幻灯片
const prev = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  } else if (props.loop) {
    activeIndex.value = props.slides.length - 1
  }
  calculateVisibleSlides()
}

// 自动播放
let autoPlayInterval: number | undefined
const startAutoPlay = () => {
  if (props.autoPlay) {
    autoPlayInterval = window.setInterval(next, 3000)
  }
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
}

onMounted(() => {
  generateUniqueIds() // 初始化时为每个 slide 生成唯一 id
  calculateVisibleSlides()
  startAutoPlay()

})

onUnmounted(() => {
  stopAutoPlay()
})

watchEffect(() => {
  activeIndex.value, calculateVisibleSlides
})

// 计算 wrapper 样式
const wrapperStyle = computed(() => ({
  transform:
    props.direction === 'horizontal'
      ? `translate3d(-${activeIndex.value * slideSize.value.width}px, 0, 0)`
      : `translate3d(0, -${activeIndex.value * slideSize.value.height}px, 0)`,
  'transition-duration': `${transitionDuration.value}ms`
}))

defineExpose({ next, prev, activeIndex })
</script>

<template>
  <div class="swiper" ref="swiperWrapper">
    <div
      class="swiper-wrapper"
      :style="wrapperStyle"
      :class="{
        horizontal: props.direction === 'horizontal',
        vertical: props.direction === 'vertical'
      }"
    >
      <div
        class="swiper-slide"
        v-for="(item, index) in visibleSlides"
        :key="item._uniqueId"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>
    <div class="swiper-arrow prev" @click="prev">
      <arrow-left-icon />
    </div>
    <div class="swiper-arrow next" @click="next">
      <arrow-right-icon />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.swiper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .swiper-wrapper {
    display: flex;

    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.5s ease;
    &.horizontal {
      flex-direction: row;
    }
    &.vertical {
      flex-direction: column;
    }
  }

  .swiper-slide {
    flex: 0 0 auto;
    width: 100%;
    height: 100%;
    position: relative;
    margin-bottom: 12px;
  }

  .swiper-arrow {
    width: 56px;
    height: 56px;
    z-index: 3;
    box-sizing: content-box;
    opacity: 1;
    position: absolute;
    top: 50%;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.15);
    border-image: initial;
    border-radius: 50%;
    transition: opacity 0.2s linear 0s;
    overflow: hidden;

    &.prev {
      left: 140px;
      transform: translateY(-50%);
    }
    &.next {
      right: 140px;
      transform: translateY(-50%);
    }
  }
}
</style>
