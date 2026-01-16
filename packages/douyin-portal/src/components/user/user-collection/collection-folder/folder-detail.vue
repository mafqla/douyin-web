<script setup lang="ts">
import {
  ref,
  shallowRef,
  watch,
  computed,
  onBeforeUnmount,
  nextTick
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserError from '../../user-error/index.vue'
import SidebarModalPlayer from '@/views/sidebar-modal-player.vue'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'
import { useSidebarStore } from '@/stores/sidebar'

const route = useRoute()
const router = useRouter()
const sidebarStore = useSidebarStore()

const props = defineProps<{
  folder: ICollectsItem
  folderList: ICollectsItem[]
  batchMode?: boolean
}>()

const emit = defineEmits<{
  select: [folder: ICollectsItem]
  back: []
  createFolder: []
}>()

// 打开新建收藏夹弹框
const handleCreateFolder = () => {
  emit('createFolder')
}

// 视频列表
const folderVideoList = shallowRef<IAwemeInfo[]>([])
const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const cursor = ref('')
const count = ref(20)

// 获取封面图片
const getCoverUrl = (folder: ICollectsItem) => {
  return folder.collects_cover?.url_list?.[0] || ''
}

// 获取收藏夹内视频列表
const getFolderVideoList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true

  try {
    const res = await apis.getUserCollectFloderDetail(
      props.folder.collects_id_str,
      count.value,
      cursor.value
    )
    folderVideoList.value = [
      ...folderVideoList.value,
      ...(res.aweme_list || [])
    ]
    cursor.value = res.cursor
    loading.value = false
    isLoadingMore.value = false
    if (!res.has_more) {
      hasMore.value = false
      isLoadingMore.value = false
    }
  } catch (error) {
    hasMore.value = false
    isLoadingMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

// 重置并加载
const resetAndLoad = () => {
  folderVideoList.value = []
  cursor.value = ''
  hasMore.value = true
  loading.value = true
  getFolderVideoList()
}

// 选择收藏夹
const handleSelectFolder = (folder: ICollectsItem) => {
  emit('select', folder)
}

// 监听收藏夹变化，重新加载视频列表
watch(
  () => props.folder.collects_id_str,
  () => {
    resetAndLoad()
  },
  { immediate: true }
)

useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getFolderVideoList()
    }
  },
  { distance: 600 }
)

// 批量选择相关状态
const selectedIds = ref<Set<string>>(new Set())

// 列表长度
const listLength = computed(() => folderVideoList.value.length)

// 清空选中状态
const clearSelection = () => {
  selectedIds.value.clear()
}

// 切换全选状态
const toggleSelectAll = () => {
  if (selectedIds.value.size === folderVideoList.value.length) {
    // 取消全选
    selectedIds.value.clear()
  } else {
    // 全选
    selectedIds.value = new Set(
      folderVideoList.value.map((item) => item.aweme_id)
    )
  }
}

// 切换单个视频的选中状态
const toggleVideoSelection = (awemeId: string) => {
  if (selectedIds.value.has(awemeId)) {
    selectedIds.value.delete(awemeId)
  } else {
    selectedIds.value.add(awemeId)
  }
}

// 处理视频项点击事件
const handleVideoItemClick = (item: IAwemeInfo) => {
  if (props.batchMode) {
    // 批量管理模式：切换选中状态
    toggleVideoSelection(item.aweme_id)
  } else {
    openModalPlayer(item.aweme_id)
  }
}

// modal-player 相关
const showModalPlayer = ref(false)

// 打开 modal-player
const openModalPlayer = (awemeId: string) => {
  // 设置收藏夹信息到 store，让 video-sidebar 显示收藏夹 tab
  sidebarStore.setFolder(props.folder)
  // 设置收藏夹视频列表到 store
  sidebarStore.setFolderVideoList(folderVideoList.value)
  // 显示 modal player
  showModalPlayer.value = true
  router.push({
    path: route.path,
    query: {
      ...route.query,
      modal_id: awemeId
    }
  })
}

