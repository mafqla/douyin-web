<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import apis from '@/api/apis'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import CreateFolderDialog from '@/components/user/user-collection/collection-folder/create-folder-dialog.vue'
import { Loading } from '@/components/common'

/**
 * 收藏夹选择面板组件（类似 share-panel）
 */

export interface CollectionFolder {
  id: string
  name: string
  cover?: string
  count: number
  isPrivate?: boolean
}

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  confirm: [folderIds: string[]]
  collectOnly: []
  cancel: []
  'update:show': [value: boolean]
  'dialog-open': [isOpen: boolean]  // 通知父组件弹框状态
}>()

// 收藏夹列表数据
const folders = ref<CollectionFolder[]>([])
const loading = ref(false)
const cursor = ref('0')
const hasMore = ref(true)

const selectedIds = ref<Set<string>>(new Set())
const hasSelection = computed(() => selectedIds.value.size > 0)

// 新建收藏夹弹框
const showCreateDialog = ref(false)

// 获取收藏夹列表
const fetchFolders = async (isLoadMore = false) => {
  if (loading.value) return
  if (isLoadMore && !hasMore.value) return

  loading.value = true
  try {
    const res = await apis.getUserCollectFloderList(20, isLoadMore ? cursor.value : '0')
    
    const newFolders: CollectionFolder[] = (res.collects_list || []).map((item: ICollectsItem) => ({
      id: item.collects_id_str,
      name: item.collects_name,
      cover: item.collects_cover?.url_list?.[0],
      count: item.total_number,
      isPrivate: item.status === 0 // status 0 为私密
    }))

    if (isLoadMore) {
      folders.value = [...folders.value, ...newFolders]
    } else {
      folders.value = newFolders
    }

    cursor.value = res.cursor || '0'
    hasMore.value = res.has_more ?? false
  } catch (error) {
    console.error('获取收藏夹列表失败:', error)
  } finally {
    loading.value = false
  }
}

const toggleSelect = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
  selectedIds.value = new Set(selectedIds.value)
}

// 监听面板显示状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 面板打开时获取收藏夹列表
    cursor.value = '0'
    hasMore.value = true
    folders.value = []
    selectedIds.value.clear()
    fetchFolders()
  }
}, { immediate: true })

// 滚动加载更多
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  
  // 距离底部 50px 时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    fetchFolders(true)
  }
}

const handleCollectOnly = () => {
  emit('collectOnly')
  emit('update:show', false)
}

const handleConfirm = () => {
  emit('confirm', Array.from(selectedIds.value))
  emit('update:show', false)
}

// 打开新建收藏夹弹框
const handleCreateFolder = () => {
  showCreateDialog.value = true
  emit('dialog-open', true)
}

// 新建收藏夹成功
const handleCreateSuccess = () => {
  showCreateDialog.value = false
  emit('dialog-open', false)
  // 重新获取收藏夹列表
  cursor.value = '0'
  hasMore.value = true
  folders.value = []
  fetchFolders()
}

// 新建收藏夹弹框关闭（取消）
const handleCreateDialogClose = () => {
  emit('dialog-open', false)
}
</script>

