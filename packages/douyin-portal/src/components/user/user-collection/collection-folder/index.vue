<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from 'vue'
import UserError from '../../user-error/index.vue'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import FolderItem from './folder-item.vue'
import FolderDetail from './folder-detail.vue'
import CreateFolderDialog from './create-folder-dialog.vue'
import EditFolderDialog from './edit-folder-dialog.vue'
import DeleteFolderDialog from './delete-folder-dialog.vue'
import AddCollectDialog from './add-collect-dialog.vue'
import apis from '@/api/apis'

// 收藏夹预加载数据类型
export interface IFolderPreloadData {
  // 预加载的视频列表（前6个用于封面展示）
  awemeList: IAwemeInfo[]
  // 游标，用于后续加载更多
  cursor: string
  // 是否还有更多
  hasMore: boolean
  // 是否正在加载
  loading: boolean
}

// 接收 props
const props = defineProps<{
  batchMode?: boolean
}>()

const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const collectionFolderList = ref<ICollectsItem[]>([])

// 每个收藏夹的预加载数据，key 为 collects_id_str
const folderPreloadDataMap = reactive<Map<string, IFolderPreloadData>>(
  new Map()
)

const count = ref(20)
const cursor = ref('0')

// 当前选中的收藏夹
const selectedFolder = ref<ICollectsItem | null>(null)

// FolderDetail 组件引用
const folderDetailRef = ref<InstanceType<typeof FolderDetail> | null>(null)

// 定义事件
const emit = defineEmits<{
  'detail-mode-change': [value: boolean]
}>()

// 监听选中状态变化，通知父组件
watch(
  () => selectedFolder.value,
  (newVal) => {
    emit('detail-mode-change', !!newVal)
  }
)

// 弹框状态
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const showAddCollectDialog = ref(false)
const currentFolder = ref<ICollectsItem | null>(null)

// 获取单个收藏夹的视频列表（用于预加载封面）
const fetchFolderVideos = async (folder: ICollectsItem) => {
  const folderId = folder.collects_id_str
  // 初始化预加载数据
  folderPreloadDataMap.set(folderId, {
    awemeList: [],
    cursor: '',
    hasMore: true,
    loading: true
  })

  try {
    const res = await apis.getUserCollectFloderDetail(folderId, 20, '')
    folderPreloadDataMap.set(folderId, {
      awemeList: res.aweme_list || [],
      cursor: res.cursor,
      hasMore: !!res.has_more,
      loading: false
    })
  } catch (error) {
    folderPreloadDataMap.set(folderId, {
      awemeList: [],
      cursor: '',
      hasMore: false,
      loading: false
    })
  }
}

// 获取收藏夹列表
const getCollectionFolderList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true

  try {
    const res = await apis.getUserCollectFloderList(count.value, cursor.value)
    const newFolders = res.collects_list || []
    collectionFolderList.value = collectionFolderList.value.concat(newFolders)
    cursor.value = res.cursor
    hasMore.value = res.has_more
    loading.value = false
    isLoadingMore.value = false

    // 为每个新获取的收藏夹并行调用 getFolderVideoList 获取封面图片
    await Promise.all(newFolders.map((folder) => fetchFolderVideos(folder)))
  } catch (error) {
    hasMore.value = false
    isLoadingMore.value = false
    loading.value = false
  }
}
// 选择收藏夹
const handleSelectFolder = (folder: ICollectsItem) => {
  selectedFolder.value = folder
}

// 返回列表
const handleBack = () => {
  selectedFolder.value = null
}

// 新建收藏夹成功回调
const handleCreateSuccess = () => {
  showCreateDialog.value = false
  // 刷新列表
  collectionFolderList.value = []
  cursor.value = '0'
  hasMore.value = true
  selectedFolder.value = null
  getCollectionFolderList()
}

// 打开编辑弹框
const handleEditFolder = (folder: ICollectsItem) => {
  currentFolder.value = folder
  showEditDialog.value = true
}

// 编辑成功回调
const handleEditSuccess = () => {
  showEditDialog.value = false
  // 刷新列表
  collectionFolderList.value = []
  cursor.value = '0'
  hasMore.value = true
  selectedFolder.value = null
  getCollectionFolderList()
}

// 打开删除弹框
const handleDeleteFolder = (folder: ICollectsItem) => {
  currentFolder.value = folder
  showDeleteDialog.value = true
}

// 删除成功回调
const handleDeleteSuccess = () => {
  showDeleteDialog.value = false
  // 如果删除的是当前选中的收藏夹，清空选中
  if (
    selectedFolder.value?.collects_id_str ===
    currentFolder.value?.collects_id_str
  ) {
    selectedFolder.value = null
  }
  // 刷新列表
  collectionFolderList.value = []
  cursor.value = '0'
  hasMore.value = true
  getCollectionFolderList()
}

// 打开添加视频弹框
const handleAddVideoToFolder = (folder: ICollectsItem) => {
  currentFolder.value = folder
  showAddCollectDialog.value = true
}

// 添加视频成功回调
const handleAddCollectSuccess = () => {
  showAddCollectDialog.value = false
  // 刷新当前收藏夹的视频列表
  if (currentFolder.value) {
    fetchFolderVideos(currentFolder.value)
  }
}

onMounted(() => {
  getCollectionFolderList()
})

useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value && hasMore.value) {
      getCollectionFolderList()
    }
  },
  { distance: 200 }
)

// 打开新建收藏夹弹框
const openCreateDialog = () => {
  showCreateDialog.value = true
}

// 打开添加视频弹框（用于详情模式下的添加视频按钮）
const openAddVideoDialog = () => {
  if (selectedFolder.value) {
    currentFolder.value = selectedFolder.value
    showAddCollectDialog.value = true
  }
}

