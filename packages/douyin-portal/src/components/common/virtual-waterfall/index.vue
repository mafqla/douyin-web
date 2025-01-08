<script setup lang="ts" generic="T extends ICards">
import type { WaterfallProps, WaterfallList } from './type'
import type { ICards } from '@/api/tyeps/request_response/homeFeedRes'
import { useLayout } from './composables/useLayout'
import { v4 as uuidv4 } from 'uuid'

defineOptions({ name: 'virtual-waterfall' })
defineSlots<{
  default(props: { item: T; index: number }): any
  loading(): any
  footer(): any
}>()
const slots = useSlots()

const props = withDefaults(defineProps<WaterfallProps<T>>(), {
  list: () => [],
  isLoading: false,
  isOver: false,
  distanceToScroll: 200,
  isMounted: false,
  virtualTime: 0,
  virtualLength: 500
})

const uniqueId = uuidv4()
const { list, isLoading, isOver } = toRefs(props)

// 容器相关的响应式变量
const wrapperWidth = ref(0)
const wrapperHeight = ref(0)
const waterfallEl = ref<HTMLDivElement | null>(null)
const scrollTop = ref(0)

// 布局状态
const isLayoutReady = ref(false)
const isInnerLoading = ref(false)
const actualLoading = computed(() => isLoading.value || isInnerLoading.value)

// 存储布局计算的结果
const transformsRef = ref<
  {
    translateX: string
    translateY: string
    width: number
    height: number
  }[]
>([])

// 记录上次触发加载的时间，避免频繁触发
const lastLoadTime = ref(0)

// 使用防抖处理窗口大小变化
const updateWrapperSize = useDebounceFn(async () => {
  if (!waterfallEl.value) return
  
  // 先更新容器宽度
  const rect = waterfallEl.value.getBoundingClientRect()
  const newWidth = rect.width
  
  // 只有当宽度真正发生变化时才更新布局
  if (newWidth !== wrapperWidth.value) {
    wrapperWidth.value = newWidth
    // 清空已有布局，触发重新计算
    isLayoutReady.value = false
    transformsRef.value = []
    
    // 使用 requestAnimationFrame 确保 DOM 更新
    await new Promise(resolve => requestAnimationFrame(resolve))
    await nextTick()
    
    // 重新计算布局
    await updateLayout(list.value)
  }
}, 200)

// 监听容器尺寸变化
const resizeObserver = new ResizeObserver(() => {
  updateWrapperSize()
})

onMounted(() => {
  if (waterfallEl.value) {
    resizeObserver.observe(waterfallEl.value)
    updateWrapperSize()
  }
})

onUnmounted(() => {
  resizeObserver.disconnect()
})

const emit = defineEmits<{
  'scroll-reach-bottom': []
}>()

// 处理滚动事件
const handleScroll = useDebounceFn(
  () => {
    if (!waterfallEl.value || isLoading.value || isOver.value) return

    const target = waterfallEl.value
    scrollTop.value = target.scrollTop

    const clientHeight = target.clientHeight
    const scrollHeight = target.scrollHeight
    const bottomDistance = scrollHeight - (scrollTop.value + clientHeight)

    // 当滚动到距离底部 2 倍的 distanceToScroll 距离时就开始加载
    const now = Date.now()
    if (
      bottomDistance <= props.distanceToScroll * 2 &&
      now - lastLoadTime.value > 500 // 减少节流时间
    ) {
      lastLoadTime.value = now
      emit('scroll-reach-bottom')
    }
  },
  100, // 减少防抖时间
  { maxWait: 300 } // 添加最大等待时间
)

