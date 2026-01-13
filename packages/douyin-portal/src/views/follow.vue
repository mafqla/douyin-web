<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SwiperControl from '@/components/swiper/swiper-control.vue'
import SwiperVideo from '@/components/swiper/swiper-video.vue'
import LivePreviewPlayer from '@/components/video-player/live-preview-player.vue'
import SidebarModalPlayer from '@/views/sidebar-modal-player.vue'
import { videosCtrolStore } from '@/stores/videos-control'
import { useSidebarStore } from '@/stores/sidebar'
import { userStore } from '@/stores/user'
import apis from '@/api/apis'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { IFollowingUser } from '@/api/tyeps/request_response/followingListRes'
import type { IFollowLiveItem } from '@/api/tyeps/request_response/followLiveFeedRes'

const loading = ref(true)
const list = ref<IAwemeInfo[]>([])
const control = videosCtrolStore()
const sidebarStore = useSidebarStore()
const user = userStore()
const route = useRoute()
const router = useRouter()
const cursor = ref(0)

// 关注列表
const followingList = ref<IFollowingUser[]>([])
const followingLoading = ref(true)
const followingLoadingMore = ref(false)
const followingHasMore = ref(true)
const followingOffset = ref(0)
const selectedUserId = ref<string>('')
const sidebarCollapsed = ref(false)

// 直播列表
const liveList = ref<IFollowLiveItem[]>([])
const selectedLiveItem = ref<IFollowLiveItem | null>(null)
let liveTimer: ReturnType<typeof setInterval> | null = null
const LIVE_REFRESH_INTERVAL = 60000 // 60秒刷新一次

// 获取关注列表（需要考虑直播用户会被过滤，所以要多加载一些）
const getFollowingList = async (isLoadMore = false) => {
  try {
    if (!user.userInfo?.user?.uid) return
    if (isLoadMore && !followingHasMore.value) return

    if (isLoadMore) {
      followingLoadingMore.value = true
    }

    const res = await apis.getFollowingList({
      user_id: user.userInfo.user.uid,
      sec_user_id: user.userInfo.user.sec_uid,
      count: 20,
      offset: followingOffset.value,
      min_time: 0,
      max_time: 0,
      source_type: 4,
      is_top: 1
    })

    if (res?.followings) {
      followingList.value.push(...res.followings)
      // 更新偏移量
      followingOffset.value += res.followings.length
      // 判断是否还有更多
      followingHasMore.value = res.has_more ?? res.followings.length >= 20
    } else {
      followingHasMore.value = false
    }

    followingLoading.value = false
    followingLoadingMore.value = false
  } catch (err) {
    followingLoading.value = false
    followingLoadingMore.value = false
  }
}

// 检查过滤后的列表是否不足30个，如果不足则继续加载
const checkAndLoadMore = async () => {
  // 过滤掉直播用户后的数量
  const liveUserIds = new Set(
    liveList.value.map((item) => item.room?.owner?.id_str)
  )
  const filteredCount = followingList.value.filter(
    (user) => !liveUserIds.has(user.uid)
  ).length

  // 如果过滤后不足30个且还有更多数据，继续加载
  if (
    filteredCount < 30 &&
    followingHasMore.value &&
    !followingLoadingMore.value
  ) {
    await getFollowingList(true)
    // 递归检查
    await checkAndLoadMore()
  }
}

// 获取关注直播列表
const getFollowLiveFeed = async () => {
  try {
    const res = await apis.getFollowLiveFeed('aweme_pc_follow_top')
    if (res?.data?.data) {
      liveList.value = res.data.data
    } else {
      liveList.value = []
    }
    // 直播列表更新后，检查是否需要加载更多关注用户
    await checkAndLoadMore()
  } catch (err) {
    liveList.value = []
  }
}

// 开始定时刷新直播列表
const startLiveRefresh = () => {
  getFollowLiveFeed()
  liveTimer = setInterval(getFollowLiveFeed, LIVE_REFRESH_INTERVAL)
}

// 停止定时刷新
const stopLiveRefresh = () => {
  if (liveTimer) {
    clearInterval(liveTimer)
    liveTimer = null
  }
}

// 关注列表滚动加载
const onFollowingScroll = async (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  // 距离底部 50px 时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    if (!followingLoadingMore.value && followingHasMore.value) {
      // 检查过滤后是否不足30个
      const liveUserIds = new Set(
        liveList.value.map((item) => item.room?.owner?.id_str)
      )
      const filteredCount = followingList.value.filter(
        (user) => !liveUserIds.has(user.uid)
      ).length
      if (filteredCount < 30) {
        await getFollowingList(true)
      }
    }
  }
}

