<script setup lang="ts">
import {} from 'vue'
import UserError from '../../user-error/index.vue'
import apis from '@/api/apis'
import type { ILVideoHistoryItem } from '@/api/tyeps/request_response/vsRecord'
import EntertainmentItem from './entertainment-item.vue'

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const recordVideoList = ref<ILVideoHistoryItem[]>([])

const count = ref(20)
const cursor = ref(0)
const getUserRecordVsList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserRecordVs(count.value, cursor.value)
    recordVideoList.value = recordVideoList.value.concat(
      res.lvideo_history_list
    )
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
  getUserRecordVsList()
})
useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getUserRecordVsList()
    }
  },
  { distance: 600 }
)
</script>
<template>
  <Loading :show="loading">
    <div class="user-record-vs">
      <div class="user-record-list">
        <user-error
          icon="no-show-like"
          title="喜欢内容不可见"
          desc="该用户已将喜欢设为私密"
          v-if="false"
          class="no-show"
        />
        <template v-if="recordVideoList.length !== 0">
          <div class="date-text">今天</div>
          <div
            class="user-record-item"
            v-for="item in recordVideoList"
            :key="item.album_id"
          >
            <entertainment-item :item />
          </div>
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
.user-record-vs {
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
