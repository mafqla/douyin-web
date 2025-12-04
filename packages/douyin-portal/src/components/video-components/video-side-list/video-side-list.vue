<script setup lang="ts">
import apis from '@/api/apis'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { IUser } from '@/api/tyeps/common/user'
import { useCount } from '@/hooks'
import { vInfiniteScroll } from '@vueuse/components'
import { onMounted, ref } from 'vue'
import SideItem from './side-item.vue'

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
// 请求用户信息
const getUserInfo = async (user_id: string) => {
  const { user } = await apis.getUserOtherInfo(props.user_sec_id)
  // console.log(user)
  userInfo.value = user
}

const isLoadingMore = ref(true)
const hasMore = ref(true)
const postParams = reactive({
  sec_user_id: props.user_sec_id,
  count: 24,
  locate_item_id: props.aweme_id,
  locate_query: false,
  max_cursor: '0',
  need_time_list: 0
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

const observer = ref<IntersectionObserver | null>(null)
const target = ref(null)

onMounted(() => {
  // 创建一个观察者对象并传入回调函数
  observer.value = new IntersectionObserver((entries) => {
    // 如果元素进入可视区域
    if (entries[0].isIntersecting) {
      getUserInfo(props.user_sec_id)
      getMixList(props.user_sec_id, 12, '0')
      // 一旦数据被加载，可以停止观察
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
  // 组件卸载时，停止观察
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
          class="scroll-content"
          data-scrollable
          v-infinite-scroll="[getUserPostList, { distance: 10 }]"
        >
          <side-item
            v-for="item in postList"
            :key="item.aweme_id"
            :item="item"
            :aweme_id="props.aweme_id"
          />
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
      // flex: 1 1;
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
          // max-width: 200px;
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
          // color: #161823;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          font-size: 12px;
          font-weight: 400;
          height: 20px;

          span {
            border-left: 1px solid;
            border-color: #f2f2f4;
            // border-color: rgba(242, 242, 243, 0.08);
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
