<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserError from '../../user-error/index.vue'
import UserConfirmDialog from '../../user-confirm-dialog/index.vue'
import MixItem from './mix-item.vue'
import SidebarModalPlayer from '@/views/sidebar-modal-player.vue'
import apis from '@/api/apis'
import type { IMixInfo } from '@/api/tyeps/common/mix'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { useSidebarStore } from '@/stores/sidebar'
import { videosCtrolStore } from '@/stores/videos-control'

const route = useRoute()
const router = useRouter()
const sidebarStore = useSidebarStore()
const controlStore = videosCtrolStore()

// 接收 props
const props = defineProps<{
  batchMode?: boolean
}>()

// 加载状态
const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)

// 合集列表
const mixList = ref<IMixInfo[]>([])

// 分页参数
const count = ref(20)
const cursor = ref('0')

// 批量选择相关状态
const selectedIds = ref<Set<string>>(new Set())

// 列表长度
const listLength = computed(() => mixList.value.length)

// 清空选中状态
const clearSelection = () => {
  selectedIds.value.clear()
}

// 切换全选状态
const toggleSelectAll = () => {
  if (selectedIds.value.size === mixList.value.length) {
    selectedIds.value.clear()
  } else {
    selectedIds.value = new Set(mixList.value.map((item) => item.mix_id))
  }
}

// 切换单个合集的选中状态
const toggleMixSelection = (mixId: string) => {
  if (selectedIds.value.has(mixId)) {
    selectedIds.value.delete(mixId)
  } else {
    selectedIds.value.add(mixId)
  }
}

// modal-player 相关
const showModalPlayer = ref(false)
const currentVideoList = shallowRef<IAwemeInfo[]>([])

// 打开 modal-player
const openModalPlayer = async (mix: IMixInfo) => {
  try {
    const totalEpisode = mix.statis?.updated_to_episode || 0
    // 使用 watched_episode 获取上次观看到的集数
    const watchedEpisode = mix.watched_episode || totalEpisode
    // 使用 watched_item 获取上次观看的视频 ID
    const watchedItem = mix.watched_item

    // 计算起始 cursor（集数从1开始，cursor从0开始，所以要减1）
    const startCursor = Math.max(0, watchedEpisode - 1)

    // 获取合集视频列表
    const videosRes = await apis.getUserMixDetail({
      mix_id: mix.mix_id,
      cursor: startCursor,
      count: 10
    })

    if (!videosRes.aweme_list?.length) {
      console.error('合集暂无视频')
      return
    }

    // 优先使用 watched_item 找到上次观看的视频
    let targetVideo = watchedItem
      ? videosRes.aweme_list.find((v) => v.aweme_id === watchedItem)
      : null

    // 如果没找到，使用列表中的第一个
    if (!targetVideo) {
      targetVideo = videosRes.aweme_list[0]
    }

    // 使用目标视频的 aweme_id 作为 modal_id
    const awemeId = watchedItem || targetVideo.aweme_id
    currentVideoList.value = videosRes.aweme_list

    // 先设置视频列表，再设置合集信息（确保 SidebarMixPlaylist 挂载时列表已存在）
    sidebarStore.setCollectionVideoList(videosRes.aweme_list)
    sidebarStore.setMix(mix as any)

    // 打开侧边栏
    controlStore.isShowSidebar = true

    // 显示 modal player
    showModalPlayer.value = true
    router.push({
      path: route.path,
      query: {
        ...route.query,
        modal_id: awemeId
      }
    })
  } catch (error) {
    console.error('打开合集失败:', error)
  }
}

// 处理合集项点击事件
const handleMixItemClick = (mix: IMixInfo) => {
  if (props.batchMode) {
    toggleMixSelection(mix.mix_id)
  } else {
    // 普通模式：打开合集播放器
    openModalPlayer(mix)
  }
}

// 关闭 modal-player
const handleModalClose = () => {
  showModalPlayer.value = false
  currentVideoList.value = []
  sidebarStore.clearMix()
  sidebarStore.clearVideoLists()
}

