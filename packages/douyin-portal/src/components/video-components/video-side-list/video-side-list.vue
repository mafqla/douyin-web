<script setup lang="ts">
import apis from '@/api/apis'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { IUser } from '@/api/tyeps/common/user'
import { useCount, useGridScrollToItem } from '@/hooks'
import { vInfiniteScroll } from '@vueuse/components'
import { onMounted, onUnmounted, ref, watch, computed, reactive, nextTick } from 'vue'
import SideItem from './side-item.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()

const props = defineProps({
  user_sec_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  aweme_id: {
    type: String,
    required: true
  }
})

const userInfo = ref<IUser>({} as IUser)
const scrollContainerRef = ref<HTMLElement | null>(null)

// 请求用户信息
const getUserInfo = async (user_id: string) => {
  const { user } = await apis.getUserOtherInfo(props.user_sec_id)
  userInfo.value = user
}

const isLoadingMore = ref(false)
const isLoadingPrev = ref(false)
const hasMore = ref(true)
const hasPrev = ref(false)

// 向下加载游标
const maxCursor = ref('0')
// 向上加载游标
const forwardAnchorCursor = ref(0)
const forwardEndCursor = ref(0)

// 视频列表数据
const postList = ref<IAwemeInfo[]>([])

// 同步视频列表到 store
watch(
  postList,
  (newList) => {
    if (newList && newList.length > 0) {
      sidebarStore.setWorksVideoList(newList)
    }
  },
  { deep: true }
)

// 当前视频 ID（用于滚动定位）
const currentId = ref<string | null>(props.aweme_id)

// 列表容器 ref
const listContainerRef = ref<HTMLElement | null>(null)

// 使用滚动定位 hook
const { scrollToItem } = useGridScrollToItem({
  containerRef: listContainerRef,
  currentId,
  items: postList,
  idKey: 'aweme_id',
  autoScroll: false,
  behavior: 'smooth',
  block: 'start'
})