// 获取关注用户的视频数据
const getData = async (count: number) => {
  try {
    const res = await apis.getFollowFeed({
      cursor: cursor.value,
      level: 1,
      count,
      pull_type: 18,
      refresh_type: 18,
      aweme_ids: '',
      room_ids: ''
    })
    loading.value = false
    // 更新游标
    cursor.value = res.cursor
    // 从 data 数组中提取 aweme 信息
    const awemeList =
      res.data?.map((item) => item.aweme as unknown as IAwemeInfo) || []
    list.value.push(...awemeList)
    control.videosNum = list.value.length
  } catch (err) {
    loading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  list.value = []
  loading.value = true
  cursor.value = 0
  control.reset()
  await getData(control.count)
}

// 选择关注用户
const selectUser = async (userItem: IFollowingUser) => {
  selectedUserId.value = userItem.uid
  selectedLiveItem.value = null

  try {
    // 获取用户视频列表
    const res = await apis.getUserPost({
      sec_user_id: userItem.sec_uid,
      max_cursor: '0',
      count: 20,
      locate_query: false
    })

    if (!res?.aweme_list || res.aweme_list.length === 0) {
      return
    }

    const videoList = res.aweme_list
    let targetVideoId: string | null = null

    // 检查是否有未看的视频
    const notSeenIds = userItem.not_seen_item_id_list_v2
    if (notSeenIds && notSeenIds.length > 0) {
      // 找到第一个未看的视频
      const notSeenVideo = videoList.find((v) =>
        notSeenIds.includes(v.aweme_id)
      )
      if (notSeenVideo) {
        targetVideoId = notSeenVideo.aweme_id
      }
    }

    // 如果没有未看视频，找最新的非置顶视频
    if (!targetVideoId) {
      // 找第一个非置顶的视频（is_top !== 1）
      const nonPinnedVideo = videoList.find((v) => !v.is_top || v.is_top !== 1)
      if (nonPinnedVideo) {
        targetVideoId = nonPinnedVideo.aweme_id
      } else {
        // 如果全是置顶视频，就播放第一个
        targetVideoId = videoList[0].aweme_id
      }
    }

    // 设置未看视频 ID 列表到 store
    if (notSeenIds && notSeenIds.length > 0) {
      sidebarStore.setNotSeenItemIds(notSeenIds)
    } else {
      sidebarStore.clearNotSeenItemIds()
    }

    // 设置作品视频列表到 store
    sidebarStore.setWorksVideoList(videoList)
    sidebarStore.setActiveTab('works')

    // 打开 modal player
    showModalPlayer.value = true
    router.push({
      path: route.path,
      query: {
        ...route.query,
        modal_id: targetVideoId
      }
    })
  } catch (err) {
    console.error('获取用户视频列表失败:', err)
  }
}

// Modal Player 相关
const showModalPlayer = ref(false)
const userVideoList = ref<IAwemeInfo[]>([])

// 关闭 modal player
const handleModalClose = async () => {
  showModalPlayer.value = false
  sidebarStore.clearNotSeenItemIds()
  selectedUserId.value = ''
}

// 加载更多用户视频
const handleLoadMoreUserVideos = async () => {
  // 如果需要可以实现加载更多逻辑
}

// 鼠标悬停直播用户
const hoverLiveIndex = ref(-1)
const showLivePreview = ref(false)
let hidePreviewTimer: ReturnType<typeof setTimeout> | null = null

const onLiveItemHover = (item: IFollowLiveItem, index: number) => {
  // 清除隐藏定时器
  if (hidePreviewTimer) {
    clearTimeout(hidePreviewTimer)
    hidePreviewTimer = null
  }
  selectedLiveItem.value = item
  hoverLiveIndex.value = index
  showLivePreview.value = true
}

// 鼠标离开直播用户
const onLiveItemLeave = () => {
  // 延迟隐藏，给用户时间移动到小窗
  hidePreviewTimer = setTimeout(() => {
    showLivePreview.value = false
    selectedLiveItem.value = null
    hoverLiveIndex.value = -1
  }, 100)
}

// 鼠标进入小窗
const onPreviewEnter = () => {
  if (hidePreviewTimer) {
    clearTimeout(hidePreviewTimer)
    hidePreviewTimer = null
  }
}

// 鼠标离开小窗
const onPreviewLeave = () => {
  showLivePreview.value = false
  selectedLiveItem.value = null
  hoverLiveIndex.value = -1
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 监听刷新版本号变化
watch(
  () => control.refreshVersion,
  (newVal, oldVal) => {
    // 只有在非首次变化时才刷新（避免 reset 触发的首次变化）
    if (oldVal !== undefined) {
      refreshData()
    }
  }
)

// 监听 refresh_index 变化，加载更多数据
watch(
  () => control.refresh_index,
  () => {
    if (control.refresh_index > 1) {
      getData(control.count)
    }
  }
)

// 获取头像URL
const getAvatarUrl = (userItem: IFollowingUser) => {
  return (
    userItem.avatar_thumb?.url_list?.[0] ||
    userItem.avatar_medium?.url_list?.[0] ||
    userItem.avatar_larger?.url_list?.[0] ||
    ''
  )
}

// 获取直播用户头像URL
const getLiveAvatarUrl = (liveItem: IFollowLiveItem) => {
  return liveItem.room?.owner?.avatar_thumb?.url_list?.[0] || ''
}

// 关注人数量（排除正在直播的人，保持30个）
const filteredFollowingList = computed(() => {
  const liveUserIds = new Set(
    liveList.value.map((item) => item.room?.owner?.id_str)
  )
  const filtered = followingList.value.filter(
    (user) => !liveUserIds.has(user.uid)
  )
  // 保持30个
  return filtered.slice(0, 30)
})

const followingCount = computed(() => filteredFollowingList.value.length)

// 直播数量
const liveCount = computed(() => liveList.value.length)

// 是否有直播
const hasLive = computed(() => liveList.value.length > 0)

// 获取直播流地址（优先 HLS，兼容性更好）
const getLiveStreamUrl = (item: IFollowLiveItem): string[] => {
  const urls: string[] = []
  const streamUrl = item.room?.stream_url
  const hlsMap = streamUrl?.hls_pull_url_map

  // 优先添加 HLS 流（兼容性更好）
  if (streamUrl?.hls_pull_url) urls.push(streamUrl.hls_pull_url)
  if (hlsMap?.FULL_HD1) urls.push(hlsMap.FULL_HD1)
  if (hlsMap?.HD1) urls.push(hlsMap.HD1)
  if (hlsMap?.SD1) urls.push(hlsMap.SD1)
  if (hlsMap?.SD2) urls.push(hlsMap.SD2)

  // 添加 FLV 流作为备用
  const flvMap = streamUrl?.flv_pull_url
  if (flvMap?.FULL_HD1) urls.push(flvMap.FULL_HD1)
  if (flvMap?.HD1) urls.push(flvMap.HD1)
  if (flvMap?.SD1) urls.push(flvMap.SD1)
  if (flvMap?.SD2) urls.push(flvMap.SD2)

  return [...new Set(urls)]
}

onMounted(async () => {
  document.body.style.position = 'fixed'
  control.reset()
  getData(control.count)
  // 获取直播列表并开始定时刷新
  startLiveRefresh()
  // 首次加载关注列表
  await getFollowingList()
  // 检查是否需要加载更多（确保过滤后有30个）
  await checkAndLoadMore()
})

onBeforeUnmount(() => {
  document.body.style.position = ''
  stopLiveRefresh()
})
</script>

<template>
  <div class="follow-page">
    <!-- 左侧关注人列表 -->
    <div class="following-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header" :class="{ collapsed: sidebarCollapsed }">
        <div v-if="!sidebarCollapsed">
          {{
            hasLive ? `正在直播(${liveCount})` : `精选关注人(${followingCount})`
          }}
        </div>
        <div class="collapse-btn" @click="toggleSidebar">
          <!-- 展开图标 -->
          <svg
            v-if="sidebarCollapsed"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14 5.25H3V6.75H14V5.25ZM3 11.25H14V12.75H3V11.25ZM3 17.25H14V18.75H3V17.25Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20.2616 11.9999L17.0471 16.0423L18.1876 17.0094L21.5302 12.8059C21.9027 12.3374 21.9027 11.6624 21.5302 11.194L18.1876 6.99042L17.0471 7.95755L20.2616 11.9999Z"
              fill="currentColor"
            ></path>
          </svg>
          <!-- 收起图标 -->
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 5.25H21V6.75H10V5.25ZM21 11.25H10V12.75H21V11.25ZM21 17.25H10V18.75H21V17.25Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.73837 11.9999L6.95287 16.0423L5.81244 17.0094L2.46976 12.8059C2.09726 12.3374 2.09726 11.6624 2.46976 11.194L5.81244 6.99042L6.95287 7.95755L3.73837 11.9999Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <div class="sidebar-content" @scroll="onFollowingScroll">
        <!-- 直播列表 -->
        <template v-if="hasLive">
          <ul class="live-list" :class="{ 'collapsed-list': sidebarCollapsed }">
            <li
              v-for="(item, index) in liveList"
              :key="item.room.id_str"
              class="live-item"
              :class="{
                'collapsed-item': sidebarCollapsed,
                active: selectedLiveItem?.room.id_str === item.room.id_str
              }"
              @mouseenter="onLiveItemHover(item, index)"
              @mouseleave="onLiveItemLeave"
            >
              <div class="avatar-wrapper">
                <div
                  class="avatar live-avatar"
                  :class="{ 'collapsed-avatar': sidebarCollapsed }"
                >
                  <img
                    :src="getLiveAvatarUrl(item)"
                    :alt="item.room.owner.nickname"
                  />
                  <span class="live-badge" v-if="!sidebarCollapsed">直播</span>
                </div>
              </div>
              <div class="user-info" v-if="!sidebarCollapsed">
                <div class="nickname">
                  <span>{{ item.room.owner.nickname }}</span>
                </div>
              </div>
            </li>
          </ul>

          <!-- 精选关注人标题 -->
          <div class="section-title" v-if="!sidebarCollapsed">
            精选关注人({{ followingCount }})
          </div>
        </template>

        <Loading :show="followingLoading" :isShowText="false">
          <ul
            class="following-list"
            :class="{ 'collapsed-list': sidebarCollapsed }"
          >
            <li
              v-for="item in filteredFollowingList"
              :key="item.uid"
              class="following-item"
              :class="{
                active: selectedUserId === item.uid,
                'collapsed-item': sidebarCollapsed
              }"
              @click="selectUser(item)"
            >
              <div class="avatar-wrapper">
                <div
                  class="avatar"
                  :class="{ 'collapsed-avatar': sidebarCollapsed }"
                >
                  <img :src="getAvatarUrl(item)" :alt="item.nickname" />
                </div>
              </div>
              <div class="user-info" v-if="!sidebarCollapsed">
                <div class="nickname">
                  <span>{{ item.nickname }}</span>
                </div>
                <div
                  class="unseen-count"
                  v-if="
                    item.not_seen_item_id_list_v2 &&
                    item.not_seen_item_id_list_v2.length > 0
                  "
                >
                  <span
                    >{{
                      item.not_seen_item_id_list_v2.length > 99
                        ? '99+'
                        : item.not_seen_item_id_list_v2.length
                    }}个作品未看</span
                  >
                </div>
              </div>
            </li>
            <!-- 加载更多提示 -->
            <Loading :show="followingLoadingMore" :isShowText="false" />
          </ul>
        </Loading>
      </div>
    </div>

    <!-- 直播小窗预览 -->
    <div
      class="live-preview-popup"
      v-if="showLivePreview && selectedLiveItem"
      @mouseenter="onPreviewEnter"
      @mouseleave="onPreviewLeave"
    >
      <LivePreviewPlayer
        :url="getLiveStreamUrl(selectedLiveItem)"
        :isPlay="true"
      />
    </div>

    <!-- Sidebar Modal Player -->
    <SidebarModalPlayer
      v-if="showModalPlayer"
      :videoList="sidebarStore.worksVideoList"
      @close="handleModalClose"
      @loadMore="handleLoadMoreUserVideos"
    />

    <!-- 右侧视频区域 -->
    <div class="video-content">
      <!-- 视频流 -->
      <Loading :show="loading" :isShowText="true" :center="true">
        <div class="xgplayer-playswitch">
          <swiper-control />
        </div>
        <div class="slide-list" id="slidelist">
          <swiper-video :videoList="list" />
        </div>
      </Loading>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-page {
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-grow: 1;
  height: 878px;
  overflow: hidden;
  position: relative;
}