// 关闭 modal-player
const handleModalClose = async (currentAwemeId: string) => {
  // 隐藏 modal player
  showModalPlayer.value = false
  // 清除收藏夹信息
  sidebarStore.clearFolder()

  // 等待 DOM 更新
  await nextTick()

  // 检查当前视频是否在可视区域内
  const videoElement = document.querySelector(
    `[data-aweme-id="${currentAwemeId}"]`
  )
  if (videoElement) {
    const rect = videoElement.getBoundingClientRect()
    const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight

    // 如果不在可视区域内，滚动到该视频位置
    if (!isInViewport) {
      videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

// 组件卸载时清除收藏夹信息
onBeforeUnmount(() => {
  sidebarStore.clearFolder()
})

// 加载更多视频
const handleLoadMore = () => {
  if (hasMore.value && !isLoadingMore.value) {
    getFolderVideoList()
  }
}

// 从收藏夹移除选中的视频
const deleteSelected = async () => {
  try {
    // TODO: 调用 API 批量从收藏夹移除
    console.log('从收藏夹移除的视频 ID:', Array.from(selectedIds.value))

    // 从列表中移除已删除的项
    folderVideoList.value = folderVideoList.value.filter(
      (item) => !selectedIds.value.has(item.aweme_id)
    )

    // 清空选中状态
    selectedIds.value.clear()
  } catch (error) {
    console.error('从收藏夹移除失败:', error)
  }
}

// 暴露给父组件使用
defineExpose({
  selectedIds,
  listLength,
  clearSelection,
  toggleSelectAll,
  deleteSelected
})
</script>

<template>
  <div class="folder-detail">
    <!--左边收藏夹列表-->
    <div class="folder-left">
      <div class="collection-navigation">
        <div
          class="collection-navigation-item"
          :class="{ disabled: batchMode }"
          @click="!batchMode && handleCreateFolder()"
        >
          <div class="folder-info">
            <div class="folder-info-top">
              <span role="img" class="add-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  focusable="false"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16.5C11.4477 16.5 11 16.0523 11 15.5V13H8.5C7.94772 13 7.5 12.5523 7.5 12C7.5 11.4477 7.94772 11 8.5 11H11V8.5C11 7.94771 11.4477 7.5 12 7.5C12.5523 7.5 13 7.94771 13 8.5V11H15.5C16.0523 11 16.5 11.4477 16.5 12C16.5 12.5523 16.0523 13 15.5 13H13V15.5C13 16.0523 12.5523 16.5 12 16.5Z"
                    fill="currentColor"
                  ></path></svg
              ></span>
              <p class="folder-name">新建收藏夹</p>
            </div>
          </div>
          <div class="star-icon-container">
            <span role="img" class="star-icon">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                focusable="false"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.4063 17C14.9493 17 12.2074 19.9139 12.4174 23.3646L14.4298 56.4253C14.6547 60.1193 17.7161 63 21.4169 63H58.7045C62.3801 63 65.4297 60.1571 65.6873 56.4905L67.579 29.5609C67.8228 26.0902 65.073 23.1405 61.5938 23.1405H40.5616C38.458 23.1405 36.535 21.9519 35.5945 20.0702C34.654 18.1886 32.731 17 30.6275 17H18.4063ZM38.9748 35.2325C39.3398 34.2558 40.7205 34.2558 41.0855 35.2325L42.2451 38.3354C42.5438 39.1347 43.2914 39.6779 44.1439 39.7152L47.4508 39.8598C48.4919 39.9053 48.9186 41.2192 48.103 41.8683L45.5117 43.9309C44.8444 44.462 44.559 45.3405 44.7868 46.1623L45.6717 49.3554C45.9502 50.3603 44.8332 51.1723 43.9641 50.5968L41.2041 48.769C40.4924 48.2978 39.5679 48.2978 38.8562 48.769L36.0962 50.5968C35.2271 51.1723 34.1101 50.3602 34.3886 49.3554L35.2735 46.1623C35.5013 45.3405 35.2159 44.462 34.5486 43.9309L31.9573 41.8683C31.1417 41.2192 31.5684 39.9053 32.6095 39.8598L35.9164 39.7152C36.7689 39.6779 37.5165 39.1347 37.8152 38.3354L38.9748 35.2325Z"
                  fill="currentColor"
                  fill-opacity="0.15"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <!--收藏夹子项-->
        <div
          v-for="item in folderList"
          :key="item.collects_id_str"
          class="collection-navigation-item"
          :class="{
            active: folder.collects_id_str === item.collects_id_str,
            disabled:
              batchMode && folder.collects_id_str !== item.collects_id_str
          }"
          @click="!batchMode && handleSelectFolder(item)"
        >
          <div class="folder-cover">
            <div class="cover-img">
              <img
                v-if="getCoverUrl(item)"
                v-lazy="getCoverUrl(item)"
                :alt="item.collects_name"
              />
            </div>
          </div>
          <div class="folder-info">
            <div class="folder-info-top">
              <p class="folder-name">{{ item.collects_name }}</p>
              <span v-if="item.status !== 1" class="lock-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  focusable="false"
                >
                  <path
                    d="M7 9V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V9H18C19.1046 9 20 9.89543 20 11V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V11C4 9.89543 4.89543 9 6 9H7ZM15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V9H15V7Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
            <span class="folder-count">{{ item.total_number }}</span>
          </div>
          <div class="star-icon-container">
            <span role="img" class="star-icon">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                focusable="false"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.4063 17C14.9493 17 12.2074 19.9139 12.4174 23.3646L14.4298 56.4253C14.6547 60.1193 17.7161 63 21.4169 63H58.7045C62.3801 63 65.4297 60.1571 65.6873 56.4905L67.579 29.5609C67.8228 26.0902 65.073 23.1405 61.5938 23.1405H40.5616C38.458 23.1405 36.535 21.9519 35.5945 20.0702C34.654 18.1886 32.731 17 30.6275 17H18.4063ZM38.9748 35.2325C39.3398 34.2558 40.7205 34.2558 41.0855 35.2325L42.2451 38.3354C42.5438 39.1347 43.2914 39.6779 44.1439 39.7152L47.4508 39.8598C48.4919 39.9053 48.9186 41.2192 48.103 41.8683L45.5117 43.9309C44.8444 44.462 44.559 45.3405 44.7868 46.1623L45.6717 49.3554C45.9502 50.3603 44.8332 51.1723 43.9641 50.5968L41.2041 48.769C40.4924 48.2978 39.5679 48.2978 38.8562 48.769L36.0962 50.5968C35.2271 51.1723 34.1101 50.3602 34.3886 49.3554L35.2735 46.1623C35.5013 45.3405 35.2159 44.462 34.5486 43.9309L31.9573 41.8683C31.1417 41.2192 31.5684 39.9053 32.6095 39.8598L35.9164 39.7152C36.7689 39.6779 37.5165 39.1347 37.8152 38.3354L38.9748 35.2325Z"
                  fill="currentColor"
                  fill-opacity="0.15"
                ></path>
              </svg>
            </span>
          </div>
          <!-- 选中箭头 -->
          <div
            v-if="folder.collects_id_str === item.collects_id_str"
            class="arrow-icons"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              class="arrow-icon-left"
              viewBox="0 0 9 21"
            >
              <path
                d="M7.991 9.154c1.296.87 1.265 2.874-.027 3.748C5.374 14.655 1.794 17.53 0 21V0c2.156 4.549 4.619 6.89 7.991 9.154z"
                fill="#454650"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              class="arrow-icon-right"
              viewBox="0 0 9 21"
            >
              <path
                d="M7.991 9.154c1.296.87 1.265 2.874-.027 3.748C5.374 14.655 1.794 17.53 0 21V0c2.156 4.549 4.619 6.89 7.991 9.154z"
                fill="#454650"
              ></path>
            </svg>
          </div>
          <div class="folder-more-btn">
            <svg
              width="18"
              height="18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 24 24"
            >
              <path
                d="M16.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"
                fill="#fff"
                fill-opacity=".5"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 右边视频列表 -->
    <div class="folder-right">
      <Loading :show="loading">
        <div class="folder-video-list">
          <user-error
            icon="no-show-like"
            title="收藏夹暂无内容"
            desc="快去收藏喜欢的视频吧"
            v-if="!loading && folderVideoList.length === 0"
            class="no-show"
          />
          <template v-if="folderVideoList.length !== 0">
            <video-item
              v-for="item in folderVideoList"
              :key="item.aweme_id"
              :aweme="item"
              :data-aweme-id="item.aweme_id"
              :disableClickToggle="true"
              :selectable="batchMode"
              :selected="selectedIds.has(item.aweme_id)"
              class="folder-item"
              @click="handleVideoItemClick(item)"
            />
            <Loading :show="isLoadingMore" />
            <list-footer v-if="!hasMore" />
          </template>
        </div>
      </Loading>
    </div>

    <!-- Sidebar Modal Player -->
    <SidebarModalPlayer
      v-if="showModalPlayer"
      :videoList="folderVideoList"
      @close="handleModalClose"
      @loadMore="handleLoadMore"
    />
  </div>
</template>

<style lang="scss" scoped>
.folder-detail {
  display: flex;
}

.folder-left {
  width: 190px;
  flex-shrink: 0;
  margin-right: 8px;
}

.folder-right {
  flex: 1;
  min-width: 0;
}

.collection-navigation {
  max-height: calc(100vh - 168px);
  height: calc(100vh - 341px);
  overscroll-behavior: contain;
  width: 190px;
  padding-right: 8px;
  overflow: auto;

  &-item {
    width: 172px;
    height: 64px;
    color: var(--color-text-t2);
    background-color: var(--color-bg-b2);
    cursor: pointer;
    border-radius: 8px;
    align-items: center;
    margin-bottom: 8px;
    padding: 0 12px;
    transition: all 0.2s;
    display: flex;
    position: relative;

    &:hover,
    &.active {
      color: var(--color-text-t0);
      background-color: var(--color-bg-b3);

      .arrow-icons {
        display: block;
      }
    }
    &:hover {
      .folder-more-btn {
        visibility: visible;
        opacity: 1;
      }
    }

    // 批量管理模式下禁用非当前选中的收藏夹
    &.disabled {
      opacity: 0.3;
      cursor: not-allowed;
      pointer-events: none;

      &:hover {
        color: var(--color-text-t2);
        background-color: var(--color-bg-b2);
      }
    }
  }
}

.folder-cover {
  width: 28px;
  height: 28px;
  z-index: 1;
  border-radius: 6px;
  margin-right: 8px;
  background-color: var(--color-bg-b2);
  transition: all 0.2s;

  .cover-img {
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-top: 100%;
    display: flex;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
      animation: 0.2s fadeIn;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}

.folder-info {
  z-index: 1;
  flex-direction: column;
  display: flex;

  &-top {
    align-items: center;
    display: flex;
    position: relative;

    .folder-name {
      max-width: 100px;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      line-height: 22px;
      position: relative;
      overflow: hidden;
    }

    .add-icon {
      z-index: 1;
      opacity: 0.8;
      margin-right: 8px;
      font-size: 24px;
      text-align: center;
      text-transform: none;
      text-rendering: optimizelegibility;
      fill: currentColor;
      font-style: normal;
      line-height: 0;
      display: inline-block;
    }

    .lock-icon {
      color: #a9aab7;
      margin-left: 2px;
      font-size: 12px;
      text-align: center;
      text-transform: none;
      text-rendering: optimizelegibility;
      fill: currentColor;
      font-style: normal;
      line-height: 0;
      display: inline-block;
    }
  }

  .folder-count {
    font-size: 12px;
    line-height: 20px;
  }
}

.star-icon-container {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;

  .star-icon {
    opacity: 0.3;
    color: var(--color-text-t2);
    font-size: 88px;
    position: absolute;
    bottom: -22px;
    right: -28px;
    text-align: center;
    text-transform: none;
    text-rendering: optimizelegibility;
    fill: currentColor;
    font-style: normal;
    line-height: 0;
    display: inline-block;
  }
}

.arrow-icons {
  width: 18px;
  height: 18px;
  display: none;
  position: absolute;
  right: -12px;

  .arrow-icon-left {
    position: absolute;
  }

  .arrow-icon-right {
    opacity: 0.3;
    position: absolute;
  }
}

.folder-more-btn {
  visibility: hidden;
  opacity: 0;
  z-index: 100;
  transition: all 0.2s;
  position: absolute;
  bottom: 8px;
  right: 8px;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.no-show {
  margin: 120px 0;
}

.folder-video-list {
  position: relative;

  .folder-item {
    width: calc(20% - 12.8px);
  }
}
</style>
