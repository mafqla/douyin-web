<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import UserError from '../../user-error/index.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import apis from '@/api/apis'
import VideoItem from '@/components/video-components/video-list/video-item.vue'

const props = defineProps<{
  folder: ICollectsItem | null
}>()

const show = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  success: []
}>()

const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const folderVideoList = ref<IAwemeInfo[]>([])

// 当前收藏夹已有的视频列表
const existingVideoList = ref<IAwemeInfo[]>([])
const existingHasMore = ref(true)
const existingCursor = ref('')

// 已选中的视频 ID 集合
const selectedVideoIds = ref<Set<string>>(new Set())

const count = 20
const cursor = ref(0)

// 当前收藏夹已有视频的 ID 集合
const existingVideoIds = computed(() => {
  return new Set(existingVideoList.value.map((v) => v.aweme_id))
})

// 过滤后的视频列表（排除已在收藏夹中的视频）
const filteredVideoList = computed(() => {
  return folderVideoList.value.filter(
    (video) => !existingVideoIds.value.has(video.aweme_id)
  )
})

// 选中的视频数量
const selectedCount = computed(() => selectedVideoIds.value.size)

// 是否可以提交
const canSubmit = computed(() => selectedCount.value > 0)

// 获取当前收藏夹已有的视频列表
const fetchExistingVideos = async () => {
  if (!props.folder || !existingHasMore.value) return

  try {
    const res = await apis.getUserCollectFloderDetail(
      props.folder.collects_id_str,
      count,
      existingCursor.value
    )
    existingVideoList.value = existingVideoList.value.concat(
      res.aweme_list || []
    )
    existingCursor.value = res.cursor
    existingHasMore.value = !!res.has_more
  } catch (error) {
    existingHasMore.value = false
  }
}

// 获取用户收藏的视频列表
const getUserCollectVideoList = async () => {
  if (
    !hasMore.value ||
    isLoadingMore.value ||
    (loading.value && folderVideoList.value.length > 0)
  )
    return

  if (folderVideoList.value.length === 0) {
    loading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    // 同时获取收藏视频和已有视频
    const [collectRes] = await Promise.all([
      apis.getUserCollectVideo(count, cursor.value),
      existingHasMore.value ? fetchExistingVideos() : Promise.resolve()
    ])
    folderVideoList.value = folderVideoList.value.concat(
      collectRes.aweme_list || []
    )
    cursor.value = collectRes.cursor
    hasMore.value = !!collectRes.has_more
  } catch (error) {
    hasMore.value = false
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }
}

// 切换视频选中状态
const toggleVideoSelect = (aweme: IAwemeInfo) => {
  const id = aweme.aweme_id
  if (selectedVideoIds.value.has(id)) {
    selectedVideoIds.value.delete(id)
  } else {
    selectedVideoIds.value.add(id)
  }
  // 触发响应式更新
  selectedVideoIds.value = new Set(selectedVideoIds.value)
}

// 检查视频是否被选中
const isVideoSelected = (aweme: IAwemeInfo) => {
  return selectedVideoIds.value.has(aweme.aweme_id)
}

// 监听弹框打开/关闭 - 使用 watch 而非 watchEffect 避免依赖追踪问题
watch(
  () => show.value,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
      // 重置状态并加载数据
      folderVideoList.value = []
      cursor.value = 0
      hasMore.value = true
      loading.value = true
      isLoadingMore.value = false
      selectedVideoIds.value = new Set()
      // 重置已有视频列表
      existingVideoList.value = []
      existingCursor.value = ''
      existingHasMore.value = true
      nextTick(() => {
        getUserCollectVideoList()
      })
    } else {
      document.body.style.removeProperty('overflow')
    }
  }
)

// 关闭弹框
const close = () => {
  show.value = false
}

// 确认添加
const handleConfirm = async () => {
  if (!canSubmit.value || !props.folder) return

  try {
    // TODO: 调用添加视频到收藏夹的接口
    // const videoIds = Array.from(selectedVideoIds.value)
    // await apis.addVideosToFolder({
    //   collects_id: props.folder.collects_id_str,
    //   aweme_ids: videoIds
    // })

    emit('success')
    close()
  } catch (error) {
    console.error('添加视频失败', error)
  }
}

// 处理滚动加载更多
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  if (
    scrollHeight - scrollTop - clientHeight < 100 &&
    !isLoadingMore.value &&
    !loading.value &&
    hasMore.value
  ) {
    getUserCollectVideoList()
  }
}
</script>
<template>
  <Teleport to="body">
    <div class="add-collect-dialog-mask" v-if="show">
      <div class="add-collect-dialog">
        <div class="collect-dialog-header">
          <p class="collect-dialog-title">添加视频（{{ selectedCount }}）</p>
          <div class="collect-dialog-actions">
            <button class="btn-cancel btn-common" type="button" @click="close">
              取消
            </button>
            <button
              class="btn-confirm btn-common"
              type="button"
              :disabled="!canSubmit"
              @click="handleConfirm"
            >
              确定
            </button>
          </div>
        </div>
        <div class="collect-list-content" @scroll="handleScroll">
          <!-- 收藏视频列表 -->
          <Loading :show="loading">
            <user-error
              icon="no-show-like"
              title="暂无可添加的视频"
              desc="收藏的视频已全部添加到此收藏夹"
              v-if="!loading && filteredVideoList.length === 0"
              class="no-show"
            />
            <template v-if="filteredVideoList.length !== 0">
              <video-item
                v-for="item in filteredVideoList"
                :key="item.aweme_id"
                :aweme="item"
                :selectable="true"
                :selected="isVideoSelected(item)"
                class="folder-item"
                @click="toggleVideoSelect(item)"
              />
              <Loading :show="isLoadingMore" />
              <list-footer v-if="!hasMore" />
            </template>
          </Loading>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.add-collect-dialog-mask {
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

.add-collect-dialog {
  box-sizing: border-box;
  max-height: 648px;
  background: var(--color-bg-b1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  width: 1060px;
  box-shadow: none;
  padding: 0 40px 24px;

  .collect-dialog-header {
    height: 80px;
    justify-content: space-between;
    align-items: center;
    display: flex;
  }

  .collect-dialog-title {
    color: var(--color-text-t1);
    font-size: 18px;
    line-height: 26px;
  }

  .collect-dialog-actions {
    gap: 12px;
    display: flex;
  }

  .btn-common {
    border-radius: 10px;
    font-size: 14px;
    font-weight: 400;
    height: 32px;
    line-height: 22px;
    min-width: 68px;
    align-items: center;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    margin: 0px;
    outline: none;
    padding: 0 16px;
    position: relative;
    width: 68px;
  }

  .btn-cancel {
    background-color: var(--secondary-bg-color);
    color: var(--color-text-t1);

    &:hover {
      background-color: var(--color-bg-b3);
    }
  }

  .btn-confirm {
    background-color: var(--color-primary);
    color: var(--color-const-text-white);

    &:hover {
      background-color: var(--color-primary-hover);
    }

    &:disabled {
      background-color: rgba(254, 44, 89, 0.34);
      cursor: not-allowed;
    }
  }
}

.collect-list-content {
  width: 980px;
  max-height: 520px;
  overflow: auto;
  height: 520px;

  .folder-item {
    width: calc(20% - 12.8px);
    margin-bottom: 24px;
    margin-right: 16px;
    position: relative;

    &:nth-child(5n) {
      margin-right: 0;
    }
  }

  .no-show {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }
}
</style>