<template>
  <div class="collection-folder-panel" @wheel.stop @touchmove.stop>
    <!-- 头部 -->
    <div class="panel-header">
      <span class="panel-title">选择收藏夹</span>
      <div class="create-btn" @click="handleCreateFolder">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 16 17">
          <path d="M8 15.167A6.667 6.667 0 1 0 8 1.833a6.667 6.667 0 0 0 0 13.334zM8 11.5a.667.667 0 0 1-.666-.667V9.167H5.667a.667.667 0 0 1 0-1.334h1.667V6.167a.667.667 0 0 1 1.333 0v1.666h1.667a.667.667 0 1 1 0 1.334H8.667v1.666a.667.667 0 0 1-.666.667z" fill="currentColor"></path>
        </svg>
        <span>新建</span>
      </div>
    </div>

    <!-- 收藏夹列表 -->
    <div class="folder-list" @scroll="handleScroll">
      <!-- 加载中状态 -->
      <Loading :show="loading && folders.length === 0" />
      
      <!-- 空状态 -->
      <div v-if="!loading && folders.length === 0" class="empty-state">
        <span>暂无收藏夹</span>
      </div>
      
      <!-- 收藏夹列表 -->
      <template v-if="folders.length > 0">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="folder-item"
          :class="{ selected: selectedIds.has(folder.id) }"
          @click="toggleSelect(folder.id)"
        >
          <!-- 封面 -->
          <div class="folder-cover">
            <img v-if="folder.cover" :src="folder.cover" />
            <div v-else class="cover-placeholder"></div>
          </div>
          
          <!-- 信息区域 -->
          <div class="folder-info">
            <span class="folder-name">{{ folder.name }}</span>
            <!-- 私密图标 -->
            <svg v-if="folder.isPrivate" class="lock-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
              <path d="M11.2 6.4V5.2C11.2 3.43269 9.76731 2 8 2C6.23269 2 4.8 3.43269 4.8 5.2V6.4C3.91634 6.4 3.2 7.11634 3.2 8V12.4C3.2 13.2837 3.91634 14 4.8 14H11.2C12.0837 14 12.8 13.2837 12.8 12.4V8C12.8 7.11634 12.0837 6.4 11.2 6.4ZM6 5.2C6 4.09543 6.89543 3.2 8 3.2C9.10457 3.2 10 4.09543 10 5.2V6.4H6V5.2Z" fill="currentColor"></path>
            </svg>
            <span class="folder-count">{{ folder.count }}</span>
          </div>

          <!-- 复选框 -->
          <div class="folder-checkbox">
            <div class="checkbox-inner" :class="{ checked: selectedIds.has(folder.id) }">
              <svg v-if="selectedIds.has(folder.id)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4111 7.30848C18.0692 7.81171 18.1947 8.75312 17.6915 9.41119L11.1915 17.9112C10.909 18.2806 10.4711 18.4981 10.0061 18.5C9.54105 18.5019 9.10143 18.288 8.81592 17.9209L5.31592 13.4209C4.80731 12.767 4.92512 11.8246 5.57904 11.316C6.23296 10.8074 7.17537 10.9252 7.68398 11.5791L9.98988 14.5438L15.3084 7.58884C15.8116 6.93077 16.7531 6.80525 17.4111 7.30848Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <Loading v-if="loading && folders.length > 0" :show="true" />
      </template>
    </div>

    <!-- 底部按钮 -->
    <div class="panel-footer">
      <button class="btn-secondary" @click="handleCollectOnly">
        仅收藏视频
      </button>
      <button 
        class="btn-primary" 
        :disabled="!hasSelection"
        @click="handleConfirm"
      >
        收藏至收藏夹
      </button>
    </div>
  </div>

  <!-- 新建收藏夹弹框 -->
  <CreateFolderDialog
    v-model="showCreateDialog"
    @success="handleCreateSuccess"
    @update:model-value="(val) => !val && handleCreateDialogClose()"
  />
</template>

<style lang="scss" scoped>
.collection-folder-panel {
  background-color: var(--color-bg-b1);
  box-shadow: var(--shadow-2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  width: 320px;
  min-width: 320px;
  max-height: 450px;
  overflow: hidden;

  .panel-header {
    height: 44px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    display: flex;
    padding: 12px 24px;

    .panel-title {
      color: var(--color-text-3);
      font-size: 13px;
      font-weight: 400;
      line-height: 21px;
    }

    .create-btn {
      color: var(--color-text-2);
      cursor: pointer;
      align-items: center;
      font-size: 13px;
      line-height: 21px;
      display: flex;

      &:hover {
        color: var(--color-text-0);
      }
    }
  }

  .folder-list {
    max-height: 212px;
    overflow-y: scroll;
    scrollbar-width: none;
    padding: 0 24px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-line-l1);
      border-radius: 2px;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: var(--color-text-t3);
    font-size: 14px;
  }

  .folder-item {
    background: var(--color-bg-b2);
    width: 272px;
    border-radius: 10px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    margin-bottom: 8px !important;
    padding: 8px 10px 8px 8px !important;

    .folder-cover {
      background: var(--color-bg-b3);
      width: 28px;
      height: 28px;
      border-radius: 6px;
      justify-content: center;
      align-items: center;
      margin-right: 8px;
      display: flex;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
      }

      .cover-placeholder {
        width: 100%;
        height: 100%;
        background: var(--color-bg-b3);
      }
    }

    .folder-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      overflow: hidden;
    }

    .folder-name {
      color: var(--color-text-1);
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 148px;
      font-size: 14px;
      line-height: 22px;
      overflow: hidden;
    }

    .lock-icon {
      margin-left: 2px;
      color: var(--color-text-t3);
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }

    .folder-count {
      color: var(--color-text-3);
      margin-left: 4px;
      font-size: 12px;
    }

    .folder-checkbox {
      flex-shrink: 0;

      .checkbox-inner {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border: 1.5px solid var(--color-const-bg-white30);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        box-sizing: border-box;

        &.checked {
          background: var(--color-primary);
          border-color: transparent;
          color: var(--color-const-text-white);

          svg {
            width: 14px;
            height: 14px;
          }
        }
      }
    }
  }

  .panel-footer {
    display: flex;
    gap: 12px;
    padding: 16px 20px 20px;
    flex-shrink: 0;

    button {
      flex: 1;
      height: 32px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;

      &:active {
        transform: scale(0.98);
      }
    }

    .btn-secondary {
      background: var(--color-const-line-white8);
      color: var(--color-text-t1);

      &:hover {
        background: var(--color-const-line-white12);
      }
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-const-text-white);

      &:hover:not(:disabled) {
        background: var(--color-primary-hover);
      }

      &:disabled {
        background: rgba(254, 44, 85, 0.34);
        color: rgba(249, 249, 249, 0.35);
        cursor: not-allowed;
      }
    }
  }
}
</style>
