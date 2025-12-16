<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import apis from '@/api/apis'

interface Props {
  // 弹框标题
  title?: string
  // 是否单选模式
  singleSelect?: boolean
  // 要排除的收藏夹 ID（不显示在列表中）
  excludeFolderId?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '收藏视频到',
  singleSelect: false,
  excludeFolderId: ''
})

const show = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  // 确认选择收藏夹（返回收藏夹 ID 数组，单选时数组只有一个元素）
  confirm: [folderIds: string[]]
  // 新建收藏夹
  createFolder: []
}>()

const loading = ref(true)
const rawFolderList = ref<ICollectsItem[]>([])
const cursor = ref('')
const hasMore = ref(true)

// 过滤后的收藏夹列表（排除指定的收藏夹）
const folderList = computed(() => {
  if (!props.excludeFolderId) return rawFolderList.value
  return rawFolderList.value.filter(
    (folder) => folder.collects_id_str !== props.excludeFolderId
  )
})

// 选中的收藏夹 ID 集合（多选）或单个 ID（单选）
const selectedFolderIds = ref<Set<string>>(new Set())

// 是否可以提交
const canSubmit = computed(() => selectedFolderIds.value.size > 0)

// 获取收藏夹列表
const getFolderList = async () => {
  if (!hasMore.value) return

  loading.value = true
  try {
    const res = await apis.getUserCollectFloderList(20, cursor.value)
    rawFolderList.value = rawFolderList.value.concat(res.collects_list || [])
    cursor.value = res.cursor
    hasMore.value = !!res.has_more
  } catch (error) {
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

// 监听弹框打开/关闭
watch(
  () => show.value,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
      // 重置状态并加载数据
      rawFolderList.value = []
      cursor.value = ''
      hasMore.value = true
      selectedFolderIds.value = new Set()
      getFolderList()
    } else {
      document.body.style.removeProperty('overflow')
    }
  }
)

// 关闭弹框
const close = () => {
  show.value = false
}

// 切换收藏夹选中状态
const toggleFolder = (folder: ICollectsItem) => {
  const id = folder.collects_id_str
  if (props.singleSelect) {
    // 单选模式：点击已选中的取消，点击未选中的替换
    if (selectedFolderIds.value.has(id)) {
      selectedFolderIds.value = new Set()
    } else {
      selectedFolderIds.value = new Set([id])
    }
  } else {
    // 多选模式：切换选中状态
    if (selectedFolderIds.value.has(id)) {
      selectedFolderIds.value.delete(id)
    } else {
      selectedFolderIds.value.add(id)
    }
    // 触发响应式更新
    selectedFolderIds.value = new Set(selectedFolderIds.value)
  }
}

// 检查收藏夹是否被选中
const isFolderSelected = (folder: ICollectsItem) => {
  return selectedFolderIds.value.has(folder.collects_id_str)
}

// 确认选择
const handleConfirm = () => {
  if (!canSubmit.value) return
  emit('confirm', Array.from(selectedFolderIds.value))
  close()
}

// 新建收藏夹
const handleCreateFolder = () => {
  emit('createFolder')
}

// 处理滚动加载更多
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  if (
    scrollHeight - scrollTop - clientHeight < 100 &&
    !loading.value &&
    hasMore.value
  ) {
    getFolderList()
  }
}

// 获取收藏夹封面图片
const getFolderCover = (folder: ICollectsItem) => {
  if (folder.collects_cover?.url_list?.length > 0) {
    return folder.collects_cover.url_list[0]
  }
  return ''
}
</script>

