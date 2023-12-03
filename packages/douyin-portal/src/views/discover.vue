<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watchEffect } from 'vue'
import HotItem from '@/components/discover/hot-item/index.vue'
import DiscoverItem from '@/components/discover/discover-item/discover-item.vue'
import { getVideoList } from '@/service/videos/videos'
import type { IFeedParams, IVideoList } from '@/service/videos/videosType'
import { useInfiniteScroll } from '@vueuse/core'
import { useRouter } from 'vue-router'
import modelPlayer from '@/components/video-player/modal-player.vue'
import { discoverStore } from '@/stores/discover'

const loading = ref(true)
const page = ref(1)
const size = ref(20)
const list = ref<IVideoList[]>([])
const allowScroll = ref(true)
const getData = async (params: IFeedParams) => {
  try {
    const res = await getVideoList(params)
    // console.log(res)

    const { data } = res

    setTimeout(() => {
      loading.value = false
    }, 1000)

    list.value.push(...data)
    allowScroll.value = data && ((data.length > 0) as any)

    // console.log(allowScroll.value)
  } catch (err) {
    console.log(err)
  }
}
const currentHeight = ref(0)
const currentWidth = ref(0)

//侧边栏宽度
const sidebarWidth = ref(172)
//每个子项的宽高
const itemWidth = ref(0)
//子项个数
const numItems = ref(5)

// margin 宽度
const marginWidth = ref(44)
// 两个子项之间的间隔
const widthGap = ref(36)
//生成每个子项的translateX值
const translateXValues = ref<number[]>([])

/**
 *
 * @param itemWidth  每个子项的宽度
 * @param gap  两个子项之间的间隔
 * @param numItems  子项的个数
 */
function generateTranslateXValues(
  itemWidth: number,
  gap: number,
  numItems: number
) {
  const translateXValues = []

  for (let i = 0; i < list.value.length + 1; i++) {
    // const translateX = 8 + (itemWidth + gap) * i
    // translateXValues.push(translateX)
    const translateX = 8 + (itemWidth + gap) * (i % numItems) // 使用取余运算来实现循环
    translateXValues.push(translateX)
  }

  return translateXValues
}

const translateYValues = ref<number[]>([])
/**
 * @description: 根据每个子项的高度和高度列表生成 translateY 值
 * @param {number} itemHeight: 每个子项的高度
 * @param {number} numItems: 子项的个数
 * @param {number[]} listHeight: 高度列表
 */
function generateTranslateYValues(
  itemHeight: number,
  hotHeight: number,
  numItems: number,
  listHeight: number[]
): number[] {
  const translateYValues: number[] = []
  // 子项之间的间隔
  const spacing = 16

  // 如果listHeight的子项等于0 使用itemHeight创建一个长度20的数组，在numItems-1的位置插入698.062
  if (listHeight.length === 0) {
    const updatedListHeight = new Array(20).fill(itemHeight)
    updatedListHeight.splice(numItems - 1, 0, 698.062)

    // 初始化每列的高度为0
    const columnHeights = new Array(numItems).fill(0)

    // 生成瀑布流列表的高度
    for (let i = 0; i < updatedListHeight.length; i++) {
      // 查找当前列中总高度最小的列索引
      const minHeightColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      )
      // 获取当前列的总高度作为 translateY 值，考虑间隔
      const translateY = columnHeights[minHeightColumnIndex] + spacing

      translateYValues.push(translateY)
      // 更新当前列的高度
      columnHeights[minHeightColumnIndex] = translateY + itemHeight
    }
    // console.log(columnHeights)
  } else {
    // 复制一份 listHeight 的副本以防止修改原数组
    const updatedListHeight = [...listHeight]

    // 在第 numItems-1 的位置插入特定的值
    updatedListHeight.splice(numItems - 1, 0, hotHeight)
    // 初始化每列的高度为0
    const columnHeights = new Array(numItems).fill(0)

    let rowIndex = 0 // 当前行的索引
    let currentRowItems = 0 // 当前行内的子项数量

    // 生成瀑布流列表的高度
    for (let i = 0; i < updatedListHeight.length; i++) {
      let translateY = 0

      if (rowIndex === 0) {
        // 第一行从16开始
        translateY = 16
      } else {
        // console.log(columnHeights, currentRowItems, i)
        // 计算 translateY 值，考虑上一行的总高度和间隔
        translateY = columnHeights[currentRowItems] + spacing
      }

      // 更新当前列的高度
      columnHeights[currentRowItems] += updatedListHeight[i] + spacing
      translateYValues.push(translateY)
      currentRowItems++

      // 如果当前行内的子项数量等于 numItems，切换到下一行
      if (currentRowItems === numItems) {
        currentRowItems = 0
        rowIndex++
      }
    }
  }

  // const translateYObjects = []
  // for (let i = 0; i < translateYValues.length; i += numItems) {
  //   const rowTranslateYValues = translateYValues.slice(i, i + numItems)
  //   translateYObjects.push({ row: i / numItems, values: rowTranslateYValues })
  // }

  // // 打印对象数组
  // console.log(translateYObjects, translateYValues)
  return translateYValues
}

