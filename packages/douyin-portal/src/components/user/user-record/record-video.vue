<script setup lang="ts">
import {} from 'vue'
import UserError from '../user-error/index.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const recordVideoList = ref<IAwemeInfo[]>([])
// 日期划分
const dateList = ref<any[]>([])

const count = ref(20)
const max_cursor = ref(0)
const getRecordVideoList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserRecordVideo(count.value, max_cursor.value)
    recordVideoList.value = recordVideoList.value.concat(res.aweme_list)
    dateList.value = dateList.value.concat(res.aweme_date)
    max_cursor.value = res.max_cursor
    loading.value = false
    isLoadingMore.value = false
    // console.log(res)
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
  getRecordVideoList()
})
useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getRecordVideoList()
    }
  },
  { distance: 600 }
)

// 获取到当前显示的视频id
const currentVideoId = ref('')
const getCurrentVideoId = (id: string) => { 
  
}
</script>
<template>
  <Loading :show="loading">
    <div class="user-record-video">
      <user-tabbar-2 style="top: 170px">
        <div class="date-text"></div>
      </user-tabbar-2>

      <div class="user-record-list">
        <user-error
          icon="no-show-like"
          title="喜欢内容不可见"
          desc="该用户已将喜欢设为私密"
          v-if="false"
          class="no-show"
        />
        <template v-if="recordVideoList.length !== 0">
          <video-list :videoList="recordVideoList" />
          <Loading :show="isLoadingMore" />
          <list-footer v-if="!hasMore" />
        </template>
      </div>
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}
.user-record-video {
  position: relative;
}
.date-text {
  width: 100%;
  height: 44px;
  background-color: var(--color-bg-b0);
  color: var(--color-text-t4);
  align-items: center;
  font-size: 13px;
  line-height: 21px;
  display: flex;
  position: relative;
}
.tabbar-2-end {
  height: 44px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0;
  display: flex;
  position: relative;

  .help-icon {
    width: 14px;
    height: 14px;
    margin-left: 20px;
  }
}
</style>