<template>
  <Teleport to="body">
    <div class="select-folder-dialog-mask" v-if="show" @click.self="close">
      <div class="select-folder-dialog">
        <!-- 头部 -->
        <div class="dialog-header">
          <h2 class="dialog-title">{{ title }}</h2>
          <svg
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            class="close-icon"
            @click="close"
          >
            <path
              d="M22.133 23.776a1.342 1.342 0 1 0 1.898-1.898l-4.112-4.113 4.112-4.112a1.342 1.342 0 0 0-1.898-1.898l-4.112 4.112-4.113-4.112a1.342 1.342 0 1 0-1.898 1.898l4.113 4.112-4.113 4.113a1.342 1.342 0 0 0 1.898 1.898l4.113-4.113 4.112 4.113z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <!-- 收藏夹列表 -->
        <div class="folder-list" @scroll="handleScroll">
          <Loading :show="loading && folderList.length === 0">
            <div
              v-for="folder in folderList"
              :key="folder.collects_id_str"
              class="folder-item"
              :class="{ selected: isFolderSelected(folder) }"
              @click="toggleFolder(folder)"
            >
              <!-- 封面图 -->
              <div class="folder-cover">
                <img
                  v-if="getFolderCover(folder)"
                  :src="getFolderCover(folder)"
                  alt=""
                />
                <div v-else class="folder-cover-placeholder"></div>
              </div>

              <!-- 收藏夹信息 -->
              <div class="folder-info">
                <span class="folder-name">{{ folder.collects_name }}</span>
                <!-- 私密图标（status: 0 为私密） -->
                <svg
                  v-if="folder.status === 0"
                  class="lock-icon"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                >
                  <path
                    d="M11.2 6.4V5.2C11.2 3.43269 9.76731 2 8 2C6.23269 2 4.8 3.43269 4.8 5.2V6.4C3.91634 6.4 3.2 7.11634 3.2 8V12.4C3.2 13.2837 3.91634 14 4.8 14H11.2C12.0837 14 12.8 13.2837 12.8 12.4V8C12.8 7.11634 12.0837 6.4 11.2 6.4ZM6 5.2C6 4.09543 6.89543 3.2 8 3.2C9.10457 3.2 10 4.09543 10 5.2V6.4H6V5.2Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span class="folder-count">{{ folder.total_number }}</span>
              </div>

              <!-- 选中状态复选框 -->
              <div class="folder-checkbox">
                <div
                  class="checkbox-inner"
                  :class="{ checked: isFolderSelected(folder), radio: singleSelect }"
                >
                  <svg
                    v-if="isFolderSelected(folder)"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.4111 7.30848C18.0692 7.81171 18.1947 8.75312 17.6915 9.41119L11.1915 17.9112C10.909 18.2806 10.4711 18.4981 10.0061 18.5C9.54105 18.5019 9.10143 18.288 8.81592 17.9209L5.31592 13.4209C4.80731 12.767 4.92512 11.8246 5.57904 11.316C6.23296 10.8074 7.17537 10.9252 7.68398 11.5791L9.98988 14.5438L15.3084 7.58884C15.8116 6.93077 16.7531 6.80525 17.4111 7.30848Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <Loading v-if="loading && folderList.length > 0" :show="true" />
          </Loading>
        </div>

        <!-- 底部按钮 -->
        <div class="dialog-footer">
          <button class="btn-create" @click="handleCreateFolder">
            新建收藏夹
          </button>
          <button
            class="btn-confirm"
            :disabled="!canSubmit"
            @click="handleConfirm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.select-folder-dialog-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--color-mask-m1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-folder-dialog {
  background: var(--color-bg-b1);
  border-radius: 16px;
  width: auto;
  max-height: 648px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  flex-shrink: 0;

  .dialog-title {
    color: var(--color-text-t1);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin: 0;
  }

  .close-icon {
    cursor: pointer;
    width: 24px;
    height: 24px;
    color: var(--color-text-t2);
    transition: color 0.2s;

    &:hover {
      color: var(--color-text-t1);
    }
  }
}

.folder-list {
  max-height: 212px;
  overflow-y: scroll;
  scrollbar-width: none;
  padding: 0 24px;
}

.folder-item {
  background: var(--color-bg-b2);
  width: 272px;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  display: flex;
  margin-bottom: 8px;
  padding: 8px 10px 8px 8px;

  &:hover {
    background-color: var(--color-fill-hover-alpha10);
  }

  &.selected {
    background-color: var(--color-fill-hover-alpha10);
  }
}

.folder-cover {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--color-bg-b2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .folder-cover-placeholder {
    width: 100%;
    height: 100%;
    background-color: var(--color-bg-b3);
  }
}

.folder-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  align-items: center;
  overflow: hidden;

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
    color: var(--color-text-t3);
    width: 12px;
    height: 12px;
    margin-left: 2px;
  }

  .folder-count {
    color: var(--color-text-3);
    margin-left: 4px;
    font-size: 12px;
  }
}

.folder-checkbox {
  flex-shrink: 0;
  margin-left: 12px;

  .checkbox-inner {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1.5px solid var(--color-text-t3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-sizing: border-box;

    // 单选框样式（圆形）
    &.radio {
      border-radius: 50%;
    }

    &.checked {
      background: linear-gradient(135deg, #ff2c55 0%, #ff0050 100%);
      border-color: transparent;
      color: #fff;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  flex-shrink: 0;

  button {
    flex: 1;
    height: 36px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s;
  }

  .btn-create {
    background-color: var(--color-bg-b2);
    color: var(--color-text-t1);

    &:hover {
      background-color: var(--color-bg-b3);
    }
  }

  .btn-confirm {
    background-color: var(--color-primary);
    color: var(--color-const-text-white);

    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
    }

    &:disabled {
      background-color: rgba(254, 44, 89, 0.34);
      cursor: not-allowed;
    }
  }
}
</style>
