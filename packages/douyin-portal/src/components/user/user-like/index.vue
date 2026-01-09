<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserError from '../user-error/index.vue'
import UserSearchBar from '../user-search-bar/index.vue'
import BatchActionBar from '../batch-action-bar/index.vue'
import UserConfirmDialog from '../user-confirm-dialog/index.vue'
import DyButton from '@/components/ui/button/button.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const props = defineProps<{
  // 根据传入的值进行判断是否显示点赞列表
  showLikeList: boolean
  // 用户 sec_user_id
  user_id: string
  // 用户 uid（用于搜索接口）
  uid: string
}>()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const likeList = ref<IAwemeInfo[]>([])
// 视频列表容器 ref
const videoListRef = ref<HTMLElement | null>(null)
// 当前需要滚动到的视频 ID
const currentScrollId = ref<string | null>(null)

// 搜索相关状态
const isSearching = ref(false)
const searchKeyword = ref('')
const searchList = ref<IAwemeInfo[]>([])
const searchLoading = ref(false)
const searchHasMore = ref(true)
const searchOffset = ref(0)
// 搜索结果提示文案
const searchResultText = ref('')

// 使用 useGridScrollToItem 实现滚动定位
const { scrollToItem } = useGridScrollToItem({
  containerRef: videoListRef,
  currentId: currentScrollId,
  items: likeList,
  idKey: 'aweme_id',
  autoScroll: false, // 手动触发滚动
  block: 'center',
  offsetTop: 60, // 顶部导航栏高度
  dataAttr: 'aweme-id' // 使用 data-aweme-id 属性查找元素
})

const params = reactive({
  sec_user_id: props.user_id,
  count: 18,
  max_cursor: 0,
  min_cursor: 0
})

