<script setup lang="ts">
import {} from 'vue'
import UserError from '../user-error/index.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import apis from '@/api/apis'

const props = defineProps<{
  //根据传入的值进行判断是否显示点赞列表
  showLikeList: boolean
  //用户id
  user_id: string
}>()
const loading = ref(true)
const isLoadingMore = ref(true)
const hasMore = ref(true)
const likeList = ref<IAwemeInfo[]>([])

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
          <video-list :videoList="likeList" />
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
.user-like {
  position: relative;
}
//批量管理
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
