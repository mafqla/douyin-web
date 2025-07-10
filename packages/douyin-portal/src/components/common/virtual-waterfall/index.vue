<script setup lang="ts" generic="T extends ICards">
import type { WaterfallProps } from './type'
import type { ICards } from '@/api/tyeps/request_response/homeFeedRes'
import { useVirtualWaterfall } from './composables/useVirtualWaterfall'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch } from 'vue'

defineOptions({ name: 'VirtualWaterfall' })
defineSlots<{
  default(props: { item: T; index: number }): any
  loading(): any
  footer(): any
}>()

const props = withDefaults(defineProps<WaterfallProps<T>>(), {
  list: () => [],
  isLoading: false,
  isOver: false,
  distanceToScroll: 200,
  bufferSize: 2,
  minRenderItems: 20
})

const uniqueId = uuidv4()
const waterfallEl = ref<HTMLDivElement | null>(null)
const slots = useSlots()
const lastLoadTime = ref(0)

const {
  wrapperWidth,
  wrapperHeight,
  isLayoutReady,
  transforms,
  visibleRange,
  visibleItems,
  getItemStyle,
  handleScroll
} = useVirtualWaterfall(waterfallEl, toRef(props, 'list'), slots, {
  distanceToScroll: props.distanceToScroll,
  bufferSize: props.bufferSize,
  minRenderItems: props.minRenderItems
})

const emit = defineEmits<{
  'scroll-reach-bottom': []
}>()

// 统一滚动处理函数
const handleScrollEvent = (e: Event) => {
  const target = e.currentTarget as HTMLElement
  const { scrollTop, clientHeight, scrollHeight } = target

  // 传递给虚拟列表处理
  handleScroll()

  // 检查是否滚动到底部
  if (props.isLoading || props.isOver) return

  const bottomDistance = scrollHeight - (scrollTop + clientHeight)

  console.log('滚动位置:', {
    scrollTop,
    clientHeight,
    scrollHeight,
    bottomDistance,
    threshold: props.distanceToScroll
  })

  console.log('触发加载更多数据')
  emit('scroll-reach-bottom')
}
</script>

<template>
  <div
    class="virtual-waterfall"
    ref="waterfallEl"
    @scroll.passive="handleScrollEvent"
  >
    <div
      class="virtual-waterfall-container"
      :style="{
        width: wrapperWidth + 'px',
        height: wrapperHeight + 'px',
        position: 'relative'
      }"
    >
      <div
        class="virtual-waterfall-item"
        v-for="(item, index) in visibleItems"
        :key="`${uniqueId}-${index + visibleRange.start}`"
        :style="getItemStyle(index + visibleRange.start)"
      >
        <slot :item="item" :index="index + visibleRange.start" />
      </div>
    </div>

    <slot
      v-if="(props.isLoading || !isLayoutReady) && !props.isOver"
      name="loading"
    />
    <slot v-if="!props.isLoading && props.isOver" name="footer" />
  </div>
</template>

<style lang="scss" scoped>
.virtual-waterfall {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  -webkit-overflow-scrolling: touch;

  /* 调试时显示滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;

  &-container {
    position: relative;
    will-change: transform;
  }

  &-item {
    position: absolute;
    will-change: transform;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
  }
}
</style>
