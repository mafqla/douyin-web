<script setup lang="ts">
import SwiperVideo from '@/components/swiper/swiper-video.vue'
import { Loading } from '@/components/common'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { videosCtrolStore } from '@/stores/videos-control'

const props = defineProps<{
  // 外部传入的视频列表
  videoList: IAwemeInfo[]
}>()

const emit = defineEmits<{
  // 关闭事件，返回当前播放的视频 ID
  close: [currentAwemeId: string]
  // 需要加载更多视频
  loadMore: []
}>()

const route = useRoute()
const router = useRouter()
const control = videosCtrolStore()

// 从路由参数获取 modal_id
const modalId = computed(() => route.query.modal_id as string)

// 内部使用的视频列表
const list = ref<IAwemeInfo[]>([])
const loading = ref(true)
// 初始视频索引
const initialIndex = ref(0)

// 根据 modal_id 初始化视频列表，保持原顺序，设置初始索引
const initVideoList = () => {
  if (!props.videoList || props.videoList.length === 0) {
    loading.value = false
    return
  }

  // 保持原列表顺序
  list.value = [...props.videoList]

  // 找到当前视频的索引
  const currentIndex = props.videoList.findIndex(
    (item) => item.aweme_id === modalId.value
  )

  // 设置初始索引，如果没找到则默认为 0
  initialIndex.value = currentIndex === -1 ? 0 : currentIndex

  // 设置 store 的初始索引
  control.activeVideoIndex = initialIndex.value
  control.videosNum = list.value.length
  loading.value = false
}

// 监听 modalId 变化，重新初始化列表
watch(
  () => modalId.value,
  () => {
    if (modalId.value && props.videoList && props.videoList.length > 0) {
      control.reset()
      initVideoList()
    }
  },
  { immediate: true }
)

// 监听 videoList 变化
watch(
  () => props.videoList,
  (newList) => {
    if (newList && newList.length > 0) {
      // 追加新视频到列表中（保持已有视频不变）
      const existingIds = new Set(list.value.map((v) => v.aweme_id))
      const newVideos = newList.filter((v) => !existingIds.has(v.aweme_id))
      if (newVideos.length > 0) {
        list.value = [...list.value, ...newVideos]
        control.videosNum = list.value.length
      }
    }
  }
)

// 监听 refresh_index 变化，通知父组件加载更多
watch(
  () => control.refresh_index,
  () => {
    emit('loadMore')
  }
)

// 保存打开 modal 前的滚动位置
const savedScrollY = ref(0)

// 组件挂载时
onMounted(() => {
  // 保存当前滚动位置
  savedScrollY.value = window.scrollY
  // 设置 body 为 position:fixed 防止背景滚动
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.top = `-${savedScrollY.value}px`
})

// 组件销毁时，去除 body 的 position:fixed 并恢复滚动位置
onBeforeUnmount(() => {
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.top = ''
  // 恢复滚动位置
  window.scrollTo(0, savedScrollY.value)
})

// 关闭弹框，移除 URL 的 modal_id 参数
const handleClose = () => {
  // 获取当前播放的视频 ID
  const currentAwemeId = list.value[control.activeVideoIndex]?.aweme_id || modalId.value

  // 创建新的 query 对象，移除 modal_id
  const newQuery = { ...route.query }
  delete newQuery.modal_id

  router.replace({
    path: route.path,
    query: newQuery
  })

  emit('close', currentAwemeId)
}
</script>

<template>
  <div class="modal-player">
    <Loading
      :show="loading"
      :isShowText="true"
      :center="true"
      text="视频加载中..."
    >
      <!-- 关闭按钮 -->
      <div class="close-btn" @click="handleClose">
        <svg-icon class="icon" icon="close-big" />
      </div>

      <!-- 视频滚动列表 -->
      <div class="slide-list" id="slidelist">
        <SwiperVideo
          :videoList="list"
          :showSwiperControl="true"
          :isModal="true"
        />
      </div>
    </Loading>
  </div>
</template>

<style lang="scss" scoped>
.modal-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  z-index: 2000;
  background-color: #000;

  .close-btn {
    position: fixed;
    top: 35px;
    left: 35px;
    width: 64px;
    height: 64px;
    background-color: rgba(0, 0, 0, 0.18);
    border: 0.5px solid hsla(0, 0%, 100%, 0.15);
    border-radius: 32px;
    z-index: 100;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.35);

      .icon {
        color: #fff;
      }
    }

    .icon {
      height: 18px;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 18px;
      color: hsla(0, 0%, 100%, 0.25);
    }
  }

  .slide-list {
    display: flex;
    flex: 1 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
}
</style>
