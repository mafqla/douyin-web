<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import UserError from '../user-error/index.vue'
import UserConfirmDialog from '../user-confirm-dialog/index.vue'
import PermissionDialog from './permission-dialog.vue'
import MixItem from '../user-collection/collection-mix/mix-item.vue'
import SidebarModalPlayer from '@/views/sidebar-modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { IMixInfo } from '@/api/tyeps/common/mix'
import apis from '@/api/apis'
import { useSidebarStore } from '@/stores/sidebar'
import { videosCtrolStore } from '@/stores/videos-control'

const props = defineProps<{
  user_id: string
  // 是否是自己的页面
  isSelf?: boolean
}>()

const route = useRoute()
const router = useRouter()
const sidebarStore = useSidebarStore()
const controlStore = videosCtrolStore()

// 合集相关状态
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const mixList = ref<IMixInfo[]>([])
const cursor = ref('0')
const list_scene = ref(3)

// ========== 批量管理相关 ==========
const isBatchMode = ref(false)
const selectedIds = ref<Set<string>>(new Set())
const showDeleteDialog = ref(false)
const showPermissionDialog = ref(false)

// 是否全选
const isAllSelected = computed(() => {
  return (
    mixList.value.length > 0 && selectedIds.value.size === mixList.value.length
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
    selectedIds.value = new Set(mixList.value.map((item) => item.mix_id))
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
    console.log('删除的合集 ID:', Array.from(selectedIds.value))
    mixList.value = mixList.value.filter(
      (item) => !selectedIds.value.has(item.mix_id)
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
  console.log(
    '设置权限:',
    permission,
    '合集 ID:',
    Array.from(selectedIds.value)
  )
  showPermissionDialog.value = false
}

// 切换单个合集的选中状态
const toggleMixSelection = (mixId: string) => {
  if (selectedIds.value.has(mixId)) {
    selectedIds.value.delete(mixId)
  } else {
    selectedIds.value.add(mixId)
  }
}

// 获取合集列表
const getMixList = async () => {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true

  try {
    const res = await apis.getUserMix(
      props.user_id,
      20,
      cursor.value,
      list_scene.value
    )
    const newMixList = res.mix_infos || []
    mixList.value = mixList.value.concat(newMixList)
    cursor.value = res.cursor || ''
    hasMore.value = !!res.has_more
  } catch (error) {
    console.error('获取合集列表失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 合集播放器相关
const showModalPlayer = ref(false)
const currentVideoList = shallowRef<IAwemeInfo[]>([])

// 打开合集播放器
const openModalPlayer = async (mix: IMixInfo) => {
  try {
    const detailRes = await apis.getMixDetail(mix.mix_id)
    if (!detailRes.mix_info) {
      console.error('获取合集详情失败')
      return
    }

    const videosRes = await apis.getUserMixDetail({
      mix_id: mix.mix_id,
      cursor: 0,
      count: 20
    })

    if (!videosRes.aweme_list?.length) {
      console.error('合集暂无视频')
      return
    }

    const awemeId = videosRes.aweme_list[0].aweme_id
    currentVideoList.value = videosRes.aweme_list

    sidebarStore.setMix(detailRes.mix_info)
    sidebarStore.setCollectionVideoList(videosRes.aweme_list)
    controlStore.isShowSidebar = true

    showModalPlayer.value = true
    router.push({
      path: route.path,
      query: { ...route.query, modal_id: awemeId }
    })
  } catch (error) {
    console.error('打开合集失败:', error)
  }
}

// 处理合集项点击
const handleMixItemClick = (mix: IMixInfo) => {
  if (isBatchMode.value) {
    toggleMixSelection(mix.mix_id)
  } else {
    openModalPlayer(mix)
  }
}

// 修改合集
const handleEditMix = (mix: IMixInfo) => {
  console.log('修改合集:', mix)
  // TODO: 打开修改合集弹窗
}

// 作品管理
const handleManageMix = (mix: IMixInfo) => {
  console.log('作品管理:', mix)
  // TODO: 跳转到作品管理页
}

// 添加作品
const handleAddToMix = (mix: IMixInfo) => {
  console.log('添加作品:', mix)
  // TODO: 打开添加作品弹窗
}

// 关闭合集播放器
const handleModalClose = () => {
  showModalPlayer.value = false
  currentVideoList.value = []
  sidebarStore.clearMix()
  sidebarStore.clearVideoLists()
}

onMounted(() => {
  getMixList()
})

useInfiniteScroll(
  window,
  () => {
    if (!loadingMore.value && hasMore.value && !loading.value) {
      getMixList()
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
  mixList,
  handleToggleSelectAll,
  handleDelete,
  handlePermission
})
</script>

<template>
  <div class="post-mix">
    <Loading :show="loading">
      <user-error
        v-if="!loading && mixList.length === 0"
        icon="empty-list-user"
        title="暂无内容"
        desc="该账号还未创建过合集哦～"
        class="no-show"
      />
      <template v-if="mixList.length > 0">
        <div class="mix-list">
          <MixItem
            v-for="mix in mixList"
            :key="mix.mix_id"
            :mix="mix"
            :isSelf="isSelf && !isBatchMode"
            :selectable="isBatchMode"
            :checked="selectedIds.has(mix.mix_id)"
            @select="handleMixItemClick"
            @edit="handleEditMix"
            @manage="handleManageMix"
            @add="handleAddToMix"
          />
        </div>
        <Loading :show="loadingMore" />
        <list-footer v-if="!hasMore" />
      </template>
    </Loading>

    <SidebarModalPlayer
      v-if="showModalPlayer"
      :videoList="currentVideoList"
      @close="handleModalClose"
    />

    <!-- 删除确认弹框 -->
    <UserConfirmDialog
      v-model="showDeleteDialog"
      :title="`确认删除 ${selectedIds.size} 个合集，删除后不可恢复`"
      cancel-text="取消"
      confirm-text="确认删除"
      @confirm="confirmDelete"
      @cancel="cancelDeleteDialog"
    />

    <!-- 权限设置弹框 -->
    <PermissionDialog
      v-model="showPermissionDialog"
      type="mix"
      @confirm="confirmPermission"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-mix {
  width: 100%;
  margin-top: 8px;
}

.mix-list {
  display: flex;
  flex-wrap: wrap;
}

.no-show {
  margin: 120px 0;
}
</style>