// 批量选择相关状态
const selectedIds = ref<Set<string>>(new Set())

// 列表长度
const listLength = computed(() => collectionFolderList.value.length)

// 清空选中状态
const clearSelection = () => {
  selectedIds.value.clear()
}

// 切换全选状态
const toggleSelectAll = () => {
  if (selectedIds.value.size === collectionFolderList.value.length) {
    // 取消全选
    selectedIds.value.clear()
  } else {
    // 全选
    selectedIds.value = new Set(
      collectionFolderList.value.map((item) => item.collects_id_str)
    )
  }
}

// 切换单个收藏夹的选中状态
const toggleFolderSelection = (folderId: string) => {
  if (selectedIds.value.has(folderId)) {
    selectedIds.value.delete(folderId)
  } else {
    selectedIds.value.add(folderId)
  }
}

// 处理收藏夹项点击事件
const handleFolderItemClick = (folder: ICollectsItem) => {
  if (props.batchMode) {
    // 批量管理模式：切换选中状态
    toggleFolderSelection(folder.collects_id_str)
  } else {
    // 普通模式：进入详情
    handleSelectFolder(folder)
  }
}

// 删除选中的收藏夹
const deleteSelected = async () => {
  try {
    // TODO: 调用 API 批量删除收藏夹
    console.log('删除收藏夹 ID:', Array.from(selectedIds.value))

    // 从列表中移除已删除的项
    collectionFolderList.value = collectionFolderList.value.filter(
      (item) => !selectedIds.value.has(item.collects_id_str)
    )

    // 清空选中状态
    selectedIds.value.clear()
  } catch (error) {
    console.error('删除收藏夹失败:', error)
  }
}

// 是否在详情模式
const isDetailMode = computed(() => !!selectedFolder.value)

// 获取当前选中的 ID（根据是否在详情模式返回不同的选中状态）
const currentSelectedIds = computed(() => {
  if (isDetailMode.value) {
    return folderDetailRef.value?.selectedIds ?? new Set<string>()
  }
  return selectedIds.value
})

// 获取当前列表长度
const currentListLength = computed(() => {
  if (isDetailMode.value) {
    return folderDetailRef.value?.listLength ?? 0
  }
  return listLength.value
})

// 清空当前选中状态
const clearCurrentSelection = () => {
  if (isDetailMode.value) {
    folderDetailRef.value?.clearSelection()
  } else {
    clearSelection()
  }
}

// 切换当前全选状态
const toggleCurrentSelectAll = () => {
  if (isDetailMode.value) {
    folderDetailRef.value?.toggleSelectAll()
  } else {
    toggleSelectAll()
  }
}

// 删除当前选中项
const deleteCurrentSelected = async () => {
  if (isDetailMode.value) {
    await folderDetailRef.value?.deleteSelected()
  } else {
    await deleteSelected()
  }
}

// 暴露方法给父组件
defineExpose({
  handleBack,
  openCreateDialog,
  openAddVideoDialog,
  selectedIds,
  listLength,
  clearSelection,
  toggleSelectAll,
  deleteSelected,
  // 详情模式相关
  isDetailMode,
  selectedFolder,
  currentSelectedIds,
  currentListLength,
  clearCurrentSelection,
  toggleCurrentSelectAll,
  deleteCurrentSelected,
  folderDetailRef
})
</script>

<template>
  <Loading :show="loading">
    <div class="collection-folder">
      <user-error
        icon="no-show-like"
        title="暂无收藏夹"
        desc="创建收藏夹来整理你喜欢的内容"
        v-if="!loading && collectionFolderList.length === 0"
        class="no-data"
      />

      <template v-if="collectionFolderList.length !== 0 || !loading">
        <!-- 收藏夹列表 -->
        <div v-show="!selectedFolder" ref="folderListRef" class="folder-list">
          <FolderItem
            v-for="folder in collectionFolderList"
            :key="folder.collects_id_str"
            :folder="folder"
            :preload-data="folderPreloadDataMap.get(folder.collects_id_str)"
            :selected="false"
            :selectable="batchMode"
            :checked="selectedIds.has(folder.collects_id_str)"
            @select="handleFolderItemClick"
            @edit="handleEditFolder"
            @delete="handleDeleteFolder"
            @add-video="handleAddVideoToFolder"
          />
          <Loading :show="isLoadingMore" />
          <list-footer v-if="!hasMore" />
        </div>
        <!-- 收藏夹详情 -->
        <div v-if="selectedFolder" class="folder-detail-wrapper">
          <FolderDetail
            ref="folderDetailRef"
            :folder="selectedFolder"
            :folder-list="collectionFolderList"
            :batch-mode="batchMode"
            :preload-data="
              folderPreloadDataMap.get(selectedFolder.collects_id_str)
            "
            @select="handleSelectFolder"
            @back="handleBack"
            @create-folder="openCreateDialog"
            class="folder-main"
          />
        </div>
      </template>
    </div>
  </Loading>

  <!-- 新建收藏夹弹框 -->
  <create-folder-dialog
    v-model="showCreateDialog"
    @success="handleCreateSuccess"
  />

  <!-- 编辑收藏夹弹框 -->
  <edit-folder-dialog
    v-model="showEditDialog"
    :folder="currentFolder"
    @success="handleEditSuccess"
  />

  <!-- 删除收藏夹弹框 -->
  <delete-folder-dialog
    v-model="showDeleteDialog"
    :folder="currentFolder"
    @success="handleDeleteSuccess"
  />

  <!-- 添加视频到收藏夹弹框 -->
  <add-collect-dialog
    v-model="showAddCollectDialog"
    :folder="currentFolder"
    @success="handleAddCollectSuccess"
  />
</template>

<style lang="scss" scoped>
.collection-folder {
  position: relative;
}
</style>
