<script setup lang="ts">
import {} from 'vue'
import UserError from '../../user-error/index.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const collectionVideoList = ref<IAwemeInfo[]>([])
// 日期划分
const dateList = ref<any[]>([])

const count = ref(20)
const cursor = ref('')
const getUserCollectVideoList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserCollectVideo(count.value, cursor.value)
    collectionVideoList.value = collectionVideoList.value.concat(res.aweme_list)
    dateList.value = dateList.value.concat(res.aweme_list)
    cursor.value = res.cursor
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
  getUserCollectVideoList()
})
useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getUserCollectVideoList()
    }
  },
  { distance: 600 }
)
</script>
<template>
  <Loading :show="loading">
    <div class="user-collection-video">
      <div class="user-collection-list">
        <user-error
          icon="no-show-like"
          title="喜欢内容不可见"
          desc="该用户已将喜欢设为私密"
          v-if="false"
          class="no-show"
        />
        <template v-if="collectionVideoList.length !== 0">
          <video-list :videoList="collectionVideoList" />
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
