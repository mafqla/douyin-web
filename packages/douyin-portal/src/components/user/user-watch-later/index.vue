<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserError from '../user-error/index.vue'
import BatchActionBar from '../batch-action-bar/index.vue'
import UserConfirmDialog from '../user-confirm-dialog/index.vue'
import DyButton from '@/components/ui/button/button.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

// 扩展 IAwemeInfo 类型，添加 play_progress 字段
interface IWatchLaterItem extends IAwemeInfo {
  play_progress?: {
    play_progress: number
    last_modified_time: number
    watch_times: number
  }
}

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const watchLaterList = ref<IWatchLaterItem[]>([])
// 视频列表容器 ref
const videoListRef = ref<HTMLElement | null>(null)
// 当前需要滚动到的视频 ID
const currentScrollId = ref<string | null>(null)

// 使用 useGridScrollToItem 实现滚动定位
const { scrollToItem } = useGridScrollToItem({
  containerRef: videoListRef,
  currentId: currentScrollId,
  items: watchLaterList,
  idKey: 'aweme_id',
  autoScroll: false,
  block: 'center',
  offsetTop: 60,
  dataAttr: 'aweme-id'
})

const params = reactive({
  offset: 0
})

const getWatchLaterList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getWatchLaterList(params.offset)
    watchLaterList.value = watchLaterList.value.concat(
      res.items as IWatchLaterItem[]
    )
    params.offset = watchLaterList.value.length
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

onMounted(() => {
  getWatchLaterList()
})

useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getWatchLaterList()
    }
  },
  { distance: 600 }
)

// 点击视频打开 modal
const handleOpenModal = (item: IAwemeInfo) => {
  router.push({
    query: {
      ...route.query,
      modal_id: item.aweme_id
    }
  })
}

// modal 是否显示
const showModal = computed(() => {
  return route.query.modal_id !== undefined
})

// Modal 滚动到末尾时加载更多
const handleLoadMore = async () => {
  await getWatchLaterList()
}

// 关闭 modal 后滚动到当前视频位置
const handleModalClose = async (currentAwemeId: string) => {
  await nextTick()
  setTimeout(() => {
    scrollToItem(currentAwemeId)
  }, 50)
}

// 批量操作相关状态
const isBatchMode = ref(false)
const selectedIds = ref<Set<string>>(new Set())
const showRemoveDialog = ref(false)
// 移除已看完视频的确认弹框
const showRemoveWatchedDialog = ref(false)

// 是否全选
const isAllSelected = computed(() => {
  return (
    watchLaterList.value.length > 0 &&
    selectedIds.value.size === watchLaterList.value.length
  )
})

// 切换批量管理模式
const toggleBatchMode = () => {
  isBatchMode.value = !isBatchMode.value
  if (!isBatchMode.value) {
    selectedIds.value.clear()
  }
}

// 切换全选状态
const handleToggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value.clear()
  } else {
    selectedIds.value = new Set(
      watchLaterList.value.map((item) => item.aweme_id)
    )
  }
}

// 处理移除按钮点击
const handleRemove = () => {
  if (selectedIds.value.size === 0) return
  showRemoveDialog.value = true
}

// 确认移除
const confirmRemove = async () => {
  showRemoveDialog.value = false
  try {
    // TODO: 调用 API 移除稍后再看
    console.log('移除稍后再看的作品 ID:', Array.from(selectedIds.value))
    // 从列表中移除已选中的项
    watchLaterList.value = watchLaterList.value.filter(
      (item) => !selectedIds.value.has(item.aweme_id)
    )
    selectedIds.value.clear()
  } catch (error) {
    console.error('移除失败:', error)
  }
}

// 取消弹框
const cancelDialog = () => {
  showRemoveDialog.value = false
}

// 点击移除已看完的视频
const handleRemoveWatched = () => {
  showRemoveWatchedDialog.value = true
}

// 确认移除已看完的视频
const confirmRemoveWatched = async () => {
  showRemoveWatchedDialog.value = false
  try {
    // 筛选出已看完的视频（进度 >= 100%）
    const watchedIds = watchLaterList.value
      .filter((item) => {
        if (!item.play_progress?.play_progress || !item.video?.duration)
          return false
        const percent =
          (item.play_progress.play_progress / item.video.duration) * 100
        return percent >= 100
      })
      .map((item) => item.aweme_id)

    // TODO: 调用 API 移除已看完的视频
    console.log('移除已看完的作品 ID:', watchedIds)

    // 从列表中移除已看完的视频
    watchLaterList.value = watchLaterList.value.filter(
      (item) => !watchedIds.includes(item.aweme_id)
    )
  } catch (error) {
    console.error('移除已看完视频失败:', error)
  }
}

