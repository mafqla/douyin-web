<script setup lang="ts" generic="T extends ICards">

import type {
  WaterfallProps,
  WaterfallList,
} from './type'
import type { ICards } from '@/api/tyeps/request_response/homeFeedRes'
import { useLayout } from './composables/useLayout';
import { v4 as uuidv4 } from 'uuid'

// 定义组件名
defineOptions({ name: 'virtual-waterfall' })
defineSlots<{
  // 默认插槽
  default(props: {
    item: T
    index: number
  }): any
  // loading 插槽
  loading(): any
  // footer 插槽
  footer(): any
}>()
const slots = useSlots()
// 定义 props 默认值
const props = withDefaults(defineProps<WaterfallProps<T>>(), {
  list: () => [], // 元数据列表
  isLoading: false, // 是否正在加载
  isOver: false, // 是否结束（所有数据加载完）
  distanceToScroll: 200, // 底部触发加载的距离，单位：px
  isMounted: false, // 父组件是否加载完成，和 scrollBodySelector 配合使用
  virtualTime: 0, // 虚拟列表的触发间隔, 默认为 0 时，不做虚拟列表
  virtualLength: 500, // 元素隐藏时距离视窗的距离
})
const {
  distanceToScroll,
  virtualTime,
  virtualLength,
} = props

const uniqueId = uuidv4()
// 使用 toRefs 将 props 中的值解构出来以便保存响应式
const { list, isLoading, isOver, isMounted, active } = toRefs(props)

// 获取元素的宽度
const wrapperWidth = ref(0)
const wrapperHeight = ref(0)
const waterfallEl = ref<HTMLDivElement | null>(null)

// 使用防抖处理窗口大小变化
const updateWrapperSize = useDebounceFn(() => {
  wrapperWidth.value = waterfallEl.value?.getBoundingClientRect().width || 0;
  wrapperHeight.value = waterfallEl.value?.getBoundingClientRect().height || 0;

  console.log('wrapperWidth', wrapperWidth.value);
}, 200);

watchEffect(() => {
  nextTick(() => {
    // 开始监听waterfallEl的尺寸变化
    updateWrapperSize();
    window.addEventListener('resize', updateWrapperSize);
  });

});

onUnmounted(() => {
  window.removeEventListener('resize', updateWrapperSize);
});

const emit = defineEmits<{
  'scroll-reach-bottom': []
}>()

/**
 * 实际 loading 态分为两个部分
 * 1.外部数据加载
 * 2.内部计算
 */
const isInnerLoading = ref(false)
const actualLoading = computed(() => {
  return isLoading.value || isInnerLoading.value
})

// 处理后的数组
const processedList = ref(list)
// 添加一个响应式变量来存储布局计算的结果
const transformsRef = ref<{
  translateX: string
  translateY: string
  width: number
  height: number
}[]>([]);

async function updateLayout(noLayoutedList: WaterfallList<T>) {
  if (!noLayoutedList || !noLayoutedList.length) return;

  isInnerLoading.value = true;
  try {
    const { totalHeight, transforms } = await useLayout(waterfallEl.value!, processedList, wrapperWidth.value, slots, noLayoutedList);
    transformsRef.value = transforms;
    wrapperHeight.value = totalHeight;

    isInnerLoading.value = false;
  } catch (error) {
    console.error("Error during layout calculation:", error);
  } finally {
    // isInnerLoading.value = false;
  }
}

/**
 * 获取项目样式
 *
 * @param index 项目索引
 * @returns 返回项目样式对象，包含 transform、width 和 height 属性
 */
const getItemStyle = (index: number) => {
  const item = transformsRef.value[index];
  if (!item) return {};
  return {
    transform: `translate(${item.translateX}, ${item.translateY}) scale(1,1)`,
    width: `${item.width}px`,
    height: `${item.height}px`,
  };

}
watchEffect(() => {
  updateLayout(processedList.value);
});

function handleScroll() {
  if (!waterfallEl.value) return;
  const scrollPosition = waterfallEl.value.scrollTop + wrapperHeight.value;
  const shouldLoadMore = scrollPosition + props.distanceToScroll >= waterfallEl.value.scrollHeight;
  console.log('shouldLoadMore', shouldLoadMore, props.isLoading, props.isOver);
  if (shouldLoadMore && !props.isLoading && !props.isOver) {
    emit('scroll-reach-bottom');
  }
}


</script>
<template>
  <div class="virtual-waterfall" @scroll="handleScroll">
    <div class="virtual-waterfall-warpper">
      <div class="virtual-waterfall-main" ref="waterfallEl">
        <div class="virtual-waterfall-container" :style="{
          width: wrapperWidth + 'px',
          height: wrapperHeight + 'px',
          margin: '0'
        }">
          <div class="virtual-waterfall-item" :style="getItemStyle(index)" v-for="(item, index ) in processedList"
            :key="uniqueId + '-' + index">
            <slot :item :index />
          </div>
        </div>
        <!-- loading slot 区域 -->
        <slot v-if="actualLoading && !isOver" name="loading"></slot>
        <!-- 加载完 slot 区域 -->
        <slot v-if="!isInnerLoading && isOver" name="footer">
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.virtual-waterfall {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;

  &-main {
    flex-grow: 1;
    position: relative;
    width: 100%;


  }

  .virtual-waterfall-warpper {
    width: calc(100% - 22px)
  }

  .virtual-waterfall-container {
    position: relative;
    // min-height: 450px;
  }

  .virtual-waterfall-item {
    position: absolute;
    will-change: transform;
  }


}
</style>
