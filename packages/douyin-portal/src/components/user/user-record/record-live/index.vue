<script setup lang="ts">
import {} from 'vue'
import UserError from '../../user-error/index.vue'
import apis from '@/api/apis'
import type { ILiveRecordItem } from '@/api/tyeps/request_response/liveRecordRes'
import recordLiveItem from './record-live-item.vue'

const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const recordList = ref<ILiveRecordItem[]>([])

const max_time = ref(0)
const getUserRecordLiveList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserRecordLive(max_time.value)
    recordList.value = recordList.value.concat(res.data)
    max_time.value = res.extra.max_time
    loading.value = false
    isLoadingMore.value = false
    // console.log(res)
    // console.log(recordList.value)
    if (!res.extra.has_more) {
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
  getUserRecordLiveList()
})
useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getUserRecordLiveList()
    }
  },
  { distance: 600 }
)

interface IRecordListGroup {
  date: ILiveRecordItem
  arr: ILiveRecordItem[]
}
const splitArrByType = (arr: ILiveRecordItem[]): IRecordListGroup[] => {
  let result: IRecordListGroup[] = []
  let currentGroup: ILiveRecordItem[] = []
  let currentDate: ILiveRecordItem | null = null

  for (const item of arr) {
    if (item.type === 11) {
      if (currentGroup.length > 0) {
        // 当前分组不为空，保存当前分组
        result.push({ date: currentDate!, arr: currentGroup })
        currentGroup = []
      }
      currentDate = item // 更新当前的 date 对象
    } else {
      currentGroup.push(item)
    }
  }

  // 将最后一个组添加到结果中
  if (currentGroup.length > 0 && currentDate !== null) {
    result.push({ date: currentDate, arr: currentGroup })
  }

  return result
}

const recordListGroup = ref<IRecordListGroup[]>()
watchEffect(() => {
  recordListGroup.value = splitArrByType(recordList.value)
  console.log(recordListGroup)
})
</script>
<template>
  <Loading :show="loading">
    <div class="user-record-vs">
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
        <template v-if="recordListGroup?.length !== 0">
          <record-live-item
            v-for="(item, index) in recordListGroup"
            :key="index"
            :item="item"
          />
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