// 左侧关注人列表
.following-sidebar {
  width: 208px;
  height: 100%;
  border-right: 1px solid var(--color-line-primary);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;

  &.collapsed {
    width: 72px;
  }

  .sidebar-header {
    color: var(--color-text-t3);
    height: 32px;
    width: 100%;
    user-select: none;
    background: 0 0;
    flex-grow: 0;
    flex-shrink: 0;
    margin-bottom: 8px;
    padding: 5px 4px 5px 16px;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    position: relative;
    display: flex;
    align-items: center;

    &.collapsed {
      justify-content: center;
      padding: 5px 4px;
    }

    .header-title {
      flex: 1;
    }

    .collapse-btn {
      cursor: pointer;
      height: 24px;
      width: 24px;
      z-index: 1;
      align-items: center;
      display: flex;
      position: absolute;
      top: 4px;
      right: 18px;

      svg {
        width: 24px;
        height: 24px;
        color: var(--color-text-t3);

        &:hover {
          color: var(--color-text-t0);
        }
      }
    }
  }

  .sidebar-content {
    width: 100%;
    flex-direction: column;
    flex: 1;
    align-items: center;
    padding-bottom: 8px;
    padding-left: 12px;
    display: flex;
    position: relative;
    overflow-x: auto;
    overflow-y: scroll;

    .following-list-header {
      padding: 12px;
      font-size: 13px;
      color: var(--color-text-t2);
      font-weight: 500;
      display: none;
    }
  }
}

