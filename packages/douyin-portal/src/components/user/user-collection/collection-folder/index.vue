<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
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

// 暴露方法给父组件
defineExpose({
  handleBack,
  openCreateDialog,
  openAddVideoDialog
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
            @select="handleSelectFolder"
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
            :folder="selectedFolder"
            :folder-list="collectionFolderList"
            :preload-data="
              folderPreloadDataMap.get(selectedFolder.collects_id_str)
            "
            @select="handleSelectFolder"
            @back="handleBack"
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
