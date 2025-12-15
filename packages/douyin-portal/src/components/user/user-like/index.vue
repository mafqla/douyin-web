<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserError from '../user-error/index.vue'
import UserSearchBar from '../user-search-bar/index.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import DyButton from '@/components/ui/button/button.vue'
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
  offsetTop: 60 // 顶部导航栏高度
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

// 关闭 modal 后滚动到当前视频位置
const handleModalClose = async (currentAwemeId: string) => {
  // 等待 DOM 更新完成（modal 关闭后 body 样式恢复）
  await nextTick()
  // 延迟一帧确保布局完成
  requestAnimationFrame(() => {
    scrollToItem(currentAwemeId)
  })
}
</script>
<template>
  <Loading :show="loading">
    <div class="user-like">
      <user-tabbar-2>
        <!-- 搜索结果提示文案（仅在有结果时显示） -->
        <div
          v-if="isSearching && searchResultText && searchList.length > 0"
          class="search-result-text"
        >
          {{ searchResultText }}
        </div>
        <UserSearchBar
          class="user-tabbar-r"
          placeholder="搜索你赞过的作品"
          @search="handleSearch"
          @close="handleSearchClose"
        />
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
              @click="handleOpenModal(item)"
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
            <dy-button type="primary" theme="solid" block @click="handleSearchClose">
              返回全部视频
            </dy-button>
            <dy-button type="tertiary" theme="solid" block @click="handleSearchMore">
              搜索更多视频
            </dy-button>
          </template>
        </user-error>
      </div>

      <!-- Modal Player 全屏播放器 -->
      <ModalPlayer
        v-if="showModal"
        :videoList="displayList"
        @close="handleModalClose"
        @loadMore="isSearching ? loadMoreSearch : getLikeList"
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
  position: absolute;
  top: 0;
  right: 0;
}
.video-list {
  width: 100%;
}
</style>