.following-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-line-primary);
    border-radius: 2px;
  }
}

// 直播列表
.live-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.live-item {
  cursor: pointer;
  transition: background-color 0.2s;
  height: 48px;
  width: 184px;
  user-select: none;
  align-items: center;
  margin-top: 4px;
  padding-left: 4px;
  display: flex;
  position: relative;

  &:hover {
    background-color: var(--color-fill-hover);
    border-radius: 12px;
  }

  &.collapsed-item {
    width: 48px;
    justify-content: center;
    padding-left: 0;
    padding-right: 0;

    .avatar-wrapper {
      margin-right: 0;
    }
  }

  .avatar-wrapper {
    flex-shrink: 0;
    position: relative;

    .live-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #fe2c55;
      box-sizing: border-box;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.collapsed-avatar {
        width: 36px;
        height: 36px;
      }
    }

    .live-badge {
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      background: #fe2c55;
      color: #fff;
      font-size: 10px;
      padding: 1px 4px;
      border-radius: 4px;
      line-height: 1.2;
      white-space: nowrap;
    }
  }

  .user-info {
    flex-direction: column;
    margin-left: 8px;
    display: flex;

    .nickname {
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      color: var(--color-text-t1);
      -webkit-box-orient: vertical;
      flex: 1;
      font-size: 13px;
      line-height: 21px;
      display: -webkit-box;
      overflow: hidden;
    }
  }
}