const getLikeList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserLike(params)
    likeList.value = likeList.value.concat(res.aweme_list)
    params.max_cursor = res.max_cursor
    loading.value = false
    isLoadingMore.value = false
    if (!res.has_more) {
      hasMore.value = false
      isLoadingMore.value = false
    }
  } catch (error) {
    hasMore.value = false
    isLoadingMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

// 搜索用户喜欢的视频
const handleSearch = async (keyword: string) => {
  if (!keyword.trim()) {
    // 清空搜索，恢复原列表
    isSearching.value = false
    searchKeyword.value = ''
    searchList.value = []
    searchOffset.value = 0
    searchHasMore.value = true
    return
  }

  isSearching.value = true
  searchKeyword.value = keyword
  searchLoading.value = true
  searchOffset.value = 0
  searchList.value = []
  searchHasMore.value = true

  try {
    const res = await apis.getUserHomeSearch({
      search_channel: 'aweme_favorite_video',
      search_source: 'normal_search',
      search_scene: 'douyin_search',
      sort_type: 0,
      publish_time: 0,
      is_filter_search: 0,
      query_correct_type: 1,
      keyword,
      enable_history: 1,
      offset: 0,
      count: 10,
      from_user: props.uid
    })
    // 从 item 中提取 aweme 信息
    searchList.value = res.aweme_list.map((item) => item.item)
    searchOffset.value = res.cursor
    searchHasMore.value = !!res.has_more
    // 保存搜索结果提示文案
    searchResultText.value = res.global_doodle_config?.home_text || ''

    // 如果第一次返回数量少且还有更多，自动加载更多
    if (searchList.value.length < 18 && searchHasMore.value) {
      searchLoading.value = false
      await loadMoreSearch()
      return
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    searchLoading.value = false
  }
}

// 加载更多搜索结果
const loadMoreSearch = async () => {
  if (!searchHasMore.value || searchLoading.value || !isSearching.value) return

  searchLoading.value = true
  try {
    const res = await apis.getUserHomeSearch({
      search_channel: 'aweme_favorite_video',
      search_source: 'normal_search',
      search_scene: 'douyin_search',
      sort_type: 0,
      publish_time: 0,
      is_filter_search: 0,
      query_correct_type: 1,
      keyword: searchKeyword.value,
      enable_history: 1,
      offset: searchOffset.value,
      count: 10,
      from_user: props.uid
    })
    // 从 item 中提取 aweme 信息
    searchList.value = searchList.value.concat(
      res.aweme_list.map((item) => item.item)
    )
    searchOffset.value = res.cursor
    searchHasMore.value = !!res.has_more
  } catch (error) {
    console.error('加载更多搜索结果失败:', error)
  } finally {
    searchLoading.value = false
  }
}

// 关闭搜索
const handleSearchClose = () => {
  isSearching.value = false
  searchKeyword.value = ''
  searchList.value = []
  searchOffset.value = 0
  searchHasMore.value = true
  searchResultText.value = ''
}

// 批量管理模式下执行搜索（会关闭批量管理模式）
const handleSearchInBatchMode = async (keyword: string) => {
  // 先关闭批量管理模式
  isBatchMode.value = false
  selectedIds.value.clear()
  // 然后执行搜索
  await handleSearch(keyword)
}

// 搜索更多视频（跳转到全局搜索页）
const handleSearchMore = () => {
  router.push({
    path: `/search/${encodeURIComponent(searchKeyword.value)}`,
    query: {
      type: 'general'
    }
  })
}

// 当前显示的列表
const displayList = computed(() => {
  return isSearching.value ? searchList.value : likeList.value
})

// 当前是否还有更多
const displayHasMore = computed(() => {
  return isSearching.value ? searchHasMore.value : hasMore.value
})

// 当前是否正在加载
const displayLoading = computed(() => {
  return isSearching.value ? searchLoading.value : isLoadingMore.value
})

onMounted(() => {
  getLikeList()
})

useInfiniteScroll(
  window,
  () => {
    if (isSearching.value) {
      if (!searchLoading.value) {
        loadMoreSearch()
      }
    } else {
      if (!isLoadingMore.value) {
        getLikeList()
      }
    }
  },
  { distance: 600 }
)

// 点击视频打开 modal
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

// Modal 滚动到末尾时加载更多
const handleLoadMore = async () => {
  if (isSearching.value) {
    await loadMoreSearch()
  } else {
    await getLikeList()
  }
}

// 关闭 modal 后滚动到当前视频位置
const handleModalClose = async (currentAwemeId: string) => {
  // 等待 modal 组件完全销毁并恢复滚动位置
  await nextTick()
  // 使用 setTimeout 确保 onBeforeUnmount 中的 scrollTo 已执行
  setTimeout(() => {
    scrollToItem(currentAwemeId)
  }, 50)
}

// 批量操作相关状态
const isBatchMode = ref(false) // 是否进入批量管理模式
const selectedIds = ref<Set<string>>(new Set())
const showCancelDialog = ref(false) // 显示取消喜欢确认弹框

// 是否全选
const isAllSelected = computed(() => {
  return (
    displayList.value.length > 0 &&
    selectedIds.value.size === displayList.value.length
  )
})

// 切换批量管理模式
const toggleBatchMode = () => {
  isBatchMode.value = !isBatchMode.value
  // 退出批量管理时清空选中状态
  if (!isBatchMode.value) {
    selectedIds.value.clear()
  }
}

// 切换全选状态
const handleToggleSelectAll = () => {
  if (isAllSelected.value) {
    // 取消全选
    selectedIds.value.clear()
  } else {
    // 全选
    selectedIds.value = new Set(displayList.value.map((item) => item.aweme_id))
  }
}

// 处理取消喜欢按钮点击
const handleCancelLike = () => {
  if (selectedIds.value.size === 0) return
  // 显示确认弹框
  showCancelDialog.value = true
}

// 确认取消喜欢
const confirmCancelLike = async () => {
  showCancelDialog.value = false

  try {
    // TODO: 调用 API 取消喜欢
    console.log('取消喜欢的作品 ID:', Array.from(selectedIds.value))

    // 模拟 API 调用
    // await apis.cancelLike(Array.from(selectedIds.value))

    // 从列表中移除已取消的项
    likeList.value = likeList.value.filter(
      (item) => !selectedIds.value.has(item.aweme_id)
    )

    // 清空选中状态
    selectedIds.value.clear()

    // 可选：退出批量管理模式
    // isBatchMode.value = false
  } catch (error) {
    console.error('取消喜欢失败:', error)
  }
}

// 取消弹框
const cancelDialog = () => {
  showCancelDialog.value = false
}

// 切换单个视频的选中状态
const toggleVideoSelection = (awemeId: string) => {
  if (selectedIds.value.has(awemeId)) {
    selectedIds.value.delete(awemeId)
  } else {
    selectedIds.value.add(awemeId)
  }
}

// 处理视频项点击事件
const handleVideoItemClick = (item: IAwemeInfo) => {
  if (isBatchMode.value) {
    // 批量管理模式：切换选中状态
    toggleVideoSelection(item.aweme_id)
  } else {
    // 普通模式：打开 modal 播放器
    handleOpenModal(item)
  }
}

// 暴露给父组件使用
defineExpose({
  isBatchMode,
  toggleBatchMode
})
</script>
<template>
  <Loading :show="loading">
    <div class="user-like">
      <!-- 批量操作工具栏 -->
      <user-tabbar-2 :style="isBatchMode ? 'height: 72px' : ''">
        <template #left>
          <BatchActionBar
            v-if="isBatchMode"
            :selected-count="selectedIds.size"
            :all-selected="isAllSelected"
            :disabled="displayList.length === 0"
            @select-all="handleToggleSelectAll"
            @action="handleCancelLike"
          >
            <template #right>
              <UserSearchBar
                placeholder="搜索你赞过的作品"
                @search="handleSearchInBatchMode"
                @close="handleSearchClose"
              />
            </template>
          </BatchActionBar>

          <!-- 搜索结果提示文案（仅在有结果时显示，非批量模式） -->
          <div
            v-if="
              !isBatchMode &&
              isSearching &&
              searchResultText &&
              searchList.length > 0
            "
            class="search-result-text"
          >
            {{ searchResultText }}
          </div>
        </template>
        <template #right>
          <!-- 非批量管理模式下显示搜索栏 -->
          <UserSearchBar
            v-if="!isBatchMode"
            class="user-tabbar-r"
            placeholder="搜索你赞过的作品"
            @search="handleSearch"
            @close="handleSearchClose"
          />
        </template>
      </user-tabbar-2>

      <div class="user-like-list">
        <user-error
          icon="no-show-like"
          title="喜欢内容不可见"
          desc="该用户已将喜欢设为私密"
          v-if="!showLikeList"
          class="no-show"
        />
        <template v-if="displayList.length !== 0 && showLikeList">
          <div class="video-list" ref="videoListRef">
            <VideoItem
              v-for="item in displayList"
              :key="item.aweme_id"
              :aweme="item"
              :data-aweme-id="item.aweme_id"
              :disableClickToggle="true"
              :selectable="isBatchMode"
              :selected="selectedIds.has(item.aweme_id)"
              @click="handleVideoItemClick(item)"
            />
          </div>
          <Loading :show="displayLoading" />
          <list-footer v-if="!displayHasMore" />
        </template>
        <!-- 搜索无结果提示 -->
        <user-error
          v-if="isSearching && searchList.length === 0 && !searchLoading"
          icon="empty-list-user"
          title="暂无内容"
          desc="暂未找到赞过的相关视频"
          class="no-show"
        >
          <template #actions>
            <dy-button
              type="primary"
              theme="solid"
              block
              @click="handleSearchClose"
            >
              返回全部视频
            </dy-button>
            <dy-button
              type="tertiary"
              theme="solid"
              block
              @click="handleSearchMore"
            >
              搜索更多视频
            </dy-button>
          </template>
        </user-error>
        <!-- 列表为空提示 -->
        <user-error
          v-if="!isSearching && likeList.length === 0 && !loading && showLikeList"
          icon="empty-list-user"
          title="暂无喜欢的内容"
          desc="你还没有喜欢过任何视频"
          class="no-show"
        />
      </div>

      <!-- Modal Player 全屏播放器 -->
      <ModalPlayer
        v-if="showModal"
        :videoList="displayList"
        :hasMore="displayHasMore"
        @close="handleModalClose"
        @loadMore="handleLoadMore"
      />

      <!-- 取消喜欢确认弹框 -->
      <UserConfirmDialog
        v-model="showCancelDialog"
        :title="`确认取消 ${selectedIds.size} 个喜欢的作品，取消后不可恢复`"
        cancel-text="暂不取消"
        confirm-text="确认取消"
        @confirm="confirmCancelLike"
        @cancel="cancelDialog"
      />
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}
.user-like {
  position: relative;
}
.search-result-text {
  color: var(--color-text-t3);
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 21px;
}
.user-tabbar-r {
  // position: absolute;
  // top: 0;
  // right: 0;
}
.video-list {
  width: 100%;
}
</style>
