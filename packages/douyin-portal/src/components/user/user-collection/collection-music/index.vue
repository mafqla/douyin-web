<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import UserError from '../../user-error/index.vue'
import MusicItem from './music-item.vue'
import apis from '@/api/apis'
import { useGridScrollToItem } from '@/hooks'
import type { ICollectMusicItem } from '@/api/tyeps/request_response/userCollectMusicRes'

// 播放模式类型
export type PlayMode = 'sequence' | 'loop' | 'shuffle'

// 加���状态
const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)

// 音乐列表
const musicList = ref<ICollectMusicItem[]>([])

// 分页参数
const count = ref(20)
const cursor = ref(0)

// ========== 播放状态管理 ==========
const currentPlayingId = ref<string | null>(null)
const playMode = ref<PlayMode>('sequence')

// 音乐列表容器引用
const musicListRef = ref<HTMLElement | null>(null)

// 使用滚动 Hook，自动滚动到当前播放项
const { scrollToItem } = useGridScrollToItem({
  containerRef: musicListRef,
  currentId: currentPlayingId,
  items: musicList,
  idKey: 'id_str',
  block: 'start',
  offsetTop: 178 // 导航栏高度
})

// 切换播放模式
const togglePlayMode = () => {
  const modeOrder: PlayMode[] = ['sequence', 'loop', 'shuffle']
  const currentIndex = modeOrder.indexOf(playMode.value)
  playMode.value = modeOrder[(currentIndex + 1) % modeOrder.length]
}

// 获取下一首歌曲索引
const getNextIndex = (currentIndex: number): number => {
  const listLength = musicList.value.length
  if (listLength === 0) return -1

  switch (playMode.value) {
    case 'sequence':
      // 顺序播放：播放下一首，到末尾停止
      return currentIndex < listLength - 1 ? currentIndex + 1 : -1
    case 'loop':
      // 单曲循环：返回当前索引
      return currentIndex
    case 'shuffle':
      // 随机播放：随机选择一首（排除当前）
      if (listLength === 1) return 0
      let randomIndex = Math.floor(Math.random() * listLength)
      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * listLength)
      }
      return randomIndex
    default:
      return -1
  }
}

// 播放指定歌曲
const playMusic = (musicId: string) => {
  currentPlayingId.value = musicId
}

// 停止播放
const stopMusic = () => {
  currentPlayingId.value = null
}

// 播放结束处理
const handleMusicEnded = async (musicId: string) => {
  const currentIndex = musicList.value.findIndex((m) => m.id_str === musicId)

  // 如果播放到接近末尾（倒数3首内），且还有更多数据，则预加载
  if (currentIndex >= musicList.value.length - 3 && hasMore.value && !isLoadingMore.value) {
    await getMusicList()
  }

  const nextIndex = getNextIndex(currentIndex)

  if (nextIndex >= 0 && nextIndex < musicList.value.length) {
    // 播放下一首
    currentPlayingId.value = musicList.value[nextIndex].id_str
  } else {
    // 停止播放
    currentPlayingId.value = null
  }
}

// 提供给子组件
provide('musicPlayer', {
  currentPlayingId,
  playMode,
  togglePlayMode,
  playMusic,
  stopMusic,
  handleMusicEnded
})

// 获取收藏音乐列表
const getMusicList = async () => {
  if (!hasMore.value || isLoadingMore.value) return
  isLoadingMore.value = true

  try {
    const res = await apis.getUserCollectMusic(count.value, cursor.value)
    const newMusicList = res.mc_list || []
    musicList.value = musicList.value.concat(newMusicList)
    cursor.value = res.cursor
    hasMore.value = !!res.has_more
  } catch (error) {
    console.error('获取收藏音乐列表失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }
}

onMounted(() => {
  getMusicList()
})

// 无限滚动加载
useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value && hasMore.value && !loading.value) {
      getMusicList()
    }
  },
  { distance: 200 }
)
</script>

<template>
  <Loading :show="loading">
    <div class="collection-music">
      <!-- 空状态 -->
      <user-error
        v-if="!loading && musicList.length === 0"
        icon="no-show-like"
        title="暂无收藏音乐"
        desc="收藏喜欢的音乐，随时聆听"
        class="no-data"
      />

      <!-- 音乐列表 -->
      <template v-if="musicList.length > 0">
        <div ref="musicListRef" class="music-list">
          <MusicItem
            v-for="music in musicList"
            :key="music.id_str"
            :music="music"
          />
        </div>
        <Loading :show="isLoadingMore" />
        <list-footer v-if="!hasMore" />
      </template>
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.collection-music {
  position: relative;

  .music-list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