//组件挂载前获取窗口大小
onMounted(() => {
  // currentHeight.value = window.innerHeight
  currentWidth.value = window.innerWidth

  getData({
    page: page.value,
    size: size.value
  })
})

const load = () => {
  // 滚动条在底部
  console.log('滚动条在底部')
  if (!allowScroll.value) {
    return
  }

  page.value += 1
  getData({
    page: page.value,
    size: size.value
  })
}
const scrollRef = ref()

setTimeout(() => {
  useInfiniteScroll(scrollRef, load, { distance: 500 })
}, 3000)

// 监听窗口大小变化
window.addEventListener('resize', () => {
  // currentHeight.value = window.innerHeight
  currentWidth.value = window.innerWidth
})

//监听窗口大小变化
watchEffect(() => {
  // console.log(currentHeight.value, currentWidth.value)
  //如果窗口宽度小于等于1240，
  if (currentWidth.value <= 1240) {
    sidebarWidth.value = 72
  } else {
    sidebarWidth.value = 160
  }
  // console.log(sidebarWidth.value)
  currentHeight.value = window.innerHeight

  // console.log('height:', height)
  // console.log(currentHeight.value, currentWidth.value)
  const minWidth = 512
  currentWidth.value = window.innerWidth - sidebarWidth.value - 44
  currentWidth.value = Math.max(currentWidth.value, minWidth)
  // console.log(currentHeight.value, currentWidth.value)
  //如果currentWeight小于等于1491设置项的个数为4，小于等于1020设置项的个数为3，小于等于768设置项的个数为2
  if (currentWidth.value >= 1680 && currentWidth.value < 1920) {
    numItems.value = 7
    widthGap.value = 32
  } else if (currentWidth.value >= 1500 && currentWidth.value < 1680) {
    numItems.value = 6
    widthGap.value = 16
  } else if (currentWidth.value >= 1440 && currentWidth.value < 1500) {
    numItems.value = 5
    widthGap.value = 26
  } else if (currentWidth.value >= 1020 && currentWidth.value < 1440) {
    numItems.value = 4
    widthGap.value = 20
  } else if (currentWidth.value >= 768 && currentWidth.value < 1020) {
    numItems.value = 3
    widthGap.value = 4
  } else if (currentWidth.value >= 0 && currentWidth.value < 768) {
    numItems.value = 2
    widthGap.value = 32
    marginWidth.value = 0
  } else {
    numItems.value = 8
    widthGap.value = 74
  }

  // console.log(numItems.value)

  // 36 20 8  32
  itemWidth.value =
    (currentWidth.value - marginWidth.value - widthGap.value) / numItems.value
  // console.log('itemWidth', itemWidth.value)
  translateXValues.value = generateTranslateXValues(
    itemWidth.value,
    16,
    numItems.value
  )

  // console.log(translateXValues.value)

  const listHeight = discoverStore().listHeight
  const hotHeight = discoverStore().hotHeight
  // console.log(numItems.value)
  translateYValues.value = generateTranslateYValues(
    360,
    hotHeight,
    numItems.value,
    listHeight
  )

  // console.log(translateYValues.value)
})