// 取消收藏确认弹框
const showUncollectDialog = ref(false)
const currentMix = ref<IMixInfo | null>(null)

// 处理单个取消收藏
const handleUncollect = (mix: IMixInfo) => {
  currentMix.value = mix
  showUncollectDialog.value = true
}

// 确认取消收藏（单个）
const confirmUncollect = async () => {
  showUncollectDialog.value = false
  if (!currentMix.value) return

  try {
    // TODO: 调用取消收藏 API
    console.log('取消收藏合集:', currentMix.value.mix_id)
    // 从列表中移除
    mixList.value = mixList.value.filter(
      (item) => item.mix_id !== currentMix.value?.mix_id
    )
  } catch (error) {
    console.error('取消收藏失败:', error)
  }
}

// 删除选中的合集（批量取消收藏）
const deleteSelected = async () => {
  try {
    // TODO: 调用批量取消收藏 API
    console.log('批量取消收藏合集 ID:', Array.from(selectedIds.value))
    // 从列表中移除已删除的项
    mixList.value = mixList.value.filter(
      (item) => !selectedIds.value.has(item.mix_id)
    )
    // 清空选中状态
    selectedIds.value.clear()
  } catch (error) {
    console.error('批量取消收藏失败:', error)
  }
}

// 获取收藏合集列表
const getMixList = async () => {
  if (!hasMore.value || isLoadingMore.value) return
  isLoadingMore.value = true

  try {
    const res = await apis.getUserCollectMix(count.value, cursor.value)
    const newMixList = res.mix_infos || []
    mixList.value = mixList.value.concat(newMixList)
    cursor.value = res.cursor
    hasMore.value = !!res.has_more
  } catch (error) {
    console.error('获取收藏合集列表失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }
}

// 加载更多合集视频
const loadMoreMixVideos = async () => {
  // 由 SidebarMixPlaylist 组件内部处理
}

onMounted(() => {
  getMixList()
})

// 组件卸载时清除
onBeforeUnmount(() => {
  sidebarStore.clearMix()
  sidebarStore.clearVideoLists()
})

// 无限滚动加载
useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value && hasMore.value && !loading.value) {
      getMixList()
    }
  },
  { distance: 200 }
)

// 暴露方法给父组件
defineExpose({
  selectedIds,
  listLength,
  clearSelection,
  toggleSelectAll,
  deleteSelected
})
</script>

<template>
  <Loading :show="loading">
    <div class="collection-mix">
      <!-- 空状态 -->
      <user-error
        v-if="!loading && mixList.length === 0"
        icon="no-show-like"
        title="暂无收藏合集"
        desc="收藏喜欢的合集，随时观看"
        class="no-data"
      />

      <!-- 合集列表 -->
      <template v-if="mixList.length > 0">
        <div ref="mixListRef" class="mix-list">
          <MixItem
            v-for="mix in mixList"
            :key="mix.mix_id"
            :mix="mix"
            :selectable="batchMode"
            :checked="selectedIds.has(mix.mix_id)"
            @select="handleMixItemClick"
            @uncollect="handleUncollect"
          />
        </div>
        <Loading :show="isLoadingMore" />
        <list-footer v-if="!hasMore" />
      </template>
    </div>
  </Loading>

  <!-- 取消收藏确认弹框 -->
  <UserConfirmDialog
    v-model="showUncollectDialog"
    :title="`确认取消收藏 1 个收藏合集，取消后不可恢复`"
    cancel-text="暂不取消"
    confirm-text="确认取消"
    @confirm="confirmUncollect"
  />

  <!-- Sidebar Modal Player -->
  <SidebarModalPlayer
    v-if="showModalPlayer"
    :videoList="currentVideoList"
    @close="handleModalClose"
    @loadMore="loadMoreMixVideos"
  />
</template>

<style lang="scss" scoped>
.collection-mix {
  position: relative;

  .mix-list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
