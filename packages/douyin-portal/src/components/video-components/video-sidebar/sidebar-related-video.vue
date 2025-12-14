<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import apis from '@/api/apis'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { formatMillisecondsToTime } from '@/utils/date-format'
import { Loading } from '@/components/common'
import RelatedVideoItem from '@/views/video/components/related-video-item.vue'
import { useCount } from '@/hooks/useCount'

interface Props {
  awemeId: string
  // 当前播放的视频信息（显示在第一个）
  currentAweme?: IAwemeInfo
}

const props = defineProps<Props>()

const loading = ref(true)
const awemeList = ref<IAwemeInfo[]>([])

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
const getVideoRelated = async () => {
  loading.value = true
  try {
    const res = await apis.getVideoRelated(
      params.aweme_id,
      params.count,
      params.filterGids,
      params.refresh_index
    )
    awemeList.value = res.aweme_list || []
  } catch (error) {
    console.error('获取相关推荐失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听 awemeId 变化
watch(
  () => props.awemeId,
  (newId) => {
    if (newId) {
      params.aweme_id = newId
      params.refresh_index = '1'
      params.filterGids = ''
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
      <ul class="related-list">
        <RelatedVideoItem
          v-for="{ item, isPlaying } in combinedList"
          :key="item.aweme_id"
          :videoTitle="item.desc"
          :videoLink="`/video/${item.aweme_id}`"
          :thumbnailSrc="item.video?.cover?.url_list?.[0]"
          :videoDuration="formatMillisecondsToTime(item.video?.duration || 0)"
          :likeCount="useCount(item.statistics?.digg_count || 0)"
          :userName="item.author?.nickname"
          :sec_uid="item.author?.sec_uid"
          :isPlaying="isPlaying"
        />
      </ul>
    </Loading>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-related-video {
  padding-top: 8px;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