// 初始化加载（定位到当前视频）
const initLoad = async () => {
  // 参数校验
  if (!props.user_sec_id || !props.aweme_id) return

  isLoadingMore.value = true
  try {
    // 第一次调用：获取最新列表，不定位
    const firstRes = await apis.getUserPost({
      sec_user_id: props.user_sec_id,
      count: 24,
      max_cursor: '0',
      locate_query: false,
      locate_item_id: props.aweme_id,
      show_live_replay_strategy: 1,
      need_time_list: 0,
      time_list_query: 0
    })

    // 检查当前视频是否在第一次返回的列表中
    const currentInFirst = firstRes.aweme_list.some(
      (item) => item.aweme_id === props.aweme_id
    )

    if (currentInFirst) {
      // 当前视频在第一页，直接使用
      postList.value = firstRes.aweme_list
      maxCursor.value = firstRes.max_cursor
      hasMore.value = firstRes.has_more
    } else if ((firstRes as any).locate_item_cursor) {
      // 当前视频不在第一页，需要第二次调用定位
      const locateRes = await apis.getUserPost({
        sec_user_id: props.user_sec_id,
        count: 10,
        max_cursor: firstRes.max_cursor,
        locate_query: true,
        locate_item_id: props.aweme_id,
        locate_item_cursor: (firstRes as any).locate_item_cursor
      })

      // 合并列表（第一次 + 第二次）
      const allList = [...firstRes.aweme_list, ...locateRes.aweme_list]
      // 去重
      postList.value = allList.filter(
        (item, index, self) =>
          self.findIndex((t) => t.aweme_id === item.aweme_id) === index
      )

      // 设置向下加载游标
      maxCursor.value = locateRes.max_cursor
      hasMore.value = locateRes.has_more

      // 设置向上加载游标
      if ((locateRes as any).min_cursor) {
        forwardAnchorCursor.value = Number((locateRes as any).min_cursor)
        forwardEndCursor.value = Number(firstRes.max_cursor)
        hasPrev.value = (locateRes as any).forward_has_more === 1
      }
    } else {
      // 没有 locate_item_cursor，直接使用第一次结果
      postList.value = firstRes.aweme_list
      maxCursor.value = firstRes.max_cursor
      hasMore.value = firstRes.has_more
    }

    // 滚动到当前视频位置
    await nextTick()
    scrollToItem(props.aweme_id)
  } catch (error) {
    console.error('initLoad error:', error)
    hasMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}



// 获取作品列表（向下加载更多）
const getUserPostList = async () => {
  if (!props.user_sec_id || !hasMore.value || isLoadingMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserPost({
      sec_user_id: props.user_sec_id,
      count: 20,
      max_cursor: maxCursor.value,
      locate_query: false,
      locate_item_id: props.aweme_id,
      show_live_replay_strategy: 1,
      need_time_list: 0,
      time_list_query: 0
    })

    maxCursor.value = res.max_cursor
    postList.value.push(...res.aweme_list)
    hasMore.value = res.has_more
  } catch (error) {
    hasMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

// 向上滚动加载更早的视频
const loadPrevVideos = async () => {
  if (!hasPrev.value || isLoadingPrev.value || !forwardAnchorCursor.value) return

  isLoadingPrev.value = true
  try {
    const res = await apis.getUserPost({
      sec_user_id: props.user_sec_id,
      count: 20,
      max_cursor: String(forwardAnchorCursor.value),
      locate_query: false,
      locate_item_id: props.aweme_id,
      forward_anchor_cursor: forwardAnchorCursor.value,
      forward_end_cursor: forwardEndCursor.value,
      show_live_replay_strategy: 1,
      need_time_list: 0,
      time_list_query: 0
    })

    if (res.aweme_list.length > 0) {
      // 记录当前滚动位置
      const scrollContainer = scrollContainerRef.value
      const prevScrollHeight = scrollContainer?.scrollHeight || 0

      // 将新数据插入到列表前面
      postList.value.unshift(...res.aweme_list)

      // 更新向上加载游标（使用 min_cursor）
      const minCursor = (res as any).min_cursor
      if (minCursor && Number(minCursor) > 0) {
        forwardAnchorCursor.value = Number(minCursor)
      } else {
        hasPrev.value = false
      }

      // 检查是否还有更多
      if ((res as any).forward_has_more === 0) {
        hasPrev.value = false
      }

      // 保持滚动位置
      await nextTick()
      if (scrollContainer) {
        const newScrollHeight = scrollContainer.scrollHeight
        scrollContainer.scrollTop = newScrollHeight - prevScrollHeight
      }
    } else {
      hasPrev.value = false
    }
  } catch (error) {
    hasPrev.value = false
  } finally {
    isLoadingPrev.value = false
  }
}

// 处理滚动事件，检测是否滚动到顶部
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.scrollTop < 100 && hasPrev.value && !isLoadingPrev.value) {
    loadPrevVideos()
  }
}

// 获取合集列表
const getMixList = async (
  sec_user_id: string,
  count: number,
  cursor: string
) => {
  const res = await apis.getUserMix(sec_user_id, count, cursor)
}

const observer = ref<IntersectionObserver | null>(null)
const target = ref(null)

onMounted(() => {
  // 初始化加载
  initLoad()

  // 创建一个观察者对象并传入回调函数
  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      getUserInfo(props.user_sec_id)
      getMixList(props.user_sec_id, 12, '0')
      if (observer.value && target.value) {
        observer.value.unobserve(target.value)
      }
    }
  })

  if (target.value) {
    observer.value.observe(target.value)
  }
})

