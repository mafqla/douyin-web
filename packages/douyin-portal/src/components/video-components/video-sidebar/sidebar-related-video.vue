<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import apis from '@/api/apis'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { formatMillisecondsToTime } from '@/utils/date-format'
import { Loading } from '@/components/common'
import RelatedVideoItem from '@/views/video/components/related-video-item.vue'
import { useCount } from '@/hooks/useCount'
import { useSidebarStore } from '@/stores/sidebar'
import { getAwemeLink } from '@/utils/aweme-link'
import { vInfiniteScroll } from '@vueuse/components'

const sidebarStore = useSidebarStore()

interface Props {
  awemeId: string
  // 当前播放的视频信息（显示在第一个）
  currentAweme?: IAwemeInfo
}

const props = defineProps<Props>()

const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const awemeList = ref<IAwemeInfo[]>([])

// 同步视频列表到 store（包含当前视频）
watch(
  awemeList,
  (newList) => {
    // 将当前视频和相关推荐合并后同步到 store
    const fullList = props.currentAweme ? [props.currentAweme, ...newList] : newList
    sidebarStore.setRelatedVideoList(fullList)
  },
  { immediate: true }
)

const params = reactive({
  aweme_id: props.awemeId,
  count: '20',
  filterGids: '',
  refresh_index: '1'
})

// 合并当前视频和相关推荐列表
const combinedList = computed(() => {
  const list: { item: IAwemeInfo; isPlaying: boolean }[] = []
  if (props.currentAweme) {
    list.push({ item: props.currentAweme, isPlaying: true })
  }
  awemeList.value.forEach((item) => {
    list.push({ item, isPlaying: false })
  })
  return list
})

// 获取相关推荐视频
const getVideoRelated = async (isLoadMore = false) => {
  if (isLoadMore) {
    if (!hasMore.value || isLoadingMore.value) return
    isLoadingMore.value = true
  } else {
    loading.value = true
  }
  
  try {
    const res = await apis.getVideoRelated(
      params.aweme_id,
      params.count,
      params.filterGids,
      params.refresh_index
    )
    const newList = res.aweme_list || []
    
    if (isLoadMore) {
      awemeList.value = [...awemeList.value, ...newList]
    } else {
      awemeList.value = newList
    }
    
    // 更新分页参数
    if (newList.length > 0) {
      params.refresh_index = String(Number(params.refresh_index) + 1)
      params.filterGids = awemeList.value.map((item) => item.aweme_id).join(',')
    }
    
    // 判断是否还有更多 (has_more 可能是 1/0 或 true/false)
    hasMore.value = Boolean(res.has_more) && newList.length > 0
  } catch (error) {
    console.error('获取相关推荐失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }
}

// 加载更多
const loadMore = () => {
  getVideoRelated(true)
}

// 监听 awemeId 变化
watch(
  () => props.awemeId,
  (newId) => {
    if (newId) {
      params.aweme_id = newId
      params.refresh_index = '1'
      params.filterGids = ''
      hasMore.value = true
      awemeList.value = []
      getVideoRelated()
    }
  }
)

onMounted(() => {
  getVideoRelated()
})
</script>

<template>
  <div class="sidebar-related-video">
    <Loading :show="loading">
      <ul
        class="related-list"
        v-infinite-scroll="[loadMore, { distance: 10 }]"
      >
        <RelatedVideoItem
          v-for="{ item, isPlaying } in combinedList"
          :key="item.aweme_id"
          :videoTitle="item.desc"
          :videoLink="getAwemeLink(item)"
          :thumbnailSrc="item.video?.cover?.url_list?.[0]"
          :videoDuration="formatMillisecondsToTime(item.video?.duration || 0)"
          :likeCount="useCount(item.statistics?.digg_count || 0)"
          :userName="item.author?.nickname"
          :sec_uid="item.author?.sec_uid"
          :isPlaying="isPlaying"
        />
        <Loading :show="isLoadingMore" />
        <list-footer v-if="!hasMore && combinedList.length > 0" />
      </ul>
    </Loading>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-related-video {
  padding-top: 8px;
  height: 100%;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
}
</style>
