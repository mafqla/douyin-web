<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { userStore } from '@/stores/user'
import apis from '@/api/apis'

interface VideoPreview {
  cover: string
  title: string
  id: string
}

//是否登录
let isLogin: any = ref(false)
const src = ref('')
const store = userStore()
const likeVideos = ref<VideoPreview[]>([])
const collectVideos = ref<VideoPreview[]>([])
const historyVideos = ref<VideoPreview[]>([])
const watchLaterVideos = ref<VideoPreview[]>([])
const myPostVideos = ref<VideoPreview[]>([])
const watchLaterCount = ref<number>(0)

watchEffect(() => {
  // console.log(store.isLogin())
  isLogin.value = store.isLogin
  src.value = store.userInfo.user.avatar_300x300.url_list[0]
})

// 获取喜欢的视频列表（前3个）
const fetchLikeVideos = async () => {
  try {
    const res = await apis.getUserLike({
      sec_user_id: store.userInfo.user.sec_uid,
      count: 3,
      max_cursor: 0,
      min_cursor: 0
    })
    if (res.aweme_list && res.aweme_list.length > 0) {
      likeVideos.value = res.aweme_list.slice(0, 3).map((item) => ({
        id: item.aweme_id,
        cover: item.video.cover.url_list[0],
        title: item.desc || '无标题'
      }))
    }
  } catch (error) {
    console.error('获取喜欢视频失败:', error)
  }
}

// 获取收藏的视频列表（前3个）
const fetchCollectVideos = async () => {
  try {
    const res = await apis.getUserCollectVideo(3, 0)
    if (res.aweme_list && res.aweme_list.length > 0) {
      collectVideos.value = res.aweme_list.slice(0, 3).map((item) => ({
        id: item.aweme_id,
        cover: item.video.cover.url_list[0],
        title: item.desc || '无标题'
      }))
    }
  } catch (error) {
    console.error('获取收藏视频失败:', error)
  }
}

// 获取观看历史视频列表（前3个）
const fetchHistoryVideos = async () => {
  try {
    const res = await apis.getUserRecordVideo(3, 0)
    if (res.aweme_list && res.aweme_list.length > 0) {
      historyVideos.value = res.aweme_list.slice(0, 3).map((item) => ({
        id: item.aweme_id,
        cover: item.video.cover.url_list[0],
        title: item.desc || '无标题'
      }))
    }
  } catch (error) {
    console.error('获取观看历史失败:', error)
  }
}

// 获取稍后再看视频列表（前3个）
const fetchWatchLaterVideos = async () => {
  try {
    const res = await apis.getWatchLaterList(0)
    if (res.items && res.items.length > 0) {
      watchLaterVideos.value = res.items.slice(0, 3).map((item: any) => ({
        id: item.aweme_id,
        cover: item.video.cover.url_list[0],
        title: item.desc || '无标题'
      }))
      watchLaterCount.value = res.items.length
    }
  } catch (error) {
    console.error('获取稍后再看失败:', error)
  }
}

// 获取我的作品列表（前3个）
const fetchMyPostVideos = async () => {
  try {
    const res = await apis.getUserPost({
      sec_user_id: store.userInfo.user.sec_uid,
      count: 3,
      max_cursor: '0',
      locate_query: false
    })
    if (res.aweme_list && res.aweme_list.length > 0) {
      myPostVideos.value = res.aweme_list.slice(0, 3).map((item) => ({
        id: item.aweme_id,
        cover: item.video.cover.url_list[0],
        title: item.desc || '无标题'
      }))
    }
  } catch (error) {
    console.error('获取我的作品失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  if (store.isLogin) {
    fetchLikeVideos()
    fetchCollectVideos()
    fetchHistoryVideos()
    fetchWatchLaterVideos()
    fetchMyPostVideos()
  }
})
</script>
<template>
  <div class="header-right-avatar">
    <el-popover :show-arrow="false" placement="bottom-end">
      <template #reference>
        <dy-avatar :src="src" size="small" />
      </template>
      <template #default>
        <user-popup
          :isLogin="true"
          :src="src"
          :nickname="store.userInfo.user.nickname"
          :likeCount="store.userInfo.user.favoriting_count"
          :followingsCount="store.userInfo.user.following_count"
          :followersCount="store.userInfo.user.follower_count"
          :postsCount="store.userInfo.user.apple_account || 0"
          :collectCount="
            store.userInfo.user_collect_count.collect_count_list[0]
              .collect_count
          "
          :watchLaterCount="watchLaterCount"
          :likeVideos="likeVideos"
          :collectVideos="collectVideos"
          :historyVideos="historyVideos"
          :watchLaterVideos="watchLaterVideos"
          :myPostVideos="myPostVideos"
          @logout="store.logout()"
        />
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.header-right-avatar {
  width: 32px;
  height: 32px;
  margin-left: 16px;
}
</style>
<style lang="scss">
.el-popover,
.el-popover.el-popper,
.el-popper.is-light {
  width: 0 !important;
  height: 0 !important;
  border: none !important;
  padding: 0;
}
</style>