function actualIndex(loopIndex: number) {
  if (loopIndex >= numItems.value - 1) {
    return loopIndex + 1
  }
  return loopIndex
}

onBeforeUnmount(() => {
  discoverStore().$reset()
})
//组件卸载前清除数据


const router = useRouter()
const visible = ref(false)
// 点击获取数据
const modalData = reactive({
  id: 0,
  username: '',
  uploadTime: '',
  description: '',
  url: '',
  poster: '',
  isPlay: false,
  img: '',
  dianzan: 0,
  comment: 0,
  shoucang: 0,
  globalVolume: 0,

  isLike: false,
  isCollect: false,
  isAttention: 0
})
const handleModal = (item: IVideoList) => {
  modalData.id = item.id
  modalData.username = item.userName
  modalData.uploadTime = item.uploadTime
  modalData.description = item.description
  modalData.url = item.videosAddress
  modalData.poster = item.videosCover
  modalData.isPlay = true
  modalData.img = item.userAvatar
  modalData.dianzan = item.likeCount
  modalData.comment = item.commentCount
  // modalData.shoucang = item.collectCount

  modalData.isLike = item.isLike
  modalData.isCollect = item.isCollect
  modalData.isAttention = item.isAttention
  modalData.globalVolume = 0.6
  router.push({
    query: {
      ...router.currentRoute.value.query,
      modal_id: item.id
    }
  })
  visible.value = true
}

//关闭modal
const handleClose = () => {
  visible.value = false
  //去除路由参数
  router.push({
    query: {
      ...router.currentRoute.value.query,
      modal_id: undefined
    }
  })
}
</script>
<template>
  <div class="discover" ref="scrollRef">
    <div class="discover-main">
      <div
        class="discover-container"
        :style="{
          height: `${currentHeight}px`,
          width: `${currentWidth}px`,
          margin: '0 22px'
        }"
      >
        <template v-for="(item, index) in list" :key="item.id">
          <template v-if="index === numItems - 1">
            <hot-item
              :style="{
                width: `${itemWidth}px`,
                transform: `translate(${translateXValues[numItems - 1]}px, ${
                  translateYValues[index]
                }px)`
              }"
            />
          </template>
          <discover-item
            :index="actualIndex(index)"
            :id="item.id"
            :img="item.videosCover"
            :postTime="item.uploadTime"
            :videoTime="item.videosTime"
            :like="item.likeCount"
            :author="item.userName"
            :title="item.title"
            :fellow="item.isAttention"
            :videoUrl="item.videosAddress"
            :itemWidth="itemWidth"
            :isLoading="loading"
            :style="{
              width: `${itemWidth}px`,
              transform: `translate(${
                translateXValues[actualIndex(index)]
              }px, ${translateYValues[actualIndex(index)]}px)`
            }"
            @click.stop="handleModal(item)"
            @openModal="handleModal(item)"
          />
        </template>

        <el-dialog
          v-model="visible"
          :show-close="false"
          :modal="false"
          :fullscreen="true"
          top="0vh"
          :append-to-body="true"
          :destroy-on-close="true"
        >
          <model-player v-bind="modalData" @closeBtn="handleClose" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discover {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;

  .discover-main {
    flex-grow: 1;
    position: relative;
    width: 100%;

    .discover-container {
      position: relative;
      // min-height: 450px;
    }
  }
}
</style>