onUnmounted(() => {
  if (observer.value && target.value) {
    observer.value.unobserve(target.value)
  }
})
</script>
<template>
  <div class="video-side-list" ref="target">
    <div class="side-list-header">
      <div class="side-list-header-info">
        <a :href="`/user/${props.user_sec_id}`" target="_blank">
          <div class="info-author">
            <span>@</span>
            <span>{{ props.username }}</span>
            <svg-icon icon="side-list-right" class="icon" />
          </div>
          <div class="info-number">
            {{ useCount(userInfo.follower_count) }}粉丝
            <span></span>
            {{ useCount(userInfo.total_favorited) }}获赞
          </div>
        </a>
      </div>
      <div class="side-list-header-btn">
        <button class="btn">关注</button>
      </div>
    </div>
    <div class="side-list-content">
      <div class="user-post-list">
        <div
          ref="scrollContainerRef"
          class="scroll-content"
          data-scrollable
          v-infinite-scroll="[getUserPostList, { distance: 10 }]"
          @scroll="handleScroll"
        >
          <!-- 顶部加载提示 -->
          <Loading :show="isLoadingPrev" />

          <div ref="listContainerRef" class="list-container">
            <side-item
              v-for="item in postList"
              :key="item.aweme_id"
              :item="item"
              :aweme_id="props.aweme_id"
            />
          </div>

          <!-- 底部加载提示 -->
          <Loading :show="isLoadingMore" />
          <list-footer v-if="!hasMore" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-side-list {
  height: 100%;
  flex-direction: column;
  display: flex;

  .side-list-header {
    -webkit-app-region: no-drag;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.06);
    height: 70px;
    margin-bottom: 4px;

    .side-list-header-info {
      display: flex;
      align-items: center;

      a {
        display: flex;
        flex-direction: column;
        height: 46px;
        justify-content: space-between;

        .info-author {
          align-items: center;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          height: 22px;
          font-size: 14px;
          font-weight: 500;
          max-width: unset;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .icon {
            width: 14px;
            height: 14px;
            color: rgba(255, 255, 255, 0.5);
          }
        }

        .info-number {
          align-items: center;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          font-size: 12px;
          font-weight: 400;
          height: 20px;

          span {
            border-left: 1px solid;
            border-color: #f2f2f4;
            display: block;
            height: 10px;
            margin: 0 8px;
            width: 0;
            font-size: 16px;
            font-weight: 500;
          }
        }
      }
    }

    .side-list-header-btn {
      align-items: center;
      display: flex;
      margin: 0 -8px 0 0;

      .btn {
        display: flex;
        font-size: 12px;
        height: 28px;
        line-height: 28px;
        justify-content: center;
        margin-right: 8px;
        min-width: 49px;
        padding: 0 8px;
        text-align: center;
        border-radius: 4px;

        background-color: #fe2c55;
        color: #fff;
        text-shadow: none;
        border: none;

        &:hover {
          background-color: rgba(210, 27, 70, 1);
        }
      }
    }
  }

  .side-list-content {
    margin: 16px -16px 0;
    height: 100%;
    -ms-overflow-style: none;
    overflow: hidden;
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
    flex: 1;

    .user-post-list {
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      .scroll-content {
        outline: none;
        position: relative;
        overflow-x: hidden;
        overflow-y: scroll;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
        margin-right: 4px;
        padding: 0 4px 0 16px;
      }
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .side-list-header {
    height: unset !important;
    margin: 0 !important;
    padding: calc(0.714286vw + 5.71429px) 0 !important;

    .info-author {
      font-size: calc(0.625vw + 5px) !important;
      .icon {
        width: calc(0.625vw + 5px) !important;
        height: calc(0.625vw + 5px) !important;
      }
    }
    .info-number {
      font-size: calc(0.357143vw + 6.85714px) !important;
    }
  }
}
@media screen and (min-width: 2560px) {
  .side-list-header {
    height: unset !important;
    margin: 0 !important;
    padding: 24px 0 !important;

    .info-author {
      font-size: 21px !important;
      .icon {
        width: 21px !important;
        height: 21px !important;
      }
    }
    .info-number {
      font-size: 16px !important;
    }
  }
}
</style>
