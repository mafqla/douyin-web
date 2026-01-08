<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import UserError from '../user-error/index.vue'
import MixItem from '../user-collection/collection-mix/mix-item.vue'
import SidebarModalPlayer from '@/views/sidebar-modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { IMixInfo } from '@/api/tyeps/common/mix'
import apis from '@/api/apis'
import { useSidebarStore } from '@/stores/sidebar'
import { videosCtrolStore } from '@/stores/videos-control'

const props = defineProps<{
  user_id: string
}>()

const route = useRoute()
const router = useRouter()
const sidebarStore = useSidebarStore()
const controlStore = videosCtrolStore()

// 合集相关状态
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const mixList = ref<IMixInfo[]>([])
const cursor = ref('0')

// 获取合集列表
const getMixList = async () => {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true

  try {
    const res = await apis.getUserMix(props.user_id, 20, cursor.value)
    const newMixList = res.mix_infos || []
    mixList.value = mixList.value.concat(newMixList)
    cursor.value = res.cursor || ''
    hasMore.value = !!res.has_more
  } catch (error) {
    console.error('获取合集列表失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 合集播放器相关
const showModalPlayer = ref(false)
const currentVideoList = shallowRef<IAwemeInfo[]>([])

// 打开合集播放器
const openModalPlayer = async (mix: IMixInfo) => {
  try {
    const detailRes = await apis.getMixDetail(mix.mix_id)
    if (!detailRes.mix_info) {
      console.error('获取合集详情失败')
      return
    }

    const videosRes = await apis.getUserMixDetail({
      mix_id: mix.mix_id,
      cursor: 0,
      count: 20
    })

    if (!videosRes.aweme_list?.length) {
      console.error('合集暂无视频')
      return
    }

    const awemeId = videosRes.aweme_list[0].aweme_id
    currentVideoList.value = videosRes.aweme_list

    sidebarStore.setMix(detailRes.mix_info)
    sidebarStore.setCollectionVideoList(videosRes.aweme_list)
    controlStore.isShowComment = false

    showModalPlayer.value = true
    router.push({
      path: route.path,
      query: { ...route.query, modal_id: awemeId }
    })
  } catch (error) {
    console.error('打开合集失败:', error)
  }
}

// 处理合集项点击
const handleMixItemClick = (mix: IMixInfo) => {
  openModalPlayer(mix)
}

// 关闭合集播放器
const handleModalClose = () => {
  showModalPlayer.value = false
  currentVideoList.value = []
  sidebarStore.clearMix()
  sidebarStore.clearVideoLists()
}

onMounted(() => {
  getMixList()
})

useInfiniteScroll(
  window,
  () => {
    if (!loadingMore.value && hasMore.value && !loading.value) {
      getMixList()
    }
  },
  { distance: 600 }
)
</script>

<template>
  <div class="post-mix">
    <Loading :show="loading">
      <user-error
        v-if="!loading && mixList.length === 0"
        icon="empty-list-user"
        title="暂无内容"
        desc="该账号还未创建过合集哦～"
        class="no-show"
      />
      <template v-if="mixList.length > 0">
        <div class="mix-list">
          <MixItem
            v-for="mix in mixList"
            :key="mix.mix_id"
            :mix="mix"
            @select="handleMixItemClick"
          />
        </div>
        <Loading :show="loadingMore" />
        <list-footer v-if="!hasMore" />
      </template>
    </Loading>

    <SidebarModalPlayer
      v-if="showModalPlayer"
      :videoList="currentVideoList"
      @close="handleModalClose"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-mix {
  width: 100%;
  margin-top: 8px;
}

.mix-list {
  display: flex;
  flex-wrap: wrap;
}

.no-show {
  margin: 120px 0;
}
</style>