// 分区标题
.section-title {
  width: 100%;
  padding: 12px 4px 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-t3);
}

.following-item {
  cursor: pointer;
  transition: background-color 0.2s;
  height: 48px;
  width: 184px;
  user-select: none;
  align-items: center;
  margin-top: 4px;
  padding-left: 4px;
  display: flex;
  position: relative;

  &:hover {
    cursor: pointer;
    background-color: var(--color-fill-hover);
    border-radius: 12px;
  }

  &.collapsed-item {
    width: 48px;
    justify-content: center;
    padding-left: 0;
    padding-right: 0;

    &:hover {
      cursor: pointer;
      background-color: var(--color-fill-hover);
      border-radius: 12px;
    }

    .avatar-wrapper {
      margin-right: 0;
    }
  }

  .avatar-wrapper {
    flex-shrink: 0;

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid var(--color-line-l3);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.collapsed-avatar {
        width: 36px;
        height: 36px;
      }
    }
  }

  .user-info {
    flex-direction: column;
    margin-left: 8px;
    display: flex;

    .nickname {
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      color: var(--color-text-t1);
      -webkit-box-orient: vertical;
      flex: 1;
      font-size: 13px;
      line-height: 21px;
      display: -webkit-box;
      overflow: hidden;
    }

    .unseen-count {
      background: var(--color-fill-tag-grey);
      color: var(--color-text-t2);
      height: 16px;
      width: -moz-fit-content;
      width: fit-content;
      border-radius: 4px;
      margin-top: 1px;
      line-height: 14px;

      span {
        font-size: 12px;
        line-height: 1;
        display: inline-block;
        transform: scale(0.85);
      }
    }
  }
}

// 右侧视频区域
.video-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;

  .xgplayer-playswitch {
    flex-shrink: 0;
  }

  @media only screen and (min-width: 580px) {
    .xgplayer-playswitch {
      position: absolute;
      right: 13px;
      top: calc(50% + 25px);
      transform: translateY(calc(-50% - 30px));
      z-index: 2;
    }
  }

  @media only screen and (max-width: 580px) {
    .xgplayer-playswitch {
      display: none;
    }
  }

  .slide-list {
    display: flex;
    flex: 1 1;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
}

// 直播小窗预览
.live-preview-popup {
  position: absolute;
  left: 208px;
  top: 40px;
  width: 160px;
  height: 284px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;

  :deep(.live-preview-player) {
    border-radius: 8px;

    // 隐藏不需要的元素
    .live-preview-btn,
    .live-info,
    .live-more,
    .stream-indicator,
    .xgplayer-controls,
    .xgplayer-progress,
    .xg-inner-controls {
      display: none !important;
    }
  }
}

// 响应式处理
@media screen and (max-width: 768px) {
  .following-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    height: 100%;
  }
}
</style>
