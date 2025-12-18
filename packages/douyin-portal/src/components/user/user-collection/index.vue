<script setup lang="ts">
import CollectionVideo from './collection-video/index.vue'
import CollectionFolder from './collection-folder/index.vue'
import CollectionMusic from './collection-music/index.vue'
import CollectionMix from './collection-mix/index.vue'
import BatchActionBar from '../batch-action-bar/index.vue'
import UserConfirmDialog from '../user-confirm-dialog/index.vue'
import SelectFolderDialog from './collection-video/select-folder-dialog.vue'
import CreateFolderDialog from './collection-folder/create-folder-dialog.vue'

import { ref, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const tabs = ['favorite_folder', 'video', 'music', 'compilation', 'playlet']
const activeTab = ref((route.query.showSubTab as string) || 'video')

// CollectionFolder 组件引用
const collectionFolderRef = ref<InstanceType<typeof CollectionFolder> | null>(
  null
)
// CollectionVideo 组件引用
const collectionVideoRef = ref<InstanceType<typeof CollectionVideo> | null>(
  null
)
// CollectionMix 组件引用
const collectionMixRef = ref<InstanceType<typeof CollectionMix> | null>(null)

// 是否在详情模式（选中了某个收藏夹）
const isDetailMode = ref(false)

// 批量管理模式
const isBatchMode = ref(false)

// 处理详情模式变化
const handleDetailModeChange = (value: boolean) => {
  isDetailMode.value = value
}

// 返回列表
const handleBack = () => {
  collectionFolderRef.value?.handleBack()
}

// 打开新建收藏夹弹框
const handleCreateFolder = () => {
  collectionFolderRef.value?.openCreateDialog()
}

// 打开添加视频弹框
const handleAddVideo = () => {
  collectionFolderRef.value?.openAddVideoDialog()
}

// 切换批量管理模式
const toggleBatchMode = () => {
  isBatchMode.value = !isBatchMode.value
  // 退出批量管理时清空选中状态
  if (!isBatchMode.value) {
    // 清空收藏夹列表和详情的选中状态
    collectionFolderRef.value?.clearSelection()
    collectionFolderRef.value?.clearCurrentSelection()
    collectionVideoRef.value?.clearSelection()
    collectionMixRef.value?.clearSelection()
  }
}

// 获取当前选中的 ID 集合
const selectedIds = computed(() => {
  if (activeTab.value === 'favorite_folder') {
    // 详情模式下使用详情组件的选中状态
    if (isDetailMode.value) {
      return collectionFolderRef.value?.currentSelectedIds ?? new Set<string>()
    }
    return collectionFolderRef.value?.selectedIds ?? new Set<string>()
  } else if (activeTab.value === 'video') {
    return collectionVideoRef.value?.selectedIds ?? new Set<string>()
  } else if (activeTab.value === 'compilation') {
    return collectionMixRef.value?.selectedIds ?? new Set<string>()
  }
  return new Set<string>()
})

// 获取当前列表长度
const currentListLength = computed(() => {
  if (activeTab.value === 'favorite_folder') {
    // 详情模式下使用详情组件的列表长度
    if (isDetailMode.value) {
      return collectionFolderRef.value?.currentListLength ?? 0
    }
    return collectionFolderRef.value?.listLength ?? 0
  } else if (activeTab.value === 'video') {
    return collectionVideoRef.value?.listLength ?? 0
  } else if (activeTab.value === 'compilation') {
    return collectionMixRef.value?.listLength ?? 0
  }
  return 0
})

// 是否全选
const isAllSelected = computed(() => {
  return currentListLength.value > 0 && selectedIds.value.size === currentListLength.value
})

// 切换全选状态
const handleToggleSelectAll = () => {
  if (activeTab.value === 'favorite_folder') {
    // 详情模式下使用详情组件的全选
    if (isDetailMode.value) {
      collectionFolderRef.value?.toggleCurrentSelectAll()
    } else {
      collectionFolderRef.value?.toggleSelectAll()
    }
  } else if (activeTab.value === 'video') {
    collectionVideoRef.value?.toggleSelectAll()
  } else if (activeTab.value === 'compilation') {
    collectionMixRef.value?.toggleSelectAll()
  }
}

// 删除确认弹框
const showDeleteDialog = ref(false)

// 处理删除按钮点击
const handleDelete = () => {
  if (selectedIds.value.size === 0) return
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = async () => {
  showDeleteDialog.value = false
  if (activeTab.value === 'favorite_folder') {
    // 详情模式下使用详情组件的删除
    if (isDetailMode.value) {
      await collectionFolderRef.value?.deleteCurrentSelected()
    } else {
      await collectionFolderRef.value?.deleteSelected()
    }
  } else if (activeTab.value === 'video') {
    await collectionVideoRef.value?.deleteSelected()
  } else if (activeTab.value === 'compilation') {
    await collectionMixRef.value?.deleteSelected()
  }
}

// 取消弹框
const cancelDialog = () => {
  showDeleteDialog.value = false
}

// 收藏夹选择弹框
const showSelectFolderDialog = ref(false)

// 新建收藏夹弹框（从收藏夹选择弹框打开）
const showCreateFolderFromSelect = ref(false)

// 处理加入收藏按钮点击
const handleAddToCollection = () => {
  if (selectedIds.value.size === 0) return
  showSelectFolderDialog.value = true
}

// 确认选择收藏夹（多选）
const handleSelectFolderConfirm = async (folderIds: string[]) => {
  try {
    // TODO: 调用 API 将选中的视频加入收藏夹
    console.log('加入收藏夹:', folderIds, '视频 ID:', Array.from(selectedIds.value))
    // 清空选中状态
    collectionVideoRef.value?.clearSelection()
  } catch (error) {
    console.error('加入收藏夹失败:', error)
  }
}

// 从收藏夹选择弹框打开新建收藏夹弹框
const handleCreateFolderFromSelect = () => {
  showSelectFolderDialog.value = false
  showCreateFolderFromSelect.value = true
}

// 新建收藏夹成功后重新打开选择弹框
const handleCreateFolderSuccess = () => {
  showCreateFolderFromSelect.value = false
  showSelectFolderDialog.value = true
}

// 获取操作按钮文本
const actionText = computed(() => {
  if (activeTab.value === 'favorite_folder') {
    // 详情模式下显示"从收藏夹移除"
    return isDetailMode.value ? '从收藏夹移除' : '删除收藏夹'
  } else if (activeTab.value === 'compilation') {
    return '取消收藏'
  }
  return '取消收藏'
})

// 获取选中项提示文本
const selectedTextTemplate = computed(() => {
  if (activeTab.value === 'favorite_folder') {
    // 详情模式下显示"已选 {count} 个收藏的视频"
    return isDetailMode.value ? '已选 {count} 个收藏的视频' : '已选 {count} 个收藏夹'
  } else if (activeTab.value === 'compilation') {
    return '已选 {count} 个收藏的合集'
  }
  return '已选 {count} 个收藏视频'
})

// 获取删除确认弹框标题
const deleteDialogTitle = computed(() => {
  if (activeTab.value === 'favorite_folder') {
    if (isDetailMode.value) {
      return `确认从收藏夹移除 ${selectedIds.value.size} 个视频吗？`
    }
    return `确认删除该收藏夹吗，删除后视频依旧可在收藏视频中查看～`
  } else if (activeTab.value === 'compilation') {
    return `确认取消收藏 ${selectedIds.value.size} 个收藏合集，取消后不可恢复`
  }
  return `确认取消收藏 ${selectedIds.value.size} 个视频吗？`
})

// 获取删除确认弹框按钮文案
const deleteDialogCancelText = computed(() => {
  if (activeTab.value === 'compilation') {
    return '暂不取消'
  }
  return '暂不删除'
})

const deleteDialogConfirmText = computed(() => {
  if (activeTab.value === 'compilation') {
    return '确认取消'
  }
  return '确认删除'
})

// 是否显示移动到按钮（收藏夹详情模式下显示）
const showMoveTo = computed(() => {
  return activeTab.value === 'favorite_folder' && isDetailMode.value
})

// 移动到弹框
const showMoveToDialog = ref(false)

// 当前收藏夹 ID（用于排除）
const currentFolderId = computed(() => {
  return collectionFolderRef.value?.selectedFolder?.collects_id_str ?? ''
})

// 处理移动到按钮点击
const handleMoveTo = () => {
  if (selectedIds.value.size === 0) return
  showMoveToDialog.value = true
}

// 确认移动到收藏夹（单选）
const handleMoveToConfirm = async (folderIds: string[]) => {
  try {
    const targetFolderId = folderIds[0]
    // TODO: 调用 API 将选中的视频移动到目标收藏夹
    console.log('移动到收藏夹:', targetFolderId, '视频 ID:', Array.from(selectedIds.value))
    // 清空选中状态并刷新列表
    collectionFolderRef.value?.clearCurrentSelection()
  } catch (error) {
    console.error('移动失败:', error)
  }
}

// 从移动到弹框打开新建收藏夹弹框
const handleCreateFolderFromMoveTo = () => {
  showMoveToDialog.value = false
  showCreateFolderFromSelect.value = true
}

// 新建收藏夹成功后重新打开移动到弹框
const handleCreateFolderSuccessForMoveTo = () => {
  showCreateFolderFromSelect.value = false
  showMoveToDialog.value = true
}

// 是否支持批量管理（音乐和短剧暂不支持）
const supportBatchMode = computed(() => {
  return ['favorite_folder', 'video', 'compilation'].includes(activeTab.value)
})

// 暴露给父组件使用
defineExpose({
  isBatchMode,
  toggleBatchMode,
  supportBatchMode
})

const getTabTitle = (tab: string) => {
  const titles: { [key: string]: string } = {
    favorite_folder: '收藏夹',
    video: '视频',
    music: '音乐',
    compilation: '合集',
    playlet: '短剧'
  }
  return titles[tab]
}

const handleTabChange = (tab: string) => {
  // 切换 tab 时重置详情模式
  if (activeTab.value === 'favorite_folder' && isDetailMode.value) {
    collectionFolderRef.value?.handleBack()
  }
  isDetailMode.value = false
  activeTab.value = tab
  router.push({
    query: {
      ...route.query,
      showSubTab: tab
    }
  })
}
</script>
<template>
  <div class="user-collection">
    <user-tabbar-2 :style="isBatchMode ? 'height: 72px' : ''">
      <!-- 批量操作工具栏 -->
      <BatchActionBar
        v-if="isBatchMode"
        :selected-count="selectedIds.size"
        :all-selected="isAllSelected"
        :disabled="currentListLength === 0"
        :action-text="actionText"
        :selected-text-template="selectedTextTemplate"
        :show-add-to-collection="activeTab === 'video'"
        :show-move-to="showMoveTo"
        @select-all="handleToggleSelectAll"
        @action="handleDelete"
        @add-to-collection="handleAddToCollection"
        @move-to="handleMoveTo"
      />

      <!-- 非批量管理模式下显示标签栏 -->
      <div v-if="!isBatchMode" class="tabbar-2-content">
        <div
          v-for="tab in tabs"
          :key="tab"
          class="tabbar-2-item"
          :class="{ active: activeTab === tab }"
          @click="handleTabChange(tab)"
        >
          <span class="tabbar-2-item-text">{{ getTabTitle(tab) }}</span>
        </div>
      </div>
      <div v-if="!isBatchMode" class="tabbar-2-end">
        <div class="media-control-container">
          <!-- 新建收藏夹按钮 - 收藏夹列表模式显示 -->
          <div
            v-if="activeTab === 'favorite_folder' && !isDetailMode"
            class="media-btn"
            @click="handleCreateFolder"
          >
            <span role="img" class="media-icon"
              ><svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                focusable="false"
              >
                <path
                  d="M6.63672 2.40039C6.99696 2.40042 7.34735 2.52164 7.62988 2.74512L9.12207 3.92676C9.19261 3.98256 9.28018 4.01358 9.37012 4.01367H11.5137C12.864 4.01367 13.9734 5.04293 14.1016 6.3584L14.1143 6.625L14.0947 11.0117C14.0883 12.4431 12.9255 13.5996 11.4941 13.5996H4.48535C3.04959 13.5994 1.88574 12.4358 1.88574 11V5C1.88595 3.56437 3.04972 2.4006 4.48535 2.40039H6.63672ZM4.48535 3.59961C3.71246 3.59982 3.08517 4.22711 3.08496 5V11C3.08496 11.7731 3.71233 12.4002 4.48535 12.4004H11.4941C12.2649 12.4004 12.8911 11.7766 12.8945 11.0059L12.9141 6.61914L12.9072 6.47559C12.8379 5.76757 12.2406 5.21289 11.5137 5.21289H9.37012C9.00983 5.2128 8.65947 5.09174 8.37695 4.86816L6.88477 3.68652C6.81421 3.63082 6.72662 3.59964 6.63672 3.59961H4.48535ZM8.04004 6.58203C8.3711 6.58224 8.63944 6.85058 8.63965 7.18164V7.97852H9.4043C9.7355 7.97852 10.0046 8.24699 10.0049 8.57812C10.0049 8.9095 9.73567 9.17871 9.4043 9.17871H8.63965V9.98145C8.63965 10.3127 8.37123 10.5818 8.04004 10.582C7.70867 10.582 7.43945 10.3128 7.43945 9.98145V9.17871H6.60449C6.27331 9.17849 6.00488 8.90936 6.00488 8.57812C6.00516 8.24713 6.27348 7.97874 6.60449 7.97852H7.43945V7.18164C7.43966 6.85045 7.7088 6.58203 8.04004 6.58203Z"
                  fill="currentColor"
                ></path></svg></span
            ><span class="media-icon-text">新建收藏夹</span>
          </div>
          <!-- 详情模式工具栏 - 收藏夹详情模式显示 -->
          <template v-if="activeTab === 'favorite_folder' && isDetailMode">
            <!-- 添加视频按钮 -->
            <div class="media-btn" @click="handleAddVideo">
              <span role="img" class="media-icon"
                ><svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  focusable="false"
                >
                  <path
                    d="M6.63672 2.40039C6.99696 2.40042 7.34735 2.52164 7.62988 2.74512L9.12207 3.92676C9.19261 3.98256 9.28018 4.01358 9.37012 4.01367H11.5137C12.864 4.01367 13.9734 5.04293 14.1016 6.3584L14.1143 6.625L14.0947 11.0117C14.0883 12.4431 12.9255 13.5996 11.4941 13.5996H4.48535C3.04959 13.5994 1.88574 12.4358 1.88574 11V5C1.88595 3.56437 3.04972 2.4006 4.48535 2.40039H6.63672ZM4.48535 3.59961C3.71246 3.59982 3.08517 4.22711 3.08496 5V11C3.08496 11.7731 3.71233 12.4002 4.48535 12.4004H11.4941C12.2649 12.4004 12.8911 11.7766 12.8945 11.0059L12.9141 6.61914L12.9072 6.47559C12.8379 5.76757 12.2406 5.21289 11.5137 5.21289H9.37012C9.00983 5.2128 8.65947 5.09174 8.37695 4.86816L6.88477 3.68652C6.81421 3.63082 6.72662 3.59964 6.63672 3.59961H4.48535ZM8.04004 6.58203C8.3711 6.58224 8.63944 6.85058 8.63965 7.18164V7.97852H9.4043C9.7355 7.97852 10.0046 8.24699 10.0049 8.57812C10.0049 8.9095 9.73567 9.17871 9.4043 9.17871H8.63965V9.98145C8.63965 10.3127 8.37123 10.5818 8.04004 10.582C7.70867 10.582 7.43945 10.3128 7.43945 9.98145V9.17871H6.60449C6.27331 9.17849 6.00488 8.90936 6.00488 8.57812C6.00516 8.24713 6.27348 7.97874 6.60449 7.97852H7.43945V7.18164C7.43966 6.85045 7.7088 6.58203 8.04004 6.58203Z"
                    fill="currentColor"
                  ></path></svg></span
              ><span class="media-icon-text">添加视频</span>
            </div>
            <div
              class="divider-vertical"
              style="margin-left: 12px; margin-right: 12px"
            ></div>
            <!-- 返回按钮 -->
            <div class="media-btn" @click="handleBack">
              <span role="img" class="media-icon"
                ><svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  focusable="false"
                >
                  <path
                    d="M12.0688 2.63721C13.2768 2.63751 14.2563 3.61672 14.2563 4.82471V11.1753C14.2561 12.383 13.2766 13.3625 12.0688 13.3628H7.70264C7.37128 13.3628 7.10306 13.0936 7.10303 12.7622C7.10314 12.4309 7.37134 12.1626 7.70264 12.1626H12.0688C12.6138 12.1623 13.0559 11.7203 13.0562 11.1753V4.82471C13.0562 4.27946 12.614 3.83673 12.0688 3.83643H7.70264C7.37128 3.83643 7.10306 3.56816 7.10303 3.23682C7.10303 2.90545 7.37127 2.63721 7.70264 2.63721H12.0688ZM7.43408 5.39307C7.66839 5.15878 8.0484 5.15878 8.28271 5.39307L10.2046 7.31396C10.5935 7.70316 10.5934 8.3339 10.2046 8.72314L8.35498 10.5728C8.12062 10.8064 7.74044 10.8068 7.50635 10.5728C7.27231 10.3386 7.27347 9.95842 7.50732 9.72412L8.61182 8.61963H2.34326L2.22217 8.60791C1.94936 8.55162 1.74385 8.30945 1.74365 8.02002C1.74366 7.73047 1.94931 7.4885 2.22217 7.43213L2.34326 7.42041H8.61377L7.43408 6.24072C7.20024 6.00668 7.2007 5.62739 7.43408 5.39307Z"
                    fill="currentColor"
                  ></path></svg></span
              ><span class="media-icon-text">返回</span>
            </div>
          </template>
        </div>
      </div>
    </user-tabbar-2>

    <div class="user-collection-content">
      <collection-folder
        v-if="activeTab === 'favorite_folder'"
        ref="collectionFolderRef"
        :batch-mode="isBatchMode"
        @detail-mode-change="handleDetailModeChange"
      />
      <collection-video
        v-if="activeTab === 'video'"
        ref="collectionVideoRef"
        :batch-mode="isBatchMode"
      />
      <collection-music v-if="activeTab === 'music'" />
      <collection-mix
        v-if="activeTab === 'compilation'"
        ref="collectionMixRef"
        :batch-mode="isBatchMode"
      />
    </div>

    <!-- 删除确认弹框 -->
    <UserConfirmDialog
      v-model="showDeleteDialog"
      :title="deleteDialogTitle"
      :cancel-text="deleteDialogCancelText"
      :confirm-text="deleteDialogConfirmText"
      @confirm="confirmDelete"
      @cancel="cancelDialog"
    />

    <!-- 收藏夹选择弹框 -->
    <SelectFolderDialog
      v-model="showSelectFolderDialog"
      @confirm="handleSelectFolderConfirm"
      @create-folder="handleCreateFolderFromSelect"
    />

    <!-- 新建收藏夹弹框（从收藏夹选择弹框打开） -->
    <CreateFolderDialog
      v-model="showCreateFolderFromSelect"
      @success="handleCreateFolderSuccess"
    />

    <!-- 移动到收藏夹弹框（单选模式，排除当前收藏夹） -->
    <SelectFolderDialog
      v-model="showMoveToDialog"
      title="选择收藏夹"
      :single-select="true"
      :exclude-folder-id="currentFolderId"
      @confirm="handleMoveToConfirm"
      @create-folder="handleCreateFolderFromMoveTo"
    />
  </div>
</template>

<style lang="scss" scoped>
.user-collection {
  padding-top: 8px;
}
.tabbar-2-content {
  position: relative;
  white-space: nowrap;
  outline: none;

  .tabbar-2-item {
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
    color: var(--color-text-2);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    display: inline-block;
    position: relative;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 6px;
    padding: 3px 12px;

    &.active {
      color: var(--color-primary);
      background-color: rgba(254, 44, 85, 0.12);
      border-width: initial;
      border-style: none;
      border-color: initial;
      border-image: initial;

      &:hover {
        cursor: default;
        color: var(--color-primary);
        font-weight: 600;
      }
    }
    &:hover {
      cursor: default;
      color: var(--color-text-0);
      font-weight: 600;
    }

    .tabbar-2-item-text {
      font-size: 13px;
      line-height: 21px;
    }
  }
}

.tabbar-2-end {
  height: 44px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0;
  display: flex;
  position: relative;

  .media-control-container {
    align-items: center;
    display: flex;
    .media-btn {
      user-select: none;
      align-items: center;
      display: flex;

      &:hover {
        .media-icon,
        .media-icon-text {
          color: var(--color-text-t0);
        }
      }
      .media-icon {
        text-align: center;
        text-transform: none;
        text-rendering: optimizelegibility;
        fill: currentColor;
        font-style: normal;
        line-height: 0;
        display: inline-block;

        color: var(--color-text-t3);
        font-size: 16px;
      }
      span {
        margin-left: 2px;
      }

      .media-icon-text {
        color: var(--color-text-t2);
        font-size: 13px;
        font-weight: 400;
        line-height: 21px;
      }
    }

    .divider-vertical {
      border-left-color: var(--color-line-l2);
      border-bottom: 0;
      border-left: 1px solid var(--color-text-t3);
      height: 12px;
      vertical-align: middle;
      margin: 0 1px;
      display: inline-block;
      color: var(--color-text-0);
      box-sizing: border-box;
    }
  }
}

.user-collection-content {
  margin-top: 8px;
}
</style>
