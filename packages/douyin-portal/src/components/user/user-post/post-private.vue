<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import UserError from '../user-error/index.vue'
import UserConfirmDialog from '../user-confirm-dialog/index.vue'
import PermissionDialog from './permission-dialog.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const props = defineProps<{
  user_id?: string
}>()

const route = useRoute()
const router = useRouter()

// 私密作品列表相关状态
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const privateList = ref<IAwemeInfo[]>([])
const maxCursor = ref('0')

// ========== 批量管理相关 ==========
const isBatchMode = ref(false)
const selectedIds = ref<Set<string>>(new Set())
const showDeleteDialog = ref(false)
const showPermissionDialog = ref(false)

// 是否全选
const isAllSelected = computed(() => {
  return (
    privateList.value.length > 0 &&
    selectedIds.value.size === privateList.value.length
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
    selectedIds.value = new Set(privateList.value.map((item) => item.aweme_id))
  }
}


// 处理删除按钮点击
const handleDelete = () => {
  if (selectedIds.value.size === 0) return
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = async () => {
  showDeleteDialog.value = false
  try {
    console.log('删除的私密作品 ID:', Array.from(selectedIds.value))
    privateList.value = privateList.value.filter(
      (item) => !selectedIds.value.has(item.aweme_id)
    )
    selectedIds.value.clear()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 取消删除弹框
const cancelDeleteDialog = () => {
  showDeleteDialog.value = false
}

// 处理权限设置按钮点击
const handlePermission = () => {
  if (selectedIds.value.size === 0) return
  showPermissionDialog.value = true
}

// 确认权限设置
const confirmPermission = (permission: string) => {
  console.log('设置权限:', permission, '作品 ID:', Array.from(selectedIds.value))
  showPermissionDialog.value = false
}

// 切换单个视频的选中状态
const toggleVideoSelection = (awemeId: string) => {
  if (selectedIds.value.has(awemeId)) {
    selectedIds.value.delete(awemeId)
  } else {
    selectedIds.value.add(awemeId)
  }
}

// 获取私密作品列表
const getPrivateList = async () => {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true

  try {
    const res = await apis.getPrivateAweme(18, maxCursor.value)

    const newList = res.aweme_list || []
    privateList.value = privateList.value.concat(newList)
    maxCursor.value = String(res.max_cursor || '0')
    hasMore.value = res.has_more === 1
  } catch (error) {
    console.error('获取私密作品列表失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 处理视频项点击
const handleVideoItemClick = (item: IAwemeInfo) => {
  if (isBatchMode.value) {
    toggleVideoSelection(item.aweme_id)
  } else {
    handleOpenModal(item)
  }
}

// 打开 modal 播放器
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

// 关闭 modal
const handleModalClose = () => {
  // 移除 modal_id 参数
}

// 加载更多
const handleLoadMore = async () => {
  await getPrivateList()
}

onMounted(() => {
  getPrivateList()
})

useInfiniteScroll(
  window,
  () => {
    if (!loadingMore.value && hasMore.value && !loading.value) {
      getPrivateList()
    }
  },
  { distance: 600 }
)

// 暴露给父组件使用
defineExpose({
  isBatchMode,
  toggleBatchMode,
  selectedIds,
  isAllSelected,
  privateList,
  handleToggleSelectAll,
  handleDelete,
  handlePermission
})
</script>

<template>
  <div class="post-private">
    <Loading :show="loading">
      <user-error
        v-if="!loading && privateList.length === 0"
        icon="empty-list-user"
        title="暂无内容"
        desc="你还没有私密作品哦～"
        class="no-show"
      />
      <template v-if="privateList.length > 0">
        <div class="private-list">
          <VideoItem
            v-for="item in privateList"
            :key="item.aweme_id"
            :aweme="item"
            :data-aweme-id="item.aweme_id"
            :disableClickToggle="true"
            :selectable="isBatchMode"
            :selected="selectedIds.has(item.aweme_id)"
            :showPlayCount="true"
            @click="handleVideoItemClick(item)"
          />
        </div>
        <Loading :show="loadingMore" />
        <list-footer v-if="!hasMore" />
      </template>
    </Loading>

    <!-- Modal Player -->
    <ModalPlayer
      v-if="showModal"
      :videoList="privateList"
      :hasMore="hasMore"
      @close="handleModalClose"
      @loadMore="handleLoadMore"
    />

    <!-- 删除确认弹框 -->
    <UserConfirmDialog
      v-model="showDeleteDialog"
      :title="`确认删除 ${selectedIds.size} 个作品，删除后不可恢复`"
      cancel-text="取消"
      confirm-text="确认删除"
      @confirm="confirmDelete"
      @cancel="cancelDeleteDialog"
    />

    <!-- 权限设置弹框 -->
    <PermissionDialog
      v-model="showPermissionDialog"
      type="video"
      @confirm="confirmPermission"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-private {
  width: 100%;
  margin-top: 8px;
}

.private-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.no-show {
  margin: 120px 0;
}
</style>
