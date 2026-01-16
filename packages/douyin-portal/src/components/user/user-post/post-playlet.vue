<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import UserError from '../user-error/index.vue'
import type { ISeriesInfo } from '@/api/tyeps/request_response/seriesListRes'
import apis from '@/api/apis'

const props = defineProps<{
  user_id: string
}>()

// 短剧相关状态
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const seriesList = ref<ISeriesInfo[]>([])
const cursor = ref(0)

// 获取短剧列表
const getSeriesList = async () => {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true

  try {
    const res = await apis.getUserSeriesList(props.user_id, 20, cursor.value)
    const newList = res.series_infos || []
    seriesList.value = seriesList.value.concat(newList)
    cursor.value = res.cursor || 0
    hasMore.value = !!res.has_more
  } catch (error) {
    console.error('获取短剧列表失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 格式化播放量
const formatPlayCount = (count: number): string => {
  if (count >= 100000000) {
    return (count / 100000000).toFixed(1) + '亿'
  }
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return String(count)
}

// 处理短剧点击
const handleSeriesClick = (series: ISeriesInfo) => {
  // TODO: 跳转到短剧详情页或播放页
  console.log('点击短剧:', series)
}

onMounted(() => {
  getSeriesList()
})

useInfiniteScroll(
  window,
  () => {
    if (!loadingMore.value && hasMore.value && !loading.value) {
      getSeriesList()
    }
  },
  { distance: 600 }
)
</script>

<template>
  <div class="post-playlet">
    <Loading :show="loading">
      <user-error
        v-if="!loading && seriesList.length === 0"
        icon="empty-list-user"
        title="暂无内容"
        desc="该账号还未发布过短剧哦～"
        class="no-show"
      />
      <template v-if="seriesList.length > 0">
        <div class="series-list">
          <div
            v-for="series in seriesList"
            :key="series.series_id"
            class="series-item"
            @click="handleSeriesClick(series)"
          >
            <div class="series-cover">
              <img
                :src="series.cover_url?.url_list?.[0]"
                :alt="series.series_name"
              />
              <div class="series-info-overlay">
                <span class="episode-count">
                  {{
                    series.updated_episode_count || series.total_episode_count
                  }}集
                </span>
              </div>
            </div>
            <div class="series-content">
              <div class="series-name">{{ series.series_name }}</div>
              <div class="series-meta">
                <span v-if="series.play_count" class="play-count">
                  {{ formatPlayCount(series.play_count) }}次播放
                </span>
              </div>
            </div>
          </div>
        </div>
        <Loading :show="loadingMore" />
        <list-footer v-if="!hasMore" />
      </template>
    </Loading>
  </div>
</template>

<style lang="scss" scoped>
.post-playlet {
  width: 100%;
  margin-top: 8px;
}

.series-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.series-item {
  width: calc(25% - 12px);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);

    .series-cover img {
      transform: scale(1.02);
    }
  }
}

.series-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--color-bg-b2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .series-info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));

    .episode-count {
      color: #fff;
      font-size: 12px;
    }
  }
}

.series-content {
  padding: 8px 0;
}

.series-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-t1);
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.series-meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-t3);

  .play-count {
    display: flex;
    align-items: center;
  }
}

.no-show {
  margin: 120px 0;
}

@media (max-width: 1200px) {
  .series-item {
    width: calc(33.33% - 11px);
  }
}

@media (max-width: 900px) {
  .series-item {
    width: calc(50% - 8px);
  }
}
</style>
