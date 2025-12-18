<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import UserError from '../../user-error/index.vue'
import UserConfirmDialog from '../../user-confirm-dialog/index.vue'
import MixItem from './mix-item.vue'
import apis from '@/api/apis'
import type { IMixInfo } from '@/api/tyeps/common/mix'

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

// 处理合集项点击事件
const handleMixItemClick = (mix: IMixInfo) => {
  if (props.batchMode) {
    toggleMixSelection(mix.mix_id)
  } else {
    // 普通模式：跳转到合集详情
    window.open(`/collection/${mix.mix_id}`, '_blank')
  }
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

onMounted(() => {
  getMixList()
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
