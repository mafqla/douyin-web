<script setup lang="ts">
import apis from '@/api/apis'
import type { IAuthor } from '@/api/tyeps/common/author'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import Loading from '@/components/common/loading.vue'
import { useCount } from '@/hooks'
import { formatMillisecondsToTime } from '@/utils/date-format'
import { } from 'vue'
import RelatedVideoItem from './related-video-item.vue'

interface Props {
  author: IAuthor
  awemeId: string
}
const props = defineProps<Props>()
const loading = ref(true)
const followers = useCount(props.author.follower_count)
const likes = useCount(props.author.total_favorited)
//是否关注
const isFollow = ref(Boolean(props.author.follow_status))
const awemeList = ref<IAwemeInfo[]>([])
const params = reactive({
  aweme_id: String(props.awemeId),
  count: '20',
  filterGids: '',
  refresh_index: '1'
})
const awemeIds = defineModel()

const getVideoRelated = async () => {
  loading.value = true
  try {
    const res = await apis.getVideoRelated(
      params.aweme_id,
      params.count,
      params.filterGids,
      params.refresh_index
    )
    // 如果是第一次请求，则添加到列表，否则追加到列表
    if (params.refresh_index === '1') {
      awemeList.value = res.aweme_list
      awemeIds.value = res.aweme_list.map((item) => item.aweme_id)
    } else {
      awemeList.value = [...awemeList.value, ...res.aweme_list]
    }
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}
getVideoRelated()

// 检测页面宽度，小于50%时展示加载更多按钮
const isLoadButtonVisible = ref(false)

const updateLoad = () => {
  // console.log(window.innerWidth, isLoadButtonVisible.value)
  isLoadButtonVisible.value =
    window.innerWidth < 1032 && params.refresh_index < '2'
  if (window.innerWidth >= 1032) {
    handleLoadMoreClick()
  }
}
onMounted(() => {
  updateLoad()
  window.addEventListener('resize', updateLoad)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateLoad)
})
// 更新页码或相关参数的函数，以备下次请求使用
const updateParamsForNextRequest = () => {
  params.refresh_index = String(Number(params.refresh_index) + 1)
  params.filterGids = awemeList.value.map((item) => item.aweme_id).join(',')
}

// 处理点击加载更多按钮的事件
const handleLoadMoreClick = () => {
  if (params.refresh_index < '2') {
    updateParamsForNextRequest()
    getVideoRelated()
  }
}
</script>
<template>
  <div class="related-video">
    <div class="user-info">
      <div class="avatar-content">
        <div class="live-avatar">
          <img
            class="avatar"
            :src="props.author.avatar_thumb.url_list[0]"
            :alt="props.author.nickname"
          />
        </div>
      </div>
      <div class="info-content">
        <div class="username">
          <span class="username-text">{{ props.author.nickname }}</span>
        </div>
        <p class="stats-container">
          <span class="stats-label">粉丝</span>
          <span class="stats-value">{{ followers }}</span>
          <span class="stats-label">获赞</span>
          <span class="stats-value">{{ likes }}</span>
        </p>
      </div>

      <div class="btn-content">
        <button type="button" class="btn" :class="{ follow: isFollow }">
          {{ isFollow ? '已关注' : '关注' }}
        </button>
      </div>
    </div>
    <div class="line"></div>
    <div class="aweme-relate">
      <div class="title-container">
        <h2 class="h2-title">推荐视频</h2>
      </div>

      <ul>
        <related-video-item
          v-for="item in awemeList"
          :key="item.aweme_id"
          :videoTitle="item.desc"
          :videoLink="`/video/${item.aweme_id}`"
          :thumbnailSrc="item.video.cover.url_list[0]"
          :videoDuration="formatMillisecondsToTime(item.video.duration)"
          :likeCount="useCount(item.statistics.digg_count)"
          :userName="item.author.nickname"
          :sec_uid="item.author.sec_uid"
        />
      </ul>
      <Loading :show="loading" />
      <div
        class="load-container"
        v-if="isLoadButtonVisible"
        @click="handleLoadMoreClick"
      >
        <button type="button" class="load-more-button">点击加载更多</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.related-video {
  width: 100%;
}

.user-info {
  height: 90px;
  justify-content: center;
  align-items: center;
  // margin: 11px 0 3px;
  margin: 1px 0 3px;
  display: flex;
}

.avatar-content {
  transition: all 0.3s ease-in;
  transform: scale(1);

  &:hover {
    transition: all 0.3s ease-out;
    transform: scale(1.1);
  }

  .live-avatar {
    width: 60px;
    height: 60px;
    box-sizing: content-box;
    border-radius: 50%;
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    // border: 1px solid rgba(22, 24, 35, 0.06) !important;
    border: 1px solid var(--color-line-l3) !important;

    .avatar {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
}

.info-content {
  flex: 1;
  margin: 0 8px;
  overflow: hidden;

  * {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .username {
    color: var(--color-text-t1);
    height: 28px;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    display: flex;

    .username-text {
      color: var(--color-text-t1);
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }
  }

  .stats-container {
    color: var(--color-text-t4);
    font-size: 12px;
    line-height: 20px;

    .stats-label {
      margin-right: 2px;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
    }

    .stats-value {
      color: var(--color-text-t1);
      margin-right: 8px;
      font-size: 12px;
      font-weight: 600;
      line-height: 20px;
    }
  }
}

.btn-content {
  .btn {
    margin: 0;
    cursor: pointer;
    border: 0;
    outline: none;
    justify-content: center;
    align-items: center;
    // margin: 0 8px;
    padding: 0 16px;
    display: inline-flex;
    position: relative;
    min-width: 68px;
    height: 32px;
    border-radius: 8px;
    font-size: 14px;

    background-color: var(--color-primary);

    color: var(--color-const-text-white);
  }
}

.line {
  width: 100%;
  height: 1px;
  min-height: 1px;
  background-color: var(--color-line-l3);
  display: block;
  position: relative;
}

.aweme-relate {
  margin-top: 36px;

  .title-container {
    justify-content: center;
    align-items: center;
    display: flex;

    .h2-title {
      color: var(--color-text-t1);
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
      white-space: nowrap;
      flex: 1 1 0%;
      overflow: hidden;
    }
  }

  .load-container {
    margin-top: 24px;
    margin-bottom: 48px;
  }

  .load-more-button {
    color: var(--color-text-t4);
    width: 100%;
    cursor: pointer;
    border: 1px solid var(--color-bg-b3);
    background-color: transparent;
    border-radius: 8px;
    outline: none;
    font-size: 12px;
    line-height: 32px;
  }
}
</style>
