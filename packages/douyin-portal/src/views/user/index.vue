<script setup lang="ts">
import apis from '@/api/apis'
import type { IUserDetailRes } from '@/api/tyeps/request_response/userDetailRes'
import ErrorPage from '@/components/common/error-page/index.vue'
import Loading from '@/components/common/loading.vue'
import { DyButton } from '@/components/ui'
import {
  UserLike,
  UserPost,
  UserHeader,
  UserPage,
  UserTab
} from '@/components/user'

// 滚动监听
const { y } = useScroll(window)
const isScroll = ref(false)

watchEffect(() => {
  if (y.value > 160) {
    isScroll.value = true
  } else {
    isScroll.value = false
  }
})

// 获取url
const route = useRoute()
const userId = route.params.id as string
const userInfo = ref<IUserDetailRes>({} as IUserDetailRes)
const isLoading = ref(true)
// 获取用户信息
const getUserInfo = async () => {
  const res = await apis.getUserOtherInfo(userId)
  userInfo.value = res
  const metaTitle = computed(() => {
    return userInfo.value.user?.nickname
      ? `${userInfo.value.user?.nickname}的抖音 - 抖音`
      : ``
  })
  document.title = metaTitle.value
  isLoading.value = false
}

onMounted(() => {
  getUserInfo()
})

const backgroundUrl = computed(() => {
  if (userInfo.value.user) {
    return userInfo.value.user?.cover_url[0]?.url_list[0]
  } else {
    return ''
  }
})
onBeforeUnmount(() => {
  document.title = '抖音-记录美好生活'
})

const router = useRouter()
const tabs = ['posts', 'like', 'favorite_collection', 'record', 'watch_later']
const activeTab = ref()
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  //添加路由
  router.push({
    query: {
      showTab: tab
    }
  })
  // 滚动到顶部
  window.scrollTo(0, 0)
}

watchEffect(() => {
  activeTab.value = route.query.showTab || 'posts'
})
</script>
<template>
  <loading
    :show="isLoading"
    :isShowText="true"
    text="加载中"
    :center="true"
    :style="{
      height: '100vh',
      position: 'static',
      margin: 'unset',
      transform: 'unset'
    }"
  >
    <error-page
      :show="userInfo.status_code !== 2"
      title="用户不存在"
      image="notFound-image"
      :style="{ height: '100vh' }"
    >
      <template #default>
        <user-page :backgroundurl="backgroundUrl">
          <template #user-header>
            <user-header :userInfo="userInfo">
              <div class="share-box">
                <div class="share-btn">
                  <svg-icon icon="more" class="icon" />
                </div>
                <div class="share-btn">
                  <span class="share-text">分享主页</span>
                </div>
              </div>
              <div class="user-action">
                <DyButton
                  class="follow-btn"
                  :class="{ follow: !userInfo.user?.follow_status }"
                  :theme="userInfo.user?.follow_status ? 'light' : 'solid'"
                  type="secondary"
                >
                  {{ userInfo.user?.follow_status ? '已关注' : '关注' }}
                </DyButton>
                <DyButton class="message-btn" theme="light" type="secondary"
                  >私信</DyButton
                >
              </div>
            </user-header>
          </template>

          <template #user-content>
            <user-tab
              :tabs="tabs"
              :activeTab="activeTab"
              :onTabChange="handleTabChange"
            >
              <template v-slot:posts>
                <h2 class="tabs-title">
                  <span class="tabs-text">作品</span>
                  <div class="user-tabs-count">
                    {{ userInfo.user?.aweme_count }}
                  </div>
                </h2>
              </template>
              <template v-slot:like>
                <span class="tabs-text">喜欢</span>
                <div
                  class="user-tabs-count"
                  v-if="userInfo.user?.show_favorite_list"
                >
                  {{ userInfo.user?.favoriting_count }}
                </div>
                <div
                  class="user-lock"
                  v-if="!userInfo.user?.show_favorite_list"
                >
                  <svg-icon icon="lock" class="icon" />
                </div>
              </template>
              <template v-slot:tabs-item-left>
                <div v-if="isScroll" class="private-message-btn">
                  <img
                    class="user-avatar"
                    :src="userInfo.user?.avatar_300x300.url_list[0]"
                    :alt="userInfo.user?.nickname"
                  />
                  <span class="message-text">私信</span>
                </div>
              </template>
              <template v-slot:taba-content>
                <user-post
                  :user_id="userId"
                  :uid="userInfo.user?.uid"
                  v-if="activeTab === 'posts'"
                />
                <user-like
                  :user_id="userId"
                  :uid="userInfo.user.uid"
                  v-if="activeTab === 'like'"
                  :show-like-list="userInfo.user.show_favorite_list"
                />
              </template>
            </user-tab>
          </template>
        </user-page>
      </template>
    </error-page>
  </loading>
</template>

<style lang="scss" scoped>
.share-box {
  width: 100%;
  flex-direction: row-reverse;
  display: flex;
  .share-btn {
    width: auto;
    background: 0 0;
    min-width: unset !important;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    height: 26px;
    margin: 0 0 0 8px;
    padding: 0;
    cursor: pointer;

    display: flex;
    align-items: center;
    user-select: none;
    .share-text {
      color: var(--color-text-t1);
    }
    .icon {
      color: var(--color-text-t1);
      width: 36px;
      height: 26px;
    }
  }
}
.user-action {
  margin-left: auto;
  display: flex;
}
.follow-btn {
  background: var(--btn-bg);
  color: var(--btn-color);
  margin: 0 8px 0 0;
  border-radius: 12px;
  height: 33px;
  &:hover {
    background: var(--btn-bg-hover);
    color: var(--btn-color);
  }

  &.follow {
    background: var(--color-primary);
  }
}

.message-btn {
  background: var(--btn-bg);
  color: var(--btn-color);
  border-radius: 12px;
  height: 33px;
  &:hover {
    background: var(--btn-bg-hover);
    color: var(--btn-color);
  }
}

.private-message-btn {
  width: 104px;
  height: 40px;
  cursor: pointer;
  align-items: center;
  display: flex;
  background: var(--color-bg-b3);
  border-radius: 20px;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  .user-avatar {
    width: 32px;
    height: 32px;
    margin-left: 4px;
    border-radius: 50%;
  }
  .message-text {
    color: var(--color-text-t3);
    margin-left: 16px;
    font-size: 14px;
    line-height: 22px;
  }
}
.tabs-title {
  align-items: center;
  font-weight: 400;
  display: flex;
}
.tabs-text,
.user-tabs-count {
  margin-right: 6px;
  font-size: 18px;
  line-height: 26px;
}
.user-lock {
  margin-top: -2px;

  .icon {
    width: 14px;
    height: 16px;
  }
}
</style>
