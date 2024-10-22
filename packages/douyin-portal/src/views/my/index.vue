<script setup lang="ts">
import { userStore } from '@/stores/user'
import {
  UserLike,
  UserPost,
  UserHeader,
  UserPage,
  UserTab,
  userModal,
  UserRecord,
  UserCollection
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
const store = userStore()
const metaTitle = computed(() => {
  return store.userInfo.user.nickname
    ? `${store.userInfo.user.nickname}的抖音 - 抖音`
    : `抖音-记录美好生活`
})
document.title = metaTitle.value
onBeforeUnmount(() => {
  document.title = '抖音-记录美好生活'
})
//编辑资料
const open = ref(false)
const userInfo = ref({
  username: '',
  signature: '',
  avatar: ''
})
const edit = () => {
  open.value = true
  userInfo.value.username = store.userInfo.user.nickname
  userInfo.value.signature = store.userInfo.user.signature
  userInfo.value.avatar = store.userInfo.user.avatar_300x300.url_list[0]
}
const route = useRoute()
const router = useRouter()
const tabs = ['posts', 'like', 'favorite_collection', 'record', 'watch_later']
const activeTab = ref((route.query.showTab as string) || 'posts')
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  //添加路由
  router.replace({
    query: {
      showTab: tab
    }
  })
}
</script>
<template>
  <loading
    :show="false"
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
      :show="store.userInfo.status_code !== 2"
      title="用户不存在"
      image="notFound-image"
      :style="{ height: '100vh' }"
    >
      <user-page :backgroundurl="store.userInfo.user.cover_url[0].url_list[0]">
        <template #user-header>
          <user-header :userInfo="store.userInfo">
            <div class="edit">
              <div class="edit-switch">
                <div class="trust-login-switch" v-if="store.isLogin">
                  <div class="trust-login-tips-left">
                    <div class="trust-login-tips-icon">
                      <svg
                        width="15"
                        height="16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class=""
                        viewBox="0 0 15 16"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.5 15.473a7.5 7.5 0 100-15 7.5 7.5 0 000 15zm.034-12c-.956 0-1.842.367-2.45 1.076-.076.089-.162.22-.243.36-.209.357-.056.805.308.999l.027.014c.396.211.842-.003 1.114-.36.3-.393.715-.588 1.244-.588.787 0 1.338.327 1.338.992 0 .536-.427.94-.91 1.371l-.03.028c-.517.469-1.05.953-1.277 1.857-.01.04-.02.088-.028.14-.077.464.31.86.779.86.423 0 .753-.33.858-.74a.984.984 0 01.027-.092c.185-.512.535-.848.885-1.152.676-.6 1.324-1.227 1.324-2.272 0-1.619-1.366-2.493-2.966-2.493zm-.034 7.5a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                          fill="#2F3035"
                          fill-opacity="0.4"
                        ></path>
                      </svg>
                      <!-- <div class="trust-login-tips-info trust-login-tips-info-bottom">
                        保存登录信息，下次登录免验证
                      </div> -->
                    </div>
                  </div>
                  <switch-button />
                </div>
              </div>

              <div class="edit-content-small">
                <button
                  class="edit-content-btn"
                  v-if="store.isLogin"
                  @click="edit"
                >
                  编辑资料
                </button>
              </div>
              <div class="edit-btn-collect">
                <div class="edit-content">
                  <button class="edit-content-btn" @click="edit">
                    编辑资料
                  </button>
                </div>
              </div>
            </div>
            <user-modal
              :open="open"
              :userInfo="userInfo"
              @close="open = false"
            />
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
                  {{ store.userInfo.user?.aweme_count }}
                </div>
              </h2>
            </template>
            <template v-slot:like>
              <span class="tabs-text">喜欢</span>
              <div class="user-tabs-count">
                {{ store.userInfo.user?.favoriting_count }}
              </div>
              <div class="user-lock" v-if="false">
                <svg-icon icon="lock" class="icon" />
              </div>
            </template>
            <template v-slot:favorite_collection>
              <span class="tabs-text">收藏</span>
              <div class="user-lock">
                <svg-icon icon="lock" class="icon" />
              </div>
            </template>
            <template v-slot:record>
              <span class="tabs-text">观看记录</span>
              <div class="user-lock">
                <svg-icon icon="lock" class="icon" />
              </div>
            </template>
            <template v-slot:watch_later>
              <span class="tabs-text">稍后再看</span>
              <div class="user-lock">
                <svg-icon icon="lock" class="icon" />
              </div>
            </template>
            <template v-slot:tabs-item-left> </template>
            <template v-slot:taba-content>
              <user-post
                :user_id="store.userInfo.user.sec_uid"
                v-if="activeTab === 'posts'"
              />
              <user-like
                :user_id="store.userInfo.user.sec_uid"
                v-if="activeTab === 'like'"
                :show-like-list="true"
              />
              <user-collection v-if="activeTab === 'favorite_collection'" />

              <user-record v-if="activeTab === 'record'" />
            </template>
          </user-tab>
        </template>
      </user-page>
    </error-page>
  </loading>
</template>

<style lang="scss" scoped>
.edit {
  align-content: space-between;
  align-items: center;
  bottom: 8px;
  flex-wrap: wrap;
  height: 112px;
  display: flex;
  position: absolute;
  right: 0px;

  :deep(.content-text) {
    width: 208px;
  }

  .edit-switch {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;

    .trust-login-switch {
      align-items: center;
      display: inline-flex;
      position: relative !important;
      height: 100%;

      .trust-login-tips-left {
        display: inline-block;
        left: -12px;
        top: 2px;
        .trust-login-tips-icon {
          cursor: pointer;
          height: 16px;
          width: 16px;

          svg path {
            fill: var(--color-text-t4);
          }
        }
      }
    }
  }
  .edit-content-small {
    display: none;
  }
  .edit-content-btn {
    background: var(--bgbg-input) !important;
    border: none;
    color: var(--btn-color) !important;
    font-size: 13px;
    font-weight: 400;
    margin: 0;

    align-items: center;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    // margin: 0 8px;
    outline: none;
    padding: 0 16px;
    position: relative;
    border-radius: 12px;
    font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
    // font-size: 14px;
    // font-weight: 500;
    // height: 36px;
    height: 33px;
    line-height: 22px;
    min-width: 88px;
  }
  .edit-btn-collect {
    display: flex;
    margin-left: auto;
    .edit-content {
      display: flex;
    }

    .new-ui {
      border-radius: 12px;
      height: 33px;
      margin: 0 0 0 8px !important;
    }
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
