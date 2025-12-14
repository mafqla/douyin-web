<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useGridScrollToItem } from '@/hooks'
import UserError from '../user-error/index.vue'
import VideoItem from '@/components/video-components/video-list/video-item.vue'
import ModalPlayer from '@/views/modal-player.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const props = defineProps<{
  // 根据传入的值进行判断是否显示点赞列表
  showLikeList: boolean
  // 用户id
  user_id: string
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

onMounted(() => {
  getLikeList()
})

useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getLikeList()
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
        <div class="batch-management" v-if="showLikeList">
          <div class="batch-management-wrap">
            <div class="batch-management-icon">
              <svg-icon icon="batch-management" class="icon" />
              <span class="batch-management-text">批量管理</span>
            </div>
          </div>
          <svg-icon icon="help" class="help-icon" />
        </div>
      </user-tabbar-2>

      <div class="user-like-list">
        <user-error
          icon="no-show-like"
          title="喜欢内容不可见"
          desc="该用户已将喜欢设为私密"
          v-if="!showLikeList"
          class="no-show"
        />
        <template v-if="likeList.length !== 0 && showLikeList">
          <div class="video-list" ref="videoListRef">
            <VideoItem
              v-for="item in likeList"
              :key="item.aweme_id"
              :aweme="item"
              :data-aweme-id="item.aweme_id"
              :disableClickToggle="true"
              @click="handleOpenModal(item)"
            />
          </div>
          <Loading :show="isLoadingMore" />
          <list-footer v-if="!hasMore" />
        </template>
      </div>

      <!-- Modal Player 全屏播放器 -->
      <ModalPlayer
        v-if="showModal"
        :videoList="likeList"
        @close="handleModalClose"
        @loadMore="getLikeList"
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

.video-list {
  width: 100%;
}

// 批量管理
.batch-management {
  height: 44px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0;
  display: flex;
  position: relative;

  .batch-management-wrap {
    display: flex;
    position: relative;
  }

  .batch-management-icon {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    align-items: center;
    display: flex;
    span {
      margin-left: 2px;
    }

    .icon {
      width: 12px;
      height: 12px;
      margin-right: 2px;
    }
  }
  .batch-management-text {
    color: var(--color-text-t3);
    font-size: 12px;
    font-weight: 400;
    line-height: 21px;
  }
  .help-icon {
    width: 14px;
    height: 14px;
    margin-left: 20px;
  }
}
</style>