// 取消移除已看完视频弹框
const cancelRemoveWatchedDialog = () => {
  showRemoveWatchedDialog.value = false
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
  if (isBatchMode.value) {
    toggleVideoSelection(item.aweme_id)
  } else {
    handleOpenModal(item)
  }
}

// 暴露给父组件使用
defineExpose({
  isBatchMode,
  toggleBatchMode
})
</script>

<template>
  <Loading :show="loading">
    <div class="user-watch-later">
      <!-- 批量操作工具栏 -->
      <user-tabbar-2 :style="isBatchMode ? 'height: 72px' : ''">
        <template #left>
          <BatchActionBar
            v-if="isBatchMode"
            :selected-count="selectedIds.size"
            :all-selected="isAllSelected"
            :disabled="watchLaterList.length === 0"
            action-text="取消稍后再看"
            selected-text-template="已选 {count} 个稍后再看的作品"
            @select-all="handleToggleSelectAll"
            @action="handleRemove"
          />
        </template>
        <template #right>
          <!-- 非批量模式下显示筛选提示 -->
          <div
            v-if="!isBatchMode"
            class="filter-tip"
            @click="handleRemoveWatched"
          >
            <svg
              class="tip-icon"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              focusable="false"
            >
              <path
                d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 3.2002C5.34903 3.2002 3.2002 5.34903 3.2002 8C3.2002 10.651 5.34903 12.7998 8 12.7998C10.651 12.7998 12.7998 10.651 12.7998 8C12.7998 5.34903 10.651 3.2002 8 3.2002ZM10.1211 7.41211C10.3944 7.46811 10.5996 7.7101 10.5996 8C10.5996 8.2899 10.3944 8.53189 10.1211 8.58789L10 8.59961H6C5.66863 8.59961 5.40039 8.33137 5.40039 8C5.40039 7.66863 5.66863 7.40039 6 7.40039H10L10.1211 7.41211Z"
                fill="currentColor"
              ></path>
            </svg>
            <span class="tip-text">移除已看完的视频</span>
          </div>
        </template>
      </user-tabbar-2>

      <div class="user-watch-later-list">
        <template v-if="watchLaterList.length !== 0">
          <div class="video-list" ref="videoListRef">
            <VideoItem
              v-for="item in watchLaterList"
              :key="item.aweme_id"
              :aweme="item"
              :data-aweme-id="item.aweme_id"
              :disableClickToggle="true"
              :selectable="isBatchMode"
              :selected="selectedIds.has(item.aweme_id)"
              :showProgress="true"
              :playProgress="item.play_progress?.play_progress"
              @click="handleVideoItemClick(item)"
            />
          </div>
          <Loading :show="isLoadingMore" />
          <list-footer v-if="!hasMore" />
        </template>
        <!-- 空状态提示 -->
        <user-error
          v-if="watchLaterList.length === 0 && !loading"
          icon="empty-list-user"
          title="暂无内容"
          desc="还没有添加稍后再看的视频"
          class="no-show"
        />
      </div>

      <!-- Modal Player 全屏播放器 -->
      <ModalPlayer
        v-if="showModal"
        :videoList="watchLaterList"
        :hasMore="hasMore"
        @close="handleModalClose"
        @loadMore="handleLoadMore"
      />

      <!-- 取消稍后再看确认弹框 -->
      <UserConfirmDialog
        v-model="showRemoveDialog"
        :title="`确认取消 ${selectedIds.size} 个稍后再看的作品，取消后不可恢复`"
        cancel-text="暂不取消"
        confirm-text="确认取消"
        @confirm="confirmRemove"
        @cancel="cancelDialog"
      />

      <!-- 移除已看完视频确认弹框 -->
      <UserConfirmDialog
        v-model="showRemoveWatchedDialog"
        title="是否确认取消已看完的作品，取消后不可恢复"
        cancel-text="暂不取消"
        confirm-text="确认取消"
        @confirm="confirmRemoveWatched"
        @cancel="cancelRemoveWatchedDialog"
      />
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}
.user-watch-later {
  position: relative;
}
.filter-tip {
  color: var(--color-text-t3);
  user-select: none;
  align-items: center;
  font-size: 13px;
  line-height: 21px;
  display: flex;
  &:hover {
    color: var(--color-text-t0);
    cursor: pointer;
  }
  .tip-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}
.video-list {
  width: 100%;
}
</style>
