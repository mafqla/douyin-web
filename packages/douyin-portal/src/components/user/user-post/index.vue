<script setup lang="ts">
import {} from 'vue'
import UserTabbar2 from '../user-tabbar-2/index.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'
import { VideoList } from '@/components/video-components'

const props = defineProps<{
  //用户id
  user_id: string
}>()
const isLoadingMore = ref(true)
const hasMore = ref(true)
const route = useRoute()
const isLoadingInitial = ref(true)
//是否为空
const isNull = computed(() => {
  if (isLoadingInitial.value) return false // 在初始加载期间，不显示错误信息
  return postList.value.length === 0
})

const postParams = reactive({
  sec_user_id: props.user_id,
  count: 24,
  locate_query: false,
  max_cursor: '0',
  need_time_list: 1
})
const postList = ref<IAwemeInfo[]>([])
// 获取作品列表
const getUserPostList = async () => {
  if (!hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await apis.getUserPost(postParams)
    postParams.max_cursor = res.max_cursor
    postList.value.push(...res.aweme_list)
    isLoadingInitial.value = false
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
// 获取合集列表
const getMixList = async (
  sec_user_id: string,
  count: number,
  cursor: string
) => {
  const res = await apis.getUserMix(sec_user_id, count, cursor)
  // console.log(res)
}

onMounted(() => {
  getUserPostList()
})

useInfiniteScroll(
  window,
  () => {
    if (!isLoadingMore.value) {
      getUserPostList()
    }
  },
  { distance: 600 }
)
</script>
<template>
  <div class="user-post">
    <user-tabbar-2>
      <div class="tabbr-title">
        <div class="title-text"><span>视频</span></div>
      </div>

      <div class="time-list-options">
        <div class="time-list-options-wrap">
          <svg-icon icon="date-icon" class="icon" />
          <div class="time-list-options-text">日期筛选</div>
          <svg-icon icon="down" class="icon down" />
        </div>
      </div>
    </user-tabbar-2>

    <div class="user-post-list">
      <user-error
        icon="empty-list-user"
        title="暂无内容"
        desc="该账号还未发布过作品哦～"
        v-if="isNull"
      />
      <template v-if="!isNull">
        <video-list :videoList="postList" />
        <Loading :show="isLoadingMore" />
        <list-footer v-if="!hasMore" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-post {
  width: 100%;
  position: relative;

  .tabbr-title {
    display: flex;

    .title-text {
      color: var(--color-text-t1);
      align-items: center;
      display: flex;
      cursor: pointer;
      font-size: 13px;
      line-height: 21px;
    }
  }

  .time-list-options {
    height: 100%;
    align-items: center;
    display: flex;
    position: relative;

    &:hover {
      .time-list-options-text,
      .icon {
        color: var(--color-text-t0);
      }
    }

    &-wrap {
      cursor: pointer;
      align-items: center;
      margin-left: 20px;
      display: flex;
      position: relative;

      &:first-child {
        margin-left: 0;
      }
    }
    &-text {
      color: var(--color-text-t3);
      margin-top: 2px;
      font-size: 12px;
      font-weight: 400;
      line-height: 21px;
    }

    .icon {
      color: var(--color-text-t3);
      font-size: 16px;

      &.down {
        margin-top: 1px;
        margin-left: 2px;
      }
    }
  }
}
</style>
