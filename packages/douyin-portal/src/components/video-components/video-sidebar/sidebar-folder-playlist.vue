<script setup lang="ts">
import { ref, shallowRef, watch, toRef } from 'vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import apis from '@/api/apis'
import SideItem from '../video-side-list/side-item.vue'
import { vInfiniteScroll } from '@vueuse/components'
import { useGridScrollToItem } from '@/hooks'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()

const props = defineProps<{
  // 收藏夹信息
  folder: ICollectsItem
  // 当前播放的视频 ID
  aweme_id: string
}>()

// 视频列表
const folderVideoList = shallowRef<IAwemeInfo[]>([])

// 同步视频列表到 store
watch(
  folderVideoList,
  (newList) => {
    sidebarStore.setFolderVideoList(newList)
  },
  { immediate: true }
)

const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const cursor = ref('')
const count = ref(20)

// 滚动容器 ref
const scrollContentRef = ref<HTMLElement | null>(null)
// 当前播放的视频 ID（用于滚动定位）
const currentScrollId = ref<string | null>(null)
// 最后一个在收藏夹中播放的视频 ID（用于高亮显示）
const lastFolderAwemeId = ref<string | null>(null)

// 使用 useGridScrollToItem 实现滚动定位
const { scrollToItem } = useGridScrollToItem({
  containerRef: scrollContentRef,
  currentId: currentScrollId,
  items: folderVideoList,
  idKey: 'aweme_id',
  autoScroll: false, // 关闭自动滚动，手动控制
  block: 'start'
})

// 监听当前播放视频变化，更新滚动目标
watch(
  () => props.aweme_id,
  (newId) => {
    if (newId) {
      // 只有当视频在收藏夹列表中时才更新
      const isInList = folderVideoList.value.some(
        (item) => item.aweme_id === newId
      )
      if (isInList) {
        lastFolderAwemeId.value = newId
        currentScrollId.value = newId
      }
    }
  },
  { immediate: true }
)

// 数据加载完成后，滚动到当前播放的视频
watch(
  () => folderVideoList.value.length,
  (newLen, oldLen) => {
    // 首次加载完成后滚动
    if (oldLen === 0 && newLen > 0) {
      const targetId = lastFolderAwemeId.value || props.aweme_id
      if (targetId) {
        // 检查目标视频是否在列表中
        const isInList = folderVideoList.value.some(
          (item) => item.aweme_id === targetId
        )
        if (isInList) {
          lastFolderAwemeId.value = targetId
          scrollToItem(targetId)
        }
      }
    }
  }
)

// 获取收藏夹内视频列表
const getFolderVideoList = async () => {
  if (!hasMore.value || isLoadingMore.value) return
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
    }
  } catch (error) {
    hasMore.value = false
    isLoadingMore.value = false
    loading.value = false
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

// 监听收藏夹变化，重新加载视频列表
watch(
  () => props.folder.collects_id_str,
  () => {
    resetAndLoad()
  },
  { immediate: true }
)
</script>

<template>
  <div class="sidebar-folder-playlist">
    <div class="folder-content">
      <Loading :show="loading">
        <div
          ref="scrollContentRef"
          class="scroll-content"
          data-scrollable
          v-infinite-scroll="[getFolderVideoList, { distance: 10 }]"
        >
          <template v-if="folderVideoList.length > 0">
            <SideItem
              v-for="item in folderVideoList"
              :key="item.aweme_id"
              :item="item"
              :aweme_id="lastFolderAwemeId || props.aweme_id"
            />
            <Loading :show="isLoadingMore" />
            <list-footer v-if="!hasMore" />
          </template>
          <div v-else-if="!loading" class="empty-tip">收藏夹暂无内容</div>
        </div>
      </Loading>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-folder-playlist {
  height: 100%;
  display: flex;
  flex-direction: column;

  .folder-header {
    padding: 12px 0;
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.06);
    margin-bottom: 12px;

    .folder-info {
      display: flex;
      align-items: center;

      .folder-cover {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 12px;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .folder-detail {
        flex: 1;
        min-width: 0;

        .folder-name {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .folder-count {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 20px;
        }
      }
    }
  }

  .folder-content {
    flex: 1;
    overflow: hidden;
    padding-top: 16px;

    .scroll-content {
      height: 100%;
      outline: none;
      position: relative;
      overflow-x: hidden;
      overflow-y: scroll;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
      margin-right: 4px;
      padding: 0 4px 0 16px;
    }

    .empty-tip {
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      padding: 40px 0;
    }
  }
}
</style>