// 优化布局更新逻辑
async function updateLayout(noLayoutedList: any) {
  if (!noLayoutedList?.length || !waterfallEl.value) return

  isInnerLoading.value = true

  try {
    // 使用 requestAnimationFrame 优化渲染
    await new Promise((resolve) => requestAnimationFrame(resolve))

    // 计算布局
    const { totalHeight, transforms } = await useLayout(
      waterfallEl.value,
      noLayoutedList,
      wrapperWidth.value,
      slots
    )

    // 更新布局结果
    await nextTick()
    transformsRef.value = transforms
    wrapperHeight.value = totalHeight
    isLayoutReady.value = true

    // 只在首次加载时检查是否需要加载更多
    if (noLayoutedList.length <= 20) {
      await nextTick()
      if (waterfallEl.value) {
        const { scrollTop, clientHeight, scrollHeight } = waterfallEl.value
        const bottomDistance = scrollHeight - (scrollTop + clientHeight)
        const now = Date.now()

        if (
          bottomDistance <= props.distanceToScroll * 2 &&
          now - lastLoadTime.value > 500 &&
          !isLoading.value &&
          !isOver.value
        ) {
          lastLoadTime.value = now
          emit('scroll-reach-bottom')
        }
      }
    }
  } catch (error) {
    console.error('Error during layout calculation:', error)
  } finally {
    isInnerLoading.value = false
  }
}

// 获取项目样式
const getItemStyle = (index: number) => {
  const item = transformsRef.value[index]
  if (!item) return {}
  return {
    transform: `translate(${item.translateX}, ${item.translateY})`,
    width: `${item.width}px`,
    height: `${item.height}px`
  }
}

// 监听列表变化
watch(
  list,
  (newList) => {
    if (newList.length > 0) {
      nextTick(() => {
        updateLayout(newList)
      })
    }
  },
  { deep: true }
)

// 优化可见范围计算
const visibleRange = computed(() => {
  if (!transformsRef.value.length) return { start: 0, end: 0 }

  const buffer = Math.ceil(wrapperHeight.value) // 动态缓冲区大小
  const currentScrollTop = scrollTop.value
  const currentHeight = wrapperHeight.value

  let start = transformsRef.value.length
  let end = 0

  // 使用二分查找优化查找过程
  const binarySearch = (isStart: boolean) => {
    let left = 0
    let right = transformsRef.value.length - 1
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const item = transformsRef.value[mid]
      const itemTop = parseFloat(item.translateY)
      const itemBottom = itemTop + item.height

      if (isStart) {
        if (itemBottom >= currentScrollTop - buffer) {
          right = mid - 1
        } else {
          left = mid + 1
        }
      } else {
        if (itemTop <= currentScrollTop + currentHeight + buffer) {
          left = mid + 1
        } else {
          right = mid - 1
        }
      }
    }
    
    return isStart ? left : right
  }

  start = binarySearch(true)
  end = binarySearch(false) + 1

  // 确保至少渲染一些元素
  if (start === transformsRef.value.length) {
    start = 0
    end = Math.min(20, transformsRef.value.length)
  }

  return { start, end }
})

// 可见元素列表
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  return list.value.slice(start, end)
})
</script>

<template>
  <div class="virtual-waterfall" @scroll="handleScroll">
    <div class="virtual-waterfall-wrapper">
      <div class="virtual-waterfall-main" ref="waterfallEl">
        <div
          v-show="isLayoutReady"
          class="virtual-waterfall-container"
          :style="{
            width: wrapperWidth + 'px',
            height: wrapperHeight + 'px',
            position: 'relative',
            overflow: 'hidden'
          }"
        >
          <div
            class="virtual-waterfall-item"
            :style="getItemStyle(index + visibleRange.start)"
            v-for="(item, index) in visibleItems"
            :key="uniqueId + '-' + (index + visibleRange.start)"
          >
            <slot :item="item" :index="index + visibleRange.start" />
          </div>
        </div>
        <slot v-if="actualLoading && !isOver" name="loading"></slot>
        <slot v-if="!isInnerLoading && isOver" name="footer"> </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.virtual-waterfall {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  -webkit-overflow-scrolling: touch;

  // 隐藏滚动条 - Webkit 浏览器
  &::-webkit-scrollbar {
    display: none;
  }

  // 隐藏滚动条 - Firefox
  scrollbar-width: none;

  // 隐藏滚动条 - IE
  -ms-overflow-style: none;

  &-main {
    flex-grow: 1;
    position: relative;
    width: 100%;
    min-height: 100%;
  }

  &-wrapper {
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
  }

  &-container {
    margin: 0 auto;
  }

  &-item {
    position: absolute;
    will-change: transform;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
  }
}
</style>
